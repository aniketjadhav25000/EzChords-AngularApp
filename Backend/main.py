from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI
import os
from dotenv import load_dotenv

# Load environment variables from .env (for local testing)
load_dotenv()

# Get OpenAI API key from environment
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY is not set in the environment")

# Initialize OpenAI client
client = OpenAI(api_key=openai_api_key)

# Initialize FastAPI app
app = FastAPI()

# Enable CORS (allow frontend requests)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ Root endpoint to confirm backend is running
@app.get("/")
def read_root():
    return {"message": "EzChords AI backend is running!"}

# ✅ Chat endpoint to receive question from frontend
@app.post("/ask")
async def ask(request: Request):
    try:
        data = await request.json()
        question = data.get("question", "").strip()

        if not question:
            return {"answer": "Please enter a valid question."}

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful guitar tutor."},
                {"role": "user", "content": question}
            ]
        )

        return {"answer": response.choices[0].message.content.strip()}

    except Exception as e:
        return {"answer": f"An error occurred: {str(e)}"}

# ✅ Optional: Start server programmatically (useful locally)
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 10000))  # Render injects PORT if needed
    uvicorn.run("main:app", host="0.0.0.0", port=port)
