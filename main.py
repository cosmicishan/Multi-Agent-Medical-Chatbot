import asyncio
from Loggers.logger_config import logger
from Graph.main_graph import graph_builder
from langchain_core.messages import HumanMessage, AIMessageChunk

async def main():

    
    
    #gr = GraphRunner()
    gr = graph_builder()

    config = {
    "configurable": {
        "thread_id": 8
    }
}


    while(True):

        print()

        user_input = input("You: ")

        if user_input.lower() in ["exit", "quit", "bye"]:
            print('Are you here?')
            break

        inputs = {
        "messages": [
            ("user", user_input),
        ]}

        # events = gr.astream_events(input= inputs, version = "v2")
        
        # logger.debug(f"The events looks like this: {events}")

        # async for event in events:

        #     # if event["event"] == "on_chat_model_stream":
        #     #     print(event["data"]["chunk"].content, end="", flush = True)

        response = gr.invoke(inputs, config = config)

        assistant_response = response["messages"][-1].content

        print(f"Assistant {response.get("current_agent")}: ", assistant_response)
        
if __name__ == "__main__":
    asyncio.run(main())