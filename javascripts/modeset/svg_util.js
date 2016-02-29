var SVGUtil = SVGUtil || {};

SVGUtil.clearColor = 'rgba(0,0,0,0)';

SVGUtil.dataImgPrefix = 'data:image/svg+xml;base64,';

SVGUtil.renderSVG = function(renderedEl, renderedCallback, jpgQuality) {
  // WARNING! Inline <image> tags must have a base64-encoded image as their source. Linked image files will not work.
  // transform svg into base64 image
  var s = new XMLSerializer().serializeToString(renderedEl);
  var uri = 'data:image/svg+xml;base64,' + window.btoa(s);

  // load svg image into canvas
  var image = new Image();
  image.onload = function() {
    var canvas = document.createElement('canvas');
    canvas.width = image.width;
    canvas.height = image.height;
    var context = canvas.getContext('2d');
    context.drawImage(image, 0, 0);
    if(jpgQuality > 0.2) {
      var jpg = canvas.toDataURL('image/jpeg', jpgQuality);
      renderedCallback(jpg);
    } else {
      var png = canvas.toDataURL('image/png');
      renderedCallback(png);
    }
  }
  image.src = uri;
};


SVGUtil.setBase64ImageOnSvgImage = function(el, base64Img) {
  el.removeAttributeNS("http://www.w3.org/1999/xlink", "href");
  el.setAttributeNS("http://www.w3.org/1999/xlink", "href", base64Img);
};
