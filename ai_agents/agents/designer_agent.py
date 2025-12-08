from . import BaseAgent, AgentResult

class DesignerAgent(BaseAgent):
    name = "UI/UX Designer Agent"

    def create_spec(
        self,
        instruction: str,
        scope: dict | None = None,
        output_path: str | None = None,
    ) -> AgentResult:
        """
        Generic design-spec helper.

        instruction: what needs to be designed/redesigned
                     e.g. "Create design spec for the Reports analytics page"
        scope: optional info about which files/pages this applies to
        output_path: optional docs path to save the spec
        """
        scope_text = ""
        if scope:
            scope_text = f"\nTarget scope (files/pages): {scope}\n"

        prompt = f"""
You are the principal UI/UX designer for the Xlance freelancing platform.

Task:
{instruction}
{scope_text}

The product already has these reference pages:
- Dashboard
- Find Work
- My Projects
- Messages

Design language:
- Clean SaaS, lots of white space
- Primary blue accent
- Rounded cards, subtle shadows
- React + Tailwind implementation

Create a **concise but clear design spec**.

Include sections:
- Layout (desktop / tablet / mobile)
- Key components and their hierarchy
- Spacing, typography scale, semantic colors (primary / neutral / success / error)
- Interaction states (loading, empty, error, hover, focus)
- Accessibility notes (contrast, focus order, keyboard navigation)

Return markdown only (no code).
"""
        res = self.ask(prompt)

        if output_path:
            self.write_file(output_path, res.raw_response)
            res.files_changed = [output_path]
        else:
            res.files_changed = []

        return res

    # 🔁 Legacy wrapper – still works, but uses generic implementation
    def create_find_work_spec(self) -> AgentResult:
        return self.create_spec(
            instruction="Create a design spec for the Xlance 'Find Work' page "
                        "that matches Dashboard / My Projects / Messages.",
            scope={"pages": ["src/pages/FindWork.jsx"]},
            output_path="docs/find_work_design_spec.md",
        )
