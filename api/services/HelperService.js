module.exports = {
  escapeRedditLinks: function(html) {
    // Check for empty comments
    if (html.indexOf('<p>[removed]</p>') != -1 || html.indexOf('<p>[deleted]</p>') != -1) {
      return false;
    }
    return html.replace('/u/', 'http://reddit.com/u/').replace('/r/', 'http://reddit.com/r/');
  }
};
