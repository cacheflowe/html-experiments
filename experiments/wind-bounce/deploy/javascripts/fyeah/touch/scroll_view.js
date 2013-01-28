/**
 * Base touch tracking on an html element
 * @requires touch_tracker.js
 */
var ScrollViewTouchTracker = Class.create( {
	initialize : function( element ) {
		this.touch_tracker = new MouseAndTouchTracker( element, this );
	},
	touchUpdated : function ( touchState, touchEvent ) {
    switch( touchState ) {
      case MouseAndTouchTracker.state_start :
        this.onStart(touchEvent);
        break;
      case MouseAndTouchTracker.state_move :
        this.onMove(touchEvent);
        break;
      case MouseAndTouchTracker.state_end :
        this.onEnd(touchEvent);
        break;
      case MouseAndTouchTracker.state_enter :
        this.onEnter(touchEvent);
        break;
      case MouseAndTouchTracker.state_leave :
        this.onLeave(touchEvent);
        break;
    }
  },
	onStart : function(touchEvent) { },
	onMove : function(touchEvent) { },
	onEnd : function(touchEvent) { },
	onEnter : function() {},
	onLeave : function() {},
	dispose : function() {
		this.touch_tracker.dispose();
		delete this.touch_tracker;
	}
});

/**
 * @requires platform_helper.js
 */
var ScrollView = Class.create(ScrollViewTouchTracker, {
  platform_helper : false,
	cur_position : false,
	container_size : false,
	content_size : false,
	scroll_enabled_x : true,
	scroll_enabled_y : true,
	scroll_content : false,
	base_inline_css : false,
	CSS_HAND : 'cursor:hand; cursor:grab; cursor:-moz-grab; cursor:-webkit-grab;',
	CSS_HAND_CUR : 'cursor: url(media/cursors/openhand.cur), default !important;',
	CSS_HAND_GRAB : 'cursor:grabbing; cursor:-moz-grabbing; cursor:-webkit-grabbing;',
	CSS_HAND_GRAB_CUR : 'cursor: url(media/cursors/closedhand.cur), default !important;',
	
	initialize : function( $super, touchObject, scrollElementInner ) {
		$super( touchObject );

		this.cur_position = { x:0, y:0 };
		this.container_size = { width:0, height:0 };
		this.content_size = { width:0, height:0 };
		this.scroll_content = scrollElementInner;
		
		this.base_inline_css = this.touch_tracker.container.getAttribute("style") || '';
    
    this.platform_helper = new PlatformHelper();
    this.platform_helper.convertPosToWebkitTransform( this.scroll_content );
		this.platform_helper.update2DPosition( this.scroll_content, 0, 0 );                     
		
		this.calculateDimensions();
	},
	calculateDimensions : function() {
		this.container_size.width = this.touch_tracker.container.offsetWidth;
		this.container_size.height = this.touch_tracker.container.offsetHeight;
		this.content_size.width = this.scroll_content.offsetWidth;
		this.content_size.height = this.scroll_content.offsetHeight;
	},
	updatePositionFromTouch : function( moveX, moveY ) {
		// update container position	    
		if( this.scroll_enabled_x ) this.cur_position.x += moveX;
		if( this.scroll_enabled_y ) this.cur_position.y += moveY;
		this.updatePositionCSS();
	},
	updatePositionCSS : function() {
	  this.platform_helper.update2DPosition( this.scroll_content, this.cur_position.x, this.cur_position.y );                     
	},
	onStart : function($super, touchEvent) {
		$super( touchEvent );
    this.cursorSetGrabbyHand();
	},
	onMove : function($super, touchEvent) {
		$super( touchEvent );
		this.updatePositionFromTouch( ( this.touch_tracker.touchmoved.x - this.touch_tracker.touchmovedlast.x ), ( this.touch_tracker.touchmoved.y - this.touch_tracker.touchmovedlast.y ) );
	},
	onEnd : function($super, touchEvent) {
		$super( touchEvent );
		if(this.touch_tracker.touch_is_inside) this.cursorSetHand();
		else this.cursorSetDefault();
	},
	onEnter : function($super, touchEvent) {
		$super( touchEvent );
		if(!this.touch_tracker.is_touching) this.cursorSetHand();
	},
	onLeave : function($super, touchEvent) {
		$super( touchEvent );
		if(this.touch_tracker.is_touching) this.cursorSetGrabbyHand();
		else this.cursorSetDefault();
	},
	cursorSetDefault : function() {
	  this.touch_tracker.container.setAttribute('style', this.base_inline_css);
	},
	cursorSetHand : function() {
    if( this.platform_helper.is_chrome || this.platform_helper.is_msie ) {
      this.touch_tracker.container.setAttribute('style', this.base_inline_css + this.CSS_HAND + this.CSS_HAND_CUR);
    } else {
      this.touch_tracker.container.setAttribute('style', this.base_inline_css + this.CSS_HAND);
    }
	},
	cursorSetGrabbyHand : function() {
    if( this.platform_helper.is_chrome || this.platform_helper.is_msie ) {
      this.touch_tracker.container.setAttribute('style', this.base_inline_css + this.CSS_HAND_GRAB + this.CSS_HAND_GRAB_CUR);
    } else {
      this.touch_tracker.container.setAttribute('style', this.base_inline_css + this.CSS_HAND_GRAB);
    }
	},
	dispose : function($super) {
		this.timer_active = false;
		this.cur_position = false;
		this.container_size = false;
		this.content_size = false;
		this.base_inline_css = false;
		this.platform_helper.update2DPosition( this.scroll_content, 0, 0 );
		this.platform_helper = null;
		$super();
	}
});


