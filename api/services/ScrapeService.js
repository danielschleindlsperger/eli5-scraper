var request = require('request'); // https://github.com/request/request
var cheerio = require('cheerio'); // https://github.com/cheeriojs/cheerio

module.exports = {
  // GET HTML of subreddit specified in bootstrap.js
  scrapePage: function (url) {
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
      ScrapeService.scrapeThread(commentUrl);
    });

    // scrape next page
    var nextURL = $('div.nav-buttons span.nextprev a').filter('[rel="nofollow next"]').attr('href');
    if (nextURL && nextURL.indexOf('t=all') != -1) {
      ScrapeService.scrapePage(nextURL);
    } else {
      console.log('Only scraping frontpage')
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

    try {
      var thread = {
        titleId: '#thing_t3_' + redditCommentId,
        title: $('title').text().replace(' : explainlikeimfive', ''),
        get upvotes() {
          return $(this.titleId + '> div.midcol > div.score.unvoted').text();
        },
        comment: $('div.comment'),
        get topAnswer() {
          return HelperService.escapeRedditLinks(this.comment.find('div.usertext-body > div.md').html());
        },
        get topAnswerSubmitter () {
          return this.comment.find('p.tagline > a.author').text();
        }
      };
    } catch (e) {
      console.log('There was an error parsing the thread.\nError: ', e, '\n');
      return;
    }

    if (!thread.topAnswer) {
      console.log('\n\nComment was deleted, moving to next post\n\n');
      return;
    }

    // Check if dataset is complete
    try {
      Object.keys(thread).forEach(attr => {
        if (typeof attr === 'undefined') {
          throw `${attr} doesn't exist.`
        }
      })
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

      thread.scrapeId = redditCommentId

      // Entry doesn't exist, create new entry
      Scrape.create({
        scrapeId: thread.scrapeId,
        title: thread.title,
        upvotes: thread.upvotes,
        topAnswer: thread.topAnswer,
        topAnswerSubmitter: thread.topAnswerSubmitter
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
