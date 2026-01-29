class Tweet {
	private text:string;
	time:Date;

	constructor(tweet_text:string, tweet_time:string) {
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
        
        return "";
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        return "";
    }

    get distance():number {
        if(this.source != 'completed_event') {
            return 0;
        }
        //TODO: prase the distance from the text of the tweet
        return 0;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
        return "<tr></tr>";
    }
}
