# ai_agents/manager.py
import os
from dataclasses import dataclass, field
from typing import List, Literal, Optional

from .agents.frontend_agent import FrontendAgent
from .agents.designer_agent import DesignerAgent
from .agents.firebase_agent import FirebaseAgent
from .agents.testing_agent import TestingAgent
from .agents.asset_agent import AssetAgent
from .agents.refactor_agent import RefactorAgent
from .config import REPO_ROOT  # make sure this exists and points to project root

TaskType = Literal[
    # Generic
    "frontend_update",
    "design_spec",
    "firebase_review_rules",
    "run_frontend_checks",
    "asset_suggestions",
    "refactor_file",

    # Legacy aliases (mapped internally)
    "redesign_find_work",
    "design_spec_find_work",
    "asset_suggestions_find_work",
]


@dataclass
class ManagerResult:
    task: TaskType
    logs: List[str] = field(default_factory=list)


class ProjectManagerAgent:
    """
    Central coordinator for all web-dev agents.
    It now also auto-creates missing files (React + Tailwind scaffold)
    before running frontend/refactor tasks.
    """

    def __init__(self):
        self.frontend = FrontendAgent()
        self.designer = DesignerAgent()
        self.firebase = FirebaseAgent()
        self.testing = TestingAgent()
        self.asset = AssetAgent()
        self.refactor = RefactorAgent()

    # ---------- NEW: file bootstrap helpers ----------

    def _to_component_name(self, base: str) -> str:
        """
        Turn 'find-work', 'find_work', 'findWork' into 'FindWork'
        """
        # replace separators with space
        cleaned = base.replace("-", " ").replace("_", " ")
        parts = cleaned.split()
        if not parts:
            return "XlancePage"
        return "".join(p[:1].upper() + p[1:] for p in parts)

    def _ensure_files_exist(self, target_files: List[str]) -> List[str]:
        """
        For each relative path in target_files:
        - If file exists, do nothing.
        - If file does NOT exist, create a minimal React + Tailwind scaffold.

        Returns list of files that were created.
        """
        created: List[str] = []

        for rel in target_files:
            if not rel:
                continue

            # Normalise path for Windows
            rel_norm = rel.replace("\\", "/")
            full_path = os.path.join(REPO_ROOT, rel_norm)

            if os.path.exists(full_path):
                continue  # already there

            os.makedirs(os.path.dirname(full_path), exist_ok=True)

            # Simple scaffold for React .jsx pages/components
            if rel_norm.endswith(".jsx"):
                base_name = os.path.splitext(os.path.basename(rel_norm))[0]
                comp_name = self._to_component_name(base_name)
                content = f'''import React from "react";

export default function {comp_name}() {{
  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-semibold text-gray-900">{comp_name}</h1>
        <p className="mt-2 text-gray-500">
          This page was scaffolded by the Xlance AI agent. You can now refine it
          using frontend_update tasks to match the rest of the design system.
        </p>
      </div>
    </main>
  );
}}
'''
            else:
                # Generic placeholder for non-JSX files
                content = "// TODO: Implement this file (created by AI bootstrap).\n"

            with open(full_path, "w", encoding="utf-8") as f:
                f.write(content)

            created.append(rel_norm)

        return created

    # ---------- MAIN RUN METHOD ----------

    def run(
        self,
        task: TaskType,
        instruction: str = "",
        target_files: Optional[List[str]] = None,
    ) -> ManagerResult:
        """
        task:
          One of TaskType.
        instruction:
          Natural-language description of what you want done.
        target_files:
          List of repo paths to operate on for frontend/refactor/etc.
        """
        logs: List[str] = []
        target_files = target_files or []

        # --- Legacy task shims: map old Find-Work-specific tasks to generic ones ---

        if task == "redesign_find_work":
            task = "frontend_update"
            if not instruction:
                instruction = (
                    "Redesign the Find Work page so it matches the Dashboard / "
                    "My Projects / Messages visual style. Keep route and data mocks."
                )
            if not target_files:
                target_files = ["src/pages/FindWork.jsx"]

        elif task == "design_spec_find_work":
            task = "design_spec"
            if not instruction:
                instruction = "Create a detailed UX/UI spec for the Find Work page."
            if not target_files:
                target_files = ["src/pages/FindWork.jsx"]

        elif task == "asset_suggestions_find_work":
            task = "asset_suggestions"
            if not instruction:
                instruction = (
                    "Suggest icons/illustrations/images for the Find Work page "
                    "that match the Xlance brand."
                )
            if not target_files:
                target_files = ["src/pages/FindWork.jsx"]

        # --- Auto-bootstrap: create missing files before certain tasks ---

        if task in ("frontend_update", "refactor_file") and target_files:
            created = self._ensure_files_exist(target_files)
            if created:
                logs.append(f"Scaffolded missing files: {', '.join(created)}")

        # --- Generic task handling ---

        if task == "design_spec":
            r = self.designer.create_page_spec(
                instruction=instruction,
                target_files=target_files,
            )
            logs.append(r.summary or "Design spec created/updated.")

        elif task == "asset_suggestions":
            r = self.asset.suggest_assets(
                instruction=instruction,
                target_files=target_files,
            )
            logs.append(r.summary or "Asset suggestions generated.")

        elif task == "frontend_update":
            r = self.frontend.update_frontend(
                instruction=instruction,
                target_files=target_files,
            )
            logs.append(r.summary or "Frontend updated.")

        elif task == "firebase_review_rules":
            r = self.firebase.review_rules()
            logs.append(r.summary or f"Rules updated: {', '.join(r.files_changed)}")

        elif task == "run_frontend_checks":
            r = self.testing.run_frontend_checks()
            logs.append(r.summary or "Frontend checks completed.")

        elif task == "refactor_file":
            if not target_files:
                logs.append("No target_files provided for refactor_file task.")
            else:
                for path in target_files:
                    r = self.refactor.refactor_component(path)
                    logs.append(
                        r.summary or f"Refactored {path}: {', '.join(r.files_changed)}"
                    )

        else:
            logs.append(f"Unknown or unsupported task: {task}")

        return ManagerResult(task=task, logs=logs)