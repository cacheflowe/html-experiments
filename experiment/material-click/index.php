<?php ob_start(); ?>
<html>
  <head>
    <?php include('../../php/head.php'); writeHead('Material Click', 'Material Click', null); ?>

    <style>
      .row {
        margin-bottom: 40px;
      }
      .columns {
        background-color: #333;
        padding: 100px 0;

      }
      .overlay-rect {
        position: absolute;
        overflow: hidden;
        transition: opacity 0.15s linear 0.15s;
        opacity: 1;
        pointer-events: none;
      }
      .overlay-rect.away {
        opacity: 0;
      }
      .click-target {
        position: absolute;
        transition: transform 0.3s linear, background-color 0.3s linear;
        width: 30px;
        height: 30px;
        border-radius: 15px;
        margin-left: -15px;
        margin-top: -15px;
        background-color: rgba(255, 255, 255, 0.4);
        transform: scale(1);
      }
      .click-target.away {
        background-color: rgba(255, 255, 255, 0.2);
        transform: scale(20);
      }

    </style>
  </head>
  <body>
    <header>
  		<h1>Material Click</h1>
  	</header>
    <div class="container">
      <div class="row">
        <div class="four columns"></div>
        <div class="four columns"></div>
        <div class="four columns"></div>
      </div>
      <div class="row">
        <div class="four columns"></div>
        <div class="four columns"></div>
        <div class="four columns"></div>
      </div>

    </div>
    <script src="../../javascripts/modeset/pointer-pos.js"></script>
    <script>
      var closest = function(element, selector) {
        selector = selector.toLowerCase();
        var className = (selector.split('.').length > 1) ? selector.split('.')[1] : '';
        selector = selector.split('.')[0];
        while (true) {
          if (element.nodeName.toLowerCase() === selector && element.className.indexOf(className) != -1) {
            return element;
          }
          if (!(element = element.parentNode)) {
            break;
          }
        }
        return null;
      };

      var coverElWithEl = function(elToCover) {
        var elRect = elToCover.getBoundingClientRect();
        var newEl = document.createElement('div');
        newEl.className = 'overlay-rect';
        var positionStyle = '';
        positionStyle += 'top:' + Math.round(elRect.top + window.scrollY) + 'px; ';
        positionStyle += 'left:' + Math.round(elRect.left) + 'px; ';
        positionStyle += 'width:' + Math.round(elRect.width) + 'px; ';
        positionStyle += 'height:' + Math.round(elRect.height) + 'px; ';
        newEl.setAttribute('style', positionStyle);
        document.body.appendChild(newEl);
        return newEl;
      }

      var showClickInEl = function(elClickHolder) {
        var newEl = document.createElement('div');
        newEl.className = 'click-target';
        var positionStyle = '';
        positionStyle += 'top:' + pointerPos.y(elClickHolder) + 'px; ';
        positionStyle += 'left:' + pointerPos.x(elClickHolder) + 'px; ';
        newEl.setAttribute('style', positionStyle);
        elClickHolder.appendChild(newEl);

        setTimeout(function(){
          newEl.classList.add('away');
        }, 40);
      }

      document.querySelector('.container').addEventListener('click', function(e) {
        var gridEl = closest(e.target, 'div.four');
        if(gridEl) {
          var overlayEl = coverElWithEl(gridEl);
          setTimeout(function(){
            overlayEl.classList.add('away');
            showClickInEl(overlayEl);
          }, 10);
          setTimeout(function(){
            overlayEl.parentNode.removeChild(overlayEl);
          }, 650);
        }
      });
    </script>
  </body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
