var request = require('request'); // https://github.com/request/request
var cheerio = require('cheerio'); // https://github.com/cheeriojs/cheerio
module.exports = {
  // GET HTML of subreddit specified in bootstrap.js
  scrapeFrontpage: function (url) {
    request(url, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log('\n\nScraping of new page started!\n', url);
        ScrapeService.parseFrontpage(body);
      } else {
        console.error(error);
      }
    });
  },
  // Parse HTML for urls to individual posts
  parseFrontpage: function (html) {
    $ = cheerio.load(html);
    $('.entry').each(function (index) {
      var commentUrl = 'http://reddit.com' + $(this).find('a.title').attr('href') + '?limit=1&sort=top';
      // console.log(commentUrl);
      ScrapeService.scrapeThread(commentUrl);
    });
    var nextURL = $('div.nav-buttons > span.nextprev > a').filter('[rel="nofollow next"]').attr('href');
    // only scrape more pages if they are Top of all time
    if (nextURL.indexOf('t=all') != -1) {
      ScrapeService.scrapeFrontpage(nextURL);
    }
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
    // Fix links to refer to reddit
    topAnswer = HelperService.escapeRedditLinks(topAnswer);
    if (!topAnswer) {
      console.log('\n\nComment was deleted, moving to next post\n\n');
      return;
    }
    var topAnswerSubmitter = comment.find('p.tagline > a.author').text();

    // Check if dataset is complete
    try {
      if (typeof redditCommentId === 'undefined') {
        throw 'redditCommentId doesn\'t exist.';
      }
      if (typeof title === 'undefined') {
        throw 'title doesn\'t exist.';
      }
      if (typeof upvotes === 'undefined') {
        throw 'upvotes doesn\'t exist.';
      }
      if (typeof topAnswer === 'undefined') {
        throw 'topAnswer doesn\'t exist.';
      }
      if (typeof topAnswerSubmitter === 'undefined') {
        throw 'topAnswerSubmitter doesn\'t exist.';
      }
    } catch (e) {
      console.error('\n\n', e, '\n\n');
    }
    Scrape.findOne({
      scrapeId: redditCommentId
    }).exec(function (err, results) {
      if (err) {
        console.log('Error checking for existance of entry: ', err, '\n Exiting.\n');
        return;
      }
      // Entry already exists, move along
      if (results) {
        console.log('\nEntry already exists.\n');
        return;
      }
      // Entry doesn't exist, create new entry
      Scrape.create({
        scrapeId: redditCommentId,
        title: title,
        upvotes: upvotes,
        topAnswer: topAnswer,
        topAnswerSubmitter: topAnswerSubmitter,
      }).exec(function createCB(err, created) {
        if (err) {
          console.error('There was an error creating a DB entry', err);
        } else {
          console.log('Created DB Entry: ', created.title);
        }
      });
    });
  }
};
