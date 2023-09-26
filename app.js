import { HfInference } from "../../node_modules/@huggingface/inference/dist/index.mjs";

const HF_ACCESS_TOKEN = "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";

const hf = new HfInference(HF_ACCESS_TOKEN);

document.addEventListener("DOMContentLoaded", function () {
    const analyzeButton = document.getElementById("analyzeButton");
    const reviewText = document.getElementById("reviewText");
    const resultDiv = document.getElementById("result");

    analyzeButton.addEventListener("click", async () => {
        const review = reviewText.value.trim();

        if (review === "") {
            alert("Please enter a review before analyzing.");
            return;
        }

        try {
            // Perform the analysis using Hugging Face model
            const result = await hf.textClassification({
                model: "roberta-base-openai-detector",
                inputs: review,
            });

            let resultHTML = '<p>Review Analysis Result:</p>';

            result.forEach((item, index) => {
                resultHTML += `
            <p>Result ${index + 1}:</p>
            <p>Label: ${item.label}</p>
            <p>Score: ${item.score}</p>
        `;
            });

            resultDiv.innerHTML = resultHTML;
        } catch (error) {
            console.error("Error analyzing the review:", error);
            resultDiv.innerHTML = "An error occurred while analyzing the review.";
        }
    });
});
