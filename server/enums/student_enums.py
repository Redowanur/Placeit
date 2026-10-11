from enum import Enum

ALLOWED_STUDENT_EMAIL_DOMAINS = {"student.sust.edu"}

class PlacementStatus(str, Enum):
    NOT_PLACED = "not_placed"
    IN_PROCESS = "in_process"
    INTERVIEW = "interview"
    PLACED = "placed"