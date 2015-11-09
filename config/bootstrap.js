/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */
module.exports.bootstrap = function (cb) {
  ScrapeService.scrapeFrontpage('https://www.reddit.com/r/explainlikeimfive/top/?sort=top&t=all');
  var CronJob = require('cron').CronJob;
  var job = new CronJob('0 0 12 * * *', function () {
    ScrapeService.scrapeFrontpage('https://www.reddit.com/r/explainlikeimfive/top/?sort=top&t=day');
  }, null, true, 'Europe/Berlin');

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
