# 🎸 EzChords - AI-Powered Guitar Assistant 🎵

**EzChords** is a full-featured Angular web application designed for guitar enthusiasts. It provides AI-powered chord help, song tutorials, and guitar guidance — all within a smooth, mobile-friendly UI.

> ✅ **Live Backend API**: [https://ezchords-backend1.onrender.com](https://ezchords-backend1.onrender.com)  
> 🌐 **Frontend (Netlify/Vercel)**: _[Add when deployed]_  
> 📦 **GitHub Repo**: [https://github.com/aniketjadhav25000/EzChords-AngularApp](https://github.com/aniketjadhav25000/EzChords-AngularApp)

---

## 🧠 Features

- ✅ **Floating AI Assistant** powered by OpenAI (ChatGPT)
- 🎤 **Voice input (Speech Recognition)**
- 💬 Markdown-formatted AI replies
- 🚀 Smooth animations and drag-and-drop chat window
- 📱 Fully responsive design
- 🎵 Quick prompt suggestions for beginners
- 🎯 Backend deployed via **Render**
- ⚙️ Environment-based API integration

---

## 🛠️ Tech Stack

### 🌐 Frontend
- [Angular 17+](https://angular.io/)
- [Tailwind CSS (CDN)](https://tailwindcss.com/)
- RxJS, Forms, HttpClient
- Web Speech API (Voice input)
- Markdown to HTML conversion with `DomSanitizer`

### 🔙 Backend
- [FastAPI](https://fastapi.tiangolo.com/)
- [OpenAI Python SDK](https://platform.openai.com/)
- Deployed on [Render](https://render.com/)
- CORS enabled, `.env` support via `python-dotenv`

---

## 📦 Installation & Setup

### 🔧 Backend (FastAPI)

```bash
# 1. Clone the backend
git clone https://github.com/aniketjadhav25000/EzChords-AngularApp.git
cd EzChords-AngularApp/backend  # Assuming you split directories

# 2. Create a virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Add .env
echo "OPENAI_API_KEY=your_openai_key_here" > .env

# 5. Run server
uvicorn main:app --host 0.0.0.0 --port 8000
