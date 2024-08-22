const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;

// Hugging Face API Configuration
const HUGGING_FACE_API_KEY = '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'; // Replace with your Hugging Face API key
const model = 'microsoft/DialoGPT-medium'; // Use a supported model

app.use(express.static('public'));
app.use(express.json());

app.post('/api/chat', async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            `https://api-inference.huggingface.co/models/${model}`,
            { inputs: message },
            {
                headers: {
                    Authorization: `Bearer ${HUGGING_FACE_API_KEY}`,
                },
            }
        );

        // Extract and clean up the AI's response
        const aiResponse = response.data[0]?.generated_text || "Sorry, I didn't get that.";

        res.json({ response: aiResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to get response from AI' });
    }
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
