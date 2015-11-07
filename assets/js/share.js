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
    // init clipboard.js
    var clipboard = new Clipboard('.select-input');
    // init bootstrap tooltip
    $('[data-toggle="tooltip"]').tooltip({
      title: 'Copied!',
      placement: 'top',
      trigger: 'manual'
    });
    // set handler to hide tooltip after 2000ms of appearing
    $('[data-toggle="tooltip"]').on('shown.bs.tooltip', function() {
      setTimeout(function() {
        $('[data-toggle="tooltip"]').tooltip('hide');
      }, 2000)
    });
    // Tooltip to display after successfull copying to clipboard
    clipboard.on('success', function(e) {
      $('[data-toggle="tooltip"]').tooltip('show');
    });
  },
};
