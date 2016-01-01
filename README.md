# node-auto-tweet-remover
A Node.js app that removes your expired tweets.  
期限切れのツイートを削除するNode.jsアプリ。

# Usage/使い方
You can remove tweets automatically using hash tags.  
ハッシュタグを使ってツイートを自動的に削除できます。

You can use the number 0-99 and one of time units `m`(minute) `h`(hour) `d`(day) `w`(week) as the expiration of the tweet.  
0〜99の数字と時間の単位`m`(分) `h`(時間) `d`(日) `w`(週)がツイートの有効期限として使えます。

If multiple expiration are set, the shortest one will be used.  
複数の期限が指定された場合、そのうち一番期間の短いものが採用されます。  

# Examples of hashtags/ハッシュタグの例
### #1m
The tweet will be removed in 1 minute. / 一分後にツイートは削除されます。

### #12h
in 12 hours / 12時間後

### #3d
in 3 days / 3日後

### #1w
in 1 week / 1週間後

# How to run/実行方法
Copy the following text to `keys.json` and replace `XXX` to your correct keys (Make a file `keys.json` in this directory).  
下のテキストを`keys.json`にコピーして、`XXX`を正しいキーに書き換えてください(このディレクトリに`keys.json`というファイルを作ってください)。 
```json
	{  
		"consumer_key": "XXX",  
		"consumer_secret": "XXX",  
		"access_token_key": "XXX",  
		"access_token_secret": "XXX"  
	}
```

Install the modules required and run app.js.  
必要なモジュールをインストールしてapp.jsを実行してください。
