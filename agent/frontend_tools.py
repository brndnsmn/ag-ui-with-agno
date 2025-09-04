from agno.tools import tool
from typing import Literal, TypedDict, List

class TaskStep(TypedDict):
    description: str
    status: Literal["enabled", "disabled", "executing"]

@tool(external_execution=True)
def generate_task_steps(steps: List[TaskStep]) -> str:  # UI render & wait
    """Render a 'Select Steps' UI with checkboxes.
    The model MUST pass 10 short imperative steps in steps=[{description, status='enabled'},...].
    The UI will let the user enable/disable and then respond with the selected steps."""



@tool(external_execution=True)
def set_theme_color(theme_color: str) -> str:  # pylint: disable=unused-argument
    """Change the theme color of the chat UI.

    Args:
        theme_color: The color to set (e.g., "#6366f1" or "indigo").
    """


@tool(external_execution=True)
def add_proverb(proverb: str) -> str:  # pylint: disable=unused-argument
    """Add a proverb to the chat UI list.

    Args:
        proverb: The proverb text to add.
    """


@tool(external_execution=True)
def render_meeting_card(
    subject: str,
    start_time: str,
    end_time: str,
    attendees: list[str] | None = None,
    description: str | None = None,
) -> str:  # pylint: disable=unused-argument
    """Render a meeting card on the frontend with the provided details.

    Args:
        subject: The meeting subject/title.
        start_time: ISO datetime string for meeting start.
        end_time: ISO datetime string for meeting end.
        attendees: Optional list of attendee emails.
        description: Optional meeting description/notes.
    """


@tool(external_execution=True)
def open_support_form() -> str:  # pylint: disable=unused-argument
    """Open and reset the customer support form on the frontend."""


@tool(external_execution=True)
def fill_support_form(
    fullName: str,
    email: str,
    subject: str,
    description: str,
    category: str | None = None,
    urgency: str | None = None,
    contactMethod: str | None = None,
) -> str:  # pylint: disable=unused-argument
    """Fill the customer support form fields on the frontend.

    Args:
        fullName: The user's full name.
        email: The user's email address.
        subject: Short subject for the support request.
        description: Detailed description of the issue.
        category: One of billing, technical, account, other.
        urgency: One of low, medium, high.
        contactMethod: One of email, phone, chat.
    """