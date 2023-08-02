from typing import TypedDict, Literal

Role = Literal["user", "system", "assistant"]

class Message(TypedDict):
    """
    Represents a message in the OpenAI /chat/completions API.
    """
    role: Role
    content: str