# Curator AI

> A modern, full-stack bookmark manager with auto-summarization, tagging, and a beautiful UI.  
> **Made by Divyansh**

---

## 🚀 Overview
Curator AI is a web application that helps you save, organize, and auto-summarize your favorite links. It features a clean, glassmorphic UI, user authentication, and seamless integration with Supabase for database and authentication.

---

## ✨ Features
- **User Authentication** (Sign up, Sign in, Sign out)
- **Secure Passwords:** All passwords are securely hashed (bcrypt) by Supabase.
- **Save Bookmarks** with auto-generated summaries using AI
- **Tagging** for easy organization and filtering
- **Drag-and-drop** bookmark reordering
- **Responsive, modern UI** (glassmorphism, mobile-friendly)
- **Dark Mode & Light Mode:**  
  - App defaults to dark mode for a modern look.  
  - Users can switch between dark and light mode at any time via the header menu.  
  - System theme detection is supported.  
  - Theme preference is remembered for future visits.
- **Supabase** backend for data and authentication
- **Instant search and filtering**
- **Profile management**

---

## 🌓 Theme System (Dark Mode & Light Mode)
- The app uses [next-themes](https://github.com/pacocoursey/next-themes) for theme management.
- **Default:** The app starts in dark mode.
- **Switching:** Users can toggle between dark and light mode from the header dropdown.
- **System Preference:** If enabled, the app can follow the user's system theme.
- **Persistence:** The selected theme is remembered for future visits.

---

## 🛠️ Tech Stack
- **Frontend:** React, TypeScript, Vite
- **UI:** Tailwind CSS, shadcn/ui, Lucide Icons
- **Backend:** Supabase (PostgreSQL, Auth, Storage)
- **State Management:** React Context, React Query
- **Theme:** next-themes

---

## 📁 Project Structure
```
CuratorAI/
├── public/                # Static assets (favicon, robots.txt, etc.)
├── src/
│   ├── components/        # Reusable UI and app components
│   ├── contexts/          # React Contexts (Auth, Theme)
│   ├── hooks/             # Custom React hooks
│   ├── integrations/      # Supabase client and types
│   ├── lib/               # Utility functions
│   ├── pages/             # Main app pages (Index, Auth, NotFound)
│   ├── App.tsx            # App entry point
│   ├── main.tsx           # React root
│   └── index.css          # Tailwind and custom styles
├── supabase/              # Supabase config and migrations
├── package.json           # Project metadata and dependencies
├── vite.config.ts         # Vite build config
└── Readme.md              # This file
```

---

## ⚙️ Setup & Installation
1. **Clone the repository:**
   ```sh
   git clone <your-repo-url>
   cd CuratorAI
   ```
2. **Install dependencies:**
   ```sh
   npm install --legacy-peer-deps
   ```
3. **Set up environment variables:**
   - Create a `.env` file in the root directory with:
     ```env
     VITE_SUPABASE_URL=your-supabase-url
     VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
     ```
4. **Start the development server:**
   ```sh
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173) (or the port shown in your terminal).

## 🔑 Environment Variables
- `VITE_SUPABASE_URL` — Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` — Your Supabase public anon key

---

## 🧑‍💻 Contributing
- Fork the repo and create a new branch for your feature or fix.
- Make your changes with clear comments.
- Submit a pull request with a clear description.

---

## 📣 Credits
- UI inspired by modern glassmorphism and shadcn/ui
- Built with ❤️ by Divyansh

---

## 📄 License
This project is open source and available under the MIT License. 
