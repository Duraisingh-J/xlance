# ai_agents/llm_client.py
import os
from groq import Groq
from dotenv import load_dotenv, find_dotenv

# Load .env from project root (or nearest parent)
load_dotenv(find_dotenv())

# Read API key safely
api_key = os.getenv("GROQ_API_KEY")
if not api_key:
    raise RuntimeError(
        "GROQ_API_KEY is not set. "
        "Make sure you have a .env file in the project root with GROQ_API_KEY=... "
        "or set it in your environment."
    )

_client = Groq(api_key=api_key)

# Default model (can override via GROQ_MODEL in .env)
DEFAULT_MODEL = os.getenv("GROQ_MODEL", "llama-3.1-70b-versatile")


def chat_llm(messages, model: str = DEFAULT_MODEL, temperature: float = 0.2):
    """
    Thin wrapper around Groq chat completions.
    `messages` should be a list of {role, content}.
    """
    resp = _client.chat.completions.create(
        model=model,
        messages=messages,
        temperature=temperature,
    )
    return resp.choices[0].message