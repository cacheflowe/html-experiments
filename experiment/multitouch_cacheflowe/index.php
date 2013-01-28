<!DOCTYPE html>
<html>
  <head>
    <meta http-equiv="Content-type" content="text/html; charset=utf-8"/>
    <meta name="viewport" content="initial-scale=1.0; maximum-scale=1.0; user-scalable=0;"/>
    <meta name="apple-touch-fullscreen" content="YES" />
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-capable" content="yes"/>
    
    <title>CacheFlowe Multitouch</title>

    <?php if( isset( $_REQUEST['dev'] ) ) { ?>
    <script type="text/javascript" src="javascripts/lib/prototype.js"></script>
    <script type="text/javascript" src="javascripts/lib/effects.js"></script>
    <?php } else { ?>
    <script type="text/javascript" src="javascripts/min/lib-min.js"></script>
    <?php } ?>
    <?php if( isset( $_REQUEST['dev'] ) ) { ?>
    <script type="text/javascript" src="javascripts/multitouch.js"></script>
    <script type="text/javascript" src="javascripts/app_init.js"></script>
    <?php } else { ?>
    <script type="text/javascript" src="javascripts/min/app-min.js"></script>
    <?php } ?>
    <?php if( isset( $_REQUEST['dev'] ) ) { ?>
    <link rel="stylesheet" href="stylesheets/interface.css" type="text/css" media="all" title="interface" />    
    <?php } else { ?>
    <link rel="stylesheet" href="stylesheets/interface-min.css" type="text/css" media="all" title="interface" />    
    <?php } ?>
  </head>
  <body>
    <div id="page_container">
        <div id="obj1" class="obj"></div>
        <div id="obj2" class="obj"></div>
        <div id="obj3" class="obj"></div>
        <div id="obj4" class="obj"></div>
        <div id="obj5" class="obj"></div>
        <div id="obj6" class="obj"></div>
        <div id="obj7" class="obj"></div>
        <div id="obj8" class="obj"></div>
        <div id="obj9" class="obj"></div>
        <div id="obj10" class="obj"></div>
    </div>
  </body>
</html>


