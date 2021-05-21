/*
 * Client-side JS logic goes here
 * jQuery is already loaded
 * Reminder: Use (and do all your DOM work in) jQuery's document ready function
 */
$(document).ready(function() {
  $("section").hide();
  $("form").on("submit", function(event) {
    event.preventDefault();
    let formData = $(this).serialize();
    console.log($('.counter')[0].value)
    // conditions to check if user send string are empty or too long 
    if ($('.counter')[0].value < 0 || $('.counter')[0].value === 140 ){
      $('.error-msg')
      .text("your tweet cannot be empty or more than 140 charactors")
      .slideDown(1000)
      .delay(2000)
      .fadeOut(1);
    // conditions to check if user send meaningful string
    } else if ($("textarea").val() === "null" || $.trim($("textarea").val()) === "") {
      $('.error-msg')
      .text("please put someting meaningful")
      .slideDown(1000)
      .delay(2000)
      .fadeOut(1);
    } else {
      $.ajax({
        url: "/tweets",
        method: "POST",
        data: formData,
      })
        .then(() => {
          // refresh textarea to empty and reset counter number to 140 after post tweet
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
// function to perform a Get request from /tweets page by using ajax
  const loadTweets = function() {
    $.ajax({
      url: "/tweets",
      method: "GET",
    })
      .then((result) => {
        // empty database make sure there is no repeated tweets sent
        $('#display').empty();
        renderTweets(result);
      })
      .catch((err) => {
        console.log("ajax error caught");
        console.log(err);
      });
  };
// function to render all tweets from database
  const renderTweets = function(tweets) {
    tweets.reverse();
    for (const key of tweets) {
      const $dataToBeAppend = createTweetElement(key);
      $("#display").append($dataToBeAppend);
    }
  };
// function to solve cross site scripting problem
  const escape = function(str) {
    let div = document.createElement("div");
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };
// function to perform a slidedown animation when press post new button and always scroll to top when press
  $(".new-text").click(function() {
    $("section").slideToggle()
  });
  
  $(".new-text").click(function() {
    $('html, body').animate({scrollTop:0}, '300');
  });
// function to creat a template of new tweet in html style
  const createTweetElement = function(tweet) {
    let time = timeago.format(tweet["created_at"], "en_US");
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
  // load function to ensure the exsiting tweets rendered
  loadTweets();
});
