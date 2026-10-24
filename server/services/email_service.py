import logging
import os
import smtplib
from email.message import EmailMessage

from anyio import to_thread

logger = logging.getLogger("email_service")

SMTP_HOST = os.getenv("SMTP_HOST")
SMTP_PORT = int(os.getenv("SMTP_PORT", "587"))
SMTP_USERNAME = os.getenv("SMTP_USERNAME")
SMTP_PASSWORD = os.getenv("SMTP_PASSWORD")
EMAIL_FROM = os.getenv("EMAIL_FROM", "Job Portal <no-reply@jobportal.local>")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:3000")


def build_verification_email(name: str, user_type: str, verify_link: str) -> str:
    return f"""
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px;">
      <h2 style="color: #0d1526; margin: 0 0 8px;">Verify your email</h2>
      <p style="color: #667085; font-size: 15px; line-height: 1.6;">
        Hi {name},<br/><br/>
        Thanks for signing up as a <strong>{user_type}</strong> on Job Portal.
        Please confirm your email address to activate your account:
      </p>
      <p style="text-align: center; margin: 28px 0;">
        <a href="{verify_link}"
           style="background-color: #2cb18a; color: #ffffff; text-decoration: none;
                  font-weight: bold; font-size: 15px; padding: 12px 28px; border-radius: 10px;
                  display: inline-block;">
          Verify Email
        </a>
      </p>
      <p style="color: #667085; font-size: 13px; line-height: 1.6;">
        This link expires in 48 hours. If the button doesn't work, paste this URL into your browser:<br/>
        <a href="{verify_link}" style="color: #219a75; word-break: break-all;">{verify_link}</a>
      </p>
      <p style="color: #98a2b3; font-size: 12px;">If you didn't create an account, you can safely ignore this email.</p>
    </div>
    """


async def send_email(to: str, subject: str, html: str) -> None:
    message = EmailMessage()
    message["From"] = EMAIL_FROM
    message["To"] = to
    message["Subject"] = subject
    message.set_content("Please view this email in an HTML client.")
    message.add_alternative(html, subtype="html")

    if not SMTP_HOST:
        # Dev mode: no SMTP configured — dump the email content to the logs
        body = message.get_body(preferencelist=("html", "plain")) or message
        logger.warning(
            "SMTP_HOST not configured — email not sent. To: %s | Subject: %s | Body: %s",
            to,
            subject,
            body.get_content(),
        )
        return

    await to_thread.run_sync(_send_smtp, message)


def _send_smtp(message: EmailMessage) -> None:
    # Runs in a worker thread: stdlib smtplib is blocking
    with smtplib.SMTP(SMTP_HOST, SMTP_PORT, timeout=30) as smtp:
        smtp.starttls()
        if SMTP_USERNAME and SMTP_PASSWORD:
            smtp.login(SMTP_USERNAME, SMTP_PASSWORD)
        smtp.send_message(message)


async def send_verification_email(to: str, name: str, user_type: str, token: str) -> None:
    verify_link = f"{FRONTEND_URL}/verify?token={token}"
    await send_email(
        to,
        "Verify your Job Portal account",
        build_verification_email(name, user_type, verify_link),
    )
