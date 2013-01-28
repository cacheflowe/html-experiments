var PageIndicator = Class.create({
	num_pages : 0,
	page_index : 0,
	container : 0,
	holder : false,
	active_color : false,
	inactive_color : false,
	y_offset : false,
	dots : false,

	initialize : function( parent, yOffset, numPages, activeColor, inactiveColor ) {

		this.container = parent;
		this.num_pages = numPages;
		this.active_color = activeColor;
		this.inactive_color = inactiveColor;
		this.y_offset = yOffset;
		
		if( this.num_pages > 1 ) this.build();
		else this.dispose();
	},

	build : function() {
		
	    // outer container
	    this.holder = document.createElement('div');
	    this.holder.className = 'page_indicator';
	    this.holder.style.position = 'absolute';
	    this.holder.style.zIndex = '10';
       
	    // build dots per page
	    this.dots = [];
	    for(var i = 0; i < this.num_pages; i++)
	    {
    	    var dot = document.createElement( 'div' );
    	    dot.style.backgroundColor = '#222277';
    	    dot.style.width = '6px';
    	    dot.style.height = '6px';
    	    dot.style.display = 'block';
    	    dot.style.cssFloat = 'left';
    	    dot.style.styleFloat = 'left';
    	    dot.style.margin = '0px 9px 0px 9px';
    	    dot.style.MozBorderRadius = '3px';
    	    dot.style.WebkitBorderRadius = '3px';
          
    	    this.holder.appendChild( dot );
    	    this.dots.push( dot );
	    }
	    
	    var indicatorWidth = this.num_pages * 24;
        this.holder.style.width = indicatorWidth + 'px';
        this.holder.style.left = ( this.container.offsetWidth - indicatorWidth ) * .5 + 'px';
        this.holder.style.top = this.container.offsetHeight - this.y_offset + 'px';
        this.container.appendChild( this.holder );
        
        this.setIndex(0);
	},
	
	setIndex : function( index ) {
	    for(var i = 0; i < this.dots.length; i++)
	        this.dots[i].style.backgroundColor = ( index == i ) ? "#"+this.active_color : "#"+this.inactive_color;
	},

    dispose : function() {
        if( this.holder )
        { 
            this.holder.replace('');
        }
    }
});


var ScrollViewPagedBase = Class.create(ScrollViewLocksDirection, {
	num_pages : 0,
	page_index : 0,
	closest_scroll_index : 0,
	easing_factor : 4,
	page_turn_ratio : 0.2,
	timer_active : false,
	timer_fps : 1000/30,
	
	initialize : function( $super, scrollContainer, scrollContentElement ) {
		$super( scrollContainer, scrollContentElement );
	},
	
	runTimer : function() {
		if( this.timer_active ) {
    		if( !this.touch_tracker.is_touching ) {
    		    // override easeToIndex to decide which axis to ease on
    		    this.easeToIndex();
                platform_helper.update2DPosition( this.scroll_content, this.cur_position.x, this.cur_position.y );                     
    	    }
		
    		this.checkForClosestIndex();
		
    		// keep timer running
    		setTimeout( function(t) { t.runTimer(); } , this.timer_fps, this);
	    }
	},
	
	updateFPS : function(e) {
        this.timer_fps = e.memo.fps;
	},

	getNextEasedLocation : function( pageIndex, curPosition, containerSize ) {
	    
	    var targetPos = pageIndex * -containerSize;
		if( curPosition !== targetPos )
		{
			if (Math.abs( curPosition - targetPos ) <= 0.5 ) {        
				curPosition = targetPos;
				this.handleDestination();
			}
		}
		// ease position to target
		return curPosition -= ( ( curPosition - targetPos ) / this.easing_factor );
	},
	
	checkForClosestIndex : function( position, containerSize ) {
		// set closest index and update indicator
		var closestIndex = Math.round( position / -containerSize );
		if( this.closest_scroll_index != closestIndex )
		{
			this.closest_scroll_index = closestIndex;
			this.closestIndexChanged();
		}
	},
	
	closestIndexChanged : function() {
	    
	},
	
	deactivate : function() {
	    this.timer_active = false;
	    this.reset();
	},
	
	activate : function() {
	    if( this.timer_active == false ) {
    	    this.timer_active = true;
    	    this.runTimer();
        }
	},
	
	reset : function() {
        this.page_index = 0;
        this.cur_position.x = 0;
        this.cur_position.y = 0;
        platform_helper.update2DPosition( this.scroll_content, this.cur_position.x, this.cur_position.y );  
	},
	
	dispose : function($super) {
		this.timer_active = false;
		$super();
	}
});


