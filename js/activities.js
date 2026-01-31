function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	const tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	2.1

	const ActivityList = { }

	for (const tweet of tweet_array){ 
		// COMPLETE
		if (!tweet.isCompletedEvent){ continue; }
		const DistanceActivity = tweet.ExtractType;
		// Bad Completions
		if (DistanceActivity === null){ continue; }

		// Activity
		// const activity = DistanceActivity.groups.activity;
		const activity = tweet.activity;
		if (!ActivityList[activity]) {
			ActivityList[activity] = { 
				'count' : 0,
				'totalDistance' : 0,
				'weekday' : 0,
				'weekend' : 0,
				'date' : []
			}
		}
		ActivityList[activity].count++; 

		// Distance 
		const unit = DistanceActivity.groups.unit; 
		if (!unit) { continue; }
		// let distance = parseFloat(DistanceActivity.groups.distance);
		let distance = parseFloat(tweet.distance);
		if (unit === 'km') { distance /= 1.609; }
		const newTotalDistance = parseFloat(ActivityList[activity].totalDistance) + distance; 
		ActivityList[activity].totalDistance = newTotalDistance;
		
	}

	// Number of Activities
	const ActivityCount = Object.entries(ActivityList).length;
	let ElementToReplace = document.getElementById("numberActivities");
	ElementToReplace.innerText = String(ActivityCount);
	
	// Top 3 Activities
	const top3 = ['firstMost', 'secondMost', 'thirdMost'];
	const sorted = Object.entries(ActivityList).sort( ([,A],[,B]) => B.count - A.count);
	const top3Act = {}
	let top3ActivityNames = [];
	for (let i=0; i<3; i++){ 
		// replaceElement(top3[i], sorted[i][0]); 
		const activity = sorted[i][0];
		top3ActivityNames.push(activity);
		const id = top3[i];
		let ElementToReplace = document.getElementById(id);
		ElementToReplace.innerText = activity;

		// storing element and average distance
		top3Act[activity] = parseFloat(ActivityList[activity].totalDistance) / parseInt(ActivityList[activity].count);
	}
	
	// Sort Averages of Top 3 Activities 
	const sortedAveragesOfTop3 = Object.entries(top3Act).sort(([,a],[,b]) => b-a );
	const longestAverageDistance = sortedAveragesOfTop3[0][0];
	const shortestActivityType = sortedAveragesOfTop3[sortedAveragesOfTop3.length-1][0];
	ElementToReplace = document.getElementById('longestActivityType');
	ElementToReplace.innerText = longestAverageDistance;
	ElementToReplace = document.getElementById('shortestActivityType');
	ElementToReplace.innerText = shortestActivityType;
	
	// Weekend or Weekday
	for (const tweet of tweet_array){ 
		// COMPLETE
		if (!tweet.isCompletedEvent){ continue; }
		const DistanceActivity = tweet.ExtractType;
		
	}

	for (const tweet of tweet_array) {
		if (!tweet.isCompletedEvent){ continue; }
		if (tweet.ExtractType === null) { continue; }
		// if (tweet.ExtractType.groups.activity != longestAverageDistance) { continue; }
		if (!top3ActivityNames.includes(tweet.activity)) { continue; }
		const dayNum = tweet.time.getDay();
		const dist = tweet.distanceVar;
		const activity = tweet.activity;
		if (!ActivityList[activity].date[dayNum]) { ActivityList[activity].date[dayNum] = []; }
		ActivityList[activity].date[dayNum].push(dist);

		if ( dayNum === 0 || dayNum === 6) { 
			const currentWeekendCount = parseInt(ActivityList[longestAverageDistance].weekend) + 1;
			ActivityList[longestAverageDistance].weekend = currentWeekendCount;

		}
		else {
			const currentWeekdayCount = parseInt(ActivityList[longestAverageDistance].weekday) + 1;
			ActivityList[longestAverageDistance].weekday = currentWeekdayCount;
		}
	}
	debugger;

	// weekend or weekday
	const weekendCount = parseInt(ActivityList[longestAverageDistance].weekend);
	const weekdayCount = parseInt(ActivityList[longestAverageDistance].weekday);
	const weekType = weekendCount > weekdayCount ? "weekends" : "weekdays"; 
	ElementToReplace = document.getElementById('weekdayOrWeekendLonger');
	ElementToReplace.innerText = weekType;

	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	
	let data = Object.entries(ActivityList).map( ([actualActName , LiteralProperties]) => 
		{
			return {
				activities: actualActName,
				count: LiteralProperties.count
			}
		}
	);
	activity_vis_spec = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph of the number of Tweets containing each type of activity.",
	  "data": {"values": data},
	//   "height": {"step": 250},
	  "mark": "bar", 
	  "encoding": {
		"y": {
			"field": "activities", 
			"type": "nominal", 
			"axis": {
				"labelAngle": 0,
				// "labelAlign": "right",
				// "labelBaseline": "middle"
				"titleAngle": 0
			},
			"sort": "-x"
		},
		"x": {
			"field": "count", 
			"type": "quantitative", 
			"axis": {"labelAngle": 0},
			// "scale": {"type": "log"}
			}
		}

	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});
	
	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.
	// distanceVis
	// distanceVisAggregated

	let button = document.querySelector("#aggregate");
	let graph1 = document.querySelector("#distanceVis");
	let graph2 = document.querySelector("#distanceVisAggregated");

	graph1.innerText = 'text1';
	graph2.innerText = 'text2';
	graph1.style.display = 'block'; 
	graph2.style.display = 'none';
	let graph1Shown = true; 

	button.addEventListener("click", () => {
		if (graph1Shown) {
			button.innerText = 'Show All Activities';
			graph1.style.display = 'none';
			graph2.style.display = 'block';
			graph1Shown = false;
		}
		else { 
			button.innerText = 'Show mean';
			graph1.style.display = 'block';
			graph2.style.display = 'none';
			graph1Shown = true; 
		}
	});
	
	// Pre-Graph 2: Activity : Day : Distance 
	// Graph 2
	const ActivityDayDist = {}
	
	function initializeADD(tweet){
		const activity = tweet.activity;
		ActivityDayDist[activity] = {
		}
	}
	for(const tweet of tweet_array){
		if (!tweet.isCompletedEvent){ continue; }
		const DistanceActivity = tweet.ExtractType;
		if (DistanceActivity === null){ continue; }
		const activity = tweet.activity;
	}

	distanceVis = {
	  "$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	  "description": "A graph showing the distances for the top 3 activities",
	  "data": {"values": data},
	  "mark": "bar", 
	  "encoding": {
		"x": {
			"field": "activities", 
			"type": "nominal", 
			"axis": {
				"labelAngle": 0,
				"titleAngle": 0
			},
		},
		"y": {
			"field": "count", 
			"type": "quantitative", 
			"axis": {"labelAngle": 0},
			// "scale": {"type": "log"}
			}
		}

	};
	vegaEmbed('#distanceVis', distanceVis, {actions:false});
}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});