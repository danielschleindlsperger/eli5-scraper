module.exports = {
  index: function (req, res) {
    var id = req.param('scrape_id');
    Scrape.find({
      scrapeId: id
    }).exec(function (err, scrape) {
      if (err) {
        console.log(err);
        return res.badRequest('Scrape not found.');
      } else {
        return res.send(200, scrape);
      }
    });
  },
  random: function (req, res) {
    Scrape.query('SELECT * FROM scrape ORDER BY RAND() LIMIT 1', function (err, results) {
      console.log(results);
      if (err) {
        console.log(err);
        return res.serverError(err);
      }
      return res.ok(results);
    });
  }
};
