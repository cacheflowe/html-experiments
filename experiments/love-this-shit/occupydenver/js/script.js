function Aggregator() {
  this.init();
}

Aggregator.prototype.init = function() {
  // class props
  this.T;
  this.num_tweets_loaded = 0;
  this.search_results_page = 1;
  this.num_search_tweets = 30;
  this.returned_ids = [];
  this.search_term = '"occupydenver"+OR+"occupy+denver"'; //'"love+this+shit"+OR+lovethisshit+OR+"love+that+shit"';
  
  // grab elements
  this.tweet_container = $('#site');
  this.script_container = $('#search_script');
  
  var self = this;
    
  // start loading twitter datas
  this.searchTwitterTimeline();
  twttr.anywhere(function (T) {
    self.T = T;
  });
  
  // listen for window scroll to bottom
  $(window).scroll(function(){
    if($(window).scrollTop() == $(document).height() - $(window).height()){
      self.loadNextPage();
    }
  });
};


Aggregator.prototype.searchTwitterTimeline = function() {  
  // write search script into page 
  this.script_container.get(0).innerHTML = '';
  var fileref = document.createElement('script');
  fileref.setAttribute("type","text/javascript");
  fileref.setAttribute("src", "http://search.twitter.com/search.json?q=" + this.search_term + "&callback=TwitterLoaded&rpp=" + this.num_search_tweets + '&page=' + this.search_results_page );
  this.script_container.get(0).appendChild(fileref);
  
  // show loader
  this.tweet_container.append('<span id="loader"></span>');
};

Aggregator.prototype.tweetsLoaded = function(obj) {
  // clear loader
  $('#loader').remove();
  $('#loader').remove();
  // draw tweets
	var self = this;
	$(obj.results).each(function(el){
	  self.num_tweets_loaded++;
	  if(
		self.returned_ids.indexOf(this.id) == -1 && 
		//this.text.indexOf('http://') == -1 && 
		this.text.indexOf('@') != 0 && 
		this.text.indexOf('RT ') != 0
	  ) {
  	    self.returned_ids.push(this.id);
  		self.tweet_container.append('<span style="color:' + self.randomColor() + '">' + this.text + '</span> ');  //' ' + self.relativeTime(this.created_at) + 
  	  }
	});
	
	this.runTextAnalysis();
};

Aggregator.prototype.randomColor = function() {
  return '#'+Math.floor(Math.random()*16777215).toString(16);
};

Aggregator.prototype.loadNextPage = function() {
  this.search_results_page++;
  this.searchTwitterTimeline();
};

Aggregator.prototype.runTextAnalysis = function() {
  // initialize text analysis - all contained in this one function for now.
  if(typeof this.word_count_hash === 'undefined') {
    this.word_count_hash = {};
    this.tweet_scrub_index = 0;
    this.tweet_elements = [];
    this.word_count_min = 5;
    this.analysis_container = $('#analysis_inner');
  }
  // grab text elements
  this.tweet_elements = $('span', this.tweet_container);
  var tweet_word_array = [];
  var words_collected = [];
  // loop through spans
  for(var i=this.tweet_scrub_index; i < this.tweet_elements.length; i++) {
    var tweetText = $(this.tweet_elements[i]).html();
    var tweetWordArray = tweetText.toLowerCase().split(' ');
    for(var j = 0; j < tweetWordArray.length; j++) {
      var curWord = tweetWordArray[j];
      curWord = curWord.replace (/[\.\,\?!\s]/g, "");
      if(typeof this.word_count_hash[curWord] === 'undefined') {
        this.word_count_hash[curWord] = 1;
      } else {
        this.word_count_hash[curWord] ++ ;
      }
      // add to collected array if more than 1
      if(this.word_count_hash[tweetWordArray[j]] > this.word_count_min) {
        var isAlreadyStored = false;
        for(var k=0; k < words_collected.length; k++) {
          if(words_collected[k].text == tweetWordArray[j]) isAlreadyStored = true;
        }
        if(!isAlreadyStored) {
          words_collected.push({count:this.word_count_hash[tweetWordArray[j]], text:tweetWordArray[j]});
        }
      }
    }
  }
  // anything with more than N instances, add to an array, and sort it for display
  function compareWords(a,b) { return parseInt( a.count ) > parseInt( b.count ); }  //console.log(parseInt( a.count ) +'>'+ parseInt( b.count )+' = '+(parseInt( a.count ) > parseInt( b.count ))); 
  words_collected.sort(compareWords);
  words_collected.reverse();
  this.analysis_container.empty();
  for(i=0; i < words_collected.length; i++) {
    if(words_collected[i].text.length > 3 && words_collected[i].text.indexOf('@') == -1) {
      this.analysis_container.append('<span style="color:' + this.randomColor() + '">' + words_collected[i].text + ' [' + words_collected[i].count + ']</span>');
    }
  }
  // size spans in analysis container
  var totalWidth = 0;
  var spans = $('span',this.analysis_container);
  for(i=0; i < spans.length; i++) {
    totalWidth += $(spans[i]).width() + 16;
  }
  this.analysis_container.css({width:totalWidth});
};


