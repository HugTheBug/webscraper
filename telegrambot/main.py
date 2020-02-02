import telegram
import os
from google.cloud import firestore

collectionScraping = u'scraping'
documentTelegram = u'telegram'

db = firestore.Client()
token = os.environ['TELEGRAM_TOKEN']
bot = telegram.Bot(token=token)

def parse_message(message, chat_id):
    text = message.text
    parsed = False
    for entity in message.entities:
        if entity.type == 'bot_command':
            command = message.text[entity.offset:entity.offset+entity.length]
            print('received command {}'.format(command))
            if command == '/id':
                doc = db.collection(collectionScraping).document(documentTelegram).get()
                bot.sendMessage(chat_id=chat_id, text=doc.to_dict()[u'lastId'])
                parsed = True
            elif command == '/echo':
                bot.sendMessage(chat_id=chat_id, text=text)
                parsed = True
    return parsed

def webhook(request):
    if request.method == 'POST':
        update = telegram.Update.de_json(request.get_json(force=True), bot)
        chat_id = update.message.chat.id
        message = update.message

        if not parse_message(message, chat_id):
            print('failed to parse the received message')
            bot.sendMessage(chat_id=chat_id, text='???')   
    return 'ok'