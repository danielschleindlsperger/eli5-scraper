module.exports = {
  types: {
    size: function () {
      return true;
    }
  },
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
    topAnswerUpvotes: {
      type: 'integer'
    },
    topAnswerSubmitter: {
      type: 'string'
    },
    answered: {
      type: 'boolean'
    }
  }
};
