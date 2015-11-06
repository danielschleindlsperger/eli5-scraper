module.exports = {
  home: function(req, res) {
    Scrape.query('SELECT * FROM scrape ORDER BY RAND() LIMIT 5', function(err, results) {
      // console.log(results);
      if (err) {
        console.log(err);
        return res.serverError(err);
      }
      var data = {};
      data.titles = [];
      data.ids = [];
      for (var i = 0; i < results.length; i++) {
        data.titles[i] = results[i].title;
        data.ids[i] = results[i].scrapeId;
      }
      return res.view('homepage', data);
    });
  },
  index: function(req, res) {
    var id = req.param('scrape_id');
    Scrape.find({
      scrapeId: id
    }).exec(function(err, result) {
      if (err) {
        console.log(err);
        return res.badRequest('Scrape not found.');
      } else {
        return res.view('scrape/default', result[0]);
      }
    });
  },
  random: function(req, res) {
    Scrape.query('SELECT * FROM scrape ORDER BY RAND() LIMIT 1', function(err, result) {
      // console.log(results);
      if (err) {
        console.log(err);
        return res.serverError(err);
      }
      // console.log(result[0].scrapeId);
      var url = '/scrape/' + result[0].scrapeId;
      return res.redirect(url);
    });
  }
};
