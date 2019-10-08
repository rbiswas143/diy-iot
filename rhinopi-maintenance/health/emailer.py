import smtplib
import os, json
import datetime
from email.mime.application import MIMEApplication
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.utils import COMMASPACE, formatdate

email_config = {
    'host': 'smtp.gmx.com',
    'port': 465,
    'username': '',
    'password': '',
    'recipients': ['']
}

subject = 'rhinoPi Health Update: {}'.format(str(datetime.datetime.now().date()))
text = 'PFA reports.'

msg = MIMEMultipart()
msg['Subject'] = subject
msg['From'] = email_config['username']
msg['To'] = email_config['recipients'][0]
msg['Date'] = formatdate(localtime=True)

msg.attach(MIMEText(text))

reports_dir = '/root/scripts/health/reports'
files = [os.path.join(reports_dir, f) for f in os.listdir(reports_dir)]

for f in files:
    print('Attaching file: {}'.format(f))
    with open(f, "rb") as fil:
        part = MIMEApplication(
            fil.read(),
            Name=os.path.basename(f)
        )
    # After the file is closed
    part['Content-Disposition'] = 'attachment; filename="%s"' % os.path.basename(f)
    msg.attach(part)
    
try:
    server = smtplib.SMTP_SSL(email_config['host'], email_config['port'])
    server.ehlo()
    server.login(email_config['username'], email_config['password'])
    server.sendmail(
        email_config['username'],
        email_config['recipients'],
        msg.as_string())
    server.quit()
    print('Mail sent')
except Exception as ex:
    print('Error sending mail: {}'.format(str(ex)))

