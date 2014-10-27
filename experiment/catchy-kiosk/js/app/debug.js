_catchy.debug = {};

_catchy.debug.init = function() {
  window.stats = new Stats();
  window.stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  window.stats.domElement.style.position = 'absolute';
  window.stats.domElement.style.left = '0px';
  window.stats.domElement.style.top = '0px';

  document.body.appendChild(window.stats.domElement);
};
