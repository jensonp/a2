function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	// debugger;
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	
	// 1.1
	document.getElementById('numberTweets').innerText = tweet_array.length;
	const times = tweet_array.map(t => t.time.getTime());

	const minTime = Math.min(...times);
	const firstDate = new Date(minTime);
	const firstTime = firstDate.toLocaleDateString(); 
	document.getElementById('firstDate').innerText = firstTime;
	
	const maxTime = Math.max(...times);
	const lastDate = new Date(maxTime);
	const lastTime = lastDate.toLocaleDateString(); 
	document.getElementById('lastDate').innerText = lastTime;

	// 1.2
	const Counts = {
		live_event: liveCount = 0,
		achievement: achievementCount = 0,
		completed_event: achievementCount = 0,
		miscellaneous: miscCount = 0
	};

	for (const tweet of tweet_array){ Counts[tweet.source]++; }

	function CreatePercentages(a, b){
		const real = (a/b);
		return new Intl.NumberFormat("en-US", {
			style: "percent",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(real);
	}

	const TweetCount = tweet_array.length; 

	function replaceElement(ClassIdentifier, Replacement){
		const a = document.getElementsByClassName(ClassIdentifier);
		for (const e of a) { e.innerText = Replacement; }
	}

	const CategoryReplacements = {
		live_event: 'liveEvents', 
		achievement: 'achievements',
		completed_event: 'completedEvents',
		miscellaneous: 'miscellaneous'
	};

	for (const [key, value] of Object.entries(Counts)){
		const count = value;
		const categoryClass = CategoryReplacements[key];
		replaceElement(categoryClass, count);
		const categoryClassPct = categoryClass + 'Pct';
		const percentage = CreatePercentages(count, TweetCount);
		replaceElement(categoryClassPct, percentage);
	}
	
	// 1.3
	let writtenArray = []; 
	let writtenCount = 0;
	for (const tweet of tweet_array) { 
		if (tweet.written) { 
			writtenCount++;
		}
	}
	const writtenPercentage = CreatePercentages(writtenCount, TweetCount);
	replaceElement('written', writtenCount);
	replaceElement('writtenPct', writtenPercentage);
	debugger;

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});