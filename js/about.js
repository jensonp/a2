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
	document.getElementById('numberTweets').innerText = tweet_array.length;
	const times = tweet_array.map(t => t.time.getTime());
	// debugger;

	const minTime = Math.min(...times);
	const firstDate = new Date(minTime);
	const firstTime = firstDate.toLocaleDateString(); 
	document.getElementById('firstDate').innerText = firstTime;
	
	const maxTime = Math.max(...times);
	const lastDate = new Date(maxTime);
	const lastTime = lastDate.toLocaleDateString(); 
	document.getElementById('lastDate').innerText = lastTime;



	// const LiveList = ['right now'];
	// const AchieveList = ['Achieved', 'goal'];
	// const CompletedList = ['Just posted', 'completed', 'Completed'];
	// const MiscList = [];
	// const Filter = [LiveList, AchieveList, CompletedList, MiscList];
	// const NoComplete = filterTweets(tweet_array, CompletedList);
	// const OnlyComplete = filterTweetsIncludes(tweet_array, CompletedList);

	
	
	// for (let i=0; i<5; i++){
	// 	console.log(tweet_array[i].text);
	// }
	

	// const tweet_array_no_completion  = tweet_array.map(function(tweet_array) {
	// 	return 
	// });
	// debugger;
	// for (const tweet of tweet_array.slice(0,4)) { 
	// 	const tweetCategory = tweet.source;
	// 	console.log(tweetCategory);
	// }	

	const Counts = {
		live_event: liveCount = 0,
		achievement: achievementCount = 0,
		completed_event: achievementCount = 0,
		miscellaneous: miscCount = 0
	};

	// for (let i=0; i<5; ++i){
	// 	Counts['live_event']++;
	// }
	for (const tweet of tweet_array){ Counts[tweet.source]++; }
	// Object.keys(temp1).reduce((sum, key) => sum + temp1[key], 0);
	// const temp3 = temp2.filter(( (tweet) => !tweet.text.includes('Achieved') ));

	// document.getElementsByClassName('completedEvents').innerText = Counts.completed_event;
	// const CompletedEventsElements = document.getElementsByClassName('completedEvents');
	// for (const e of CompletedEventsElements){ e.innerText = Counts.completed_event; }

	// const LiveEventsElements = document.getElementsByClassName('liveEvents');
	// for (const e of LiveEventsElements) { e.innerText = Counts.live_event; }

	// const AchievementEventsElements = document.getElementsByClassName('achievements');
	// for (const e of AchievementEventsElements) { e.innerText = Counts.achievement; }

	// const MiscEventsElements = document.getElementsByClassName('miscellaneous');
	// for (const e of MiscEventsElements) { e.innerText = Counts.miscellaneous; }

	// create percentages
	function CreatePercentages(a, b){
		const real = (a/b);
		return new Intl.NumberFormat("en-US", {
			style: "percent",
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(real);
	}

	const TweetCount = tweet_array.length; 

	// const CEEPCT = document.getElementsByClassName('completedEventsPct');
	// const CEEPCT_NUM = CreatePercentages(Counts.completed_event, TweetCount);
	// for (const e of CEEPCT) { e.innerText = CEEPCT_NUM; }

	function replaceElement(ClassIdentifier, Replacement){
		const a = document.getElementsByClassName(ClassIdentifier);
		for (const e of a) { e.innerText = Replacement; }
	}

	// const CategoryReplacements = {
	// 	live_event: 'liveEvents',
	// 	achievement: 'achievements',
	// 	completed_event: 'completedEvents',
	// 	miscellaneous: 'miscellaneous'
	// };


	const CategoryReplacements = {
		live_event: 'liveEvents', 
		achievement: 'achievements',
		completed_event: 'completedEvents',
		miscellaneous: 'miscellaneous'
	};

	// for (const [key, value] of Object.entries(CategoryReplacements)){
	// 	const percentage = CreatePercentages(Counts.key, TweetCount);
	// 	replaceElement(key, Counts.key);
	// }

	for (const [key, value] of Object.entries(Counts)){
		const count = value;
		const categoryClass = CategoryReplacements[key];
		replaceElement(categoryClass, count);
		const categoryClassPct = categoryClass + 'Pct';
		const percentage = CreatePercentages(count, TweetCount);
		replaceElement(categoryClassPct, percentage);
	}

	function filterTweets(tweet_array, query){
	const exclude = (tweet) => !tweet.text.includes(query);
	return tweet_array.filter((exclude));
	}

	function filterTweetsIncludes(tweet_array, query){
		const exclude = (tweet) => tweet.text.includes(query);
		return tweet_array.filter((exclude));
	}

	// const completionList = ['Just completed a'];
	// const noCompletionTweets = filterTweets(tweet_array, completionList);
	// const CompletionTweets = filterTweetsIncludes(tweet_array, completionList);

	// const a = ['with @Runkeeper'];
	// const b = filterTweets(CompletionTweets, a);
	// const c = filterTweetsIncludes(CompletionTweets, a);
	
	// const d = ['Just completed a'];
	// const e = filterTweets(b, d);
	// const f = filterTweetsIncludes(b, d);

	

	// Written Testing
	for (tweet in tweet_array) { const category = tweet.source; }
	function isCompletedEvent(tweet){ return tweet.source === 'completed_event'; }
	const OnlyCompletedTweets = tweet_array.filter( (t) => isCompletedEvent(t));
	const NoAtRK = filterTweets(OnlyCompletedTweets, 'with @Runkeeper');

	

	debugger;

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});