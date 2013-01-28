
var AppState = Class.create({
	DEVICE_WIDTH: 768,
	DEVICE_HEIGHT: 1024,
	PORTRAIT: 0,
	LANDSCAPE: 1,
	orientation: -1,    
	actualAppWidth: -1,    
	actualAppHeight: -1,    
	is_running_on_device: false,
	is_running_in_app: false,
	is_paging_disabled: false,
	lightbox_active: false,
	show_footer: false,
	actual_orientation : 0,
	
	initialize: function () {
		this.orientation = this.PORTRAIT;	// default for desktop browser
		this.detectAppSize();
		this.setUpOrientationListener();
	},
	
	detectAppSize: function () {		
        var myWidth = 0, myHeight = 0;

        if( typeof( window.innerWidth ) == 'number' ) {
          //Non-IE
          myWidth = window.innerWidth;
          myHeight = window.innerHeight;
        } else if( document.documentElement && ( document.documentElement.clientWidth || document.documentElement.clientHeight ) ) {
          //IE 6+ in 'standards compliant mode'
          myWidth = document.documentElement.clientWidth;
          myHeight = document.documentElement.clientHeight;
        } else if( document.body && ( document.body.clientWidth || document.body.clientHeight ) ) {
          //IE 4 compatible
          myWidth = document.body.clientWidth;
          myHeight = document.body.clientHeight;
        }
        
		this.actualAppWidth = myWidth;
		this.actualAppHeight = myHeight;

		//debug.log( document.body.clientWidth + ' x ' + document.body.clientHeight );
		//alert( myWidth + ' x ' + myHeight );
		
	},
	setUpOrientationListener: function () {
	  var self = this;
	  
		// add listener to window if it's orientation-capable
		if (window.orientation !== undefined) {
			// set device/app flags, and check app size (both orientations) to decide whether we're in the actual app
			this.is_running_on_device = true;
			if ((this.actualAppWidth === this.DEVICE_WIDTH && this.actualAppHeight === this.DEVICE_HEIGHT) || (this.actualAppWidth === this.DEVICE_HEIGHT && this.actualAppHeight === this.DEVICE_WIDTH)) {
				this.is_running_in_app = true;
			}
				
			// setup iDevice-specific html listener
			window.onorientationchange = function (event) {
				if (Math.abs(window.orientation) % 180 === 90) {
					self.orientation = self.LANDSCAPE;
				} else {
					self.orientation = self.PORTRAIT;
				}
					//debug.log('self.orientation = '+self.orientation);
				// send out custom event
				$$('body')[0].fire("app:orientationchange", {orientation: self.orientation});
			};
			// make sure local flag is set right away
			window.onorientationchange(null);
		}
	}
});


/*
// example code for listening to custom event that fires on orientation change
document.observe("app:orientationchange", function(event) {
	console.log( "Tag " + event.target.tagName + " with id of " + event.target.id + " says the orientation is now " + event.memo.orientation + ".");
});
*/

/*
// class initialization
var app_state = new AppState(),
*/