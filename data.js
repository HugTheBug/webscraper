const Firestore = require('@google-cloud/firestore');
const { logger } = require('./log');
const config = require('./config');

const db = new Firestore({
  projectId: config.projectId,
  keyFilename: config.keyFilename,
});

const collectionScraping = 'scraping';
const collectionLinks = 'links';
const documentTelegram = 'telegram';
const documentGeneral = 'general';

const defaultLastId = 8268;
const getLastId = async () => {
  let doc = {};
  try {
    doc = await db.collection(collectionScraping).doc(documentTelegram).get();
  } catch (error) {
    logger.error(`Failed to get the last post id: database error "${error}". Using default id ${defaultLastId}.`);
    return defaultLastId;
  }
  if (doc.exists) {
    return doc.lastId;
  }
  logger.error(`Failed to get the last post id: scraping settings for telegram is not in the database. Using default id ${defaultLastId}.`);
  return defaultLastId;
};

const getLinks = async () => {
  let documents = [];
  try {
    documents = await db.collection(collectionLinks).get();
  } catch (error) {
    logger.error(`Failed to get links: database error "${error}".`);
    return [];
  }
  return documents.map((doc) => doc.link);
};

const updateLastId = async (posts) => {
  const lastId = posts[posts.length - 1].id;
  db.collection(collectionScraping).doc(documentTelegram).set({
    lastId,
  }, { merge: true });
  logger.info(`last post id is ${lastId}`);
  return posts;
};

const addLinks = async (links) => {
  links.forEach((e) => db.collection(collectionLinks).add({
    link: e.link,
    date: e.date,
  }).catch((error) => logger.error(`Failed to add link ${e.link} to the database: "${error}"`)));
  return links;
};

const getWords = async () => {
  let doc = {};
  try {
    doc = await db.collection(collectionScraping).doc(documentGeneral).get();
  } catch (error) {
    logger.error(`Failed to get words to search for: database error "${error}".`);
    return [];
  }
  if (doc.exists) {
    return doc.words;
  }
  logger.error('Failed to get words to search for: the words are not in the database.');
  return [];
};

exports.getLastId = getLastId;
exports.getLinks = getLinks;
exports.getWords = getWords;
exports.updateLastId = updateLastId;
exports.addLinks = addLinks;
