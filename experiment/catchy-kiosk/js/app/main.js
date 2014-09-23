
////////////////////////////////////////////////////////////////////////////////////////////
// STATS INIT //////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

var stats = new Stats();
stats.setMode(0); // 0: fps, 1: ms

// Align top-left
stats.domElement.style.position = 'absolute';
stats.domElement.style.left = '0px';
stats.domElement.style.top = '0px';

document.body.appendChild( stats.domElement );


////////////////////////////////////////////////////////////////////////////////////////////
// TWO SVG PREP ////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// init Two for svg import
Two.Resolution = 24;
var _twoCanvas = new Two({
  width: 400,
  height: 400,
  type: Two.Types.canvas
}); //.appendTo(container);

var getScaledSpriteFromSVG = function(elemId) {
  _twoCanvas.clear();

  // import svg from DOM, scale up, fit canvas to svg and render!
  var shape = _twoCanvas.interpret(document.getElementById(elemId));  // .center()
  shape.scale = 1;
  var charH = Math.ceil(shape.getBoundingClientRect().height);
  var charW = Math.ceil(shape.getBoundingClientRect().width);
  _twoCanvas.width = charW;
  _twoCanvas.height = charH;
  _twoCanvas.update();

  // grab two canvas contents
  // var newSvgSprite = new PIXI.Sprite(PIXI.Texture.fromCanvas(_twoCanvas.renderer.domElement));
  var newSvgSprite = new PIXI.Sprite(PIXI.Texture.fromImage(_twoCanvas.renderer.domElement.toDataURL()));
  newSvgSprite.anchor.x = 0.5;
  newSvgSprite.anchor.y = 0.5;

  return newSvgSprite;
};

var birdieSvg = getScaledSpriteFromSVG('birdie');
var birdieSvgCatch = getScaledSpriteFromSVG('birdie-catch');

var grass = getScaledSpriteFromSVG('grass');
var mountain = getScaledSpriteFromSVG('mountain');

////////////////////////////////////////////////////////////////////////////////////////////
// APP /////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// setup screen props
MobileUtil.lockTouchScreen(true);

// get window size
var _stageWidth = window.innerWidth;
var _stageHeight = window.innerHeight;
var _scaleV = 1;

// create an new instance of a pixi stage
var _pixiStage = new PIXI.Stage(0x92CA56);
var _pixiRenderer = PIXI.autoDetectRenderer(_stageWidth, _stageHeight);
var _pixiContainer = document.getElementById('pixi-container');
_pixiContainer.appendChild(_pixiRenderer.view);
_pixiStage.interactive = false;

// stage resize handling
var onWindowResize = function(e) {
  _stageWidth = window.innerWidth;
  _stageHeight = window.innerHeight;
  _scaleV = _stageHeight / 680;

  _pixiRenderer.resize(_stageWidth,_stageHeight);
  layoutScene();
}
window.addEventListener('resize', onWindowResize);

// mouse/touch controls
var _usingAccelerometer = false;
var _percentX = new EasingFloat(0, 10, 0.001);
var onMouseMove = function(e) {
  if(_usingAccelerometer == true) return;
  var newPercentX = e.clientX / window.innerWidth;
  _percentX.setTarget( newPercentX );
}
window.addEventListener('mousemove', onMouseMove);

var onTouchMove = function(e) {
  if(_usingAccelerometer == true) return;
  var newPercentX = e.touches[0].clientX / window.innerWidth;
  _percentX.setTarget( newPercentX );
}
window.addEventListener('touchmove', onTouchMove);


// debug controls
// mouse events
var mouseEventsEl = document.getElementById('mouse-events');
document.body.addEventListener('mousedown', function(e){
  mouseEventsEl.innerHTML = '<b>mousedown</b><br/>'+'e.clientX: '+e.clientX+'<br/>'+'e.clientY: '+e.clientY;
});
document.body.addEventListener('mouseup', function(e){
  mouseEventsEl.innerHTML = '<b>mouseup</b><br/>'+'e.clientX: '+e.clientX+'<br/>'+'e.clientY: '+e.clientY;
});
document.body.addEventListener('mousemove', function(e){
  mouseEventsEl.innerHTML = '<b>mousemove</b><br/>'+'e.clientX: '+e.clientX+'<br/>'+'e.clientY: '+e.clientY;
});

