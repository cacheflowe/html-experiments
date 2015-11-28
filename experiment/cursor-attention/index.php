<?php ob_start(); ?>
<html>
  <head>
    <?php include('../../php/head.php'); writeHead('Cursor Attention', 'Cursor Attention', 'http://cacheflowe.com/code/web/experiment/cursor-attention/preview.gif'); ?>

    <style>
      html, body, .container {
        width: 100%;
        height: 100%;
      }
      .circle {
        transition: all 0.4s cubic-bezier(0.455, 0.030, 0.515, 0.955);
        position: absolute;
        top: 50%;
        left: 50%;
        width: 50px;
        height: 50px;
        margin-top: -25px;
        margin-left: -25px;
        border-radius: 25px;
        background-color: #000;
      }
    </style>
  </head>
  <body>
    <header>
  		<h1>Cursor Attention</h1>
  	</header>
    <div class="container">
      <div class="circle"></div>
    </div>
    <script src="../../javascripts/modeset/pointer-pos.js"></script>
    <script>
      var getRadiansToTarget = function( x1, y1, x2, y2 ) {
        return ((Math.PI*2) + (Math.PI/2) + Math.atan2( x1 - x2, y1 - y2 )) % (Math.PI*2); // hideous normalization. fix this.
      };

      var cursors = ['w-resize', 'sw-resize', 's-resize', 'se-resize', 'e-resize', 'ne-resize', 'n-resize', 'nw-resize'];

      var pointAtEl = function(el) {
        // calculate radians relative to element's center and map rotation to the cursor index: https://en.wikipedia.org/wiki/Radian
        var elRect = el.getBoundingClientRect();
        var mouseRadians = getRadiansToTarget(elRect.left + elRect.width / 2, elRect.top + elRect.height / 2, window.pointerPos.x(), window.pointerPos.y());

        var fortyFive = Math.PI / 4;
        var fortyFiveHalf = fortyFive / 2;

        var cursorIndex = 0;
        var curRadians = fortyFiveHalf;
        while(mouseRadians > curRadians) {
          cursorIndex++;
          curRadians += fortyFive;
        }
        document.body.setAttribute('style', 'cursor: ' + cursors[cursorIndex % cursors.length]);
      };

      var circleEl = document.querySelector('.circle');
      var frameCount = 1;

      var animate = function() {
        requestAnimationFrame(animate);
        if(frameCount++ % 120 == 0) circleEl.setAttribute('style', 'top: '+ (20 + Math.random() * 60) +'%; left: '+ (20 + Math.random() * 60) +'%');
        pointAtEl(circleEl);
      };
      requestAnimationFrame(animate);
    </script>
  </body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
