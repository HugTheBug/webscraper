const axios = require('axios');
const cheerio = require('cheerio');

const logger = require('./logger');

const siteUrl = 'https://t.me/s/vandroukiby';
const idPefixLength = 'vandroukiby/'.length;

const fetchData = async (url) => {
  logger.log(`fetching ${url} ...`);
  const result = await axios.get(url);
  const html = result.data;
  const $ = cheerio.load(html);
  const postsElement = $('section.tgme_channel_history.js-message_history').children('div');

  const posts = [];
  postsElement.each((i, element) => {
    const postBody = $(element).find('.tgme_widget_message.force_userpic.js-widget_message');
    const id = postBody.prop('data-post').slice(idPefixLength);
    const messagePart = postBody.find('.tgme_widget_message_text.js-message_text');
    const text = messagePart.contents().filter((_i, child) => child.tagName !== 'a' && child.tagName !== 'i').text();
    posts.push({
      id,
      text,
    });
  });
  logger.log('finished');
  return posts;
};

const fetchFirst = async (number) => {
  let posts = [];
  let data = await fetchData(siteUrl);
  let firstId = data[0].id;
  posts = posts.concat(data);
  for (let i = 20; i < number; i += 20) {
    // eslint-disable-next-line no-await-in-loop
    data = await fetchData(`${siteUrl}?before=${firstId}`);
    firstId = data[0].id;
    posts = data.concat(posts);
  }
  logger.log(`fetched ${posts.length} posts`);
  return posts;
};

const fetchUntilId = async (startId, maxNumber = 1000) => {
  let posts = [];
  let data = await fetchData(siteUrl);
  let firstId = data[0].id;
  posts = posts.concat(data);
  for (let i = 0; i < maxNumber; i += 20) {
    if (firstId <= startId) {
      break;
    }
    // eslint-disable-next-line no-await-in-loop
    data = await fetchData(`${siteUrl}?before=${firstId}`);
    firstId = data[0].id;
    posts = data.concat(posts);
  }
  if (firstId !== startId) {
    posts = posts.filter((e) => e.id > startId);
  }
  logger.log(`fetched ${posts.length} posts`);
  return posts;
};

exports.fetchUntilId = fetchUntilId;
exports.fetchFirst = fetchFirst;
