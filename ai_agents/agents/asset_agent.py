from . import BaseAgent, AgentResult

class AssetAgent(BaseAgent):
    name = "Asset & Illustration Agent"

    def suggest_assets(
        self,
        instruction: str,
        scope: dict | None = None,
        output_path: str | None = None,
    ) -> AgentResult:
        """
        Generic asset helper.

        instruction: high-level description of what assets are needed
                     e.g. "Hero + empty state illustrations for the Reports page"
        scope: optional info about target pages/components
               e.g. {"pages": ["src/pages/Reports.jsx"]}
        output_path: optional docs file to write to
        """
        scope_text = ""
        if scope:
            scope_text = f"\nTarget scope (files/pages): {scope}\n"

        prompt = f"""
You are the visual design assistant for the Xlance freelancing platform.

Task:
{instruction}
{scope_text}

For each proposed asset, return:
- short name
- short description
- generative art prompt (usable in DALL·E / Midjourney / Canva)
- suggested aspect ratio (e.g. 16:9, 4:3, 1:1)

Output format:
- Use a markdown bullet list.
- Group by sections with headings, for example:
  ## Hero Illustration
  - ...
  ## Empty State
  - ...
"""
        res = self.ask(prompt)

        if output_path:
            self.write_file(output_path, res.raw_response)
            res.files_changed = [output_path]
        else:
            res.files_changed = []

        return res

    # 🔁 Legacy wrapper – still works, but now uses the generic method
    def suggest_find_work_assets(self) -> AgentResult:
        return self.suggest_assets(
            instruction=(
                "Propose hero + empty state illustrations and category icons "
                "for the Xlance Find Work page aimed at Indian freelancers."
            ),
            scope={"pages": ["src/pages/FindWork.jsx"]},
            output_path="docs/find_work_assets.md",
        )