var ScrollViewPagedHorizontal = Class.create(ScrollViewPagedBase, {
	cancels_main_nav : false,
	indicator : false,
	closest_scroll_index : 0,
	container_width : false,
	initialize : function( $super, scrollContainer, scrollContentElement, indicator ) {
	    this.container_width = scrollContainer.offsetWidth;
		$super( scrollContainer, scrollContentElement );

        this.indicator = indicator;
		this.scroll_enabled_y = false;
		
		this.activate();
	},
    setNewIndicator : function(indicator) {
        if (this.indicator) this.indicator.dispose();
        this.indicator = indicator;
    },
    
    easeToIndex : function() {
        this.cur_position.x = this.getNextEasedLocation( this.page_index, this.cur_position.x, this.container_size.width );
    },
    
    checkForClosestIndex : function( $super ) {
        $super( this.cur_position.x, this.container_size.width );
    },
    
	closestIndexChanged : function( $super ) {
	    $super();
	    if( this.indicator ) this.indicator.setIndex( this.closest_scroll_index );
	},
	
	calculateDimensions : function( $super ) {
		$super();
		this.num_pages = Math.ceil( this.content_size.width / this.container_size.width );
	},
	
	updatePositionFromTouch : function( $super, moveX, moveY ) {
	    // handle bounce-back and lessened swipe-ability at ends of scroll area
	    if( this.scroll_enabled_x ) 
		{
			if( this.page_index == 0 && this.touch_tracker.touchmoved.x > 0 )
			    this.cur_position.x += moveX * 0.3;
			else if( this.page_index == this.num_pages - 1 && this.touch_tracker.touchmoved.x < 0 )
			    this.cur_position.x += moveX * 0.3;
			else
			    this.cur_position.x += moveX;
		}
		this.updatePositionCSS();
	},
	
	onStart : function($super, touchEvent) {
		$super( touchEvent );
        
		if( this.cancels_main_nav ) 
		    app_events.fireEvent( app_events.MAIN_NAV_SCROLL_DISABLE, null );
	},
	onMove : function($super, touchEvent) {
	    // check that the mouse is within the boundaries, to ensure that events only fire while in-bounds. this may not always be the desired outcome...
		var relativeTouchX = this.touch_tracker.touchcurrent.x + this.touch_tracker.container_position.x;
		var relativeContainerX = this.touch_tracker.container_position.x;
		// only pass along move event if inside container
		//if( relativeTouchX > relativeContainerX && relativeTouchX < relativeContainerX + this.container_size.width && this.touch_lock_direction != this.VERTICAL ) {
		  if( this.touch_lock_direction != this.VERTICAL ) {
	        
	    }
	    $super( touchEvent );
	    
		// is we've set the flag, disable the main nav
		if( this.cancels_main_nav )
		    app_events.fireEvent( app_events.MAIN_NAV_SCROLL_DISABLE, null );
	},
	onEnd : function($super, touchEvent) {
	    // snap to page and constrain page calculation
	    if( this.touch_lock_direction == this.HORIZONTAL ) {
    		if( this.touch_tracker.touchmoved.x > this.container_size.width * this.page_turn_ratio )
    			this.page_index = ( this.page_index == 0 ) ? 0 : this.page_index - 1;
    		else if	( this.touch_tracker.touchmoved.x < -this.container_size.width * this.page_turn_ratio )
    			this.page_index = ( this.page_index < this.num_pages - 1 ) ? this.page_index + 1 : this.num_pages - 1;
		}
		
		$super( touchEvent );
		if( this.cancels_main_nav ) setTimeout( function(){ app_events.fireEvent( app_events.MAIN_NAV_SCROLL_ENABLE, null ); }, 10 ); 
	},
	handleDestination: function () {
	    // generally used by subclasses.
	    if( this.indicator ) this.indicator.setIndex( this.page_index );
	},
	setPage: function ( index, immediately ) {
        this.page_index = index;
        if (immediately) this.cur_position.x = this.page_index * -this.container_size.width;
	},
	reset : function( $super ) {
        $super();
	    if( this.indicator ) this.indicator.setIndex( this.page_index );
	},
	dispose : function( $super ) {
	    $super();
        if (this.indicator) {
            this.indicator.dispose();
            delete this.indicator;
        }
	}
});



