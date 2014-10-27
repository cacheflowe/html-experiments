_catchy.SpriteBuilder = function() {

  var _twoCanvas;

  var init = function() {
    // init Two for svg import
    Two.Resolution = 24;
    _twoCanvas = new Two({
      width: 400,
      height: 400,
      type: Two.Types.canvas
    });
  };

  var getScaledImageFromSVG = function(container, elemId, scale, loadedCallback) {
    _twoCanvas.clear();

    // import svg from DOM, scale up, fit canvas to svg and render!
    var shape = _twoCanvas.interpret(document.getElementById(elemId));
    shape.scale = scale;
    var charH = Math.ceil(shape.getBoundingClientRect().height);
    var charW = Math.ceil(shape.getBoundingClientRect().width);
    _twoCanvas.width = charW;
    _twoCanvas.height = charH;
    _twoCanvas.update();

    // grab two canvas contents
    div = newSpriteContainer(container);
    img = document.createElement('img')
    img.src = _twoCanvas.renderer.domElement.toDataURL();
    div.appendChild(img);
    return new _catchy.Sprite(div, img, loadedCallback);
  };

  var newSpriteContainer = function(container) {
    var div = document.createElement('div');
    div.className = 'sprite';
    container.appendChild(div);
    return div;
  }

  var cleanUpSvgSource = function() {
    var svgLib = document.getElementById('svg-lib');
    svgLib.parentNode.removeChild(svgLib);
  };

  init();
  return {
    getScaledImageFromSVG: getScaledImageFromSVG,
    cleanUpSvgSource: cleanUpSvgSource,
    newSpriteContainer: newSpriteContainer
  };
};



