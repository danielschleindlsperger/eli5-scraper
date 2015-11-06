module.exports = {
  connection: 'eli5_mysql',
  attributes: {
    scrapeId: {
      type: 'string',
      required: true,
      unique: true
    },
    title: {
      type: 'string'
    },
    upvotes: {
      type: 'integer'
    },
    topAnswer: {
      type: 'text'
    },
    topAnswerSubmitter: {
      type: 'string'
    }
  }
};
