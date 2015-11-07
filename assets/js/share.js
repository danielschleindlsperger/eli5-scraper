$(document).ready(function() {
  share.addURI();
  share.initClipboard();
  $('#input-share-url').click(function(event_details) {
    $(this).select();
  });
});
var share = {
  input: document.querySelector('#input-share-url'),
  addURI: function() {
    var url = window.location.href;
    share.input.value = url;
  },
  initClipboard: function() {
    var clipboard = new Clipboard('.select-input');
  }
};
