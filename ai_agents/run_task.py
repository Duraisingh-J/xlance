import argparse
from .langgraph_router import run_via_graph
from .manager import TaskType


def main():
    parser = argparse.ArgumentParser(description="Run Xlance AI agents task.")

    parser.add_argument(
        "--task",
        required=True,
        choices=[
            # Generic tasks
            "frontend_update",
            "design_spec",
            "firebase_review_rules",
            "run_frontend_checks",
            "asset_suggestions",
            "refactor_file",
            # Legacy aliases (still supported)
            "redesign_find_work",
            "design_spec_find_work",
            "asset_suggestions_find_work",
        ],
        help="Type of task the agents should perform.",
    )

    parser.add_argument(
        "--instruction",
        type=str,
        default="",
        help=(
            "Natural language instruction for the agents, e.g. "
            "'Redesign the Find Work page to match the Dashboard style.' "
            "If omitted for legacy tasks, a default will be used."
        ),
    )

    parser.add_argument(
        "--file",
        action="append",
        dest="files",
        default=None,
        help=(
            "Target file path for tasks that operate on specific files. "
            "Can be specified multiple times, e.g. "
            "--file src/pages/FindWork.jsx --file src/components/JobCard.jsx"
        ),
    )

    args = parser.parse_args()

    # Normalize to types expected by the manager / graph
    task: TaskType = args.task  # type: ignore
    instruction: str = args.instruction.strip()
    target_files = args.files or []

    # Call LangGraph wrapper – it should forward to ProjectManagerAgent.run(...)
    state = run_via_graph(
        task=task,
        instruction=instruction,
        target_files=target_files,
    )

    print("=== AI Agent Run Finished ===")
    print("Task:", task)
    print("Instruction:", instruction or "<none>")
    print("Target files:", ", ".join(target_files) if target_files else "<none>")
    print("Logs:")
    for line in state.get("logs", []):
        print("-", line)


if __name__ == "__main__":
    main()