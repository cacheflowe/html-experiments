function Obj(element, w, h, platformHelper){
	this.element = element;

  this.size = MathUtil.randRange(20, 80);
  this.x = w/2;
  this.y = h/2;
	this.vector_x = MathUtil.randRange(-20, 20);
	this.vector_y = MathUtil.randRange(-20, 20);
	this.gravity = 0.5;
	this.bounce_threshold = 1.3;
	this.floor_bounce = -0.6;
	this.platform_helper = platformHelper;
  
	
	// set initial style
	$(this.element).css({
	  'background-color' : ColorUtil.randomColor(),
	  width : this.size,
	  height : this.size
	});
	this.platform_helper.update2DPosition( this.element, Math.round( this.x ), Math.round( this.y ) );
	
	// tap to change color
	var self = this;
	new ButtonTouchCallback( this.element, function(){
	  $(self.element).css({ 'background-color' : ColorUtil.randomColor() });
	}, true );
};

Obj.prototype.center = function(w, h){
  this.x = w/2;
  this.y = h/2;
};

Obj.prototype.update = function(w, h, windX, windY){
  // apply gravity
  this.vector_x *= 0.98;
  this.vector_y += this.gravity;
  
  // apply wind, more to smaller objects
  this.vector_x += windX * 0.012 * 80/this.size;
  this.vector_y += windY * 0.012 * 80/this.size;
  
  // recalculate position
  var targetX = this.x + this.vector_x;
  var targetY = this.y + this.vector_y;

  // apply boundaries
  if (targetX > w - this.size || targetX < 0) { this.vector_x *= -1; }
  if (targetY > h - this.size) { this.vector_y = (this.vector_y < this.bounce_threshold) ? 0 : this.vector_y *= this.floor_bounce; }
  if (targetY < 0) { this.vector_y *= -1; }
  
  // increment position
  this.x += this.vector_x;
  this.y += this.vector_y;

  // update css
	this.platform_helper.update2DPosition( this.element, Math.round( this.x ), Math.round( this.y ) );
};



function WindBounce(){
  this.init();
}

WindBounce.prototype.init = function(){
  this.app_width = 0;
  this.app_height = 0;
	this.app_container = false;
	this.timer_fps = 1000 / 60;
	this.num_elements = 20;
	this.objs = [];
	this.touch_tracker = false;
	this.move_count = 0;
	this.windX = 0;
	this.windY = 0;
	this.bgX = 0;
	this.bgY = 0;
  
  this.CSS_HAND = 'cursor:hand; cursor:grab; cursor:-moz-grab; cursor:-webkit-grab;';
	this.CSS_HAND_CUR = 'cursor: url(images/cursors/openhand.cur), default !important;';
	this.CSS_HAND_GRAB = 'cursor:grabbing; cursor:-moz-grabbing; cursor:-webkit-grabbing;';
	this.CSS_HAND_GRAB_CUR = 'cursor: url(images/cursors/closedhand.cur), default !important;';
	
  this.start();
};

WindBounce.prototype.start = function(){
  // init browser properties
  this.detectAppSize();
  this.setBrowserProperties();
	this.platform_helper = new PlatformHelper();

  // create site holder
  this.app_container = document.createElement('div');
  this.app_container.id = 'site';
  document.body.appendChild( this.app_container );
  
  // create elements
	for (var i = 0; i < this.num_elements; i++) {
	  var element = document.createElement('div');
    element.className = 'obj';
    this.app_container.appendChild( element );
    var obj = new Obj( element, this.app_width, this.app_height, this.platform_helper );
    this.objs.push( obj );
	}
  
  // create helper objects
  this.touch_tracker = new MouseAndTouchTracker( this.app_container, this, false );

	this.base_inline_css = document.body.getAttribute("style") || '';
  this.cursorSetHand();
	
	// start timer
	this.runTimer();
};

WindBounce.prototype.touchUpdated = function( state, event ) {
  if( state == MouseAndTouchTracker.state_start ) {
    this.cursorSetGrabbyHand();
  }
  if( state == MouseAndTouchTracker.state_end ) {
		this.cursorSetHand();
  }
  if( state == MouseAndTouchTracker.state_move ) {
    this.windX += this.touch_tracker.touchspeed.x;
    this.windY += this.touch_tracker.touchspeed.y;
  }	
};

WindBounce.prototype.runTimer = function() {
  // keep container set to window size
  this.detectAppSize();
  $(this.app_container).css({ width: this.app_width, height: this.app_height, 'background-position': this.bgX+'px '+this.bgY+'px' });
  
  // update wind
  this.windX *= 0.9;
  this.windY *= 0.9;
  this.bgX += this.windX * 0.1;
  this.bgY += this.windY * 0.1;
  
  // update all objects
  for (var i = 0; i < this.num_elements; i++) {
    this.objs[i].update(this.app_width, this.app_height, this.windX, this.windY);
  }
  
	// keep timer running
	var self = this;
	setTimeout(function() { self.runTimer(); } , this.timer_fps );
},

WindBounce.prototype.setBrowserProperties = function() {
	// prevents mobile safari from bouncing
  document.ontouchmove = function(event) {
   event.preventDefault();
  };
  
  var self = this;
	// add listener to window if it's orientation-capable
	if (window.orientation !== undefined) {
		window.onorientationchange = function(event) {
			if (Math.abs(window.orientation) % 180 === 90) {
				window.scrollTo(0, 1);
			} else {
				window.scrollTo(0, 1);
			}
			// center all objects
      self.detectAppSize();
			for (var i = 0; i < self.num_elements; i++) {
        self.objs[i].center(self.app_width, self.app_height);
      }
		};
		// make sure to respond right away
		//window.onorientationchange(null);
	}
};

WindBounce.prototype.detectAppSize = function() {
  var myWidth = 0, myHeight = 0;

  if (typeof(window.innerWidth) == 'number') {
    //Non-IE
    myWidth = window.innerWidth;
    myHeight = window.innerHeight;
  } else if (document.documentElement && (document.documentElement.clientWidth || document.documentElement.clientHeight)) {
    //IE 6+ in 'standards compliant mode'
    myWidth = document.documentElement.clientWidth;
    myHeight = document.documentElement.clientHeight;
  } else if (document.body && (document.body.clientWidth || document.body.clientHeight)) {
    //IE 4 compatible
    myWidth = document.body.clientWidth;
    myHeight = document.body.clientHeight;
  }

	this.app_width = myWidth;
	this.app_height = myHeight;
};

WindBounce.prototype.cursorSetDefault = function() {
  document.body.setAttribute('style', this.base_inline_css);
};
WindBounce.prototype.cursorSetHand = function() {
  if( this.platform_helper.is_chrome || this.platform_helper.is_msie ) {
    document.body.setAttribute('style', this.base_inline_css + this.CSS_HAND + this.CSS_HAND_CUR);
  } else {
    document.body.setAttribute('style', this.base_inline_css + this.CSS_HAND);
  }
}
WindBounce.prototype.cursorSetGrabbyHand = function() {
  if( this.platform_helper.is_chrome || this.platform_helper.is_msie ) {
    document.body.setAttribute('style', this.base_inline_css + this.CSS_HAND_GRAB + this.CSS_HAND_GRAB_CUR);
  } else {
    document.body.setAttribute('style', this.base_inline_css + this.CSS_HAND_GRAB);
  }
};

// delayed call to make iphone app full screen
$(window).load(function () {
  setTimeout(function() { window.scrollTo(0, 1); }, 1000);
});

// kick off app on dom loade
$(document).ready(function(){
  var windbounce = new WindBounce();
});


