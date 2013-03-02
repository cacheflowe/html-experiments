<?php

$filename = $_REQUEST['file'];

$handle = fopen($filename, "r");

$imgbinary = fread(fopen($filename, "r"), filesize($filename));

echo '<img src="data:image/png;base64,' . base64_encode($imgbinary) . '" />';

?>