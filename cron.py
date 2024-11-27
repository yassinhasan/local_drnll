from crontab import CronTab
import os

cron = CronTab(tab="""
  * * * * * command # comment
""")

path = os.path.abspath("./testSession.py")
job = cron.new(command="python " + "'" + path + "'")
job.minute.every(1) 

cron.write()