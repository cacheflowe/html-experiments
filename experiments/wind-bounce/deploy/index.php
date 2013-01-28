<!doctype html>
<!--[if lt IE 7 ]> <html lang="en" class="no-js ie6"> <![endif]-->
<!--[if IE 7 ]>    <html lang="en" class="no-js ie7"> <![endif]-->
<!--[if IE 8 ]>    <html lang="en" class="no-js ie8"> <![endif]-->
<!--[if IE 9 ]>    <html lang="en" class="no-js ie9"> <![endif]-->
<!--[if (gt IE 9)|!(IE)]><!--> <html lang="en" class="no-js"> <!--<![endif]-->
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1">
    <?php if( $isAjaxCrawler == false ) { ?>
    <meta name="fragment" content="!">
    <?php } ?>
    <title>WindBounce</title>
    <meta name="description" content="HTML Experiment">
    <meta name="author" content="Justin Gitlin">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=0">
    <meta name="apple-touch-fullscreen" content="YES" />
    <!-- <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-capable" content="yes"/> -->
    <link rel="apple-touch-icon" href="./apple-touch-icon.png">
    <?php if( isset( $_REQUEST['dev'] ) ) { ?>
    <link rel="stylesheet" type="text/css" href="stylesheets/reset.css" />
    <link rel="stylesheet" type="text/css" href="stylesheets/application.css" />
    <?php } else { ?>
    <link rel="stylesheet" href="stylesheets/interface-min.css" type="text/css" media="all" title="interface" />    
    <?php } ?>
  </head>
  <body>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/1.5.0/jquery.min.js"></script>
    <script>!window.jQuery && document.write(unescape('%3Cscript src="javascripts/lib/jquery-1.5.min.js"%3E%3C/script%3E'))</script>
    <?php if( isset( $_REQUEST['dev'] ) ) { ?>
    <script src="javascripts/fyeah/util/platform_helper.js" type="text/javascript" charset="utf-8"></script>
    <script src="javascripts/fyeah/touch/touch_tracker.js" type="text/javascript" charset="utf-8"></script>
    <script src="javascripts/fyeah/touch/button_touch_callback.js" type="text/javascript" charset="utf-8"></script>
    <script src="javascripts/fyeah/util/color_util.js" type="text/javascript" charset="utf-8"></script>
    <script src="javascripts/fyeah/util/math_util.js" type="text/javascript" charset="utf-8"></script>
    <?php } else { ?>
    <script src="javascripts/min/lib-min.js" type="text/javascript"></script>
    <?php }
    if( isset( $_REQUEST['dev'] ) ) { ?>
    <script src="javascripts/app.js" type="text/javascript"></script>
    <?php } else { ?>
    <script src="javascripts/min/app-min.js" type="text/javascript"></script>
    <?php } ?>
  </body>
</html>


