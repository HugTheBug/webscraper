import telegram
from dotenv import load_dotenv
import os

load_dotenv()

token = os.getenv('TELEGRAM_TOKEN')
app_path = os.getenv('APP_PATH')
bot = telegram.Bot(token=token)

path = app_path # + '/bot/' + token
print(path)
bot.set_webhook(path)