// touch events
var touchEventsEl = document.getElementById('touch-events');
var multiTouchEventsEl = document.getElementById('multi-touch-events');
document.body.addEventListener('touchstart', function(e){
  if(e.touches.length == 1) { 
    touchEventsEl.innerHTML = '<b>touchstart</b><br/>'+'e.clientX: '+e.touches[0].clientX+'<br/>'+'e.clientY: '+e.touches[0].clientY;
  } else {
    var multiTouchStr = '<b>touchstart</b><br/>';
    for(var i=0; i < e.touches.length; i++) {
      multiTouchStr += 'touch '+(i+1)+'e.clientX: '+e.touches[i].clientX+'<br/>'+'e.clientY: '+e.touches[i].clientY;
    }
    multiTouchEventsEl.innerHTML = multiTouchStr;
  }
});
document.body.addEventListener('touchend', function(e){
  if(e.touches.length == 1) { 
    touchEventsEl.innerHTML = '<b>touchend</b><br/>'+'e.clientX: '+e.touches[0].clientX+'<br/>'+'e.clientY: '+e.touches[0].clientY;
  } else {
    var multiTouchStr = '<b>touchend</b><br/>';
    for(var i=0; i < e.touches.length; i++) {
      multiTouchStr += 'touch '+(i+1)+'e.clientX: '+e.touches[i].clientX+'<br/>'+'e.clientY: '+e.touches[i].clientY;
    }
    multiTouchEventsEl.innerHTML = multiTouchStr
  }
});
document.body.addEventListener('touchmove', function(e){
  if(e.touches.length == 1) { 
    touchEventsEl.innerHTML = '<b>touchmove</b><br/>'+'e.clientX: '+e.touches[0].clientX+'<br/>'+'e.clientY: '+e.touches[0].clientY;
  } else {
    var multiTouchStr = '<b>touchmove</b><br/>';
    for(var i=0; i < e.touches.length; i++) {
      multiTouchStr += 'touch '+(i+1)+'e.clientX: '+e.touches[i].clientX+'<br/>'+'e.clientY: '+e.touches[i].clientY;
    }
    multiTouchEventsEl.innerHTML = multiTouchStr
  }
});

// pointer events
var pointerEventsEl = document.getElementById('pointer-events');
document.body.addEventListener('pointerdown', function(e){
  pointerEventsEl.innerHTML = '<b>pointerdown</b><br/>'+'e.clientX: '+e.clientX+'<br/>'+'e.clientY: '+e.clientY;
});
document.body.addEventListener('pointerup', function(e){
  pointerEventsEl.innerHTML = '<b>pointerup</b><br/>'+'e.clientX: '+e.clientX+'<br/>'+'e.clientY: '+e.clientY;
});
document.body.addEventListener('pointermove', function(e){
  pointerEventsEl.innerHTML = '<b>pointermove</b><br/>'+'e.clientX: '+e.clientX+'<br/>'+'e.clientY: '+e.clientY;
  pointerEventsEl.innerHTML += '<br/><b>e.pointerType</b>:'+' '+e.pointerType;
});

// IE pointer event check
// if(window.MSPointerDown || window.PointerDown) {

// }
// if(navigator.maxTouchPoints || navigator.msMaxTouchPoints) {

// }

// window.addEventListener('mousemove', function(e){});


