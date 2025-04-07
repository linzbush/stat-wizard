# StatWizard

An AI-powered statistical consultant for researchers and data analysts, built with Next.js and OpenAI.

## Features

- Get recommendations for appropriate statistical methods based on research questions
- AI-powered analysis using GPT-4o
- Interactive UI with example research questions
- Detailed recommendations including variable types, statistical tests, and visualization suggestions

## Tech Stack

- Next.js 15
- React 19
- Tailwind CSS
- shadcn/ui components
- AI SDK with OpenAI integration
- TypeScript

## Getting Started

### Prerequisites

- Node.js 18.x or later
- pnpm 8.x or later

### Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/stat-wizard.git
cd stat-wizard
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env.local` file in the root of your project with your OpenAI API key:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Development

Run the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

### Build for Production

```bash
pnpm build
pnpm start
```

## Project Structure

- `app/` - Next.js app router components and server actions
- `components/` - UI components using shadcn/ui
- `public/` - Static assets

## License

MIT 