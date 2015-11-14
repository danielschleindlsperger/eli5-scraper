module.exports = {
  escapeRedditLinks: function(html) {
    // Check for empty comments
    if (html.indexOf('<p>[removed]</p>') != -1 || html.indexOf('<p>[deleted]</p>') != -1) {
      return false;
    }
    // replace instances where links refer to /u/... or /r/ with actual links to reddit
    return html.replace(/href=\"\/u\//g, 'href=\"https://reddit.com/u/').replace(/href=\"\/r\//g, 'href=\"https://reddit.com/r/');
  }
};