var ScrollViewLocksDirection = Class.create(ScrollView, {
	HORIZONTAL : 'horizontal',
	VERTICAL : 'vertical',
	UNLOCKED : 'unlocked',
	
	decide_threshold : 15,
	has_decided_a_direction : false,
	touch_lock_direction : false,
	
	initialize : function( $super, scrollContainer, scrollContentElement ) {
		$super( scrollContainer, scrollContentElement );

		this.has_decided_a_direction = false;
		this.touch_lock_direction = this.UNLOCKED;
	},
	onStart : function($super, touchEvent) {   
    // reset state flags until we decide a direction
		$super( touchEvent );
	},
	onMove : function($super, touchEvent) {
    // if we haven't moved far enough in a direction, watch for which direction (x/y) moves to the threshold first
    // once a direction is decided, start passing through onMove events
    if( !this.has_decided_a_direction ) {
      if( Math.abs( this.touch_tracker.touchmoved.x ) > this.decide_threshold ) {
        this.hasDecidedDirection( this.HORIZONTAL );
      } else if( Math.abs( this.touch_tracker.touchmoved.y ) > this.decide_threshold ) {
        this.hasDecidedDirection( this.VERTICAL );
      }
    } else {
      $super( touchEvent );
    }
    touchEvent.preventDefault();
	},
	onEnd : function($super, touchEvent) {   
		$super( touchEvent );
		this.has_decided_a_direction = false;
    this.touch_lock_direction = this.UNLOCKED;
	},
	hasDecidedDirection : function( direction ) {
	  this.has_decided_a_direction = true;
    this.touch_lock_direction = direction;
	}
});


