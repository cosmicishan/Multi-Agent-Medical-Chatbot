from langgraph.graph import StateGraph, START, END
from State import State
from Agents.supervisor_agent import supervisor_node
from Agents.crisis_agent import crisis_node
from Agents.research_agent import drug_research_node
from Agents.guidance_agent import guidance_node
from Agents.symptoms_agent import symptoms_node
from Loggers.logger_config import logger
from langgraph.checkpoint.memory import MemorySaver

def graph_builder():

    memory = MemorySaver()

    graph = StateGraph(State)

    graph.add_node("supervisor", supervisor_node)
    graph.add_node("crisis", crisis_node)
    graph.add_node("drug_research", drug_research_node)
    graph.add_node("guidance", guidance_node)
    graph.add_node("symptoms", symptoms_node)

    graph.add_edge(START, "supervisor")
    
    compiled_graph = graph.compile(checkpointer = memory)

    logger.debug("The graph compiled successfully!")

    return compiled_graph