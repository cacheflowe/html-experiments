var Debug = Class.create({
  element: false,
  log_lines: 10,
  realtime_properties: [],
  frame_rate: 1000 / 60,
	initialize: function(elem) {
		this.element = elem;
		//this.runTimer();
	},
	log: function(newDebugString) {
		// get time
		var currentTime = new Date();
		var hours = currentTime.getHours();
		var minutes = currentTime.getMinutes();
		if (minutes < 10) minutes = '0' + minutes;

		// log to console
    //		if( console )
    //			console.log( "[" + hours + ":" + minutes + "] " + newDebugString );

		// log it
		this.element.innerHTML += '<div>[' + hours + ':' + minutes + '] ' + newDebugString + '</div>';

		// if we're over the limit for logging, remove first element
		if (this.element.childElements().length > this.log_lines)
			this.element.childElements()[0].remove();
	},
	runTimer: function() {

		$('debug_realtime').innerHTML = '';
		var obj;
		for (var i = 0; i < this.realtime_properties.length; i++)
		{
			obj = this.realtime_properties[i];
			$('debug_realtime').innerHTML += obj.friendlyName + ' = ' + obj.object[obj.propertyStr] + '<br/>';
		}

		// keep timer running
		//setTimeout( function(t) { t.runTimer(); } , this.frame_rate, this);
	},
	addRealtimeProperty: function(object, propertyStr, friendlyName) {
		this.realtime_properties.push({ object: object, propertyStr: propertyStr, friendlyName: friendlyName });
	}
});