var ScrollViewPagedVertical = Class.create(ScrollViewPagedBase, {
	last_y : 0,
	speed : 0,
	scroll_indicator : null,
	tracking_category_id : null,
	tracking_page_ids : null,
	
	initialize : function( $super, scrollContainer, scrollContentElement ) {
		
		var pages = scrollContentElement.select('.sub_page');
		var numPages = pages.length;
		
		// set scroll container
		scrollContentElement.style.height = ( 973 * numPages ) + 'px';
		$super( scrollContainer, scrollContentElement );
		this.scroll_indicator = new VerticalScrollIndicator( this.touch_tracker.container, this.container_size.width, this.container_size.height, this.content_size.height );
		
		this.activate();
	},

    easeToIndex : function() {
	    this.cur_position.y = this.getNextEasedLocation( this.page_index, this.cur_position.y, this.container_size.height );
    },
    checkForClosestIndex : function( $super ) {
        $super( this.cur_position.y, this.container_size.height );

        //  move the indicator, keep track of speed to know when to hide
        this.speed = this.cur_position.y - this.last_y;
		this.scroll_indicator.update( this.cur_position.y );
		this.last_y = this.cur_position.y;
		if( Math.abs(this.speed) < 2 && !this.touch_tracker.is_touching ) if( this.scroll_indicator ) this.scroll_indicator.hide();
		
    },
	closestIndexChanged : function( $super ) {
	    $super();
	    // tell video players to shut down
	    app_events.fireEvent( app_events.VERTICAL_SCROLL_PAGE_CHANGED, null );
	},
	calculateDimensions : function($super) {
		$super();
		this.num_pages = Math.round( this.content_size.height / this.container_size.height );
	    if( this.scroll_indicator ) this.scroll_indicator.resize( this.container_size.width, this.container_size.height, this.content_size.height );
	},
	updatePositionFromTouch : function( $super, moveX, moveY ) {
	    // handle bounce-back and lessened swipe-ability at ends of scroll area
		if( this.page_index == 0 && this.touch_tracker.touchmoved.y > 0 )
		    this.cur_position.y += moveY * 0.3;
		else if( this.page_index == this.num_pages - 1 && this.touch_tracker.touchmoved.y < 0 )
		    this.cur_position.y += moveY * 0.3;
		else
		    this.cur_position.y += moveY;
	
		this.updatePositionCSS();
	},
	onStart : function($super, touchEvent) {    
		$super( touchEvent );
		if( this.scroll_indicator ) this.scroll_indicator.show();
	},
	onMove : function($super, touchEvent) {
	    // check that the mouse is within the boundaries, to ensure that events only fire while in-bounds. this may not always be the desired outcome...
		var relativeTouchY = this.touch_tracker.touchcurrent.y + this.touch_tracker.container_position.y;
		var relativeContainerY = this.touch_tracker.container_position.y;
		// only pass along move event if inside container
		if( relativeTouchY > relativeContainerY && relativeTouchY < relativeContainerY + this.container_size.height && this.touch_lock_direction != this.HORIZONTAL ) {
	        $super( touchEvent );
	    } else {
	        // debug.log('out of range');
	    }
	},
	hasDecidedDirection : function ( $super, direction ) {
	    $super( direction );
	    
	    // send event when swipe direction is decided from super
	    if( direction == this.HORIZONTAL ) {
            app_events.fireEvent( app_events.VERTICAL_SCROLL_END, null );
    		if( this.scroll_indicator ) this.scroll_indicator.hide();
        } else if( direction == this.VERTICAL ) {
    		if( this.scroll_indicator ) this.scroll_indicator.show();
        }
	    
	},
	onEnd : function($super, touchEvent) {
	    // detect vertical page change
	    if( this.touch_lock_direction == this.VERTICAL ) {
	        var previousPage = this.page_index;
    	    // snap to page and constrain page calculation
    		if( this.touch_tracker.touchmoved.y > this.container_size.height * this.page_turn_ratio )
    			this.page_index = ( this.page_index == 0 ) ? 0 : this.page_index - 1;
    		else if ( this.touch_tracker.touchmoved.y < -this.container_size.height * this.page_turn_ratio )
    			this.page_index = ( this.page_index < this.num_pages - 1 ) ? this.page_index + 1 : this.num_pages - 1;
		}
		
		$super( touchEvent );
		setTimeout( function(){ app_events.fireEvent( app_events.VERTICAL_SCROLL_END, null ); }, 100 ); 
	},
	handleDestination: function () {
	    // send event to current area for tracking index
        app_events.fireEvent( app_events.PAGED_SCROLLER_VERTICAL_INDEX_CHANGED, { index: this.page_index } );
	}
});




