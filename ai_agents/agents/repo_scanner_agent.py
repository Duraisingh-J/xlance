import os
from . import BaseAgent, AgentResult
from ..config import REPO_ROOT

class RepoScannerAgent(BaseAgent):
    name = "Repository Scanner Agent"

    def analyze(self):
        tree = []
        for root, dirs, files in os.walk(REPO_ROOT):
            if "node_modules" in root or ".git" in root:
                continue
            for f in files:
                if f.endswith((".jsx", ".tsx", ".js")):
                    rel = os.path.relpath(os.path.join(root, f), REPO_ROOT)
                    tree.append(rel)

        instructions = """
Analyze the provided file tree.
Identify:
- shared components
- typography and Tailwind patterns
- reusable card structures
- design inconsistencies across pages
Return a JSON report with:
{ "components": [...], "patterns": [...], "issues": [...] }
"""
        r = self.ask(instructions, context="\n".join(tree))
        rel = "ai_agents/repo_analysis.json"
        self.write_file(rel, r.raw_response)
        r.files_changed = [rel]
        return r