var VerticalScrollIndicator = Class.create({
	container : 0,
	container_height : 0,
	content_height : 0,
	scroll_indicator : null,
	scroll_indicator_bar : null,
	scroll_indicator_x : 0,
	scroll_indicator_height : 0,
	scroll_indicator_opacity : 0.5,
	is_showing : false,
	fade : false,

	initialize : function( container, containerWidth, containerHeight, contentHeight ) {
		this.container = container;
		this.container_width = containerWidth;
		this.container_height = containerHeight;
		this.content_height = contentHeight;
		this.build();
		this.resize( this.container_width, this.container_height, this.content_height );
	},

	build : function() {
    // store reused position/dimensions
    this.scroll_indicator_height = ( this.container_height / this.content_height ) * this.container_height;
    this.scroll_indicator_x = this.container_width - 7;
    this.bottom_limit = this.container_height - this.content_height;

    // create div, set size and hide it
    this.scroll_indicator = document.createElement('div');
    this.scroll_indicator.className = 'scroll_indicator';
    this.scroll_indicator.style.width = '5px';
    this.scroll_indicator.style.height = this.container_height + 'px';
    this.scroll_indicator.style.left = '0px';
    this.scroll_indicator.style.top = '0px';
    this.scroll_indicator.style.position = 'absolute';
    this.scroll_indicator.style.overflow = 'hidden';
    this.scroll_indicator.style.zIndex = '10';
    this.scroll_indicator.style.MozBorderRadius = '6px';
    this.scroll_indicator.style.WebkitBorderRadius = '6px';

    this.scroll_indicator_bar = document.createElement('div');
    this.scroll_indicator_bar.className = 'scroll_indicator_bar';
    this.scroll_indicator_bar.style.width = '5px';
    this.scroll_indicator_bar.style.height = this.scroll_indicator_height + 'px';
    this.scroll_indicator_bar.style.left = '0px';
    this.scroll_indicator_bar.style.top = '0px';
    this.scroll_indicator_bar.style.display = 'none';
    this.scroll_indicator_bar.style.position = 'absolute';
    this.scroll_indicator_bar.style.backgroundColor = 'black';
    this.scroll_indicator_bar.style.opacity = '0.5';
    this.scroll_indicator_bar.style.MozBorderRadius = '6px';
    this.scroll_indicator_bar.style.WebkitBorderRadius = '6px';

    // attach to the scroll container div
    this.scroll_indicator.appendChild( this.scroll_indicator_bar );
    this.container.appendChild( this.scroll_indicator );
	},
  resize : function( containerWidth, containerHeight, contentHeight ) {
	  this.container_width = containerWidth;
		this.container_height = containerHeight;
		this.content_height = contentHeight;
		this.bottom_limit = this.container_height - this.content_height;

    this.scroll_indicator_height = ( this.container_height / this.content_height ) * this.container_height;
    if( this.scroll_indicator_height > this.container_height ) this.scroll_indicator_height = this.container_height;
    if( this.scroll_indicator_bar ) this.scroll_indicator_bar.style.height = Math.round( this.scroll_indicator_height ) + 'px';
  },
  update : function( scrollYPosition ) {
    if( this.scroll_indicator && this.scroll_indicator_bar ) {
      platform_helper.update2DPosition( this.scroll_indicator, this.scroll_indicator_x, 0 );
      var verticalDistanceRatio = MathUtil.getPercentWithinRange( 0, this.bottom_limit, scrollYPosition );
      var yPosition = Math.round( verticalDistanceRatio * ( this.container_height - this.scroll_indicator_height ) );
      platform_helper.update2DPosition( this.scroll_indicator_bar, 0, yPosition );

      // force opacity
      if( this.is_showing ) {
        this.scroll_indicator_bar.style.display = 'block';
        this.scroll_indicator_bar.style.opacity = this.scroll_indicator_opacity;
      }
    }

  },
	show : function() {
    if( this.is_showing == false ) {
      if( this.container_height < this.content_height ) {
        this.scroll_indicator_bar.style.display = 'block';
        this.is_showing = true;
        
        // tween opacity or just set it if no tweener
        if( typeof JSTweener !== 'undefined' ) {
          JSTweener.addTween( this.scroll_indicator_bar.style, { time: 0.3, transition: 'linear', opacity: this.scroll_indicator_opacity } );
        } else {
          this.scroll_indicator_bar.style.opacity = this.scroll_indicator_opacity;
        }
      }
    }
	},
	hide : function() {
    if( this.is_showing == true ) {
      this.is_showing = false;

      // tween opacity or just set it if no tweener
      if( typeof JSTweener !== 'undefined' ) {
        JSTweener.addTween( this.scroll_indicator_bar.style, { time: 0.3, transition: 'linear', opacity: 0 } );
      } else {
        this.scroll_indicator_bar.style.opacity = 0;
      }
    }
	},
  dispose : function() {
    // if( this.holder ) this.holder.remove();
  }
});

