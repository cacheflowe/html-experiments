var TouchObj = Class.create( {
	touchstart : false,
	touchlast : false,
	touchmove : false,
	touchspeed : false,
	target_point : false,
	container : false,
	canvas_drawing : false,
	touch_id : false,
	index : false,
    initialize : function( objDiv, index, appWidth, appHeight ) {
        this.container = objDiv;
        this.index = index;

	    this.canvas_drawing = Raphael(this.container, 0, 0);
	    
        var randomX = 10 - Math.floor(Math.random()*(20));
        var randomY = 10 - Math.floor(Math.random()*(20));
        
        this.touch_id = false;
        this.touchstart = { x : false, y : false };
		this.touchlast = { x : 0, y : 0 };
		this.touchmove = { x : 0, y : 0 };
		this.touchspeed = { x : randomX, y : randomY };
		this.target_point = { x : appWidth/2, y : appHeight/2 };
		
		this.drawDefault();
	},
	startTouch : function() {
		this.drawPressed();
	},
	endTouch : function() {
		this.touchstart.x = this.touchstart.y = 0;
		this.touchlast.x = this.touchlast.y = 0;
		this.touchmove.x = this.touchmove.y = 0;
		this.touch_id = false;
		
		this.drawDefault();
	},
	drawDefault : function() {
	    this.canvas_drawing.clear();
        var circle = this.canvas_drawing.circle(40, 40, 39);
        circle.attr({stroke: "black"});
        var text = this.canvas_drawing.text(40, 40, ''+(this.index + 1));
        text.attr({stroke: "white"});
	},
	drawPressed : function() {
	    this.canvas_drawing.clear();
        var circle = this.canvas_drawing.circle(40, 40, 39);
        circle.attr({stroke: "red"});
        var text = this.canvas_drawing.text(40, 40, ''+(this.index + 1));
        text.attr({stroke: "white"});
	},
	updatePosition : function( appWidth, appHeight ) {
	    if( this.touch_id != false )
	        this.container.setStyle({ left: (this.target_point.x)+'px', top: (this.target_point.y)+'px' });
	    else
	    {
	        this.touchspeed.x *= 0.97;
	        this.touchspeed.y *= 0.97;
	        
	        this.target_point.x += this.touchspeed.x;
	        this.target_point.y += this.touchspeed.y;
	        
	        if( this.target_point.x > appWidth - 80 || this.target_point.x < 0 ) { this.touchspeed.x *= -1; this.target_point.x += this.touchspeed.x; }
	        if( this.target_point.y > appHeight - 80 || this.target_point.y < 0 ) { this.touchspeed.y *= -1; this.target_point.y += this.touchspeed.y; }
	        
	        if( Math.abs( this.touchspeed.x ) < 0.4 ) this.touchspeed.x = 0;
	        if( Math.abs( this.touchspeed.y ) < 0.4 ) this.touchspeed.y = 0;

	        //this.container.setStyle({ left: (this.target_point.x)+'px', top: (this.target_point.y)+'px' });
	        var new_transform = "translate3d(" + this.target_point.x + "px, " + this.target_point.y + "px, 0px)";
    		if( this.container.style.webkitTransform != new_transform ) 
    		    this.container.style.webkitTransform = new_transform;
    		
	    }
	}
});      