/*
if(texture.baseTexture.hasLoaded) {
  console.log(stone.width + ', ' + stone.height);
} else {
  texture.addEventListener("update", onTextureUpdate)
}

function onTextureUpdate() {
  console.log(stone.width + ', ' + stone.height);
}*/

  // var texture = PIXI.Texture.fromImage("images/"+layers[i]);
  // var layerImg = new PIXI.Sprite(texture);
  // layerImg.anchor.x = 0.5;
  // layerImg.anchor.y = 0.5;
  
  // move the sprite t the center of the screen
  // layerImg.position.x = _stageWidth/2;
  // layerImg.position.y = _stageHeight/2;
  // _pixiStage.addChild(layerImg);

//////////////////////////////////////////
// // add test svg image
// var birdieSvg = 'PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4NCjwhLS0gR2VuZXJhdG9yOiBBZG9iZSBJbGx1c3RyYXRvciAxNS4wLjAsIFNWRyBFeHBvcnQgUGx1Zy1JbiAuIFNWRyBWZXJzaW9uOiA2LjAwIEJ1aWxkIDApICAtLT4NCjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+DQo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB3aWR0aD0iOTkuMzI3cHgiIGhlaWdodD0iMjE5LjM5MXB4IiB2aWV3Qm94PSIwIDAgOTkuMzI3IDIxOS4zOTEiIGVuYWJsZS1iYWNrZ3JvdW5kPSJuZXcgMCAwIDk5LjMyNyAyMTkuMzkxIg0KCSB4bWw6c3BhY2U9InByZXNlcnZlIj4NCjxwb2x5Z29uIHBvaW50cz0iOTEuNzQyLDAgNDkuNjY0LDM1LjM0NiA3LjU4NywwIDExLjU5OSw2MS40NCA0OS42NjQsNTYuMTQ3IDg3LjczLDYxLjQ0ICIvPg0KPHBvbHlnb24gZmlsbD0iI0ZBQTIxQiIgcG9pbnRzPSI2Ny4yMTEsNTkuNjI1IDcuNTg2LDY3LjkxNiA3LjU4NiwwICIvPg0KPHBvbHlnb24gZmlsbD0iI0ZBQTIxQiIgcG9pbnRzPSIzMi4xMTgsNTkuNjI1IDkxLjc0Myw2Ny45MTYgOTEuNzQzLDAgIi8+DQo8cGF0aCBmaWxsPSIjRkFBMjFCIiBkPSJNNDUuNjk1LDIxNS41ODFjMCwyLjEwNC0xLjcwNiwzLjgxLTMuODEsMy44MWMtMi4xMDQsMC0zLjgxLTEuNzA2LTMuODEtMy44MXYtNjguNDczDQoJYzAtMi4xMDQsMS43MDUtMy44MTEsMy44MS0zLjgxMWMyLjEwNCwwLDMuODEsMS43MDYsMy44MSwzLjgxMVYyMTUuNTgxeiIvPg0KPHBhdGggZmlsbD0iI0ZBQTIxQiIgZD0iTTU5Ljg5LDIxNS41ODFjMCwyLjEwNC0xLjcwNiwzLjgxLTMuODEsMy44MWMtMi4xMDQsMC0zLjgxLTEuNzA2LTMuODEtMy44MXYtNjguNDczDQoJYzAtMi4xMDQsMS43MDUtMy44MTEsMy44MS0zLjgxMWMyLjEwNCwwLDMuODEsMS43MDYsMy44MSwzLjgxMVYyMTUuNTgxeiIvPg0KPHBhdGggZmlsbD0iI0ZGREEwMCIgZD0iTTk5LjMyNywxNjcuMjQ4VjkwLjQ3Yy0wLjEzMy0yNy4zMTYtMjIuMzE2LTQ5LjQxOS00OS42NjMtNDkuNDE5Yy0yNy4yOTMsMC00OS40NDIsMjIuMTc3LTQ5LjY2MSw0OS40MTkNCglsLTAuMDAyLDc2Ljc3OGwwLjAxMiwwLjEwNkgwLjAwMXY1LjA5MWw0LjQ0NSw0LjcyNWw2LjM5My02LjM5NGw2LjM5Myw2LjM5NGw2LjM5My02LjM5NGw2LjM5Myw2LjM5NGw2LjM5My02LjM5NGw2LjM5Myw2LjM5NA0KCWw2LjM5Mi02LjM5NGw2LjM5Myw2LjM5NGw2LjM5My02LjM5NGw2LjM5Myw2LjM5NGw2LjM5Mi02LjM5NGw2LjM5Myw2LjM5NGw2LjM5My02LjM5NGw2LjM5Myw2LjM5NGw1LjM4Ny01LjI3MXYtNC41NDRoLTAuMDExDQoJTDk5LjMyNywxNjcuMjQ4eiIvPg0KPHBhdGggb3BhY2l0eT0iMC4wNSIgZD0iTTQ5LjM5Miw0MS4wNTlDMjIuMjI0LDQxLjIwNSwwLjIxOSw2My4zMTksMC4wMDEsOTAuNDcxTDAsMTY3LjI0OGwwLjAxMSwwLjEwN0gwdjUuMDkxbDQuNDQ0LDQuNzI0DQoJbDYuMzkzLTYuMzkzbDYuMzkzLDYuMzkzbDYuMzkzLTYuMzkzbDYuMzkzLDYuMzkzbDYuMzkyLTYuMzkzbDYuMzk0LDYuMzkzbDYuMzkyLTYuMzkzbDAuMiwwLjJWNDEuMDU5eiIvPg0KPHBhdGggZmlsbD0iI0ZBQTIxQiIgZD0iTTQ5LjY2NCwxMTIuMTU5Yy0xMi4yODQsMC0yMi4yNzgtOS45OTQtMjIuMjc4LTIyLjI3OGMwLTEyLjI4NSw5Ljk5NC0yMi4yOCwyMi4yNzgtMjIuMjgNCgljMTIuMjg1LDAsMjIuMjc5LDkuOTk1LDIyLjI3OSwyMi4yOEM3MS45NDMsMTAyLjE2NSw2MS45NDksMTEyLjE1OSw0OS42NjQsMTEyLjE1OSIvPg0KPHBhdGggZmlsbD0iI0ZGRkZGRiIgZD0iTTcwLjM4OCw4OC4wOTVjMCwxMS40NDUtOS4yNzcsMjAuNzI1LTIwLjcyNCwyMC43MjVjLTExLjQ0NSwwLTIwLjcyNC05LjI3OS0yMC43MjQtMjAuNzI1DQoJYzAtMTEuNDQ0LDkuMjc4LTIwLjcyNCwyMC43MjQtMjAuNzI0QzYxLjExLDY3LjM3MSw3MC4zODgsNzYuNjUsNzAuMzg4LDg4LjA5NSIvPg0KPHBhdGggZmlsbD0iI0ZBQTIxQiIgZD0iTTU0Ljg1OCw3Ni40OWMwLDIuODY5LTIuMzI1LDUuMTk0LTUuMTkzLDUuMTk0Yy0yLjg2OSwwLTUuMTk1LTIuMzI1LTUuMTk1LTUuMTk0czIuMzI2LTUuMTk0LDUuMTk1LTUuMTk0DQoJQzUyLjUzMyw3MS4yOTYsNTQuODU4LDczLjYyMSw1NC44NTgsNzYuNDkiLz4NCjwvc3ZnPg0K';
// var character = PIXI.Sprite.fromImage(_catchy.config.dataImgPrefixSvg + birdieSvg, false);
// character.scale.x = 2;
// character.scale.y = 2;
// _pixiStage.addChild(character);
//////////////////////////////////////////

