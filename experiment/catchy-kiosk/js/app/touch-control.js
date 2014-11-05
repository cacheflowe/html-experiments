_catchy.touchControl = {};
_catchy.touchControl.init = function(){

  _catchy.touchControl.percentX = new EasingFloat(0.5, 10, 0.001);

  // -ms-touch-action: none; /* required to make pointer move event work */
  // touch-action: none; /* required to make pointer move event work */
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
