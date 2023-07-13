from typing import TypedDict, Literal

Role = Literal["user", "system", "assistant"]

class Message(TypedDict):
    role: Role
    content: str