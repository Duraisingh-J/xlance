from . import BaseAgent, AgentResult

class StyleAgent(BaseAgent):
    name = "Global Style/Theme Agent"

    def update_design_tokens(self, changes: str) -> AgentResult:
        file = "src/styles/tokens.css"  # central theme location recommended
        current = self.read_file(file)

        instructions = f"""
Apply these global style changes to the design system CSS tokens:

{changes}

Preserve variable names.
Return only corrected file content.
"""
        r = self.ask(instructions, context=current)
        if ":" in r.raw_response:
            self.write_file(file, r.raw_response)
            r.files_changed = [file]
        return r
