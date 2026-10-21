from datetime import datetime, timezone

from beanie import Document, Replace, Save, SaveChanges, Update, before_event
from pydantic import Field

from utils.helpers import utcnow

class University(Document):
    name: str = Field(min_length=2, max_length=100)

    created_at: datetime = Field(default_factory=utcnow)
    updated_at: datetime = Field(default_factory=utcnow)

    @before_event(Save, Replace, SaveChanges, Update)
    def touch_updated_at(self):
        self.updated_at = utcnow()

    class Settings:
        name = "universities"