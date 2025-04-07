"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function getStatisticalRecommendation(formData: FormData) {
  const researchQuestion = formData.get("researchQuestion") as string

  if (!researchQuestion || researchQuestion.trim() === "") {
    return {
      recommendation: "",
      error: "Please provide a research question",
    }
  }

  const systemPrompt = `You are StatWizard, an AI-powered statistical consultant for researchers and data analysts.
Your task is to recommend appropriate statistical methods based on the user's research question.
For each recommendation:
1. Identify the type of variables involved (categorical, continuous, etc.)
2. Suggest specific statistical tests or methods
3. Explain why these methods are appropriate
4. Recommend visualizations that would help interpret the data
5. Format your response in a clear, structured way for researchers

Be precise, technical, and helpful. Use proper statistical terminology.`

  try {
    // Generate the text response
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: researchQuestion,
      system: systemPrompt,
      maxTokens: 1000,
    })

    // Return the text string from the result
    return {
      recommendation: result.text,
      error: null,
    }
  } catch (error) {
    console.error("Error getting recommendation:", error)
    return {
      recommendation: "",
      error: "Failed to generate recommendation. Please try again.",
    }
  }
}

