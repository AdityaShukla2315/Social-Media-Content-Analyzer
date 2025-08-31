const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const router = express.Router();

// Initialize Gemini client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || 'your-gemini-api-key-here');
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

// POST /api/analysis/analyze - Analyze content and provide engagement suggestions
router.post('/analyze', async (req, res) => {
  try {
    const { text, contentType = 'social-media', platform = 'general' } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    // Truncate text if too long for API
    const truncatedText = text.length > 4000 ? text.substring(0, 4000) + '...' : text;

    const analysisPrompt = `
Analyze the following ${contentType} content and provide comprehensive engagement improvement suggestions:

Content: "${truncatedText}"

Please provide analysis in the following JSON format:
{
  "contentAnalysis": {
    "tone": "string (e.g., professional, casual, friendly, authoritative)",
    "sentiment": "string (positive, negative, neutral, mixed)",
    "readability": "string (easy, moderate, difficult)",
    "wordCount": number,
    "estimatedReadTime": "string (e.g., '2 minutes')",
    "keyTopics": ["array of main topics"],
    "targetAudience": "string (who this content is best suited for)"
  },
  "engagementMetrics": {
    "attentionGrabber": "score 1-10 with explanation",
    "clarity": "score 1-10 with explanation", 
    "callToAction": "score 1-10 with explanation",
    "relevance": "score 1-10 with explanation",
    "overallEngagement": "score 1-10 with explanation"
  },
  "improvementSuggestions": {
    "headline": ["array of headline suggestions"],
    "content": ["array of content improvement suggestions"],
    "hashtags": ["array of relevant hashtag suggestions"],
    "visualElements": ["array of visual enhancement suggestions"],
    "timing": "string (best time to post suggestions)",
    "platformSpecific": {
      "twitter": ["array of Twitter-specific suggestions"],
      "linkedin": ["array of LinkedIn-specific suggestions"],
      "instagram": ["array of Instagram-specific suggestions"],
      "facebook": ["array of Facebook-specific suggestions"]
    }
  },
  "bestPractices": {
    "dos": ["array of recommended actions"],
    "donts": ["array of actions to avoid"],
    "trendingTopics": ["array of current trending topics to consider"]
  }
}

Focus on practical, actionable advice that can immediately improve engagement rates.
`;

    const prompt = `You are a social media content optimization expert with deep knowledge of engagement strategies across all major platforms. Provide practical, data-driven advice.\n\n${analysisPrompt}`;
    
    const result = await model.generateContent(prompt);
    const analysisResult = result.response.text();
    
    // Try to parse JSON response (handle markdown code blocks)
    let parsedAnalysis;
    try {
      // Remove markdown code blocks if present
      let cleanedResult = analysisResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedAnalysis = JSON.parse(cleanedResult);
    } catch (parseError) {
      // If JSON parsing fails, return the raw text
      parsedAnalysis = {
        rawAnalysis: analysisResult,
        parseError: "Could not parse structured response"
      };
    }

    res.json({
      success: true,
      data: {
        originalText: text,
        textLength: text.length,
        contentType,
        platform,
        analysis: parsedAnalysis,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Content analysis error:', error);
    
    res.status(500).json({
      error: 'Failed to analyze content',
      message: error.message
    });
  }
});

// POST /api/analysis/quick-analyze - Quick content analysis
router.post('/quick-analyze', async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Text content is required' });
    }

    const quickPrompt = `
Provide a quick analysis of this social media content in JSON format:
"${text.substring(0, 2000)}"

Return only this JSON structure:
{
  "sentiment": "positive/negative/neutral",
  "engagementScore": "1-10",
  "topSuggestion": "single most important improvement",
  "hashtagSuggestion": "3-5 relevant hashtags"
}
`;

    const prompt = `You are a social media expert. Provide quick, actionable feedback.\n\n${quickPrompt}`;
    
    const result = await model.generateContent(prompt);
    const quickResult = result.response.text();
    
    let parsedResult;
    try {
      // Remove markdown code blocks if present
      let cleanedResult = quickResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedResult = JSON.parse(cleanedResult);
    } catch (parseError) {
      parsedResult = { rawResult: quickResult };
    }

    res.json({
      success: true,
      data: parsedResult
    });

  } catch (error) {
    console.error('Quick analysis error:', error);
    res.status(500).json({
      error: 'Failed to perform quick analysis',
      message: error.message
    });
  }
});

// GET /api/analysis/models - List available models
router.get('/models', async (req, res) => {
  try {
    const models = await genAI.listModels();
    res.json({
      success: true,
      models: models
    });
  } catch (error) {
    console.error('Models list error:', error);
    res.status(500).json({
      error: 'Failed to list models',
      message: error.message
    });
  }
});

// GET /api/analysis/tips - Get general social media tips
router.get('/tips', async (req, res) => {
  try {
    const tipsPrompt = `
Provide 10 essential social media engagement tips in JSON format:
{
  "tips": [
    {
      "title": "string",
      "description": "string",
      "platform": "string (general/twitter/linkedin/instagram/facebook)"
    }
  ]
}
`;

    const prompt = `You are a social media marketing expert.\n\n${tipsPrompt}`;
    
    const result = await model.generateContent(prompt);
    const tipsResult = result.response.text();
    
    let parsedTips;
    try {
      // Remove markdown code blocks if present
      let cleanedResult = tipsResult.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedTips = JSON.parse(cleanedResult);
    } catch (parseError) {
      parsedTips = { rawTips: tipsResult };
    }

    res.json({
      success: true,
      data: parsedTips
    });

  } catch (error) {
    console.error('Tips generation error:', error);
    res.status(500).json({
      error: 'Failed to generate tips',
      message: error.message
    });
  }
});

module.exports = router;
