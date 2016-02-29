var CanvasFilters = CanvasFilters || {};

// desaturate(canvas);
// contrastImage(canvas, 30);
// brightness(canvas, 0.15);
// contrastImage(canvas, 40);
// sharpen(canvas);


// helpers to overwrite canvas that's getting filtered
CanvasFilters.getCanvasImageData = function(canvas) {
  var w = canvas.width;
  var h = canvas.height;
  var ctx = canvas.getContext("2d");
  var imageData = ctx.getImageData(0, 0, w, h);
  return imageData;
};

CanvasFilters.getCanvasContext = function(canvas) {
  return canvas.getContext("2d");
};


// from: https://gist.github.com/doctyper/992342
// Desaturate Usage:
// var ctx = canvas.getContext("2d");
// var data = desaturate(ctx);
// ctx.putImageData(data);

CanvasFilters.desaturate = function (canvas) {
  var imageData = CanvasFilters.getCanvasImageData(canvas);
  var pixels = imageData.data;
  for (var i = 0; i < pixels.length; i += 4) {
    var avg = (pixels[i] + pixels[i +1] + pixels[i +2]) / 3;
    pixels[i]     = avg; // red
    pixels[i + 1] = avg; // green
    pixels[i + 2] = avg; // blue
  }
  CanvasFilters.getCanvasContext(canvas).putImageData(imageData,0,0);
};

CanvasFilters.brightness = function(canvas, adjustment) {
  adjustment *= 255;
  var imageData = CanvasFilters.getCanvasImageData(canvas);
  var pixels = imageData.data;

  for (var i = 0; i < pixels.length; i += 4) {
    pixels[i] += adjustment;
    pixels[i+1] += adjustment;
    pixels[i+2] += adjustment;
  }
  CanvasFilters.getCanvasContext(canvas).putImageData(imageData,0,0);
};


// from: http://stackoverflow.com/questions/10521978/html5-canvas-image-contrast
CanvasFilters.contrastImage = function(canvas, contrast) {
  var imageData = CanvasFilters.getCanvasImageData(canvas);
  var pixels = imageData.data;

  var factor = (259 * (contrast + 255)) / (255 * (259 - contrast));

  for (var i = 0; i < pixels.length; i += 4) {
      pixels[i] = factor * (pixels[i] - 128) + 128;
      pixels[i+1] = factor * (pixels[i+1] - 128) + 128;
      pixels[i+2] = factor * (pixels[i+2] - 128) + 128;
  }
  CanvasFilters.getCanvasContext(canvas).putImageData(imageData,0,0);
}

CanvasFilters.sharpen = function(canvas) {
  filteredPixels = CanvasFilters.convolute(
    CanvasFilters.getCanvasImageData(canvas),
    [ 0, -1,  0,
     -1,  5, -1,
      0, -1,  0],
    false );
  CanvasFilters.getCanvasContext(canvas).putImageData(filteredPixels,0,0);
}

// hue: 0-100
CanvasFilters.hue = function(canvas, adjust) {
  var imageData = CanvasFilters.getCanvasImageData(canvas);
  var pixels = imageData.data;

  for (var i=0; i<pixels.length; i+=4) {
    var hsv = rgbToHSV(pixels[i], pixels[i+1], pixels[i+2]);
    var h = hsv.h * 100;
    h += Math.abs(adjust);
    h = h % 100;
    h /= 100;
    hsv.h = h;

    var ref = hsvToRGB(hsv.h, hsv.s, hsv.v);
    pixels[i] = ref.r;
    pixels[i+1] = ref.g;
    pixels[i+2] = ref.b;
  }
  CanvasFilters.getCanvasContext(canvas).putImageData(imageData,0,0);
};

CanvasFilters.threshold = function(canvas, threshold) {
  var imageData = CanvasFilters.getCanvasImageData(canvas);
  var pixels = imageData.data;

  for (var i=0; i<pixels.length; i+=4) {
    var r = pixels[i];
    var g = pixels[i+1];
    var b = pixels[i+2];
    var v = (0.2126*r + 0.7152*g + 0.0722*b >= threshold) ? 255 : 0;
    pixels[i] = pixels[i+1] = pixels[i+2] = v
  }
  CanvasFilters.getCanvasContext(canvas).putImageData(imageData,0,0);
};



////////////////////////////////
// Canvas convolution filter codes from:
// http://www.html5rocks.com/en/tutorials/canvas/imagefilters/
////////////////////////////////
CanvasFilters.tmpCanvas = document.createElement('canvas');
CanvasFilters.tmpCtx = CanvasFilters.tmpCanvas.getContext('2d');

CanvasFilters.createImageData = function(w,h) {
  return this.tmpCtx.createImageData(w,h);
};

CanvasFilters.convolute = function(pixels, weights, opaque) {
  var side = Math.round(Math.sqrt(weights.length));
  var halfSide = Math.floor(side/2);

  var src = pixels.data;
  var sw = pixels.width;
  var sh = pixels.height;

  var w = sw;
  var h = sh;
  var output = CanvasFilters.createImageData(w, h);
  var dst = output.data;

  var alphaFac = opaque ? 1 : 0;

  for (var y=0; y<h; y++) {
    for (var x=0; x<w; x++) {
      var sy = y;
      var sx = x;
      var dstOff = (y*w+x)*4;
      var r=0, g=0, b=0, a=0;
      for (var cy=0; cy<side; cy++) {
        for (var cx=0; cx<side; cx++) {
          var scy = Math.min(sh-1, Math.max(0, sy + cy - halfSide));
          var scx = Math.min(sw-1, Math.max(0, sx + cx - halfSide));
          var srcOff = (scy*sw+scx)*4;
          var wt = weights[cy*side+cx];
          r += src[srcOff] * wt;
          g += src[srcOff+1] * wt;
          b += src[srcOff+2] * wt;
          a += src[srcOff+3] * wt;
        }
      }
      dst[dstOff] = r;
      dst[dstOff+1] = g;
      dst[dstOff+2] = b;
      dst[dstOff+3] = a + alphaFac*(255-a);
    }
  }
  return output;
};


////////////////////////////////
// Color space tranlastion
////////////////////////////////

var rgbToHSV = function(r, g, b) {
  var d, max, min, s, v;
  r /= 255;
  g /= 255;
  b /= 255;
  max = Math.max(r, g, b);
  min = Math.min(r, g, b);
  v = max;
  d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) {
    h = 0;
  } else {
    h = (function() {
      switch (max) {
        case r:
          return (g - b) / d + (g < b ? 6 : 0);
        case g:
          return (b - r) / d + 2;
        case b:
          return (r - g) / d + 4;
      }
    })();
    h /= 6;
  }
  return {
    h: h,
    s: s,
    v: v
  };
};

var hsvToRGB = function(h, s, v) {
  var f, i, p, q, t;
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0:
      r = v;
      g = t;
      b = p;
      break;
    case 1:
      r = q;
      g = v;
      b = p;
      break;
    case 2:
      r = p;
      g = v;
      b = t;
      break;
    case 3:
      r = p;
      g = q;
      b = v;
      break;
    case 4:
      r = t;
      g = p;
      b = v;
      break;
    case 5:
      r = v;
      g = p;
      b = q;
  }
  return {
    r: Math.floor(r * 255),
    g: Math.floor(g * 255),
    b: Math.floor(b * 255)
  };
};