var MultiTouchTracker = Class.create( {
    app_width : 0,
    app_height : 0, 
	app_container : false,
	divs : false,
	touch_objs : false,
	timer_fps : 1000/60,
	touch_id_objs : false,
	initialize : function( trackerObject ) {
	    this.detectAppSize();


		// get array of divs to add to pool
		this.divs = $$('.obj');
		
		this.touch_id_objs = [];
		
		this.touch_objs = [];
		for( var i=0; i < this.divs.length; i++ )
		{
		    this.touch_objs.push( new TouchObj( this.divs[i], i, this.app_width, this.app_height ) );
		    this.divs[i].observe("touchstart", this.onStart.bind(this));
    		this.divs[i].observe("touchmove", this.onMove.bind(this));
    		this.divs[i].observe("touchend", this.onEnd.bind(this));
    		this.divs[i].observe("touchcancel", this.onEnd.bind(this));
		}
		
		// set up container touch listeners
		this.app_container = trackerObject;
		
		// start timer
		this.runTimer();
	},
	runTimer : function() {
	    this.detectAppSize();
	    this.app_container.setStyle({ width: this.app_width+'px' });
	    this.app_container.setStyle({ height: this.app_height+'px' });
		
	    for( var i=0; i < this.touch_objs.length; i++)
	    {
	        this.touch_objs[i].updatePosition( this.app_width, this.app_height );
	    }
	    
		// keep timer running
		setTimeout( function(t) { t.runTimer(); } , this.timer_fps, this);
	},
	getTouchObjFromEventTarget : function( target ) {
	    for( var i=0; i < this.touch_objs.length; i++ )
		{
		    if( this.touch_objs[i].container == target ){ return this.touch_objs[i]; }
		}
	},
	getCurrentTouchEvent : function( event ) {
	    for( var i=0; i < event.touches.length; i++ )
		{
		    if( event.touches[i].target == event.target ){ return event.touches[i]; }
		}
	},
	onStart : function(touchEvent) {
	    
	    var localTouch = this.getCurrentTouchEvent( touchEvent );
	    
        // get the class of the touched object, and add to the map of touch objects, with the touch event id as the map id
        var trackerObj = this.getTouchObjFromEventTarget( touchEvent.target );
        
        if( trackerObj && localTouch ){
            // store new touch object in map, with touch event id as key
            this.touch_id_objs[ localTouch.identifier ] = trackerObj;
            
	        // set touch location properties on custom object
			trackerObj.is_touching = true;
			trackerObj.touchstart.x = localTouch.clientX;
			trackerObj.touchstart.y = localTouch.clientY;
			
			trackerObj.startTouch();
        }
		touchEvent.preventDefault();
	},
	onMove : function(touchEvent) {    	    
    	
	    var localTouch = this.getCurrentTouchEvent( touchEvent );
        
        var trackerObj = this.touch_id_objs[ localTouch.identifier ];
        if( trackerObj )
        {
	        trackerObj.touchlast.x = trackerObj.touchmove.x;
			trackerObj.touchlast.y = trackerObj.touchmove.y;
			trackerObj.touchmove.x = localTouch.clientX - trackerObj.touchstart.x;
			trackerObj.touchmove.y = localTouch.clientY - trackerObj.touchstart.y;
			trackerObj.touchspeed.x = trackerObj.touchmove.x - trackerObj.touchlast.x;
			trackerObj.touchspeed.y = trackerObj.touchmove.y - trackerObj.touchlast.y;
            
            trackerObj.target_point.x = localTouch.clientX - 40;
            trackerObj.target_point.y = localTouch.clientY - 40;            
        }
		
		touchEvent.preventDefault();
	},
	onEnd : function(touchEvent) {
	    // remove object from current touch hash, and reset vars
	    var trackerObj = this.getTouchObjFromEventTarget( touchEvent.target );
	    if( trackerObj )
	    {
	        delete this.touch_id_objs[ trackerObj.touch_id ];
	        trackerObj.endTouch();
        }
	    
	    // helps prevent scrolling in iPhone and Android?
		touchEvent.preventDefault();
	},
	dispose : function() {
		for( var i=0; i < this.divs.length; i++ )
		{
		    this.divs[i].stopObserving("touchstart");
    		this.divs[i].stopObserving("touchmove");
    		this.divs[i].stopObserving("touchend");
    		this.divs[i].stopObserving("touchcancel");
		}
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
        
		this.app_width = myWidth;
		this.app_height = myHeight;		
	}
});











/*onStart : function(touchEvent) {
    
    // find and associate touch with object
    for( var i=0; i < touchEvent.touches.length; i++ )
    {        
        //this.touch_id_objs.push( { element_id: touchEvent.touches[i].target.id, touch_id: touchEvent.touches[i].identifier } );
        
        // get the class of the touched object, and add to the map of touch objects, with the touch event id as the map id
        var trackerObj = this.getTouchObjFromEventCurrentTarget( touchEvent.currentTarget );
        if( trackerObj ) 
            this.touch_id_objs[ touchEvent.touches[i].identifier ] = trackerObj;
        
        
        
        debug.log('touch! '+trackerObj+' :: '+touchEvent.touches[i].identifier + '     :: '+trackerObj);
    }
    
    
	if (touchEvent.touches.length === 1) {		
		this.is_touching = true;
		this.touchstart.x = touchEvent.touches[0].clientX;
		this.touchstart.y = touchEvent.touches[0].clientY;
		//debug.log(touchEvent.touches[0].target.id);
		//for(var it in touchEvent.touches[0]) console.log(it+' = '+touchEvent.touches[0][it]);
	}
	touchEvent.preventDefault();
},
onMove : function(touchEvent) {    	    
	
    for( var i=0; i < touchEvent.touches.length; i++ )
    {
        debug.log('move! '+touchEvent.touches[i].identifier);
        
        var trackerObj = this.touch_id_objs[ touchEvent.touches[i].identifier ];
        if( trackerObj )
        {
	        trackerObj.touchlast.x = trackerObj.touchmove.x;
			trackerObj.touchlast.y = trackerObj.touchmove.y;
			trackerObj.touchmove.x = touchEvent.touches[i].clientX - trackerObj.touchstart.x;
			trackerObj.touchmove.y = touchEvent.touches[i].clientY - trackerObj.touchstart.y;
			trackerObj.touchspeed.x = trackerObj.touchmove.x - trackerObj.touchlast.x;
			trackerObj.touchspeed.y = trackerObj.touchmove.y - trackerObj.touchlast.y;
        
	        trackerObj.container.setStyle({ left: (touchEvent.touches[i].clientX - 40)+'px', top: (touchEvent.touches[i].clientY - 40)+'px' });
        }
    }
	touchEvent.preventDefault();
},
*/