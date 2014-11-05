alert('hello world');
_catchy.touchControl = {};
_catchy.touchControl.init = function(){
  _catchy.touchControl.percentX = new EasingFloat(0.5, 10, 0.001);

  var pointers = {};

  function onPointerDown(e) {
    alert('pointer down');
    pointers[e.pointerId] = {
      x: e.clientX,
      y: e.clientY,
      pointerType: e.pointerType,
      pointerId: e.pointerId
    };
  }

  function onPointerMove(e) {
    alert('pointer move');
    var newPercentX = e.clientX / _catchy.screen.width;
    _catchy.touchControl.percentX.setTarget( newPercentX );

    // Prevent the browser from doing its default thing (scroll, zoom)
    var pointer = pointers[e.pointerId];
    if (pointer) {
      pointer.x = e.clientX;
      pointer.y = e.clientY;
      var newPercentX = e.clientX / _catchy.screen.width;
      _catchy.touchControl.percentX.setTarget( newPercentX );
    }
  } 

  function onPointerUp(e) { 
    alert('pointer up');
    delete pointers[e.pointerId];
  }

  function onMouseDown(e) { 
    alert('mouse down');
  }

  function onMouseMove(e) { 
    alert('mouse move');
  }

  function onMouseUp(e) { 
    alert('mouse up');
  }

  // -ms-touch-action: none; /* required to make pointer move event work */
  // touch-action: none; /* required to make pointer move event work */
  // _catchy.screen.container.addEventListener( 'touchmove', function(e){
  //   _catchy.touchControl.percentX.setTarget( e.touches[0].clientX / _catchy.screen.width );
  // }, false );
  console.log(_catchy.screen.container);
  // _catchy.screen.container.addEventListener( 'pointerdown', onPointerDown, false );
  // _catchy.screen.container.addEventListener( 'pointermove', onPointerMove, false );
  // _catchy.screen.container.addEventListener( 'pointerup', onPointerUp, false );
  // _catchy.screen.container.addEventListener( 'pointercancel', onPointerUp, false );

  // _catchy.screen.container.addEventListener( 'mousedown', onMouseDown, false );
  // _catchy.screen.container.addEventListener( 'mousemove', onMouseMove, false );
  // _catchy.screen.container.addEventListener( 'mouseup', onMouseUp, false );


  var _touchTracker = new tts.MouseAndTouchTracker( _catchy.screen.container, function( touchState ){
    switch( touchState ) {
      case tts.MouseAndTouchTracker.state_start :
        var newPercentX = _touchTracker.touchcurrent.x / _catchy.screen.width;
        _catchy.touchControl.percentX.setTarget( newPercentX );
        // MobileUtil.lockTouchScreen(true);
        break;

      case tts.MouseAndTouchTracker.state_move :
        var newPercentX = _touchTracker.touchcurrent.x / _catchy.screen.width;
        _catchy.touchControl.percentX.setTarget( newPercentX );
        break;

      case tts.MouseAndTouchTracker.state_end :
        var newPercentX = _touchTracker.touchcurrent.x / _catchy.screen.width;
        _catchy.touchControl.percentX.setTarget( newPercentX );
        // MobileUtil.lockTouchScreen(false);
        break;
    }
  }, true, '', false );

};

