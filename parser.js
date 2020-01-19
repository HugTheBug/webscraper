const logger = require('./logger');
const data = require('./data');

const processText = async (posts) => posts.map((e) => {
  e.text = e.text.toLowerCase();
  return e;
});

const filterPosts = async (posts) => {
  const names = await data.getNames();
  const result = posts.filter((post) => names.findIndex((e) => post.text.indexOf(e) !== -1) !== -1);
  logger.log(`filtered ${result.length} posts`);
  return result;
};

const getLinks = async (posts) => posts.map((e) => `https://t.me/vandroukiby/${e.id}`);

const filterLinks = async (posts) => processText(posts).then(filterPosts).then(getLinks);

exports.filterLinks = filterLinks;
