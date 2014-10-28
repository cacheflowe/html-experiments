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

// TODO: remove this before launch
var alertErrors = (function() {
  if( !window.addEventListener ) return;
  window.addEventListener('error',function(e){
    var fileComponents = e.filename.split('/');
    var file = fileComponents[fileComponents.length-1];
    var line = e.lineno;
    var message = e.message;
    alert('ERROR\n'+'Line '+line+' in '+file+'\n'+message);
  });
})();
