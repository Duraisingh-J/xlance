import subprocess
from . import BaseAgent, AgentResult
from ..config import REPO_ROOT

class TestingAgent(BaseAgent):
    name = "Testing & QA Agent"

    def run_frontend_checks(self) -> AgentResult:
        cmds = [
            ["npm.CMD", "run", "lint"],
            # Add others when available:
            # ["npm", "run", "test", "--", "--watch=false"],
            # ["npm", "run", "build"],
        ]
        logs = []
        ok = True
        for cmd in cmds:
            try:
                out = subprocess.check_output(
                    cmd, cwd=REPO_ROOT, stderr=subprocess.STDOUT, text=True
                )
                logs.append(f"$ {' '.join(cmd)}\n{out}")
            except subprocess.CalledProcessError as e:
                ok = False
                logs.append(f"$ {' '.join(cmd)}\n[FAILED]\n{e.output}")
                break

        summary = "All checks passed." if ok else "Some checks failed. See logs in GitHub Actions."
        return AgentResult(summary=summary, files_changed=[], raw_response="\n\n".join(logs))
