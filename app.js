var keys = require('./keys.json');
var Twitter = require('twitter');
var schedule = require('node-schedule');

var client = new Twitter({
	consumer_key: keys.consumer_key,
	consumer_secret: keys.consumer_secret,
	access_token_key: keys.access_token_key,
	access_token_secret: keys.access_token_secret
});

var since_id = '';

schedule.scheduleJob('*/30 * * * * *', scheduleRemovingTweets);

function scheduleRemovingTweets() {
	fetchTweets(since_id, removeOrIgnoreTweets);

	function removeOrIgnoreTweets(tweets) {
		if (tweets.length > 0)
			if (tweets[0].id_str)
				since_id = tweets[0].id_str;

		tweets.forEach(function (tweet) {
			if (hasMaxAge(tweet)) {
				scheduleRemovingTweet(tweet);
			}
		});
	};
}

function fetchTweets(since_id, callback) {
	var option = { count: 35 };
    if (since_id)
    	option.since_id = since_id;

	client.get('statuses/user_timeline', option, function (err, tweets) {
		if (err) {
			console.error(err);
		} else {
			callback(tweets);
		}
	});
}

function hasMaxAge(tweet) {
	if (getMaxAge(tweet))
		return true;
	else
		return false;
}

function getMaxAge(tweet) {
	var date = new Date();
	var hashtags = getHashtags(tweet);
	var shortestMaxAge = (hashtags.length > 0)
		? (isMaxAge(hashtags[0]))
			? hashtags[0] : null
		: null;

	for (var i = 1; i < hashtags.length; i++) {
		var hashtag = hashtags[i];
		if (isMaxAge(hashtag)) {
			var currentExpiration = getExpiration(hashtag, date).getTime();
			var previousExpiration = getExpiration(shortestMaxAge, date).getTime();
			if (currentExpiration < previousExpiration) {
				shortestMaxAge = hashtag;
			}
		}
	}

	if (shortestMaxAge)
		return shortestMaxAge;
	else
		return '';
}

function isMaxAge(maxAge) {
	return /^[0-9]?[0-9][mhdw]$/g.test(maxAge);
}

function getHashtags(tweet) {
	if (typeof tweet.entities == 'object') {
		if (Array.isArray(tweet.entities.hashtags)) {
			return tweet.entities.hashtags.map(function (item) {
                return item.text;
            });
		}
	}
	return [];
}

function getExpiration(maxAge, fromDate) {
	var expiration = new Date(fromDate.getTime());
	var value = parseInt(maxAge.match(/^[0-9]?[0-9]/g));
	var unit = maxAge.match(/[mhdw]$/g)[0];
	switch (unit) {
		case 'm':
			expiration.setMinutes(expiration.getMinutes() + value);
			break;
		case 'h':
			expiration.setHours(expiration.getHours() + value);
			break;
		case 'd':
			expiration.setDate(expiration.getDate() + value);
			break;
		case 'w':
			expiration.setDate(expiration.getDate() + value * 7);
			break;
	}
	return expiration;
}

function scheduleRemovingTweet(tweet) {
	var createdDate = new Date(tweet.created_at);
	var maxAge = getMaxAge(tweet);
	var expiration = getExpiration(maxAge, createdDate);

	function removeTweet() {
		client.post('statuses/destroy/' + tweet.id_str, function (err, tweet) {
			if (err) console.error(err);
			console.log('[' + new Date().toLocaleTimeString() + '] removed: ' + tweet.text + '(' + new Date(tweet.created_at).toLocaleTimeString() + ')');
		});
	}

	schedule.scheduleJob(expiration, removeTweet);
}