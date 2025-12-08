import os
from dataclasses import dataclass
from typing import List
from ..llm_client import chat_llm
from ..config import REPO_ROOT

@dataclass
class AgentResult:
    summary: str
    files_changed: List[str]
    raw_response: str

class BaseAgent:
    name: str = "base-agent"

    def _system_prompt(self) -> str:
        return (
            f"You are the {self.name} for the Xlance freelancing platform.\n"
            "Tech stack: React + Vite + Tailwind + Firebase.\n"
            "You write concise, production-quality code and follow existing patterns."
        )

    def ask(self, instructions: str, context: str = "") -> AgentResult:
        msgs = [
            {"role": "system", "content": self._system_prompt()},
            {"role": "user", "content": f"Task:\n{instructions}\n\nContext:\n{context[:6000]}"},
        ]
        reply = chat_llm(msgs)
        return AgentResult(
            summary=reply[:400],
            files_changed=[],
            raw_response=reply,
        )

    # file helpers
    def read_file(self, rel_path: str) -> str:
        path = os.path.join(REPO_ROOT, rel_path)
        if not os.path.exists(path):
            return ""
        with open(path, "r", encoding="utf-8") as f:
            return f.read()

    def write_file(self, rel_path: str, content: str):
        path = os.path.join(REPO_ROOT, rel_path)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w", encoding="utf-8") as f:
            f.write(content)
