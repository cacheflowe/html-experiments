var CanvasUtil = CanvasUtil || {};

CanvasUtil.clearColor = 'rgba(0,0,0,0)';

CanvasUtil.dataImgPrefix = 'data:image/png;base64,';

/**
 *  Lets a developer know if the canvas element is supported.
 *  @return A boolean indicating canvas support.
 *  @use    {@code CanvasUtil.hasCanvas();}
 */
CanvasUtil.hasCanvas = function() {
  return (!document.createElement('canvas').getContext) ? false : true;
};

/**
 *  Converts a hex color value to canvas-friendly rgba. Original code from Robin W. Spencer (http://scaledinnovation.com).
 *  @return An rgba color string.
 *  @use    {@code CanvasUtil.hexToCanvasColor('#00ff00', 0.5);}
 */
CanvasUtil.hexToCanvasColor = function( hexColor, opacity ) {
  opacity = ( opacity != null ) ? opacity : "1.0";
  hexColor = hexColor.replace( "#", "" );
  var r = parseInt( hexColor.substring( 0, 2 ), 16 );
  var g = parseInt( hexColor.substring( 2, 4 ), 16 );
  var b = parseInt( hexColor.substring( 4, 6 ), 16 );
  return "rgba("+r+","+g+","+b+","+opacity+")";
};

/**
 *  Converts r, g, b, a values to a css-friendly hexadecimel string.
 *  @return An rgb color string.
 *  @use    {@code CanvasUtil.rgb2hex(0, 255, 0);}
 */
CanvasUtil.rgb2hex = function(r,g,b) {
  return "#" + Number(0x1000000 + r*0x10000 + g*0x100 + b).toString(16).substring(1);
};

/**
 *  Converts r, g, b, a values to a THREE/PIXI-friendly hexadecimel number.
 *  @return An rgb color string.
 *  @use    {@code CanvasUtil.rgb2hexNum(0, 255, 0);}
 */
CanvasUtil.rgb2hexNum = function(r,g,b) {
  return Number("0x"+ Number(0x1000000 + r*0x10000 + g*0x100 + b).toString(16).substring(1));
};

/**
 *  Converts r, g, b, a values to canvas-friendly rgba string.
 *  @return An rgba color string.
 *  @use    {@code CanvasUtil.rgbToCanvasColor(0, 0, 0, 0.5);}
 */
CanvasUtil.rgbToCanvasColor = function( r, g, b, opacity ) {
  return "rgba("+r+","+g+","+b+","+opacity+")";
};

/**
 *  Converts r, g, b, to a brightness between 0-1.
 *  @return A brightness percentage.
 *  @use    {@code CanvasUtil.rgbToBrightness(0, 255, 0);}
 */
CanvasUtil.rgbToBrightness = function( r, g, b ) {
  return (r + g + b) / 768; // 768 is r,g,b: 256*3
};

/**
 *  Returns the percent difference between 2 colors.
 *  @return A difference percentage.
 *  @use    {@code CanvasUtil.rgbDifference(0, 0, 0, 255, 255, 255);}
 */
CanvasUtil.rgbDifference = function( r1, g1, b1, r2, g2, b2 ) {
  return Math.abs((r1 + g1 + b1) - (r2 + g2 + b2)) / 765;
};

/**
 *  Converts a hex color value to a darker or lighter version. Original code from from: http://www.sitepoint.com/javascript-generate-lighter-darker-color/
 *  @return A hex color string.
 *  @use    {@code CanvasUtil.colorLuminance('00ff00', 0.5);}
 */
CanvasUtil.colorLuminance = function(hex, lum) {
  // validate hex string
  hex = hex.replace( "#", "" );
  hex = String(hex).replace(/[^0-9a-f]/gi, '');
  if (hex.length < 6) {
    hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
  }
  lum = lum || 0;

  // convert to decimal and change luminosity
  var rgb = "#", c, i;
  for (i = 0; i < 3; i++) {
    c = parseInt(hex.substr(i*2,2), 16);
    c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
    rgb += ("00"+c).substr(c.length);
  }

  return rgb;
};

/**
 *  Draws a filled circle. Original code from Robin W. Spencer (http://scaledinnovation.com).
 *  @use    {@code CanvasUtil.drawCircle( context, 50, 50, 40 );}
 */
CanvasUtil.drawCircle = function( ctx, x, y, radius, extraSetup ) {
  ctx.save();
  if( extraSetup ) extraSetup( ctx );
  ctx.beginPath();
  ctx.arc( x, y, radius, 0.0, 2 * Math.PI, false );
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};

/**
 *  Draws an arc - a portion of a circle.
 *  @use    {@code CanvasUtil.drawArc(context, 50, 50, 40, 90, 180);}
 */
