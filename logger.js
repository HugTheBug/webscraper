const logger = console;

const printPosts = async (posts) => {
  logger.log(`${posts.length}\n`);
  posts.forEach((e) => {
    logger.log(`id: ${e.id} \ntext: \n${e.text}\n`);
  });
};

const printIds = async (posts) => {
  logger.log(posts.length);
  logger.log(posts.map((e) => e.id).join(', '));
};

exports.log = logger.log;
exports.printPosts = printPosts;
exports.printIds = printIds;
