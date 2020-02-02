import telegram
import os
from google.cloud import firestore

collectionScraping = u'scraping'
documentTelegram = u'telegram'

db = firestore.Client()
token = os.environ['TELEGRAM_TOKEN']
bot = telegram.Bot(token=token)

def webhook(request):
    if request.method == 'POST':
        update = telegram.Update.de_json(request.get_json(force=True), bot)
        chat_id = update.message.chat.id
        message = update.message

        text = message.text
        for entity in message.entities:
            if entity.type == 'bot_command':
                command = message.text[entity.offset:entity.offset+entity.length]
                if command == 'id':
                    doc = db.collection(collectionScraping).document(documentTelegram).get()
                    bot.sendMessage(chat_id=chat_id, text=doc.to_dict()[u'lastId'])
                elif command == 'echo':
                    bot.sendMessage(chat_id=chat_id, text=text) 
    return 'ok'