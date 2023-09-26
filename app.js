const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Define your routes and NLP functionality here

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

const { pipeline } = require('@huggingface/node');
const apiKey = 'YOUR_HUGGING_FACE_API_KEY'; // Replace with your Hugging Face API key

const nlp = pipeline('sentiment-analysis', { model: 'openai/roberta-base-sentiment', apiKey });


async function detectBotReview(reviewText) {
    try {
        const results = await nlp(reviewText);
        const sentimentScore = results[0].score;

        // You can set a threshold for bot review detection based on sentiment score
        const isBotReview = sentimentScore < 0.3;

        return isBotReview;
    } catch (error) {
        console.error('Error analyzing review:', error);
        return false;
    }
}


app.post('/analyze-review', async (req, res) => {
    const { reviewText } = req.body;

    if (!reviewText) {
        return res.status(400).json({ error: 'Review text is required' });
    }

    const isBotReview = await detectBotReview(reviewText);

    if (isBotReview) {
        return res.json({ result: 'Bot review detected' });
    } else {
        return res.json({ result: 'Review looks good' });
    }
});
