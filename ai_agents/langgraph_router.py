# ai_agents/langgraph_router.py
from typing import TypedDict, List, Optional
from langgraph.graph import StateGraph, END

from .manager import ProjectManagerAgent, TaskType


class AgentState(TypedDict, total=False):
    task: TaskType
    instruction: str
    target_files: List[str]
    logs: List[str]


# Single shared manager instance
_pm = ProjectManagerAgent()


def manager_node(state: AgentState) -> AgentState:
    """Single LangGraph node that delegates to ProjectManagerAgent.run()."""
    task = state["task"]
    instruction = state.get("instruction", "")
    target_files = state.get("target_files", []) or []

    result = _pm.run(
        task=task,
        instruction=instruction,
        target_files=target_files,
    )

    logs = state.get("logs", [])
    logs.extend(result.logs)
    state["logs"] = logs
    return state


def build_graph():
    graph = StateGraph(AgentState)
    graph.add_node("manager", manager_node)
    graph.set_entry_point("manager")
    graph.add_edge("manager", END)
    return graph.compile()


_graph = build_graph()


def run_via_graph(
    task: TaskType,
    instruction: str = "",
    target_files: Optional[List[str]] = None,
) -> AgentState:
    """
    Small wrapper so the CLI (run_task.py) can call LangGraph in one line.
    """
    init_state: AgentState = {
        "task": task,
        "instruction": instruction,
        "target_files": target_files or [],
        "logs": [],
    }
    return _graph.invoke(init_state)