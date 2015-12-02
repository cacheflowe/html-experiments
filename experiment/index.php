<html>
<head>
  <title>CacheFlowe | CacheFlowe's HTML Experiments</title>
  <meta charset="utf-8">
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible" />
  <meta content="no" name="imagetoolbar" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="keywords" content="CacheFlowe's HTML Experiments" />
  <meta name="description" content="CacheFlowe's HTML Experiments" />
  <meta name="author" content="CacheFlowe" />
  <meta name="copyright" content="CacheFlowe" />

  <meta property="og:site_name" content="CacheFlowe's HTML Experiments"/>
  <meta property="og:title" content="CacheFlowe | CacheFlowe's HTML Experiments"/>
  <meta property="og:description" content="CacheFlowe's HTML Experiments"/>
  <meta property="og:type" content="website"/>
  <meta property="og:image" content="http://cacheflowe.com/images/cacheflowe-logo.png"/>

  <meta name="twitter:card" content="summary">
  <meta name="twitter:site" content="@cacheflowe">
  <meta name="twitter:title" content="CacheFlowe | CacheFlowe's HTML Experiments">
  <meta name="twitter:description" content="CacheFlowe's HTML Experiments">
  <meta name="twitter:image:src" content="http://cacheflowe.com/images/cacheflowe-logo.png">
  <meta name="twitter:domain" content="http://cacheflowe.com">

  <link rel="stylesheet" href="../stylesheets/normalize.css" type="text/css" />
  <link rel="stylesheet" href="../stylesheets/skeleton.css" type="text/css" />
  <link rel="stylesheet" href="../stylesheets/experiments.css" type="text/css" />
  <style>
    nav {
      padding-top: 4rem;
    }
    nav .button {
      display: block;
      width: 31.333%;
      margin: 1%;
      height: 0;
      padding-bottom: 31%;
      background-size: cover;
      float: left;
    }
  </style>
</head>

<body>
	<header>
		<h1>CacheFlowe's HTML Experiments</h1>
	</header>
  <nav>
    <?php
      $absolute_path = "./";
      $dl = ".";
      $dir = opendir($absolute_path);
      while($file = readdir($dir)) {
        if(($file != "..") && ($file != ".") && ($file != "index.php") && (stristr($file,".DS_Store") == false)) {
          $thumb = null;
          if(file_exists($file.'/preview.png')) $thumb = $file.'/preview.png';
          if(file_exists($file.'/preview.jpg')) $thumb = $file.'/preview.jpg';
          if(file_exists($file.'/preview.gif')) $thumb = $file.'/preview.gif';
          if(isset($thumb)) {
            $list .= "<div><a class='button button-primary' href='$dl/$file/index.php' style='background-image:url($thumb)'>$file</a></div>";
          }
        }
      }
      echo $list;
    ?>
  </nav>
	<script>
	</script>
</body>
</html>
