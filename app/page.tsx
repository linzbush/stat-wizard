"use client"

import { useState, useTransition } from "react"
import { LineChart, BarChart2, PieChart } from "lucide-react"
import { Header } from "./components/Header"
import { ChatInterface } from "./components/ChatInterface"
import { sendChatMessage } from "./actions"

// Example research questions for quick selection
const EXAMPLE_QUESTIONS = [
  {
    title: "Relationship analysis",
    description: "Correlation between variables",
    icon: LineChart,
    question:
      "I'm studying the relationship between hours of sleep and reaction time. Sleep is measured in hours and reaction time in milliseconds.",
  },
  {
    title: "Compare test scores",
    description: "Group differences analysis",
    icon: BarChart2,
    question:
      "I want to compare test scores between three different teaching methods. Each student was randomly assigned to one method and took the same test.",
  },
  {
    title: "Marketing strategy comparison",
    description: "A/B testing analysis",
    icon: PieChart,
    question:
      "I'm comparing conversion rates between two marketing strategies. I have the number of conversions and total visitors for each strategy over a 30-day period.",
  },
]

export default function StatWizard() {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  const handleSendMessage = async (message: string) => {
    setError(null)
    
    try {
      const result = await sendChatMessage(message)
      
      if (result.error) {
        setError(result.error)
        return "I'm sorry, I couldn't process your request at this time. Please try again later."
      }
      
      return result.response
    } catch (error) {
      console.error("Error sending message:", error)
      setError("An unexpected error occurred. Please try again.")
      return "I'm sorry, something went wrong. Please try again."
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      <Header />
      
      <main className="max-w-4xl mx-auto px-4 py-6">
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
            {error}
          </div>
        )}
        
        <ChatInterface 
          onSendMessage={handleSendMessage}
          isLoading={isPending}
          examples={EXAMPLE_QUESTIONS}
        />
      </main>
    </div>
  )
}

