import os
from dotenv import load_dotenv

# Load .env from repo root
ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
load_dotenv(os.path.join(ROOT_DIR, ".env"))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
DEFAULT_MODEL = "mixtral-8x7b-32768"  # good general Groq model

if not GROQ_API_KEY:
    raise RuntimeError("GROQ_API_KEY is not set in .env")

REPO_ROOT = ROOT_DIR  # used to read/write project files