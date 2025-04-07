"use client"

import type React from "react"

import { useState, useRef, useTransition } from "react"
import { ChevronRight, BarChart2, LineChart, PieChart, HelpCircle, ArrowRight, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getStatisticalRecommendation } from "./actions"

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
  const [researchQuestion, setResearchQuestion] = useState(EXAMPLE_QUESTIONS[0].question)
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)

    startTransition(async () => {
      setError(null)
      setRecommendation(null)

      const result = await getStatisticalRecommendation(formData)

      if (result.error) {
        setError(result.error)
      } else if (result.recommendation) {
        setRecommendation(result.recommendation)
      }
    })
  }

  const handleExampleClick = (question: string) => {
    setResearchQuestion(question)
    // Clear previous results when selecting a new example
    setRecommendation(null)
    setError(null)
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
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-purple-700 to-violet-900 text-white py-10 px-6 md:py-16 md:px-8 rounded-b-lg shadow-lg">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <BarChart2 className="h-8 w-8 md:h-10 md:w-10" />
            <h1 className="text-3xl md:text-5xl font-bold tracking-tight">StatWizard</h1>
          </div>
          <p className="text-xl md:text-2xl font-light max-w-2xl">
            Your AI-Powered Statistical Consultant for Research & Data Analysis
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8 md:px-8 md:py-12">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Left Column - Main Input */}
          <div className="md:col-span-2 space-y-6">
            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-semibold text-slate-800">Describe your research question</h2>
                    <HelpCircle className="h-5 w-5 text-slate-400 hover:text-purple-600 cursor-pointer" />
                  </div>

                  <Textarea
                    name="researchQuestion"
                    placeholder="Describe your research question and provide details about your data..."
                    className="min-h-[200px] text-base resize-y"
                    value={researchQuestion}
                    onChange={(e) => setResearchQuestion(e.target.value)}
                    required
                  />

                  <div className="flex items-center justify-between pt-2">
                    <div className="text-sm text-slate-500">Be specific about variables and measurements</div>
                    <Button type="submit" className="bg-purple-700 hover:bg-purple-800" disabled={isPending}>
                      {isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Analyzing...
                        </>
                      ) : (
                        <>
                          Get Recommendation
                          <ChevronRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Results Section */}
            {(recommendation || error || isPending) && (
              <Card
                className={`shadow-md border-0 ${error ? "border-l-4 border-l-red-500" : "border-l-4 border-l-purple-700"}`}
              >
                <CardContent className="pt-6">
                  <h3 className="text-lg font-medium text-slate-800 mb-3">
                    {error ? "Error" : "Analysis Recommendation"}
                  </h3>

                  {isPending && (
                    <div className="flex flex-col items-center justify-center py-8">
                      <Loader2 className="h-8 w-8 text-purple-600 animate-spin mb-4" />
                      <p className="text-slate-600">Analyzing your research question...</p>
                    </div>
                  )}

                  {error && <div className="p-4 bg-red-50 rounded-md text-red-800">{error}</div>}

                  {recommendation && !isPending && (
                    <div className="p-4 bg-purple-50 rounded-md text-slate-700 prose max-w-none">
                      <RecommendationDisplay text={recommendation} />
                      <div className="flex justify-end mt-4">
                        <Button variant="outline" className="mt-2 w-fit">
                          Export Report
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Examples and Help */}
          <div className="space-y-6">
            <Card className="shadow-md border-0">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium text-slate-800 mb-4">Try an example</h3>
                <div className="flex flex-col gap-3">
                  {EXAMPLE_QUESTIONS.map((example, index) => {
                    const Icon = example.icon
                    return (
                      <Button
                        key={index}
                        variant="outline"
                        className="justify-start h-auto py-3 px-4"
                        onClick={() => handleExampleClick(example.question)}
                      >
                        <Icon className="h-5 w-5 mr-3 text-purple-600" />
                        <div className="text-left">
                          <div className="font-medium">{example.title}</div>
                          <div className="text-sm text-slate-500">{example.description}</div>
                        </div>
                      </Button>
                    )
                  })}
                </div>
              </CardContent>
            </Card>

            <Card className="shadow-md border-0 bg-gradient-to-br from-slate-800 to-slate-900 text-white">
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3">Need more guidance?</h3>
                <p className="text-slate-300 mb-4">
                  Access our comprehensive library of statistical methods, tutorials, and case studies.
                </p>
                <Tabs defaultValue="methods">
                  <TabsList className="bg-slate-700">
                    <TabsTrigger value="methods">Methods</TabsTrigger>
                    <TabsTrigger value="tutorials">Tutorials</TabsTrigger>
                    <TabsTrigger value="examples">Examples</TabsTrigger>
                  </TabsList>
                  <TabsContent value="methods" className="mt-3 text-sm text-slate-300">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400" />
                        Correlation Analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400" />
                        Regression Models
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400" />
                        ANOVA & T-tests
                      </li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="tutorials" className="mt-3 text-sm text-slate-300">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400" />
                        Choosing the Right Test
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400" />
                        Interpreting Results
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400" />
                        Data Visualization
                      </li>
                    </ul>
                  </TabsContent>
                  <TabsContent value="examples" className="mt-3 text-sm text-slate-300">
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400" />
                        Clinical Trial Analysis
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400" />
                        Market Research Case Study
                      </li>
                      <li className="flex items-center gap-2">
                        <ChevronRight className="h-4 w-4 text-purple-400" />
                        Educational Assessment
                      </li>
                    </ul>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

