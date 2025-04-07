import React, { useState, useRef, useEffect } from "react"
import { Send, Loader2, BarChart2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card } from "@/components/ui/card"

// Types for our messages
type MessageType = {
  id: string
  content: string
  role: "user" | "assistant"
  timestamp: Date
}

type ChatInterfaceProps = {
  onSendMessage: (message: string) => Promise<string>
  isLoading?: boolean
  initialMessages?: MessageType[]
  examples?: { question: string }[]
}

export const ChatInterface = ({
  onSendMessage,
  isLoading = false,
  initialMessages = [],
  examples = [],
}: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<MessageType[]>(initialMessages)
  const [input, setInput] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: MessageType = {
      id: Date.now().toString(),
      content: input,
      role: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    try {
      const response = await onSendMessage(input)
      
      const assistantMessage: MessageType = {
        id: (Date.now() + 1).toString(),
        content: response,
        role: "assistant",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Error sending message:", error)
      // Could add error handling here
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e)
    }
  }

  const handleExampleClick = (question: string) => {
    setInput(question)
    inputRef.current?.focus()
  }

  // Function to format the recommendation text with proper markdown styling
  const RecommendationDisplay = ({ text }: { text: string }) => {
    if (!text) return null

    // Split the text into sections based on markdown headers
    const sections = text.split(/(?=###)/g)

    return (
      <div className="space-y-4">
        {sections.map((section, i) => {
          // Process each section
          const lines = section.split("\n")
          const title = lines[0]?.startsWith("###") ? lines[0].replace(/^###\s*/, "") : ""
          const content = title ? lines.slice(1).join("\n") : section

          return (
            <div key={i} className="mb-4">
              {title && <h3 className="text-lg font-semibold text-purple-800 mb-2">{title}</h3>}
              <div>
                {content.split("\n").map((line, j) => {
                  // Handle list items
                  if (line.trim().startsWith("-")) {
                    return (
                      <div key={j} className="ml-4 mb-1">
                        • {line.trim().substring(1).trim()}
                      </div>
                    )
                  }
                  // Handle bold text
                  const boldPattern = /\*\*(.*?)\*\*/g
                  const textWithBold = line.replace(boldPattern, "<strong>$1</strong>")

                  // Only create paragraph for non-empty lines
                  return line.trim() ? (
                    <div key={j} className="mb-2" dangerouslySetInnerHTML={{ __html: textWithBold }} />
                  ) : (
                    <div key={j} className="h-2" />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Message container */}
      <ScrollArea className="flex-1 p-4 mb-4">
        <div className="space-y-4">
          {messages.length === 0 && (
            <div className="text-center my-8">
              <BarChart2 className="mx-auto h-12 w-12 text-purple-600 mb-3" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">Welcome to StatWizard</h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Your AI-powered statistical consultant. Ask about research methods, data analysis, or statistical tests.
              </p>
              
              {examples.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm text-gray-500 mb-2">Try asking about:</p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {examples.map((example, index) => (
                      <button
                        key={index}
                        onClick={() => handleExampleClick(example.question)}
                        className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-sm hover:bg-purple-100 transition-colors"
                      >
                        {example.question.length > 40 ? example.question.substring(0, 40) + "..." : example.question}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[85%] p-3 ${
                  message.role === "user"
                    ? "bg-purple-700 text-white"
                    : "bg-white border border-gray-200"
                }`}
              >
                {message.role === "assistant" ? (
                  <RecommendationDisplay text={message.content} />
                ) : (
                  <p className="whitespace-pre-wrap">{message.content}</p>
                )}
              </Card>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Input area */}
      <form onSubmit={handleSubmit} className="border-t border-gray-200 pt-4">
        <div className="relative">
          <Textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about statistical methods, research design, data analysis..."
            className="pr-16 min-h-[80px] max-h-[200px] resize-y"
            disabled={isLoading}
          />
          <Button
            type="submit"
            className="absolute right-2 bottom-2 h-10 w-10 p-0"
            disabled={isLoading || !input.trim()}
          >
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <Send className="h-5 w-5" />
            )}
          </Button>
        </div>
      </form>
    </div>
  )
} 