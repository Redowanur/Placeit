from enums.student_enums import ALLOWED_STUDENT_EMAIL_DOMAINS


def _check_email(value: str | None) -> str | None:
    if value is None:
        return value
    value = value.lower()
    if value.split("@")[-1] not in ALLOWED_STUDENT_EMAIL_DOMAINS:
        raise ValueError("Use your university email address.")
    return value


def _check_phone(value: str | None) -> str | None:
    if value is None:
        return value
    if not value.isdigit() or len(value) != 10:
        raise ValueError("Invalid phone number.")
    return "+880" + value