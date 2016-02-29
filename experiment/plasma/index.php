<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('Plasma', 'Plasma pixels on canvas', 'http://cacheflowe.com/code/html/experiment/plasma/preview.gif'); ?>
</head>

<body>
	<header>
		<h1>Plasma</h1>
	</header>

	<script>
			/* MATH FUNCTIONS ------------------------------ */

			function MathUtil() {}

			MathUtil.getDistance = function ( a, b ) {
					return Math.abs( Math.sqrt(a*a + b*b) );
			};

			MathUtil.randRangeDecimel = function ( min, max ) {
					return Math.random() * ( max - min ) + min;
			};

			/* GRID CELL CLASS ------------------------------ */

			var Cell = function( x, y, w, h ) {
					this.x = x;
					this.y = y;
					this.w = w;
					this.h = h;
			}

			Cell.prototype.update = function( r, g, b ) {
					this.r = r;
					this.g = g;
					this.b = b;

					this.draw();
			};

			Cell.prototype.draw = function() {
					if( !plasma ) return;

					// get color, based on distance
					var ctrlPt1 = MathUtil.getDistance( this.x - plasma.controlPoints[0].x, this.y - plasma.controlPoints[0].y );
					var ctrlPt2 = MathUtil.getDistance( this.x - plasma.controlPoints[1].x, this.y - plasma.controlPoints[1].y );
					var ctrlPt3 = MathUtil.getDistance( this.x - plasma.controlPoints[2].x, this.y - plasma.controlPoints[2].y );

					var distDiv = 250;
					var rVal = .5+.5*Math.sin(this.r) * Math.cos(ctrlPt1/distDiv) * Math.cos(ctrlPt2/distDiv) * Math.sin(ctrlPt3/distDiv);
					var gVal = .2+.5*Math.sin(this.g) * Math.sin(ctrlPt1/distDiv) * Math.sin(ctrlPt2/distDiv) * Math.sin(ctrlPt3/distDiv);
					var bVal = .2+.5*Math.cos(this.b) * Math.sin(ctrlPt1/distDiv) * Math.cos(ctrlPt2/distDiv) * Math.sin(ctrlPt3/distDiv)

					// draw pixel to canvas
					plasma.context.fillStyle = "rgb("+ Math.round( 127 + rVal * 255 ) +","+ Math.round( 127 + gVal * 255 ) +","+ Math.round( 127 + bVal * 255 ) +")";
					plasma.context.fillRect ( this.x, this.y, this.w, this.h );
			};


			/* CONTROL POINT CLASS ------------------------------ */

			var ControlPoint = function( canvasW, canvasH ) {
					// create random x,y starting point
					this.incX = MathUtil.randRangeDecimel( 0, 2 * Math.PI );
					this.incY = MathUtil.randRangeDecimel( 0, 2 * Math.PI );
					// create random x,y oscillating speed
					this.incXSpeed = MathUtil.randRangeDecimel( .001, .01 );
					this.incYSpeed = MathUtil.randRangeDecimel( .001, .01 );
					// store center point to oscillate around
					this.centerX = canvasW / 2;
					this.centerY = canvasH / 2;
			}

			ControlPoint.prototype.update = function() {
					// increment oscillating based on randomly-calculated speed
					this.incX += this.incXSpeed;
					this.incY += this.incYSpeed;
					// update coordinate
					this.x = this.centerX + this.centerX * Math.sin( this.incX );
					this.y = this.centerY + this.centerY * Math.sin( this.incY );
			};


			/* PLASMA CLASS ------------------------------ */

			var Plasma = function() {
					var size = 30;
					this.COLS = Math.ceil(window.innerWidth / size);
					this.ROWS =  Math.ceil(window.innerHeight / size);
					this.CANVAS_W = window.innerWidth;
					this.CANVAS_H = window.innerHeight;
					this.FPS = 1000/30;
					this.NUM_CONTROL_POINTS = 3;

					this.startR = MathUtil.randRangeDecimel(0,2*Math.PI);
					this.startG = MathUtil.randRangeDecimel(0,2*Math.PI);
					this.startB = MathUtil.randRangeDecimel(0,2*Math.PI);
					this.startIncR = MathUtil.randRangeDecimel(.001,.05);
					this.startIncG = MathUtil.randRangeDecimel(.001,.05);
					this.startIncB = MathUtil.randRangeDecimel(.001,.05);
					this.incR = MathUtil.randRangeDecimel(.0001,.001);
					this.incG = MathUtil.randRangeDecimel(.0001,.001);
					this.incB = MathUtil.randRangeDecimel(.0001,.001);

					this.canvas;
					this.context;
					this.grid;

					this.buildStage();
					this.createGrid();
					this.createControlPoints();
					this.addSaveFunctionality();

					var self = this;
					requestAnimationFrame(function(){ self.update(); });
			};

			Plasma.prototype.buildStage = function() {
					// create and attach canvas element
					this.canvas = document.createElement('canvas');
					this.canvas.width = this.CANVAS_W;
					this.canvas.height = this.CANVAS_H;
					this.canvas.className = 'full-width';
					document.body.appendChild( this.canvas );

					// store graphical context
					this.context = this.canvas.getContext("2d");
			};

			Plasma.prototype.createGrid = function() {
					// calculate "pixel" size
					var boxW = this.CANVAS_W / this.COLS;
					var boxH = this.CANVAS_H / this.ROWS;

					// create 2D array of grid cells
					this.grid = new Array( this.COLS );
					for( var i = 0; i < this.COLS; i++ ) {
							this.grid[ i ] = new Array( this.ROWS )
							for( var j = 0; j < this.ROWS; j++ ) {
									this.grid[ i ][ j ] = new Cell( i * boxW, j * boxH, boxW, boxH );
							}
					}
			};

			Plasma.prototype.createControlPoints = function() {
					this.controlPoints = [];
					for ( var i = 0; i < this.NUM_CONTROL_POINTS; i++ ) {
							this.controlPoints.push( new ControlPoint( this.CANVAS_W, this.CANVAS_H ) );
					}
			};

			Plasma.prototype.addSaveFunctionality = function() {
					var self = this;
					this.canvas.addEventListener("click", function(e) {
							window.open( self.canvas.toDataURL("image/jpeg") );
					}, false);
			};

			Plasma.prototype.update = function() {
					var self = this;
					requestAnimationFrame(function(){ self.update(); });

					// increment the starting colors
					this.startR += this.startIncR;
					var curR = this.startR;
					this.startG += this.startIncG;
					var curG = this.startG;
					this.startB += this.startIncB;
					var curB = this.startB;

					// update control points
					for ( var i = 0; i < this.NUM_CONTROL_POINTS; i++ ) {
							this.controlPoints[i].update();
					}

					// increment grid cells and draw to canvas
					for (var i = 0; i < this.COLS; i++) {
							for (var j = 0; j < this.ROWS; j++) {
									// send new base color to cells
									this.grid[i][j].update( curR, curG, curB );

									// increment color as we traverse the grid
									curR += this.incR;
									curG += this.incG * 3;
									curB += this.incB;
							}
					}
			};


			// kick off the plasma controller
			var plasma = new Plasma();

			window.addEventListener('resize', function() {
				canvas.width = window.innerWidth;
				canvas.height = window.innerHeight;
			}, false);
	</script>
</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
