from enum import Enum


class JobType(str, Enum):
     FULL_TIME = "full_time"
     PART_TIME = "part_time"
     INTERNSHIP = "internship"
     CONTRACT = "contract"
     
class WorkPlace(str, Enum):
    REMOTE = "remote"
    ONSITE = "onsite"
    HYBRID = "hybrid"