from email.mime.text import MIMEText
import smtplib
from config import mail_config
from services.emailtemplate import email_temp
from services.emailtemplateevents import email_tempevents

# Extract mail configuration
MAIL_SERVER = mail_config['MAIL_SERVER']
MAIL_PORT = mail_config['MAIL_PORT']
MAIL_USERNAME = mail_config['MAIL_USERNAME']
MAIL_PASSWORD = mail_config['MAIL_PASSWORD']
MAIL_USE_TLS = mail_config['MAIL_USE_TLS']
MAIL_USE_SSL = mail_config['MAIL_USE_SSL']
APP_NAME = mail_config['APP_NAME']

# Constants
PORT = 587  # For STARTTLS

def create_email_message(from_email, to_email, subject, body, cc=None):
    message = MIMEText(body, 'html')
    message['From'] = f"{APP_NAME} <{from_email}>"
    message['To'] = to_email
    message['Subject'] = subject
    if cc:
        message['Cc'] = cc
    return message.as_string()

def send_email(smtp_server, port, username, password, from_email, to_email, subject, body, cc=None):
    try:
        server = smtplib.SMTP(smtp_server, port)
        print("Connection Status: Connected")
        server.set_debuglevel(1)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(username, password)
        print("Connection Status: Logged in")

        msg = create_email_message(from_email, to_email, subject, body, cc)
        server.sendmail(from_email, to_email, msg)
        print("Status: Email as HTML successfully sent")
    finally:
        server.quit()

def send_feedback_email(data):
    body = email_temp(data)
    subject = 'Thank you for your feedback'
    cc = f'Copy To <{data["email"]}>'
    send_email(
        smtp_server=MAIL_SERVER,
        port=PORT,
        username=MAIL_USERNAME,
        password=MAIL_PASSWORD,
        from_email=MAIL_USERNAME,
        to_email=MAIL_USERNAME,
        subject=subject,
        body=body,
        cc=cc
    )

def send_event_email(email, subject, message):
    body = email_tempevents( message)
    send_email(
        smtp_server=MAIL_SERVER,
        port=PORT,
        username=MAIL_USERNAME,
        password=MAIL_PASSWORD,
        from_email=MAIL_USERNAME,
        to_email=email,
        subject=subject,
        body=body
    )

# Example usage:
# send_feedback_email(data)
# send_event_email(email, subject, message)