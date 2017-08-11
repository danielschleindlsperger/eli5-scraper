module.exports = {
  connection: 'eli5_mysql',
  attributes: {
    scrapeId: {
      type: 'string',
      required: true,
      unique: true
    },
    title: {
      type: 'text'
    },
    upvotes: {
      type: 'string'
    },
    topAnswer: {
      type: 'text'
    },
    topAnswerSubmitter: {
      type: 'string'
    }
  }
};
