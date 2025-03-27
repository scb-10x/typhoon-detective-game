# Detective Game

An interactive detective game built with Next.js, React, and Typhoon AI integration.

## Features

- LLM-powered detective game experience
- Dynamic case generation based on user preferences
- Clue collection and examination system
- Interactive suspect interviews
- Multiple language support (English & Thai)
- Responsive design for desktop and mobile
- Dark/light mode support

## Tech Stack

- **Framework**: Next.js 15
- **UI**: React 19, Tailwind CSS 4
- **AI Integration**: Typhoon API (models: typhoon-v2-70b-instruct and typhoon-v2-r1-70b-preview)
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS
- **Icons**: React Icons
- **Markdown**: React Markdown

## Getting Started

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Typhoon API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/detective-game.git
   cd detective-game
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.local` file and add your Typhoon API key:
   ```
   TYPHOON_API_KEY=your_api_key_here
   ```
   - The API key is only accessed server-side for security.

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Game Mechanics

- **Case Generation**: Create new cases with different difficulties, themes, and settings
- **Evidence Collection**: Discover and examine clues to build your case
- **Suspect Interviews**: Question suspects using the LLM to generate realistic responses
- **Case Solving**: Present your theory about the culprit and the evidence

## Project Structure

- `src/app` - Next.js app router pages
- `src/components` - Reusable UI components
- `src/contexts` - React contexts for state management
- `src/hooks` - Custom React hooks
- `src/lib` - Utility functions and AI integration
- `src/types` - TypeScript type definitions

## Deployment

The application can be deployed to Vercel:

```bash
pnpm build
```

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Typhoon API for providing the language model integration
- Next.js team for the excellent framework
