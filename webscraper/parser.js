const { logger } = require('./log');
const data = require('./data');

const processText = async (posts) => posts.map((e) => {
  e.text = e.text.toLowerCase();
  return e;
});

const filterPosts = async (posts) => {
  logger.info(`filtering ${posts.length} posts`);
  if (posts.length > 0) {
    const words = await data.getWords();
    const result = posts.filter((post) => words.some((e) => e.test(post.text)));
    logger.info(`${result.length} posts left after filtering`);
    return result;
  } else {
    return [];
  }
};

// eslint-disable-next-line arrow-body-style
const getLinks = async (posts) => posts.map((e) => {
  return {
    link: `https://t.me/vandroukiby/${e.id}`,
    date: e.date,
  };
});

const filterLinks = async (posts) => processText(posts).then(filterPosts).then(getLinks);

exports.filterLinks = filterLinks;
