from pydantic import BaseModel, Field
from typing import Literal
from langgraph.prebuilt import create_react_agent
from langgraph.graph import END
from langgraph.types import Command
from State.state import State
from langchain_groq import ChatGroq
from langchain_google_genai import ChatGoogleGenerativeAI
import os
from dotenv import load_dotenv
import logging
from Loggers.logger_config import logger
from langchain_core.messages import HumanMessage

load_dotenv()

llm = ChatGroq(model_name = os.getenv("MODEL_NAME"), streaming = True)

class Supervisor(BaseModel):

    next: Literal["crisis", "drug_research", "symptoms", "guidance" ,"supervisor"] = Field(description="""
        To determine the appropriate specialist to activate in response to a user’s message, the input must first be carefully analyzed to understand the underlying intent and urgency.

        Analyse and determine which specialist to activate next in the workflow sequence:

        crisis: When the user is in immediate need of surgery, urgent treatment, or requires a quick doctor check-up.

        drug_research: When the user has asked about a specific drug—you need to redirect them to this agent to research that particular drug.

        symptoms: When the user is describing symptoms and is trying to understand what might be causing them, but there is no sign of an immediate emergency.

        guidance: When the user is seeking non-urgent health advice, including wellness strategies, lifestyle modifications, chronic condition management, or general preventive care.

        supervisor: When uncertain or if the message contains ambiguous intent, ask the coordinator for clarification.

        """)

    reason: str = Field(
        description="""
        To determine the appropriate specialist to activate in response to a user’s message, the input must first be carefully analyzed to understand the underlying intent and urgency.

        If the content of the message suggests an immediate threat to the user's health or safety—such as the need for urgent medical intervention, emergency care, or situations that appear to be severe or time-sensitive—it should be directed to the crisis.
        This includes any language that conveys a sense of immediacy, distress, or potential life-threatening conditions, where prompt attention is essential.
        Justification: Clearly state the emergency indicators present in the user's message.
        Example: “The user described symptoms such as severe chest pain and difficulty breathing, which are indicative of a potential cardiac emergency.”

        If the user’s inquiry pertains specifically to a medication—such as seeking information about its safety, side effects, proper usage, potential interactions with other substances, or general drug-related details—the message should be routed to the drug_research.
        Justification: Identify the specific drug or medication mentioned and explain why this requires expert drug information.
        Example: “The user asked about the side effects of Paracetamol, which requires detailed drug research.”

        If the user is describing specific physical or mental symptoms and appears to be seeking a possible explanation or preliminary evaluation, without indicating immediate danger, the message should be routed to the symptom_checker.
        This includes symptom descriptions like pain, discomfort, or other health changes where the user is trying to identify a possible cause or condition.
        Justification: Highlight the described symptoms and explain how they align with the need for a diagnostic exploration.
        Example: “The user reported persistent fatigue and dizziness over several days. These symptoms warrant evaluation to identify a potential underlying condition.”

        If the user is seeking general health-related advice, lifestyle recommendations, preventive care strategies, mental wellness support, or non-urgent medical guidance, the message should be routed to guidance.
        This includes questions about nutrition, exercise, managing chronic conditions, emotional well-being, or routine health maintenance.
        Justification: Indicate that the user’s concern relates to health improvement or maintenance rather than diagnosis or emergency care.
        Example: “The user is asking for tips on managing stress and improving sleep quality, which fits within the scope of general health guidance.”

        In situations where the intent is unclear or there is ambiguity about whether the concern is urgent, medication-related, symptom-based, or guidance-oriented—for instance, when elements of multiple categories are present or the information provided is insufficient to make a confident determination—the case should be redirected to the supervisor.
        This ensures that uncertain or borderline cases receive appropriate review and are directed to the most suitable specialist without risking delays or misclassification.
        Justification: Use second person and ask the user clarifying questions to gather more information.
        Example: “Your message mentions symptoms that could relate to several medical conditions or medications. To help you best, could you please clarify whether you are experiencing a medical emergency or if you have a specific medication question? Are you currently in severe pain, or are you asking about a particular drug?”
        """)

def supervisor_node(state: State) -> Command[Literal["crisis", "drug_research", "symptoms", "guidance" ,"supervisor"]]:

    system_prompt = ("""
        To determine the appropriate specialist to activate in response to a user’s message, the input must first be carefully analyzed to understand the underlying intent and urgency.

        If the content of the message suggests an immediate threat to the user's health or safety—such as the need for urgent medical intervention, emergency care, or situations that appear to be severe or time-sensitive—it should be directed to the crisis.
        This includes any language that conveys a sense of immediacy, distress, or potential life-threatening conditions, where prompt attention is essential.

        If the user’s inquiry pertains specifically to a medication—such as seeking information about its safety, side effects, proper usage, potential interactions with other substances, or general drug-related details—the message should be routed to the drug_research.

        If the user is describing specific physical or mental symptoms and appears to be seeking a possible explanation or preliminary evaluation, without indicating immediate danger, the message should be routed to the symptom_checker.
        This includes symptom descriptions like pain, discomfort, or other health changes where the user is trying to identify a possible cause or condition.

        If the user is seeking general health-related advice, lifestyle recommendations, preventive care strategies, mental wellness support, or non-urgent medical guidance, the message should be routed to guidance.
        This includes questions about nutrition, exercise, managing chronic conditions, emotional well-being, or routine health maintenance.

        In situations where the intent is unclear or there is ambiguity about whether the concern is urgent, medication-related, symptom-based, or guidance-oriented—for instance, when elements of multiple categories are present or the information provided is insufficient to make a confident determination—the case should be redirected to the supervisor.
        This ensures that uncertain or borderline cases receive appropriate review and are directed to the most suitable specialist without risking delays or misclassification.          
        """)
    
    messages = [
        {"role": "system", "content": system_prompt},  
    ] + state["messages"] 
    
    response = llm.with_structured_output(Supervisor).invoke(messages)

    goto = response.next
    reason = response.reason

    if goto == "supervisor":

        return Command(update = {

            "messages": [("assistant", reason)],
            "current_agent": "Supervisor Agent"

        },
        goto = "__end__"
        
        )
    
    return Command(
        update={
            "messages": 
               [HumanMessage(content=reason)],
            "current_agent": goto
        },
        goto=goto,  
    )