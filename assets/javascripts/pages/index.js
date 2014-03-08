(function() {
  $(function() {
    var $tweetContent, handleTweet;
    $tweetContent = $("#tweet-content");
    handleTweet = function(tweet) {
      return $tweetContent.html(tweet);
    };
    if ($tweetContent.length > 0) {
      return twitterFetcher.fetch("421861421010272256", "tweet-content", 1, true, false, false, '', false, handleTweet, false);
    }
  });

}).call(this);
