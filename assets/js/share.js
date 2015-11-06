$(document).ready(function () {
  share.addURI();
  share.selectInput();
  $('#input-share-url').click(function (event_details) {
    $(this).select();
  });
});
var share = {
  input: $('#input-share-url'),
  addURI: function () {
    var url = window.location.href;
    share.input.val(url);
  },
  selectInput: function () {


  }
};
