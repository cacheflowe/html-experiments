function Debug(){}

Debug.prototype.init = function () {
  // create html
  var htmlStr = '';
  htmlStr += '<div id="debug_stats"></div>';
  htmlStr += '<div style="color:black;">';
  htmlStr += '  <strong>';
  htmlStr += '    <span class="underline">DEBUG</span>';
  htmlStr += '  </strong>';
  htmlStr += '</div>';
  htmlStr += '<div id="debug_realtime"></div>';
  htmlStr += '<div style="color:black;">';
  htmlStr += '  <strong>';
  htmlStr += '    <span class="underline">LOG</span>';
  htmlStr += '  </strong>';
  htmlStr += '</div>';
  htmlStr += '<div id="debug_log"></div>';
  
  var debugDiv = document.createElement( 'div' );
  debugDiv.id = "debug";
  debugDiv.innerHTML = htmlStr;
  document.body.appendChild( debugDiv );
  
  this.element = document.getElementById( "debug_log" );
  this.realtime_element = document.getElementById("debug_realtime") ;
  this.stats_holder = document.getElementById("debug_stats") ;
	this.log_lines = 12;
	this.realtime_properties = [];
	this.timer_fps = 1000/30;
	this.active = true;
	
	this.stats = new Stats();
  this.stats_holder.appendChild(this.stats.domElement);    
	
	if (this.element) this.runTimer();
};

Debug.prototype.log = function ( newDebugString ) {
  if (this.element) {
    // get time
    var currentTime = new Date();
    var hours = currentTime.getHours();
    var minutes = currentTime.getMinutes();
    if(minutes < 10) minutes = "0" + minutes;

    // log it
    this.element.innerHTML += "<div>[" + hours + ":" + minutes + "] " + newDebugString + "</div>";

    // if we're over the limit for logging, remove first element
    if( this.element.childNodes.length > this.log_lines ){
      this.element.removeChild( this.element.childNodes[0] );
    }
  }
};

Debug.prototype.runTimer = function () {
  // keep stats animating
  this.stats.update();

	this.realtime_element.innerHTML = "";
	var obj;
	for( var i=0; i < this.realtime_properties.length; i++ )
	{
		obj = this.realtime_properties[i];
		this.realtime_element.innerHTML += obj.friendlyName + " = " + obj.object[ obj.propertyStr ] + "<br/>";
	}
	
	// keep timer running
	if( this.active ) setTimeout( function(t) { t.runTimer(); } , this.timer_fps, this);
};

Debug.prototype.addRealtimeProperty = function ( object, propertyStr, friendlyName ) {
  if (this.element) {
    this.realtime_properties.push( { object:object, propertyStr:propertyStr, friendlyName:friendlyName } );
  }    
};

Debug.prototype.updateFPS = function( e ) {
  this.timer_fps = e.memo.fps;
};


Debug.prototype.removeElement = function( elem ) {
  if( elem ) {
    if( elem.parentNode ) {
      elem.parentNode.removeChild( elem );
    }
  }
};

Debug.prototype.dispose = function ()
{
  this.removeElement( document.getElementById("debug") );
  this.active = false;
  this.element = null;
};
