(function() {
  $(function() {
    var $tweetContent, handleTweet;
    $tweetContent = $("#tweet-content");
    handleTweet = function(tweet) {
      return $tweetContent.html(tweet);
    };
    if ($tweetContent.length > 0) {
      return twitterFetcher.fetch({
        id: "707675292278644736",
        domId: "tweet-content",
        maxTweets: 1,
        enableLinks: true,
        showUser: false,
        showTime: false,
        showRetweet: false,
        customCallback: handleTweet,
        showInteraction: false
      });
    }
  });

}).call(this);
