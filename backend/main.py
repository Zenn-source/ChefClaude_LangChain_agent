import os
from dotenv import load_dotenv
from langchain_openai import ChatOpenAI
from langchain.agents import create_agent
from tools import recommend_dishes, get_recipe

load_dotenv()

SYSTEM_PROMPT = """You are Chef Claude, a warm and knowledgeable personal chef assistant.
You help users decide what to cook based on their cuisine preferences and dietary needs,
and you provide clear, encouraging step-by-step recipes.

When a user asks what to eat or cook, use the recommend_dishes tool.
When a user asks how to make a specific dish, use the get_recipe tool.
If they ask for recommendations AND a recipe in the same message, call both tools.
Always be enthusiastic, supportive, and explain any culinary terms clearly."""

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0.7)
tools = [recommend_dishes, get_recipe]
agent = create_agent(llm, tools, system_prompt=SYSTEM_PROMPT)


def run_turn(query: str) -> None:
    try:
        for chunk in agent.stream(
            {"messages": [("user", query)]},
            stream_mode="values",
        ):
            message = chunk["messages"][-1]

            if message.type == "ai":
                if message.tool_calls:
                    for tc in message.tool_calls:
                        print(f"  [Chef is checking: {tc['name']}...]")
                elif message.content:
                    print(f"\nChef Claude: {message.content}")

    except Exception as e:
        print(f"\nChef Claude: I ran into a problem in the kitchen — {e}")
        print("Chef Claude: Please try asking again, perhaps in a different way.")


def main():
    print("=" * 55)
    print("    Welcome to Chef Claude — Your Personal Chef!")
    print("    Ask me what to cook or how to make a dish.")
    print("    Type 'exit' or 'quit' to leave the kitchen.")
    print("=" * 55)

    while True:
        try:
            user_input = input("\nYou: ").strip()
        except (KeyboardInterrupt, EOFError):
            print("\nChef Claude: Goodbye — bon appétit!")
            break

        if not user_input:
            continue

        if user_input.lower() in ("exit", "quit"):
            print("Chef Claude: It was a pleasure cooking with you. Bon appétit!")
            break

        run_turn(user_input)


if __name__ == "__main__":
    main()
