
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const geminiApiKey = Deno.env.get('GOOGLE_GEMINI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();

    const fullPrompt = `You are a helpful assistant that returns expert-level, production-grade PostgreSQL SQL queries or DDL statements in response to descriptive user requests. Only output the SQL in a code block. User request: "${prompt}"`;

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{
          parts: [{
            text: fullPrompt
          }]
        }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 512,
        }
      }),
    });

    if (!response.ok) {
        const errorData = await response.json();
        console.error('Gemini API error:', errorData);
        throw new Error(errorData.error?.message || 'Failed to generate SQL from Gemini');
    }

    const data = await response.json();

    if (!data.candidates || data.candidates.length === 0) {
      if (data.promptFeedback?.blockReason) {
        throw new Error(`Request blocked by Gemini. Reason: ${data.promptFeedback.blockReason}`);
      }
      console.error('Invalid response from Gemini: No candidates found.', data);
      throw new Error('Received an invalid response from the Gemini API (no candidates).');
    }
    
    const candidate = data.candidates[0];

    if (!candidate.content || !candidate.content.parts || candidate.content.parts.length === 0 || !candidate.content.parts[0].text) {
        console.error('Invalid response from Gemini: No text content found.', JSON.stringify(data, null, 2));
        if (candidate.finishReason) {
             throw new Error(`Content generation failed. Reason: ${candidate.finishReason}`);
        }
        throw new Error('Received a response with no usable content from Gemini.');
    }

    // Parse the output, extract SQL from code block if present
    let generatedSql = candidate.content.parts[0].text as string;
    const codeMatch = generatedSql.match(/```(?:sql)?\s*([^`]+)```/i);
    if (codeMatch) {
      generatedSql = codeMatch[1].trim();
    } else {
       // If no code block is found, return the whole text, trimmed.
       generatedSql = generatedSql.trim();
    }

    return new Response(JSON.stringify({ generatedSql }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-sql function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