CanvasUtil.drawArc = function( ctx, x, y, radius, startAngle, endAngle ) {
  ctx.save();
  ctx.beginPath();
  ctx.arc( x, y, radius, (Math.PI / 180) * (startAngle - 90), (Math.PI / 180) * (endAngle - 90), false );
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
  ctx.restore();
};


CanvasUtil.getPixelColorFromContext = function( context, x, y ) {
  var pixelData = context.getImageData( x, y, 1, 1 ).data;
  return [pixelData[0], pixelData[1], pixelData[2]];
};

CanvasUtil.pixelColorToCanvasColor = function( context, x, y ) {
  var color = CanvasUtil.getPixelColorFromContext( context, x, y );
  return CanvasUtil.rgbToCanvasColor( color[0], color[1], color[2], 1 );
};

CanvasUtil.loadImageToCanvas = function( imagePath, callback ) {
    var image = new Image();
    image.crossOrigin = 'anonymous';
    image.onload = function() {
        var canvas = document.createElement("canvas");
        canvas.width = image.width;
        canvas.height = image.height;
        var context = canvas.getContext("2d");
        context.drawImage( image, 0, 0 );
        callback( canvas, image );
    };
    image.src = imagePath;
};

// useful for grabbing an image and caching it as a pixel source
CanvasUtil.loadImageToContext = function( imagePath, callback ) {
    var image = new Image();
    image.onload = function() {
        var canvasSource = document.createElement("canvas");
        canvasSource.width = image.width;
        canvasSource.height = image.height;
        var context = canvasSource.getContext("2d");
        context.drawImage( image, 0, 0 );
        callback( context, image );
    };
    image.src = imagePath;
};

CanvasUtil.loadImageToContextFromInput = function( inputEl, callback ) {
  inputEl.addEventListener('change', function(e){
    callback( inputEl.files ); 
    e.stopPropagation();  
    e.preventDefault();   
  });
};

CanvasUtil.loadImageToContextFromDrop = function( dropEl, callback ) {
  dropEl.addEventListener('dragenter', function(e){
    e.stopPropagation();  
    e.preventDefault();  
    dropEl.classList.add('drop-over'); 
  });
  dropEl.addEventListener('dragover', function(e){
    e.stopPropagation();  
    e.preventDefault();  
  });
  dropEl.addEventListener('dragleave', function(e){
    e.stopPropagation();  
    e.preventDefault();  
    dropEl.classList.remove('drop-over'); 
  });
  dropEl.addEventListener('drop', function(e){
    e.stopPropagation();  
    e.preventDefault();   
    callback( e.target.files || e.dataTransfer.files ); 
    dropEl.classList.remove('drop-over'); 
  }, false);
};

CanvasUtil.imagesSelected = function( myFiles, callback ) {
  for (var i = 0, f; f = myFiles[i]; i++) {
    var imageReader = new FileReader();
    // onload callback when file loads
    imageReader.onload = (function(aFile) {
      return function(e) {
        var span = document.createElement('span');
        var image = document.createElement('img');
        image.src = e.target.result;  // base64 image string
        image.alt = aFile.name;       // file name
        // document.getElementById('drop').insertBefore(image, null);
        setTimeout(function(){
          var canvasSource = document.createElement("canvas");
          canvasSource.width = image.width;
          canvasSource.height = image.height;
          var context = canvasSource.getContext("2d");
          context.drawImage( image, 0, 0 );
          callback( context, image );
        },300);
      };
    })(f);
    imageReader.readAsDataURL(f); // load/read the file
  }
}



CanvasUtil.copyPixels = function( source, destination, sourceX, sourceY, sourceW, sourceH, destX, destY, destW, destH ) {
    sourceX = sourceX || 0;
    sourceY = sourceY || 0;
    sourceW = sourceW || source.canvas.width;
    sourceH = sourceH || source.canvas.height;
    destX = destX || 0;
    destY = destY || 0;
    destW = destW || source.canvas.width;
    destH = destH || source.canvas.height;
    destination.putImageData( source.getImageData( sourceX, sourceY, sourceW, sourceH ), destX, destY, destX, destY, destW, destH );
};

// canvas saving
CanvasUtil.saveCanvas = function( ctx ){
  // set canvasImg image src to dataURL
  // so it can be saved as an image
  var saveImg = document.createElement('img');
  saveImg.id = 'save';
  document.body.appendChild(saveImg);
  document.getElementById("save").src = ctx.canvas.toDataURL();
  document.getElementById("save").width = ctx.canvas.width/4;
  document.getElementById("save").height = ctx.canvas.height/4;
  document.getElementById("save").id = '';
};
