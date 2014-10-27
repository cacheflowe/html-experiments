var tts = tts || {};

tts.CSSHelper = function() {

  var _curVendor = tts.CSSHelper.getVendorPrefix( 'Transform' );
  var _transformsEnabled = ( _curVendor != null );
  var _transformString = _curVendor + 'Transform';
  tts.CSSHelper.transformString = _curVendor + 'Transform';
  var _transitionString = _curVendor + 'Transition';
  var _isPreAndroid4 = ( navigator.userAgent.toLowerCase().match(/android 2/i) || navigator.userAgent.toLowerCase().match(/android 3/i) ) ? true : false;
  
  var getVendor = function() {
    return _curVendor;
  };

  var getCssTransformsEnabled = function() {
    return _transformsEnabled;
  };

  var clearNativePositioning = function( element ) {
    element.style.left = '';
    element.style.top = '';
  };

  var clearTransformPositioning = function( element ) {
    element.style[ _transformString ] = '';
  };

  var clearCssTransition = function( element ) {
    element.style[ _transitionString ] = '';
  };

  var setBackfaceVisbility = function( element, hidden ) {
    hidden = hidden || 'hidden';
    element.style.backfaceVisibility = 'hidden';
    element.style[ _curVendor + 'BackfaceVisibility' ] = 'hidden';
  };

  // update css based on webkit positioning, or standard top/left css
  var update2DPosition = function ( element, x, y, scale, rot, keepTransition ) {
    if( !element ) return;
    if( keepTransition != true ) keepTransition = false;
    scale = scale || 1;
    rot = rot || 0;

    // since we're manually setting position, generally we're doing this in a frame loop, and should disable css transitions if true
    if( keepTransition == false ) clearCssTransition( element );

    if( !_transformsEnabled ) {
      // move element by top/left if transitions aren't supported
      element.style.left = tts.CSSHelper.roundForCSS( x ) + 'px';
      element.style.top = tts.CSSHelper.roundForCSS( y ) + 'px';
      element.style.zoom = scale;
    } else {
      element.style[ _transformString ] = buildPositionTranslateString( x, y ) + buildScaleTranslateString( scale ) + buildRotationTranslateString( rot );   // element[ _transformString ] &&
    }
  };

  var update2DRotation = function ( element, rot ) {
    element.style[ _transformString ] = buildRotationTranslateString( rot );
  };


  var buildPositionTranslateString = function( x, y ) {
    return " translate3d( " + tts.CSSHelper.roundForCSS( x ) + "px, " + tts.CSSHelper.roundForCSS( y ) + "px, 0px )";
  };

  var buildScaleTranslateString = function( deg ) {
    return " scale( " + tts.CSSHelper.roundForCSS( deg ) + " )";
  };

  var buildRotationTranslateString = function( deg ) {
    return " rotate( " + tts.CSSHelper.roundForCSS( deg ) + "deg )";
  };

  return {
    update2DPosition : update2DPosition,
    update2DRotation : update2DRotation,
    getVendor: getVendor,
    getCssTransformsEnabled : getCssTransformsEnabled,
    setBackfaceVisbility : setBackfaceVisbility
  };
};

// this should really only be called once
tts.CSSHelper.getVendorPrefix = function( styleSuffix ) {

  // see if the major browser vendor prefixes are detected for css transforms
  var checkVendor = function() {
    if(!navigator.userAgent.toLowerCase().match(/msie 9/i)){
      var vendors = ['Moz', 'Webkit', 'ms'];  // should have 'ms' also, but IE9 transform doesn't work, even though it claims to exist. so, we leave it out
      var element = findElementWithStyle();
      for( var vendor in vendors ) {
        if( element.style[ vendors[vendor] + styleSuffix ] !== undefined ) {
          return vendors[vendor];
        }
      }
      return null;
    }
  };

  // find & return a legit element with style
  var findElementWithStyle = function () {
    var bodyChildren = document.body.childNodes;
    for( var child in bodyChildren ) {
      if( typeof bodyChildren[child].style !== 'undefined' ) {
        return bodyChildren[child];
      }
    }
  }

  return checkVendor();
};

// round down to 2 decimel places for smaller css strings
tts.CSSHelper.roundForCSS = function( number ) {
  var multiplier = Math.pow( 10, 2 );
  return Math.round( number * multiplier ) / multiplier;
};

// find the location of an element on the page, taking into consideration either native left/top or CSS transform positioning, and page scroll offset
// cobbled from:
// http://javascript.about.com/od/browserobjectmodel/a/bom12.htm
// http://www.quirksmode.org/js/findpos.html
// with original code to handle webkitTransform positioning added into the mix
tts.CSSHelper.posArray = [0,0]; // reuse to avoid creating new objects
tts.CSSHelper.findPos = function(obj) {
  // get page scroll offset
  var scrollX = window.pageXOffset ? window.pageXOffset : document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft;
  var scrollY = window.pageYOffset ? window.pageYOffset : document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop;

  // get element location
  var curleft = curtop = 0;

  if (obj.offsetParent) {
    do {
      // xyz: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 120, 130, 140, 1)"
      // x: "matrix(1, 0, 0, 1, 120, 0)"
      // y: "matrix(1, 0, 0, 1, 0, 120)"
      // xy: "matrix(1, 0, 0, 1, 120, 120)"
      // z: "matrix3d(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 120, 1)"
      // add up css transform: translate3d positioning
      // if(obj.offsetParent) console.log(obj.offsetParent);
      // if(obj.offsetParent) console.log(obj.offsetParent.style[ tts.CSSHelper.transformString ]);
      if( obj.offsetParent && typeof obj.offsetParent.style !== 'undefined' && typeof obj.offsetParent.style[ tts.CSSHelper.transformString ] !== 'undefined' && obj.offsetParent.style[ tts.CSSHelper.transformString ] ) {  // last conditional fixes chrome on windows
        var transformXYZArray = obj.offsetParent.style[ tts.CSSHelper.transformString ].split('translate3d(')[1].split(')')[0].replace(/ +/g, '').replace(/px+/g, '').split(',');
        curleft += parseInt( transformXYZArray[0] );
        curtop += parseInt( transformXYZArray[1] );
      }
      // add normal positioning offset
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
  }

  // return position from cumulative offset
  tts.CSSHelper.posArray[0] = curleft - scrollX;
  tts.CSSHelper.posArray[1] = curtop - scrollY;
  return tts.CSSHelper.posArray;
};