// add scene svgs
_pixiStage.addChild(mountain);
_pixiStage.addChild(grass);


// add character svg
var _playerCharacter = new PIXI.DisplayObjectContainer();
_pixiStage.addChild(_playerCharacter);

_playerCharacter.addChild(birdieSvg);
_playerCharacter.addChild(birdieSvgCatch);
birdieSvgCatch.visible = false;

var lastCharacterX = _playerCharacter.position.x;
var characterSpeed = 0;
var startTime = Date.now();
var updateCharacterPosition = function() {
  _playerCharacter.position.x = _percentX.value() * _stageWidth;
  characterSpeed = lastCharacterX - _playerCharacter.position.x;
  _playerCharacter.rotation = -characterSpeed / 100;
  lastCharacterX = _playerCharacter.position.x;

  grass.position.y = _stageHeight - grass.height/2;
  grass.position.x = (_stageWidth / 2) + 100 * (_percentX.value() - 0.5);

  mountain.position.y = _stageHeight - mountain.height/2;
  mountain.position.x = (_stageWidth / 2) + 40 * (_percentX.value() - 0.5);

  // sprite swap for now
  if(Date.now() > startTime + 500) {
    startTime = Date.now();
    if(birdieSvgCatch.visible == false) {
      birdieSvgCatch.visible = true;
      birdieSvg.visible = false;
    } else {
      birdieSvgCatch.visible = false;
      birdieSvg.visible = true;
    }
  }
};


