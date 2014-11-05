_catchy.touchControl = {};
_catchy.touchControl.init = function(){
  _catchy.touchControl.percentX = new EasingFloat(0.5, 10, 0.001);

  var pointers = {};

  function onPointerDown(e) {
    pointers[e.pointerId] = {
      x: e.clientX,
      y: e.clientY,
      pointerType: e.pointerType,
      pointerId: e.pointerId
    };
  }

  function onPointerMove(e) {
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
    delete pointers[e.pointerId];
  }

  // -ms-touch-action: none; /* required to make pointer move event work */
  // touch-action: none; /* required to make pointer move event work */
  _catchy.screen.container.addEventListener( 'touchmove', function(e){
    _catchy.touchControl.percentX.setTarget( e.touches[0].clientX / _catchy.screen.width );
  }, false );
  _catchy.screen.container.addEventListener( 'pointerdown', onPointerDown, false );
  _catchy.screen.container.addEventListener( 'pointermove', onPointerMove, false );
  _catchy.screen.container.addEventListener( 'pointerup', onPointerUp, false );
  _catchy.screen.container.addEventListener( 'pointercancel', onPointerUp, false );
};
