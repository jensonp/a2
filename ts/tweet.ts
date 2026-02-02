// Groups 

class Tweet {
	private text:string;
	time:Date;
    private activity:string = "";
    private distanceVar:string = "";
    private unit:string = "";


	constructor(
        tweet_text:string, 
        tweet_time:string, 
    ) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
	}

	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        const FilterList: Record<string,string[]> = {
            live_event: ['right now'],
            achievement: ['Achieved', 'goal', 'for a run', 'work on', 'Next stop', 'overall', 'fastest', 'Fastest', 'Can I'],
            completed_event: ['Just posted', 'completed', 'Completed']
        } as const; // examine as const operator behavior in Ts 

        for (const [key, value] of Object.entries(FilterList)){
            const isEvent = value.some( (value) => this.text.includes(value) );
            if (isEvent) return key;
        }

        return 'miscellaneous';

    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        const FilterWritten: Record<string, string[]> = { written: ['with @Runkeeper'] }

        // Complete Event Check
        const IsCompletedEvent = this.source === 'completed_event';
        if (!IsCompletedEvent) return false; 

        // Written Filter Check 
        for (const [key, value] of Object.entries(FilterWritten)){
            const isEvent = value.some( (value) => this.text.includes(value) );
            if (isEvent) return false; 
        }
        
        return true;
    }

    get writtenText():string {
        if(!this.written) {
            return "";
        }
        //TODO: parse the written text from the tweet
        let splits = this.text.split("- ")[1];
        const httpsTest = /https/;
        if (httpsTest.test(splits)) { 
            return splits.split("https")[0];
        }
        return splits; 

    }

    get isTimeActivity():boolean{
        
        return false; 
    }
    // Check Completion Event
    get isCompletedEvent():boolean { return this.source === 'completed_event' ? true: false; }

    // Helper Function to check if a tweet is categorized as a "completed-event"
    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return this.activity;
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return parseFloat(this.distanceVar);
    }

    get ExtractType(): RegExpMatchArray | null{
        // debugger; 
        const ExtractMajorityDistance = /(Just)\s(\w+)\s(a)\s(?<distance>\d+\.\d+)(\s?)(?<unit>km|mi)\s(?<activity>\w+)/;
        const DistanceActivityEdgeCase = /^Completed a (?<distance>\d+\.\d+)\s(?<unit>km|mi)\s(?<activity>\w+)\b/;
        const ExtractMajorityTime = /Just\s(\w+\s)?(an|a)\s*(?<activity>.*?)\s+in/;
        
        // Check If Distance 
        let DistanceActivity = this.text.match(ExtractMajorityDistance);
        if (DistanceActivity) { 
            this.activity = DistanceActivity.groups?.activity ?? "";
            this.distanceVar = DistanceActivity.groups?.distance ?? "";
            this.unit = DistanceActivity.groups?.unit ?? "";
            return DistanceActivity;
        }
    
        // Check Distance Activity Edge Case
        DistanceActivity = this.text.match(DistanceActivityEdgeCase);
        if (DistanceActivity) { 
            this.activity = DistanceActivity.groups?.activity ?? "";
            this.distanceVar = DistanceActivity.groups?.distance ?? "";
            this.unit = DistanceActivity.groups?.unit ?? "";
            return DistanceActivity;
        }

        // Parsing Majority of Time Activities 
        DistanceActivity = this.text.match(ExtractMajorityTime);
        if (DistanceActivity) { 
            this.activity = DistanceActivity.groups?.activity ?? "";
            return DistanceActivity;
        }
        return null;

    }
    
    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}
