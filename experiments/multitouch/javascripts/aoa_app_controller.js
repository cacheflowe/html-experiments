var AoAPitch = Class.create({
	appFrameRate: 1000/60,
	app_state : false,
	main_navigation : false,
	timer_objects : [],
	num_timer_objects : 0,
	initialize: function() {
		this.setBrowserProperties();
		this.setupDebug();
		
		window.scroll(0,0);
		
		canvasPool = new CanvasPool(3);
		canvasPoolCoverflow = new CanvasPool(40);
		
		this.buildExperiment();
						
		this.num_timer_objects = this.timer_objects.length;
		this.runAppTimer(this);
	},
	runAppTimer : function() {
		// update all timer-base objects
		for( var i=0; i < this.num_timer_objects; i++ )
		{
			this.timer_objects[i].runTimer();
		}
		
		// keep timer running
		setTimeout( function(t) { t.runAppTimer(); } , this.appFrameRate, this);
	},
	setBrowserProperties : function() {
		// prevents mobile safari from bouncing
		document.ontouchmove = function(event) {
			event.preventDefault();
		};
	},
	setupDebug : function() {
		// debug tweaking
		$("debug").setOpacity(0.6);
        $("debug").hide();

		// implement our own debug class
		debug = new Debug( $("debug_log") );
		//this.timer_objects.push( debug );//console.log('YAH!!');
		/**/
		// implement MrDoob's stats class
		var stats = new Stats();
		$("debug_stats").appendChild(stats.domElement);
		this.timer_objects.push( stats );
	},
	buildExperiment : function() {
		// enable site navigation
		var container = $("page_container");
	    
		this.main_navigation = new MultiTouchTracker( container );
		//this.timer_objects.push( main_navigation );
	}
});
