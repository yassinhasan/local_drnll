from email.message import EmailMessage
from email.mime.text import MIMEText
import smtplib, ssl
from config import mail_config
from emailtemplate import email_temp
from emailtemplateevents import email_tempevents


mail_config['MAIL_SERVER']
mail_config['MAIL_PORT']
mail_config['MAIL_USERNAME']
mail_config['MAIL_PASSWORD']
mail_config['MAIL_USE_TLS']
mail_config['MAIL_USE_SSL']


port = 587  # For starttls
smtp_server = mail_config['MAIL_SERVER']
mail_username = mail_config['MAIL_USERNAME']
receiver_email = mail_config['MAIL_USERNAME']
password = mail_config['MAIL_PASSWORD']
app_name = mail_config['APP_NAME']

# message = """\
# Subject: Final exam

# Teacher when is the final exam?"""

def sendemail( data):
        # p1 = f'<h4>From : {data["name"]}</font></h4>'
        # p2 = f'<p>{data["msg"]}</p><br>'
        # p3 = f'<span>Kind Regards,</span><br>'
        # p4 = f'<span> {data["email"]}</span><br>'
        # p5 = f'<span> phone: {data["phone"]}</span>'
        
        message = MIMEText(email_temp(data), 'html')  
        # servers may not accept non RFC 5321 / RFC 5322 / compliant TXT & HTML typos

        message['From'] = f"DR Null<{receiver_email}>"
        message['To'] = f'<Dr.null Website>'
        message['Cc'] = f'Copy To <{data["email"]}>'
        message['Subject'] = f'Thank you for feedback'
        msg = message.as_string()

        server = smtplib.SMTP(smtp_server, port)
        print("Connection Status: Connected")
        server.set_debuglevel(1)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(mail_username, password)
        print("Connection Status: Logged in")
        server.sendmail(data["email"], (receiver_email,data["email"]), msg)
        print("Status: Email as HTML successfully sent")

def sendevents(email,subject,message):
        # p1 = f'<h4>From : {data["name"]}</font></h4>'
        # p2 = f'<p>{data["msg"]}</p><br>'
        # p3 = f'<span>Kind Regards,</span><br>'
        # p4 = f'<span> {data["email"]}</span><br>'
        # p5 = f'<span> phone: {data["phone"]}</span>'
        

         
        message = MIMEText(email_tempevents(email,subject,message), 'html')  
        # servers may not accept non RFC 5321 / RFC 5322 / compliant TXT & HTML typos

        message['From'] = f"DR Null<{receiver_email}>"
        message['To'] = f'<{email}>'
        message['Subject'] = f'{subject}'
        msg = message.as_string()

        server = smtplib.SMTP(smtp_server, port)
        print("Connection Status: Connected")
        server.set_debuglevel(1)
        server.ehlo()
        server.starttls()
        server.ehlo()
        server.login(mail_username, password)
        print("Connection Status: Logged in")
        server.sendmail(receiver_email, email, msg)
        print("Status: Email as HTML successfully sent")
        server.quit()



