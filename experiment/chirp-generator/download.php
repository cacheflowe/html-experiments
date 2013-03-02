<?

session_name("DOWNLOAD");
session_set_cookie_params( 60*60*24 ,"/" );
session_start();

if(empty($_SESSION['wav-string']) == true) {
  // store string in cookie
  $_SESSION['wav-string'] = $_REQUEST['string'];
  $_SESSION['filename'] = $_REQUEST['filename'];
} else {
  // used by window.open to load the page
  $base64strImg = $_SESSION['wav-string']; 
  $filename = $_SESSION['filename']; 
  
  // header ( "Content-Type: application/force-download" );
  // header ( "Content-Type: application/octet-stream" );
  // header ( "Content-Type: application/download" );
  // // header('Content-Type: audio/x-wav');
  // // header('Content-Type: application/octet-stream');
  // // header('Content-Description: File Transfer');
  header('Content-Disposition: attachment; filename="effect-'.$filename.'.wav"');
  // header("Content-Transfer-Encoding: binary");
  // // header('Expires: 0');
  // // header('Pragma: public');
  // header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
  // header('Pragma: no-cache');
  echo base64_decode($base64strImg);
  // echo base64_encode($base64strImg);

  // header ( "Pragma: public" );
  // header ( "Expires: 0" );
  // header ( "Cache-Control: must-revalidate, post-check=0, pre-check=0" );
  // header ( "Content-Type: application/force-download" );
  // header ( "Content-Type: application/octet-stream" );
  // header ( "Content-Type: application/download" );
  // header ( 'Content-Disposition: attachment; filename="test.wav"');
  // header ( "Content-Transfer-Encoding: binary " );
  // header ( 'Content-Type: audio/x-wav');
  header ( 'Content-Length: ' . strlen($base64strImg));


  // echo $base64strImg;

  unset( $_SESSION['wav-string'] );
  unset( $_SESSION['filename'] );
}




// header('Content-Type: audio/x-wav');
// header('Content-Disposition: attachment; filename=' . basename($realLink));
// header('Content-Transfer-Encoding: binary');
// header('Expires: 0');
// header('Cache-Control: must-revalidate');
// header('Pragma: public');
// header('Content-Length: ' . filesize($realLink));
// ob_clean();
// flush();
// readfile($realLink);

// echo $base64strImg;


// unset( $_SESSION['catnum'] );

// // header('Content-type: audio/mpeg');
// header("Content-Length:" . filesize($audioFile));
// header("Content-Disposition:attachment;filename=\"$fileName\"");

// header("Content-Transfer-Encoding: binary");
// header('X-Pad: avoid browser bug');
// // no caching
// header('Expires: Thu, 19 Nov 1981 08:52:00 GMT');
// header('Cache-Control: no-cache');
// header('Cache-Control: no-store, no-cache, must-revalidate, post-check=0, pre-check=0');
// header('Pragma: no-cache');

// readfile( $audioFile );
?>