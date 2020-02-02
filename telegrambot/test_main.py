from dotenv import load_dotenv
load_dotenv()

from main import webhook

import unittest
from unittest.mock import patch

import flask
from telegram import Bot

app = flask.Flask(__name__)

class ClientTestCase(unittest.TestCase):
    def make_request(self, filepath):
        with open(filepath) as f:
            with app.test_request_context(method='POST', data=f):
                r = flask.request
                webhook(r)

    def test_text_only(self):
        with patch.object(Bot, 'sendMessage', return_value='message text') as send:
            self.make_request('test_files/text_only.json')
            send.assert_called_with(chat_id=123456789, text='???')

    def test_subscribe_unsubscribe(self):
        with patch.object(Bot, 'sendMessage', return_value='message text') as send:
            self.make_request('test_files/subscribe.json')
            send.assert_called_with(chat_id=123456789, text='subscribed to notifications about new posts')
            
            self.make_request('test_files/unsubscribe.json')
            send.assert_called_with(chat_id=123456789, text='your subscription was cancelled')


    def test_substatus(self):
        with patch.object(Bot, 'sendMessage', return_value='message text') as send:
            self.make_request('test_files/sub_status.json')
            send.assert_called_with(chat_id=123456789, text='you are not subscribed')

            self.make_request('test_files/subscribe.json')
            send.assert_called_with(chat_id=123456789, text='subscribed to notifications about new posts')

            self.make_request('test_files/sub_status.json')
            send.assert_called_with(chat_id=123456789, text='you are subscribed')
            
            self.make_request('test_files/unsubscribe.json')
            send.assert_called_with(chat_id=123456789, text='your subscription was cancelled')
if __name__ == '__main__':
    unittest.main()