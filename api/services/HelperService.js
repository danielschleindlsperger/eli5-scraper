module.exports = {
  escapeRedditLinks: function(html) {
    return html.replace('/u/', 'http://reddit.com/u/').replace('/r/', 'http://reddit.com/r/');
  }
};
