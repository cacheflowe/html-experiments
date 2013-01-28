
var CanvasPool = Class.create(Class, {
    
    canvases: false,
    num_canvases: 0,
    active_canvases : 0,

    initialize: function ( numCanvases ) {
        this.canvases = [];
        this.num_canvases = numCanvases;

        for (var i = 0, len = this.num_canvases; i < len; i += 1) {
            var new_canvas = document.createElement("canvas");
            this.canvases.push({element: new_canvas, is_active: false});
        }
        debug.addRealtimeProperty( this, 'active_canvases', 'active canvases' )
        
    },

    getFreeCanvas: function () {
        for (var i = 0, len = this.num_canvases; i < len; i += 1) {
            if (this.canvases[i].is_active === false) {
                delete this.canvases[i].element;
                delete this.canvases[i].is_active;
                var new_canvas = document.createElement("canvas");
                this.canvases[i] = {element: new_canvas, is_active: true};
                return this.canvases[i].element;
            }
        }
        return null;
    },

    deactivateCanvas: function (canvas_element) {
        var context = canvas_element.getContext("2d");
        context.clearRect(0, 0, 768, 1004 );//parseInt(canvas_element.width), parseInt(canvas_element.height));
        canvas_element.width = 1;
        canvas_element.height = 1;
        context.clearRect(0, 0, 768, 1004 );//parseInt(canvas_element.width), parseInt(canvas_element.height));
        canvas_element.className = '';
        // remove the two attributes from the canvas object so that the canvas is fresh when it gets pulled out to be reused.
        canvas_element.removeAttribute(CanvasPool.IMAGE_AREA);
        canvas_element.removeAttribute(CanvasPool.IMAGE_SCROLLER);

        this.active_canvases = 0;
        for (var i = 0, len = this.num_canvases; i < len; i += 1) {
            if (canvas_element === this.canvases[i].element) {
                this.canvases[i].is_active = false;
            }
        }        
    },
    
    updateNumActiveCanvii : function() {
        this.active_canvases = 0;
        for (var i = 0, len = this.num_canvases; i < len; i += 1) {
            if (this.canvases[i].is_active === true) {
                this.active_canvases += 1;
            }
        }
    },
  
    replaceImageWithCanvas: function ( imgElement, dataAttribute, callback, index ) {
        // get props from img
        var src = imgElement.readAttribute( dataAttribute );
        
        // create canvas, size it and replace the image element it got its data from
        var canvas = this.getFreeCanvas();
        if( !canvas ) debug.log('ERROR: OUT OF CANVII');
        canvas.width = imgElement.readAttribute('width');
        canvas.height = imgElement.readAttribute('height');
        canvas.className = imgElement.className+"";
        canvas.id = index;
        var attrObj = {};
        attrObj[dataAttribute] = src;
        canvas.writeAttribute( attrObj );
        imgElement.replace(canvas);

        // get canvas context and create image loader
        var context = canvas.getContext("2d");
        // context.clearRect(0, 0, canvas.width, canvas.height);
        var image = new Image();

        // load image, with callback
        image.onload = function () {
//            context.clearRect(0, 0, canvas.width, canvas.height);
            context.drawImage(image, 0, 0);
            delete image.src;
            image.onload = null;
            image = null;
            if( callback ) callback();
        };
        image.onerror = function () {
//            context.clearRect(0, 0, canvas.width, canvas.height);
            delete image.src;
            image.onerror = null;
            image = null;
            if( callback ) callback();
        };
        image.src = src;
    },
    
    replaceCanvasWithImage : function( canvas, dataAttribute ) {
        var imgElement = document.createElement( 'img' );
        imgElement.width = canvas.width;
        imgElement.height = canvas.height;
        imgElement.className = canvas.className+"";
        var attrObj = {};
        attrObj[dataAttribute] = canvas.readAttribute( dataAttribute );
        imgElement.writeAttribute( attrObj );
        this.deactivateCanvas( canvas );
        canvas.replace( imgElement );
    },
    
    replaceImagesInContainer : function( container, dataAttribute, callback ) {
        // make sure we only use elements with the data attribute that we're looking for
        var imgSelector = container.select('img');
        var images = [];
        var i;
        for( i = 0; i < imgSelector.length; i++ ){
            if( imgSelector[i].readAttribute( dataAttribute ) ) {
                images.push( imgSelector[i] );
            }
        }

        // if none found, make callback immediately
        if( images.length == 0 ) {
            if( callback ) callback();
            return;
        }

        // replace correct elements
        var imagesLoaded = 0;
        for( i=0; i < images.length; i++ ) {
            this.replaceImageWithCanvas( images[i], dataAttribute, function(){
                imagesLoaded++;
                if( imagesLoaded == images.length ) {
                    if( callback ) 
                        callback();
                }
            }, i);

        }
        
        // update count for debugging
        this.updateNumActiveCanvii();
    },
    
    replaceCanvasesInContainer : function( container, dataAttribute ) {
        // make sure we only use elements with the data attribute that we're looking for
        var canviiSelector = container.select('canvas');
        var canvii = [];
        var i;
        for( i = 0; i < canviiSelector.length; i++ ){
            if( canviiSelector[i].readAttribute( dataAttribute ) ) {
                canvii.push( canviiSelector[i] );
            }
        }
        
        // replace correct elements
        for( i=0; i < canvii.length; i++ ) {
            this.replaceCanvasWithImage( canvii[i], dataAttribute );
        }
        
        // update count for debugging
        this.updateNumActiveCanvii();
    }
    
});

Object.extend(CanvasPool, {
    IMAGE_AREA : 'data-img-src',
    IMAGE_SCROLLER : 'data-img-scroller'
});
