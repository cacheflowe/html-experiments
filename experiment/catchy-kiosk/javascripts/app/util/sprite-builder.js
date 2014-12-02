_catchy.SpriteBuilder = function() {

  var _twoCanvas,
      _cssHelper;

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
    var retinaScale = 1;
    if(window.devicePixelRatio > 1) retinaScale = window.devicePixelRatio;
    shape.scale = scale / retinaScale;
    var charH = Math.ceil(shape.getBoundingClientRect().height);
    var charW = Math.ceil(shape.getBoundingClientRect().width);
    _twoCanvas.width = charW;
    _twoCanvas.height = charH;
    _twoCanvas.update();

    // grab two canvas contents
    div = newSpriteContainer(container);
    img = document.createElement('img');
    img.src = _twoCanvas.renderer.domElement.toDataURL();
    div.appendChild(img);
    return new _catchy.Sprite(div, img, null, null, loadedCallback);
  };

  var getScaledSvgFromSvg = function(container, elemId, scale, loadedCallback) {
    var srcSvg = document.getElementById(elemId);
    var newSvg = srcSvg.cloneNode(true);
    newSvg.innerHTML = srcSvg.innerHTML;
    var width = srcSvg.getBoundingClientRect().width;
    var height = srcSvg.getBoundingClientRect().height;

    div = newSpriteContainer(container);
    div.appendChild(newSvg);

    var newSprite = new _catchy.Sprite(div, null, newSvg, null, loadedCallback);
    newSprite.setOriginalSize(width, height);
    newSprite.setScale(scale);

    return newSprite;
  };


  var getTextField = function(container, scale, initialText) {
    div = newSpriteContainer(container);

    divText = newSpriteContainer(div);
    divText.classList.add('sprite-text');

    var newSprite = new _catchy.Sprite(div, null, null, divText);
    newSprite.setScale(scale);
    newSprite.setText(initialText);

    return newSprite;
  };


  var newSpriteContainer = function(container) {
    var div = document.createElement('div');
    div.className = 'sprite';
    container.appendChild(div);
    return div;
  }

  init();
  return {
    getScaledImageFromSVG: getScaledImageFromSVG,
    getScaledSvgFromSvg: getScaledSvgFromSvg,
    newSpriteContainer: newSpriteContainer,
    getTextField: getTextField
  };
};



