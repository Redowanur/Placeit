from datetime import datetime, timezone

from beanie import Document, PydanticObjectId, Replace, Save, SaveChanges, Update, before_event
from pydantic import Field

def utcnow() -> datetime:
    return datetime.now(timezone.utc)

class Department(Document):
    name: str = Field(min_length=2, max_length=100)
    university_id: PydanticObjectId

    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    @before_event(Save, Replace, SaveChanges, Update)
    def touch_updated_at(self):
        self.updated_at = utcnow()

    class Settings:
        name = "departments"