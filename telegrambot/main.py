from flask import Flask
import telegram
from dotenv import load_dotenv
import os
import json
from threading import Thread

load_dotenv()

app = Flask(__name__)
token = os.getenv('TELEGRAM_TOKEN')
bot = telegram.Bot(token=token)

def process_webhook(content):
    print('content {}'.foramt(content))
    print('message {}'.format(content['message']))
    message = content.message
    print('from {}'.format(message['from']))
    print('chat {}'.format(message['chat']))

@app.route('/bot/')
def bot_hello():
    return 'bot here'

@app.route('/bot/' + token)
def webhook_arrived():
    thread = Thread(target=process_webhook, args=(request.json,))
    thread.start()
    
    return 'hi, webhook'

if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entrypoint` to app.yaml.
    app.run(host='127.0.0.1', port=8081, debug=True)