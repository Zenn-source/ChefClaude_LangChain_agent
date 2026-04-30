import os
from tavily import TavilyClient
from langchain_core.tools import tool

def _get_client() -> TavilyClient:
    api_key = os.getenv("TAVILY_API_KEY")
    if not api_key or api_key == "your-tavily-api-key-here":
        raise ValueError(
            "TAVILY_API_KEY is not set. Add your key to the .env file."
        )
    return TavilyClient(api_key=api_key)


def _format_results(results: list[dict]) -> str:
    lines = []
    for r in results:
        title = r.get("title", "No title")
        content = r.get("content", "").strip()
        url = r.get("url", "")
        lines.append(f"**{title}**\n{content}\nSource: {url}")
    return "\n\n---\n\n".join(lines)


@tool
def recommend_dishes(cuisine: str, dietary_preferences: str) -> str:
    """Recommend dishes for a given cuisine and dietary preference using live web search.

    Use this when the user asks what to cook, what dishes exist for a cuisine,
    or what to eat given a dietary restriction.

    Args:
        cuisine: The cuisine type (e.g. 'italian', 'mexican', 'japanese', 'indian').
        dietary_preferences: Dietary needs such as 'vegetarian', 'vegan', 'gluten-free',
            or 'none' for no restrictions.
    """
    try:
        client = _get_client()
        query = f"best {cuisine} dishes to cook"
        if dietary_preferences.lower() not in ("none", ""):
            query += f" {dietary_preferences}"

        response = client.search(
            query=query,
            search_depth="basic",
            max_results=5,
            include_answer=True,
        )

        parts = []
        if response.get("answer"):
            parts.append(response["answer"])
        if response.get("results"):
            parts.append(_format_results(response["results"]))

        return "\n\n".join(parts) if parts else "No results found."

    except ValueError:
        raise
    except Exception as e:
        raise RuntimeError(f"Web search failed while looking up dish recommendations: {e}") from e


@tool
def get_recipe(dish_name: str) -> str:
    """Get a detailed step-by-step recipe for a specific dish using live web search.

    Use this when the user asks how to make or cook a specific dish by name.

    Args:
        dish_name: The name of the dish (e.g. 'Margherita Pizza', 'Carnitas Tacos').
    """
    try:
        client = _get_client()
        query = f"{dish_name} recipe step by step ingredients"

        response = client.search(
            query=query,
            search_depth="advanced",
            max_results=3,
            include_answer=True,
        )

        parts = []
        if response.get("answer"):
            parts.append(response["answer"])
        if response.get("results"):
            parts.append(_format_results(response["results"]))

        return "\n\n".join(parts) if parts else "No recipe found."

    except ValueError:
        raise
    except Exception as e:
        raise RuntimeError(f"Web search failed while looking up recipe for '{dish_name}': {e}") from e
