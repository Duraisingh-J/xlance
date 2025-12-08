# ai_agents/agents/frontend_agent.py
import re
from . import BaseAgent, AgentResult


class FrontendAgent(BaseAgent):
    name = "React + Tailwind Frontend Agent"

    def update_frontend(self, instruction: str, target_files: list[str]) -> AgentResult:
        """
        Generic React + Tailwind frontend agent.

        instruction: natural language task, e.g.
          - "Redesign the Find Work page to match Dashboard style"
          - "Add dark mode support to the navbar and layout"
          - "Refactor the job card component for better responsiveness"

        target_files: list of file paths to operate on, e.g.
          ["src/pages/FindWork.jsx", "src/components/find-work/JobCard.jsx"]
        """

        # 1) Read current code for all target files
        combined_context = []
        for path in target_files:
            try:
                content = self.read_file(path)
            except FileNotFoundError:
                content = ""
            combined_context.append(f"=== FILE: {path}\n{content}")

        context_str = "\n\n".join(combined_context)

        # 2) Ask the LLM to apply the change across those files
        prompt = f"""
You are a senior React + Tailwind engineer working on the Xlance freelancing
platform.

Task:
{instruction}

Codebase (concatenated files):
{context_str}

Requirements:
- Keep the existing design language consistent with Dashboard, My Projects,
  and Messages pages (light SaaS, white cards, primary blue accent, smooth
  spacing and radii).
- Use React with functional components and Tailwind utility classes.
- Preserve all exports, imports and routing so nothing breaks.
- Keep components responsive (mobile first; use flex, grid, gap, etc.).
- Reuse existing shared components (Card, Button, Badge, etc.) when possible.
- Do NOT introduce new dependencies without a clear reason.
- Only touch the files listed in target_files unless strictly necessary.

Response format:
Return the FULL updated code for each modified file in this exact format:

=== FILE: path/to/File.jsx
<complete updated file contents>

=== FILE: another/File.jsx
<complete updated file contents>

Do NOT include comments, explanations, or Markdown outside of this format.
"""

        res = self.ask(prompt)

        raw = res.raw_response or ""
        changed_files: list[str] = []

        # 3) Parse the LLM response and write updated files
        # Matches:
        # === FILE: path\n
        # <code until next === FILE or end>
        pattern = r"=== FILE:\s*(.+?)\n(.*?)(?=\n=== FILE:|\Z)"
        for match in re.finditer(pattern, raw, flags=re.DOTALL):
            path = match.group(1).strip()
            code = match.group(2).lstrip("\n")

            if not path or not code:
                continue

            self.write_file(path, code)
            changed_files.append(path)

        # 4) Attach metadata to AgentResult
        res.files_changed = changed_files
        res.summary = (
            f"Frontend updated for {len(changed_files)} file(s) "
            f"based on instruction: {instruction[:80]}..."
        )
        return res

    # OPTIONAL: backward-compatible helper so old code keeps working.
    # You can delete this later if everything uses update_frontend().
    def redesign_find_work_page(self) -> AgentResult:
        """Legacy helper that now calls the generic method."""
        instruction = """
Redesign the Find Work page so that it visually matches the Dashboard, My Projects,
and Messages pages:

- Light SaaS aesthetic: soft background, white cards, primary blue accent.
- Layout:
  - Page header with title "Find Work" and subtitle.
  - Search bar with:
      * keyword input
      * filters (Project type, Budget, Experience level)
  - Left sidebar (desktop only): saved searches, quick filters.
  - Main column: list of job cards with:
      * title, client, location/remote
      * badges: "AI Recommended", "Urgent", etc.
      * short description (2–3 lines)
      * skills chips
      * rate/budget in ₹ aligned to the right
      * primary button "View Details"
- Fully responsive:
  - On mobile: search bar on top, job cards stacked; sidebar collapses into a filter drawer.
- Reuse existing design tokens / components if they exist in this project.
- Keep all imports, exports, and routing intact.

"""
        return self.update_frontend(
            instruction=instruction,
            target_files=["src/pages/FindWork.jsx"],
        )