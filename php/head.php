<?php

function writeHead($title, $description, $image) {
  if(isset($image) == false) $image = 'http://cacheflowe.com/images/cacheflowe-logo.png';
  echo '
    <title>CacheFlowe | ' . $title . '</title>
    <meta charset="utf-8">
    <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
    <meta content="IE=edge,chrome=1" http-equiv="X-UA-Compatible" />
    <meta content="no" name="imagetoolbar" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="keywords" content="' . $title . '" />
    <meta name="description" content="' . $description . '" />
    <meta name="author" content="CacheFlowe" />
    <meta name="copyright" content="CacheFlowe" />

    <meta property="og:site_name" content="CacheFlowe\'s HTML Experiments"/>
    <meta property="og:title" content="CacheFlowe | ' . $title . '"/>
    <meta property="og:description" content="' . $description . '"/>
    <meta property="og:type" content="website"/>
    <meta property="og:image" content="' . $image . '"/>

    <meta name="twitter:card" content="summary">
    <meta name="twitter:site" content="@cacheflowe">
    <meta name="twitter:title" content="CacheFlowe | ' . $title . '">
    <meta name="twitter:description" content="' . $description . '">
    <meta name="twitter:image:src" content="' . $image . '">
    <meta name="twitter:domain" content="http://cacheflowe.com">

    <link rel="stylesheet" href="../../stylesheets/normalize.css" type="text/css" />
    <link rel="stylesheet" href="../../stylesheets/skeleton.css" type="text/css" />
    <link rel="stylesheet" href="../../stylesheets/experiments.css" type="text/css" />
  ';
}

?>
