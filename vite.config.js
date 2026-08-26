import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

const makeGeminiRequest = async (apiKey, prompt, model) => {
  const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000); // 12 seconds timeout

  try {
    const res = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }],
        generationConfig: {
          responseMimeType: 'application/json'
        }
      }),
      signal: controller.signal
    });
    return res;
  } finally {
    clearTimeout(timeoutId);
  }
};

const fetchWithRetry = async (apiKey, prompt) => {
  const modelsToTry = ['gemini-3.7-flash', 'gemini-3.6-flash', 'gemini-3.5-flash'];
  const maxRetries = 2;
  const transientStatuses = [429, 500, 502, 503, 504];
  let lastError;

  for (const model of modelsToTry) {
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        if (attempt > 0) {
          const delay = Math.pow(2, attempt - 1) * 1000;
          await new Promise(resolve => setTimeout(resolve, delay));
        }

        const response = await makeGeminiRequest(apiKey, prompt, model);

        if (response.ok) {
          return response;
        }

        if (transientStatuses.includes(response.status)) {
          const statusText = response.statusText || '';
          lastError = new Error(`Gemini API returned transient error ${response.status} (${statusText})`);
          console.warn(`[${model}] Attempt ${attempt + 1} failed with status ${response.status}. Retrying...`);
          continue;
        } else {
          const errText = await response.text();
          throw new Error(`Gemini API returned permanent error ${response.status}: ${errText}`);
        }
      } catch (err) {
        lastError = err;
        if (err.message && err.message.includes('permanent')) {
          throw err;
        }
        console.warn(`[${model}] Attempt ${attempt + 1} caught error: ${err.message}. Retrying...`);
      }
    }
  }

  throw lastError || new Error('Failed to fetch response from Gemini API after retrying.');
};

// A simple dev server middleware to handle API calls locally
const apiPlugin = () => ({
  name: 'api-plugin',
  configureServer(server) {
    server.middlewares.use(async (req, res, next) => {
      if (req.url.startsWith('/api/generate-prep') && req.method === 'POST') {
        let body = '';
        req.on('data', chunk => {
          body += chunk;
        });
        req.on('end', async () => {
          try {
            const jobContext = JSON.parse(body);
            
            // Load GEMINI_API_KEY from environment
            const apiKey = process.env.GEMINI_API_KEY;
            if (!apiKey || apiKey === 'undefined' || apiKey === 'null') {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'GEMINI_API_KEY environment variable is not configured locally. Please create a .env file with GEMINI_API_KEY.' }));
              return;
            }

            // Construct prompt
            const prompt = `
You are an expert AI Career Coach and Interview Prep Assistant.
Prepare the candidate for their upcoming interview using the following job details:
- Company: ${jobContext.company}
- Position: ${jobContext.position}
- Location: ${jobContext.location || 'Not specified'}
- Job Type: ${jobContext.jobType || 'Not specified'}
- Application Status: ${jobContext.status || 'Applied'}
- Interview Date: ${jobContext.interviewDate || 'Not scheduled'}
- Notes/Description: ${jobContext.notes || 'No notes provided'}

Focus on practical preparation tips, likely interview questions specific to this role and company, and talking points the candidate should emphasize based on the notes.
Do not invent false facts about the company or the candidate. If notes or job information are minimal, provide general preparation tips appropriate for a ${jobContext.position} role at ${jobContext.company}.

You MUST respond ONLY with a JSON object in the following format. Do not wrap the JSON in markdown code blocks.
{
  "preparationSummary": "A concise (2-3 sentences) strategic summary of what this interview will likely focus on and the overall mindset the candidate should adopt.",
  "likelyQuestions": [
    "Question 1",
    "Question 2",
    "Question 3"
  ],
  "talkingPoints": [
    "Talking point 1",
    "Talking point 2",
    "Talking point 3"
  ],
  "preparationTips": [
    "Tip 1",
    "Tip 2",
    "Tip 3"
  ]
}
`;

            let apiResponse;
            try {
              apiResponse = await fetchWithRetry(apiKey, prompt);
            } catch (retryError) {
              console.error('All Gemini API attempts failed:', retryError);
              res.writeHead(503, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: retryError.message || 'Failed to fetch response from Gemini API.' }));
              return;
            }

            const data = await apiResponse.json();
            const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
            if (!rawText) {
              res.writeHead(500, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'Empty response received from LLM model.' }));
              return;
            }

            const parsedData = JSON.parse(rawText.trim());
            if (
              typeof parsedData.preparationSummary !== 'string' ||
              !Array.isArray(parsedData.likelyQuestions) ||
              !Array.isArray(parsedData.talkingPoints) ||
              !Array.isArray(parsedData.preparationTips)
            ) {
              res.writeHead(520, { 'Content-Type': 'application/json' });
              res.end(JSON.stringify({ error: 'AI response did not match the expected structured layout.' }));
              return;
            }

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(parsedData));
          } catch (err) {
            console.error('Vite API proxy error:', err);
            res.writeHead(500, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Internal Dev Server Error', details: err.message }));
          }
        });
      } else {
        next();
      }
    });
  }
});

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  if (env.GEMINI_API_KEY) {
    process.env.GEMINI_API_KEY = env.GEMINI_API_KEY;
  }

  return {
    plugins: [react(), apiPlugin()],
  };
});
