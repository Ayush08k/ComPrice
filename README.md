# ComPrice PRO

ComPrice PRO is a Smart Price Comparison Engine that helps you find the best deals across various Indian e-commerce platforms. It aggregates live prices and uses Google's Gemini AI to analyze deals and provide smart buying recommendations.

## Features

- **Live Price Tracking:** Compares prices from multiple e-commerce platforms.
- **Smart AI Analysis:** Powered by Google's Gemini 1.5 Flash model, it evaluates deals, identifies the best platform, and gives buying advice (e.g., "BUY NOW" or "WAIT FOR SALE").
- **Currency Toggle:** Seamlessly switch between INR and USD.
- **Sleek UI:** Built with React and styled with a modern, dynamic, and premium look.

## Tech Stack

- **Frontend:** React, Vite, Lucide React
- **Backend/AI:** Python, Google Generative AI (Gemini)

## Setup

1. Install frontend dependencies:
   ```bash
   npm install
   ```
2. Start the frontend development server:
   ```bash
   npm run dev
   ```

3. Ensure you have Python installed, and configure your Gemini API key in the `.env` file:
   ```env
   GEMINI_API_KEY=your_api_key_here
   ```

## License

MIT
