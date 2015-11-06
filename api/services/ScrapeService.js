var request = require('request'); // https://github.com/request/request
var cheerio = require('cheerio'); // https://github.com/cheeriojs/cheerio
var scraps = {};
module.exports = {
  // GET HTML of subreddit specified in bootstrap.js
  scrapeFrontpage: function (url) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        ScrapeService.parseFrontpage(body);
      } else {
        console.log(error);
      }
    });
  },
  // Parse HTML for urls to individual posts
  parseFrontpage: function (html) {
    $ = cheerio.load(html);
    $('.entry').each(function (index) {
      var commentUrl = 'http://reddit.com' + $(this).find('a.title').attr('href') + '?limit=1&sort=top';
      console.log(commentUrl);
      ScrapeService.scrapeThread(commentUrl);
    });
  },
  // GET HTML for a singular post
  scrapeThread: function (commentUrl) {
    var redditCommentId = commentUrl.replace('http://reddit.com/r/explainlikeimfive/comments/', '').slice(0, 6);
    console.log(redditCommentId);
    request(commentUrl, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        ScrapeService.parseThread(body, redditCommentId);
      } else {
        console.log(error);
      }
    });
  },
  // Parse HTML of singular link and return its title, upvotes, the top comments, the top commenters, its answered status and the comment upvotes
  parseThread: function (html, redditCommentId) {
    $ = cheerio.load(html);
    var titleId = '#thing_t3_' + redditCommentId;
    var title = $('title').text().replace(' : explainlikeimfive', '');
    var upvotes = $(titleId + '> div.midcol > div.score.unvoted').text();
    // Helper variable comment for everything about the comment and not the OP
    var comment = $('div.comment');
    var topAnswer = comment.find('div.usertext-body > div.md').html();
    var topAnswerUpvotes = comment.find('p.tagline > span.score.unvoted').text().replace(' points', '');
    var topAnswerSubmitter = comment.find('p.tagline > a.author').text();
    var answered = $('div.linkflair > div.entry.unvoted > p.title > span.linkflairlabel').text() === 'Explained' ?
      true : false;
    Scrape.create({
      scrapeId: redditCommentId,
      title: title,
      upvotes: upvotes,
      topAnswer: topAnswer,
      topAnswerUpvotes: topAnswerUpvotes,
      topAnswerSubmitter: topAnswerSubmitter,
      answered: answered
    }).exec(function createCB(err, created) {
      if (err) {
        console.error('There was an error creating a DB entry', err);
      } else {
        console.log('Created DB Entry: ', created);
      }
    });
  }
};
