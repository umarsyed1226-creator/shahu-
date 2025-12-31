
import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
    // This function creates a new client instance for each call.
    // This is crucial for the Veo model to ensure the latest selected API key is used.
    if (!process.env.API_KEY) {
        // In a real app, you might want to handle this more gracefully.
        // For this context, we assume the key is present but might become invalid.
        console.warn("API_KEY environment variable not set.");
    }
    return new GoogleGenAI({ apiKey: process.env.API_KEY });
};

// 1. AI Chatbot
export const generateChatResponse = async (
    prompt: string, 
    history: { sender: 'user' | 'ai', text: string }[]
): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-3-flash-preview';

    // A simplified history format for the model
    const contents = history.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));
    contents.push({ role: 'user', parts: [{ text: prompt }] });

    const response = await ai.models.generateContent({
        model,
        contents,
        config: {
            systemInstruction: "You are a helpful, beginner-friendly AI assistant named NexusAI. Answer clearly and concisely."
        }
    });

    return response.text;
};

// 2. AI Image Generation
export const generateImage = async (prompt: string, aspectRatio: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-2.5-flash-image';
    
    const response = await ai.models.generateContent({
        model,
        contents: { parts: [{ text: prompt }] },
        config: {
            imageConfig: { aspectRatio }
        }
    });

    for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
            return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
    }
    
    throw new Error('No image data found in response.');
};

{/* FIX: Add generateVideo function */}
// 3. AI Video Generation
export const generateVideo = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'veo-3.1-fast-generate-preview';

    let operation = await ai.models.generateVideos({
        model,
        prompt,
        config: {
            numberOfVideos: 1,
            resolution: '720p',
            aspectRatio: '16:9'
        }
    });

    while (!operation.done) {
        await new Promise(resolve => setTimeout(resolve, 10000));
        operation = await ai.operations.getVideosOperation({ operation });
    }

    const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;

    if (!downloadLink) {
        throw new Error('Video generation failed, no download link found.');
    }

    const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
    if (!videoResponse.ok) {
        const errorBody = await videoResponse.text();
        throw new Error(`Failed to download video: ${videoResponse.statusText}. Details: ${errorBody}`);
    }

    const videoBlob = await videoResponse.blob();
    return URL.createObjectURL(videoBlob);
};


// 4. AI Website Generation
export const generateWebsiteCode = async (prompt: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-3-pro-preview';
    
    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: `You are an expert web developer. Based on the user's request, generate a complete, single HTML file.
            This file MUST include all necessary HTML structure, inline CSS within a <style> tag, and any JavaScript functionality within a <script> tag.
            Use Tailwind CSS classes for styling by linking to the CDN.
            Do not provide any explanation, comments, or markdown formatting.
            Your entire output should be ONLY the raw HTML code, starting with <!DOCTYPE html> and ending with </html>.`
        }
    });
    
    // Clean up potential markdown code block fences
    let code = response.text;
    if (code.startsWith('```html')) {
        code = code.substring(7);
    }
    if (code.endsWith('```')) {
        code = code.substring(0, code.length - 3);
    }

    return code.trim();
};


// 5. AI Content Writing
export const generateContent = async (topic: string, contentType: string, tone: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-3-flash-preview';
    const prompt = `Write a ${contentType} about "${topic}" in a ${tone} tone. The content should be SEO-friendly and engaging for its target audience.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: "You are an expert content writer and marketing specialist. Generate high-quality, ready-to-publish content."
        }
    });

    return response.text;
};

// 6. AI App Generation
export const generateAppPlan = async (idea: string): Promise<string> => {
    const ai = getAiClient();
    const model = 'gemini-3-pro-preview';
    
    const prompt = `The user has an app idea: "${idea}".
    
    Please generate a detailed, beginner-friendly blueprint for this application. Structure your response with the following sections using Markdown formatting:
    
    ### 1. App Summary
    A brief, one-paragraph overview of the app and its core purpose.
    
    ### 2. Key Features
    A bulleted list of 5-7 primary features the app should have.
    
    ### 3. Recommended Tech Stack
    A list of recommended technologies for Frontend, Backend, and Database, with a brief justification for each choice (e.g., "React for a dynamic user interface").
    
    ### 4. Basic Frontend Code Example
    Provide a simple, functional React component for the main screen of the app using TypeScript and Tailwind CSS. This should be a single, copy-pastable code block.`;

    const response = await ai.models.generateContent({
        model,
        contents: prompt,
        config: {
            systemInstruction: "You are a senior CTO and startup builder. Your goal is to provide clear, actionable, and beginner-friendly guidance for building new applications."
        }
    });

    return response.text;
};
