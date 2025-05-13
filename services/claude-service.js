import { config } from '../config.js';

class ClaudeService {
    constructor() {
        this.API_KEY = config.CLAUDE_API_KEY;
        this.API_ENDPOINT = 'https://api.anthropic.com/v1';
    }

    async generateInteriorDesign(requirements) {
        try {
            const prompt = this.constructDesignPrompt(requirements);
            const response = await fetch(`${this.API_ENDPOINT}/images/generations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.API_KEY,
                    'anthropic-version': '2024-03-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-opus-20240229',
                    prompt: prompt,
                    max_tokens: 4096,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error generating design:', error);
            throw error;
        }
    }

    async enhanceDesign(imageUrl, enhancementPrompt) {
        try {
            const prompt = `Enhance this interior design: ${enhancementPrompt}`;
            const response = await fetch(`${this.API_ENDPOINT}/images/edits`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-api-key': this.API_KEY,
                    'anthropic-version': '2024-03-01'
                },
                body: JSON.stringify({
                    model: 'claude-3-opus-20240229',
                    image: imageUrl,
                    prompt: prompt,
                    max_tokens: 4096,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`API request failed: ${response.statusText}`);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error enhancing design:', error);
            throw error;
        }
    }

    constructDesignPrompt(requirements) {
        const { room, style, budget } = requirements;
        return `Create a photorealistic interior design for a ${style} ${room} with a budget of ${budget}. 
                The design should incorporate:
                - Modern lighting and fixtures
                - Appropriate color schemes for ${style} style
                - Furniture and decor within ${budget} range
                - Optimal space utilization
                - Natural light consideration
                Please generate a high-resolution, photorealistic image that showcases the entire room from an optimal viewing angle.`;
    }
}

export default new ClaudeService(); 