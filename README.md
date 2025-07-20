# QueryGenie – AI SQL Generator ⚡

QueryGenie is a smart AI-powered web application that converts natural language questions into SQL queries in real-time using the **Gemini API**. Built with a modern tech stack, QueryGenie bridges the gap between users and databases — no SQL knowledge required.

## 🚀 Features

- 🔮 Convert natural language to SQL using Gemini API
- 🧠 Seamless integration with Supabase for query execution
- ⚡ Real-time results with responsive and sleek UI
- 🔐 Credentials handled securely via environment variables
- ☁️ Spabasebase integrated for authentication or optional data handling

## 🛠️ Tech Stack

- **Frontend**: React.js, Tailwind CSS
- **AI Engine**: Gemini API (by Google)
- **Backend/Database**: Supabase
- **Dev Tools**: Vite, GitHub

## 📂 Project Structure

QueryGenie/
├── public/
├── src/
│ ├── components/
│ ├── services/ # API & Supabase utils
│ └── App.jsx
├── .env # Environment variables (not committed)
├── .gitignore
├── README.md
└── package.json

makefile
Copy
Edit

## 🔐 Environment Setup

Create a `.env` file in the root:

```env
VITE_GEMINI_API_KEY=your_gemini_api_key
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
⚠️ Never commit your .env file. Ensure .gitignore includes .env.

🧪 Running Locally
bash
Copy
Edit
# Install dependencies
npm install

# Start the development server
npm run dev
Then visit: http://localhost:5173

📸 Screenshots
Add screenshots or a demo GIF here for better visual representation.

🌐 Deployment
This app can be deployed using Vercel, Netlify, or Firebase Hosting.

🤝 Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

📄 License
MIT License © 2025 Sanjeeviram
