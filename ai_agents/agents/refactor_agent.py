from . import BaseAgent, AgentResult

class RefactorAgent(BaseAgent):
    name = "Refactor & Cleanup Agent"

    def refactor_component(self, rel_path: str) -> AgentResult:
        code = self.read_file(rel_path)
        instructions = f"""
Refactor this React component to be cleaner and more readable:

- Keep the same behaviour exactly.
- Extract small helper components if JSX is too long.
- Prefer functional components and hooks.
- Ensure Tailwind classes remain but can be re-grouped logically.

Return the full updated file (same language/extension).
"""
        res = self.ask(instructions, context=code)
        if res.raw_response.strip():
            self.write_file(rel_path, res.raw_response)
            res.files_changed = [rel_path]
        return res