// var elem = $('#box');
// var inner = $('#box > .inner');
// if ( Math.abs(inner.offset().top) + elem.height() + elem.offset().top >= inner.outerHeight() ) {
//   // We're at the bottom!
// }

Aggregator.prototype.formatTwitString = function(str)
{
	str=' '+str;
	str = str.replace(/((ftp|https?):\/\/([-\w\.]+)+(:\d+)?(\/([\w/_\.]*(\?\S+)?)?)?)/gm,'<a href="$1" target="_blank">$1</a>');
	str = str.replace(/([^\w])\@([\w\-]+)/gm,'$1@<a href="http://twitter.com/$2" target="_blank">$2</a>');
	//str = str.replace(/([^\w])\@([\w\-]+)/gm,'$1<a href="http://twitter.com/$2" target="_blank">@$2</a>');
	str = str.replace(/([^\w])\#([\w\-]+)/gm,'$1<a href="http://twitter.com/search?q=%23$2" target="_blank">#$2</a>');
	return str;
};

Aggregator.prototype.relativeTime = function(pastTime)
{	
	var origStamp = Date.parse(pastTime);
	var curDate = new Date();
	var currentStamp = curDate.getTime();

	var difference = parseInt((currentStamp - origStamp)/1000);

	if(difference < 0) return false;

	if(difference <= 5)				return "Just now";
	if(difference <= 20)			return "Seconds ago";
	if(difference <= 60)			return "A minute ago";
	if(difference < 3600)			return parseInt(difference/60)+" minutes ago";
	if(difference <= 1.5*3600) 		return "One hour ago";
	if(difference < 23.5*3600)		return Math.round(difference/3600)+" hours ago";
	if(difference < 1.5*24*3600)	return "One day ago";
	if(difference < 48*3600)	return "Two days ago";
	if(difference < 7*24*3600)	return "In the past week";
	if(difference < 30*24*3600)	return "In the past month";
	if(difference < 365*24*3600)	return "In the past year";
	if(difference > 365*24*3600)	return "Over a year ago";
	
	var dateArr = pastTime.split(' ');
	return dateArr[4].replace(/\:\d+$/,'')+' '+dateArr[2]+' '+dateArr[1]+(dateArr[3]!=curDate.getFullYear()?' '+dateArr[3]:'');
}

Aggregator.prototype.createLinkToTweet = function(userId, tweetId) {
  return 'http://twitter.com/' + userId + '/status/' + tweetId;
}

function TwitterLoaded(obj) {
  window.aggregator.tweetsLoaded(obj);
}

$(document).ready(function(){
  window.aggregator = new Aggregator();
});
