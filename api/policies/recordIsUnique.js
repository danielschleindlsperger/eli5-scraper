module.exports = function(id) {
  Scrape.findOne({
    scrapeId: id
  }).exec(function(err, result) {
    if (result) {
      return true;
    }
    if (err) {
      return false;
    }
  });
};
