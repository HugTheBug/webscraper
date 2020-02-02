import telegram
import os
from google.cloud import firestore
from google.cloud.exceptions import NotFound


collection_scraping = u'scraping'
collection_subscriptions = u'subscriptions'
collection_chats = u'chats'
document_telegram = u'telegram'

db = firestore.Client()
token = os.environ['TELEGRAM_TOKEN']
bot = telegram.Bot(token=token)

def is_subscribed(chat_id):
    id_str = str(chat_id)
    chats = db.collection(collection_subscriptions).document(document_telegram).collection(collection_chats)
    return chats.document(id_str).get().exists

def unsubscribe(chat_id):
    id_str = str(chat_id)
    db.collection(collection_subscriptions).document(document_telegram).collection(collection_chats).document(id_str).delete()

def subscribe(chat_id):
    id_str = str(chat_id)
    db.collection(collection_subscriptions).document(document_telegram).collection(collection_chats).document(id_str).set({})

def get_last_post_id():
    doc = db.collection(collection_scraping).document(document_telegram).get()
    return doc.to_dict()[u'lastId']

def parse_message(message, chat_id):
    parsed = False
    for entity in message.entities:
        if entity.type == 'bot_command':
            command = message.text[entity.offset:entity.offset+entity.length]
            print('received command {}'.format(command))
            if command == '/id':
                parsed = True
                last_id = get_last_post_id()
                bot.sendMessage(chat_id=chat_id, text='id of the last processed post is {}'.format(last_id))
            elif command == '/sub':
                parsed = True
                subscribe(chat_id)
                bot.sendMessage(chat_id=chat_id, text='subscribed to notifications about new posts')
            elif command == '/unsub':
                parsed = True
                unsubscribe(chat_id)
                bot.sendMessage(chat_id=chat_id, text='your subscription was cancelled')
            elif command == '/substatus':
                parsed = True
                if is_subscribed(chat_id):
                    bot.sendMessage(chat_id=chat_id, text='you are subscribed')
                else:
                    bot.sendMessage(chat_id=chat_id, text='you are not subscribed')
    return parsed

def webhook(request):
    if request.method == 'POST':
        update = telegram.Update.de_json(request.get_json(force=True), bot)
        chat_id = update.message.chat.id
        message = update.message

        if parse_message(message, chat_id):
            print('successfully parsed the received message')
        else:
            print('failed to parse the received message')
            bot.sendMessage(chat_id=chat_id, text='???')   
    return 'ok'