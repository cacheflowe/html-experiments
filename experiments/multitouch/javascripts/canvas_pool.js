
var CanvasPool = Class.create(Class, {
  canvases: false,
  num_canvases: 0,
  
  initialize: function ( numCanvases ) {
    this.canvases = [];
    this.num_canvases = numCanvases;
    
    for (var i = 0, len = this.num_canvases; i < len; i += 1) {
      var new_canvas = document.createElement("canvas");
      this.canvases.push({element: new_canvas, is_active: false});
    }
  },
  
  getFreeCanvas: function () {
    for (var i = 0, len = this.num_canvases; i < len; i += 1) {
      if (this.canvases[i].is_active === false) {
        this.canvases[i].is_active = true;
        return this.canvases[i].element;
      }
    }
    return null;
  },
  
  deactivateCanvas: function (canvas_element) {
    var context = canvas_element.getContext("2d");
    context.clearRect(0, 0, canvas_element.width, canvas_element.height);
    canvas_element.width = 0;
    canvas_element.height = 0;
    delete canvas_element.className;
    
    var activeCanvases = 0;
    for (var i = 0, len = this.num_canvases; i < len; i += 1) {
      if (canvas_element === this.canvases[i].element) {
        this.canvases[i].is_active = false;
      }
      if (this.canvases[i].is_active === true) {
        activeCanvases += 1;
      }
    }
  }
});
