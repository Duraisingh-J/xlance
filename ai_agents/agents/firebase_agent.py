from . import BaseAgent, AgentResult

class FirebaseAgent(BaseAgent):
    name = "Firebase Integration Agent"

    def review_rules(self) -> AgentResult:
        rules = self.read_file("firestore.rules")
        instructions = """
Review these Firestore rules for a freelancing platform with users, jobs,
contracts, and messages. Suggest safer rules but keep them practical for development.
Return improved rules only, not explanation.
"""
        res = self.ask(instructions, context=rules)
        if "service cloud.firestore" in res.raw_response:
            self.write_file("firestore.rules", res.raw_response)
            res.files_changed = ["firestore.rules"]
        return res
