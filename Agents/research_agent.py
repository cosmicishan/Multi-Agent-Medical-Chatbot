from State.state import State
from langgraph.types import Command
from langgraph.prebuilt import create_react_agent
from langchain_community.tools.tavily_search import TavilySearchResults 
from langchain_groq import ChatGroq
from Loggers.logger_config import logger
import os 
from dotenv import load_dotenv

load_dotenv()

llm = ChatGroq(model_name = os.getenv("MODEL_NAME"), streaming = True)

def drug_research_node(state: State):
    """Handle drug information and research requests."""

    tavily_search = TavilySearchResults(max_results=10)

    research_agent = create_react_agent(
        llm,
        tools = [tavily_search],
        prompt = """
        Whenever a user asks for information about a medicine—whether it's the name, what it's used for, how to take it, possible side effects, or alternatives—the AI should use the dedicated drug information tool to search the official repository. The tool should be queried based on one of the following: the drug’s brand name, its generic composition, or its form (such as tablet, syrup, cream, injection, etc.). The tool can handle searches for both single drugs and compound formulations that contain more than one active ingredient. Once the tool returns the relevant data, the AI must always respond using the brand name of the drug (unless the user specifically requests the generic name).

        The AI should present the information in clear, layman-friendly language, avoiding medical jargon unless absolutely necessary—and even then, any technical term used should be explained simply. The response should begin with the drug’s brand name, followed by its general purpose (e.g., to relieve pain, reduce fever, treat infections, etc.). Then, briefly explain how the medicine works in the body in a way that's easy to understand (e.g., “It blocks certain chemicals that cause pain and fever”). The form of the drug—such as tablet, capsule, syrup—should be mentioned, and if it’s relevant, common precautions or side effects should be included (e.g., “It’s safe when taken correctly but too much can harm your liver”).

        If a user inputs a symptom or condition instead of a drug name (e.g., “What should I take for a headache?”), the AI should still use the tool to search based on the relevant condition or common treatment medications, and provide information about one suitable drug. If the drug isn’t found or the input is unclear, the AI should politely ask the user for more details, such as the brand name, what the medicine is for, or the form in which it is taken. The ultimate goal is to provide helpful, accurate, and understandable medicine guidance based on authoritative data, while ensuring users always walk away with brand-level clarity and a basic understanding of the medication’s purpose and safety.
        """
    )  

    result = research_agent.invoke(state)

    return Command(
        update={
            "messages": [{"role": "assistant", "content": result["messages"][-1].content}],
            "current_agent": "Drug Research Agent"
        },
        goto="__end__"
    )