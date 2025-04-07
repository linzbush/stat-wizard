import React from "react"
import { BarChart2 } from "lucide-react"

export const Header = () => {
  return (
    <header className="bg-gradient-to-r from-purple-700 to-violet-900 text-white py-6 px-6 rounded-b-lg shadow-lg">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3">
          <BarChart2 className="h-7 w-7" />
          <h1 className="text-2xl font-bold tracking-tight">StatWizard</h1>
        </div>
        <p className="text-sm md:text-base font-light mt-1">
          Your AI-Powered Statistical Consultant for Research & Data Analysis
        </p>
      </div>
    </header>
  )
} 