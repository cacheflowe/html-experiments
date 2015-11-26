<?php ob_start(); ?>
<html>
  <head>
    <?php include('../../php/head.php'); writeHead('Grid Nav Zoom', 'Grid Nav Zoom', null); ?>
    <?php include('./index.css'); ?>
  </head>
  <body>
    <?php include('./layout.html'); ?>
    <script>
      <?php include('../../javascripts/modeset/pointer-pos.js'); ?>
      <?php include('./index.js'); ?>
    </script>
  </body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
