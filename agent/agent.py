"""Example: Agno Agent with Finance tools

This example shows how to create an Agno Agent with tools (YFinanceTools) and expose it in an AG-UI compatible way.
"""
import os
import dotenv 
from agno.agent.agent import Agent
from agno.app.agui.app import AGUIApp
from agno.models.openai import OpenAIChat
#from agno.models.google import Gemini
from agno.tools.yfinance import YFinanceTools
from agno.tools.duckduckgo import DuckDuckGoTools
from agno.tools.arxiv import ArxivTools
from agno.tools.gmail import GmailTools



from frontend_tools import (
  add_proverb,
  set_theme_color,
  render_meeting_card,
  open_support_form,
  fill_support_form,
  generate_task_steps, 
)

dotenv.load_dotenv()


agent = Agent(
  model=OpenAIChat(id="gpt-4o"),
  #model=Gemini(id="gemini-2.5-pro"),
  tools=[
    # Example of a backend tool, defined and handled in your agno agent
    YFinanceTools(stock_price=True, historical_prices=True),
    # Example of frontend tools, handled in the frontend Next.js app
    DuckDuckGoTools(),
    ArxivTools(),
    GmailTools(port=0),
    add_proverb,
    set_theme_color,
    # Frontend Generative UI tool to render a meeting card
    render_meeting_card,
    # Frontend tools for customer support form flow
    open_support_form,
    fill_support_form,
    generate_task_steps, 
  ],
  show_tool_calls=True,
  description=(
    "You are an investment and research assistant that analyzes markets (prices, recommendations, fundamentals) "
    "and can retrieve relevant academic papers from arXiv."
  ),
  instructions=(
    "Format your response using markdown and use tables to display data where possible. "
    "For meeting-related requests, infer subject/date/time from the user's message and call the 'render_meeting_card' tool to present a confirmation card in the UI. "
    "For fetching news requests, search the web for information via DuckDuckGo() and always include the source. "
    "For reaching emails or sending emails, use GmailTools()"
    "For research requests about topics or papers, use ArxivTools() to search arXiv by keywords. "
    "Return 3 or 5 highly relevant results as a markdown list with this format: [Title](arXiv URL) — Authors (Year). "
    "Prefer the official arXiv page links, avoid fabricating citations, and include a one-line takeaway per paper. "
    "For customer support requests, first call 'open_support_form' to open a blank form, ask clarifying questions to collect missing details, then call 'fill_support_form' with the finalized values. "
    "Do not attempt to book or modify external calendars."
    "For email requests, ask for the recipients email address and a short description of the message."
    "Use the description to craft a polite subject and email body, preserving context."
    "Then call send_email(to=<address>, subject=<generated>, body=<generated>) with GmailTools."
    "Do not attempt calendar bookings here."
    "When the user asks you to perform any multi-step task (e.g., plan/organize/do X), "
    "you MUST call the tool `generate_task_steps` with exactly 10 concise imperative steps "
    "(each 2-4 words) and status='enabled'. "
    "Wait for the user's UI feedback (the tool will return a message listing selected steps). "
    "Then produce a short (max 3 sentences) creative description of how you execute the task. "
    "Do NOT list the steps; adapt around disabled steps with witty workarounds if needed."

  ),
)

agui_app = AGUIApp(
  agent=agent,
  name="Investment Analyst",
  app_id="investment_analyst",
  description="An investment analyst that researches stock prices, analyst recommendations, and stock fundamentals.",
)

app = agui_app.get_app()

if __name__ == "__main__":
  agui_app.serve(app="agent:app", port=8000, reload=True)

