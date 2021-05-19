
$(document).ready(function() {
  $("#tweet-text").on("input", function () {
    let maxChar = 140;
    remainChar= maxChar - this.value.length;
    if (remainChar < 0) {
      $(this).parents().find('.counter').text(remainChar).css('color', 'red')
    } else {
      $(this).parents().find('.counter').text(remainChar).css('color', 'black')
    }
  }) 
})



