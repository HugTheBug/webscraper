const { logger } = require('./log');

let lastId = 8226;
const getLastId = async () => lastId;

let savedLinks = [];
const getLinks = async () => savedLinks;

const updateLastId = async (posts) => {
  lastId = posts[posts.length - 1].id;
  logger.info(`last post id is ${lastId}`);
  return posts;
};

const addLinks = async (links) => {
  savedLinks = savedLinks.concat(links);
  return links;
};

const getNames = async () => [
  'ньюйорк', 'нью-йорк', 'нью йорк',
  'лосанджелес', 'лос-анджелес', 'лос анджелес',
  'санфранциско', 'сан-франциско', 'сан франциско',
  'майами',
  'сиэтл',
  'ласвегас', 'лас-вегас', 'лас вегас',
  'остин',
  'америка', 'сша', 'штаты',
];

exports.getLastId = getLastId;
exports.getLinks = getLinks;
exports.getNames = getNames;
exports.updateLastId = updateLastId;
exports.addLinks = addLinks;
