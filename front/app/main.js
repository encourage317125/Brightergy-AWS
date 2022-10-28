$(document).ready(function () {
  var windowWidth = $(window).width();
  if (windowWidth < 1024) {
    $('body').addClass('collapsed');
    $('#wrapper').addClass('collapsed');
  }
});
