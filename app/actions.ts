"use server"

import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Base system prompt that defines the assistant's personality and capabilities
const baseSystemPrompt = `You are StatWizard, an AI-powered statistical consultant for researchers and data analysts.
Your task is to provide expert guidance on statistical methods, research design, and data analysis.

When responding to queries:
1. Identify the type of variables involved (categorical, continuous, etc.)
2. Suggest specific statistical tests or methods that would be appropriate
3. Explain why these methods are appropriate for the research question
4. Recommend visualizations that would help interpret the data
5. Format your response in a clear, structured way using markdown headings (###)

Be precise, technical, and helpful. Use proper statistical terminology while ensuring explanations are accessible.
If the user's question is unclear, ask for clarification on specific details that would help you provide better advice.

For recommendations, structure your response with these sections (using ### for headings):
- Variables Identification
- Recommended Statistical Approach
- Explanation & Justification
- Visualization Recommendations
- Important Considerations`

export async function sendChatMessage(message: string) {
  if (!message || message.trim() === "") {
    return {
      response: "",
      error: "Please provide a message",
    }
  }

  try {
    // Generate the text response
    const result = await generateText({
      model: openai("gpt-4o"),
      prompt: message,
      system: baseSystemPrompt,
      maxTokens: 1000,
    })

    // Return the text string from the result
    return {
      response: result.text,
      error: null,
    }
  } catch (error) {
    console.error("Error processing message:", error)
    return {
      response: "",
      error: "Failed to generate a response. Please try again.",
    }
  }
}

// Keep the original function for backward compatibility
export async function getStatisticalRecommendation(formData: FormData) {
  const researchQuestion = formData.get("researchQuestion") as string

  if (!researchQuestion || researchQuestion.trim() === "") {
    return {
      recommendation: "",
      error: "Please provide a research question",
    }
  }

  try {
    const result = await sendChatMessage(researchQuestion)
    
    return {
      recommendation: result.response,
      error: result.error,
    }
  } catch (error) {
    console.error("Error getting recommendation:", error)
    return {
      recommendation: "",
      error: "Failed to generate recommendation. Please try again.",
    }
  }
}

