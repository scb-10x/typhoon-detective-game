# Typhoon Detective Game

## Introduction

[Typhoon Detective Game](https://detective.apps.opentyphoon.ai) is an interactive mystery-solving experience where players take on the role of a detective to solve dynamically generated cases. Through examining evidence, interviewing suspects, and piecing together clues, players must identify the culprit and solve the mystery.

This project is part of [Typhoon Application Week](https://apps.opentyphoon.ai), showcasing the capabilities of the [Typhoon platform](https://opentyphoon.ai). Please note that this application is not maintained for production use and is not production-ready. Use at your own risk.

## Highlighted Features + Typhoon Integration

- **Dynamic Case Generation**: Typhoon creates unique cases with customizable settings, themes, and difficulties, generating complex plots, motives, and characters on demand.

- **Interactive Suspect Interviews**: Leverage Typhoon's conversational abilities to question suspects naturally, with the AI generating context-aware responses based on the case details and suspect personalities.

- **Evidence Analysis**: Typhoon powers the evidence examination system, providing insights and connections between clues that help players build their case.

- **Multiple Language Support**: Typhoon's multilingual capabilities enable gameplay in both English and Thai with natural, fluent interactions.

- **Adaptive Difficulty**: Typhoon adjusts the complexity of cases and hints based on player performance and selected difficulty level.

## Getting Started (Local Development)

### Prerequisites

- Node.js 18+ 
- pnpm 8+
- Typhoon API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/typhoon-detective-game.git
   cd typhoon-detective-game
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env.local` and add your Typhoon API key:
   ```
   TYPHOON_API_KEY=your_api_key_here
   ```

4. Run the development server:
   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT) - see the LICENSE file for details.

## Connect With Us

- Website: [Typhoon](https://opentyphoon.ai)
- GitHub: [SCB 10X](https://github.com/scb-10x)
- Hugging Face: [SCB 10X](https://huggingface.co/scb10x)
- Discord: [Join our community](https://discord.com/invite/9F6nrFXyNt)
- X (formerly Twitter): [Typhoon](https://x.com/opentyphoon)
