/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function () {
  $("section").hide();
  $("form").on("submit", function (event) {
    event.preventDefault();
    let formData = $(this).serialize();
    const dataToCheck = formData.slice(5);
    // $("<div>").text(formData);
    console.log(dataToCheck.length)
    if (dataToCheck.length === 0 || dataToCheck.length > 140 ){
       $('.error-msg')
       .text("your tweet cannot be empty or more than 140 charactors")
       .slideDown(1000)
       .delay(2000)
       .fadeOut(1)
    } else if (dataToCheck === "null" || $.trim($("textarea").val()) === "") {
      $('.error-msg')
      .text("please put someting meaningful")
      .slideDown(1000)
      .delay(2000)
      .fadeOut(1)
    } else{
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: formData,
      })
        .then(() => {
          $("textarea").val("");
          $('.counter').text('140');
          loadTweets();
        })
        .catch((err) => {
          console.log("ajax error caught");
          console.log(err);
        });
    } 
  });

  const loadTweets = function (all) {
    $.ajax({
      url: "/tweets",
      method: "GET",
    })
      .then((result) => {
        $('#display').empty();
        renderTweets(result);  
      })
      .catch((err) => {
        console.log("ajax error caught");
        console.log(err);
      });
  };

  const renderTweets = function (tweets) {
    tweets.reverse();
    for (const key of tweets) {
      const $dataToBeAppend = createTweetElement(key);
      $("#display").append($dataToBeAppend);
    }
  };
  const escape = function (str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  $( ".new-text" ).click(function() {
    $( "section" ).slideToggle()})

  $(".new-text").click(function() {
      $('html, body').animate({scrollTop:0}, '300');
    });

  const createTweetElement = function (tweet) {
    let time = timeago.format(tweet["created_at"], "en_US");
    console.log("time:", tweet["created_at"]);
    console.log(time);
    const $tweet = $(`
    <article class="tweet">
      <header>
        <div>
          <img src="${tweet.user.avatars}"> 
          <span>${tweet.user.name}</span>
        </div>
        <div class="tag">${tweet.user.handle}</div>
      </header>
      <p class="tweet-content">${escape(tweet.content.text)}</p>
      <footer>
        <div id=“tweeted-since” style="font-size:16px">${time}</div>
        <div class="icon">
          <i class="fas fa-flag"></i>
          <i class="fas fa-share"></i>
          <i class="fas fa-heart"></i>
        </div>
      </footer>
    </article>
  `);
    return $tweet;
  };
  loadTweets();

});
