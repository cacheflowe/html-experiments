(function(){

  var _x = -1,
      _y = -1;

  var reset = function() {
    _x = -1;
    _y = -1;
  };

  /////////////////////////////////////////////////////////////
  // PUBLIC
  /////////////////////////////////////////////////////////////

  var pointerPos = {};
  window.pointerPos = pointerPos;

  window.pointerPos.x = function(el) {
    if(el != null) {
      var offset = el.getBoundingClientRect();
      return _x - offset.left;
    }
    return _x;
  };

  window.pointerPos.y = function(el) {
    if(el != null) {
      var offset = el.getBoundingClientRect();
      return _y - offset.top;
    }
    return _y;
  };

  window.pointerPos.xPercent = function(el) {
    if(el != null) {
      var offset = el.getBoundingClientRect();
      var relativeX = _x - offset.left;
      return relativeX / offset.width;
    }
    return _x / window.innerWidth;
  };

  window.pointerPos.yPercent = function(el) {
    if(el != null) {
      var offset = el.getBoundingClientRect();
      var relativeY = _y - offset.top;
      return relativeY / offset.height;
    }
    return _y / window.innerHeight;
  };

  /////////////////////////////////////////////////////////////
  // Move listener
  /////////////////////////////////////////////////////////////

  var mouseX = 0;
	var mouseY = 0;
	function pointerMoved(x, y) {
		_x = x;
		_y = y;
	}

  document.addEventListener('mousedown', function(e) {
    pointerMoved(e.clientX, e.clientY);
  });
  document.addEventListener('mousemove', function(e) {
    pointerMoved(e.clientX, e.clientY);
  });

  document.addEventListener('touchstart', function(e) {
    pointerMoved(e.touches[0].clientX, e.touches[0].clientY);
  });
  document.addEventListener('touchmove', function(e) {
    pointerMoved(e.touches[0].clientX, e.touches[0].clientY);
  });

})();