var layoutScene = function() {
    // update character positions
  _playerCharacter.position.y = _stageHeight - birdieSvg.height/2 - grass.height * 0.3;
}

onWindowResize();

function animate() {
  stats.begin();
  requestAnimFrame( animate );

  _percentX.update();
  updateCharacterPosition();

  _pixiRenderer.render(_pixiStage);

  stats.end();
}
requestAnimFrame( animate );



////////////////////////////////////////////////////////////////////////////////////////////
// ACCELEROMETER ///////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////

// add accelerometer event listener and store values as they come in ------------------------------
// for more info: http://www.html5rocks.com/en/tutorials/device/orientation/
var tiltZAxis = 0;
var tiltXAxis = 0;
var compass = 0;
var updateOrientation = function( e ) {
  // store accelerometer values
  tiltZAxis = parseFloat( e.gamma );
  tiltXAxis = parseFloat( e.beta );
  compass = parseFloat( e.alpha );

  if( !isNaN(tiltZAxis) && !isNaN(tiltXAxis) && tiltZAxis != 0 && tiltXAxis != 0 ) {
    _usingAccelerometer = true;
  }
  _percentX.setTarget( -tiltZAxis/50 );
};
window.addEventListener('deviceorientation', updateOrientation, false);

// let the user know if there's no accelerometer data available after 1 second of listening
// (for desktops and non-capable mobile devices).
// This would be a good place to conditionally fall back to touch-based controls
setTimeout(function(){
  if( (isNaN(tiltZAxis) && isNaN(tiltXAxis)) || (tiltZAxis == 0 && tiltXAxis == 0) ) {
    // alert('You don\'t seem to have an accelerometer, which is required for this demo.');
  }
},1000);




////////////////////////////////////////////////////////////////////////////////////////////
// POINTER EVENTS //////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////
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
  var newPercentX = e.clientX / window.innerWidth;
  _percentX.setTarget( newPercentX );

  // Prevent the browser from doing its default thing (scroll, zoom)
  var pointer = pointers[e.pointerId];
  if (pointer) {
    pointer.x = e.clientX;
    pointer.y = e.clientY;

    if(_usingAccelerometer == true) return;
    var newPercentX = e.clientX / window.innerWidth;
    _percentX.setTarget( newPercentX );
  }
} 

function onPointerUp(e) { 
  delete pointers[e.pointerId];
}

// -ms-touch-action: none; /* required to make pointer move event work */
// touch-action: none; /* required to make pointer move event work */
_pixiContainer.addEventListener( 'pointerdown', onPointerDown, false );
_pixiContainer.addEventListener( 'pointermove', onPointerMove, false );
_pixiContainer.addEventListener( 'pointerup', onPointerUp, false );
_pixiContainer.addEventListener( 'pointercancel', onPointerUp, false );


