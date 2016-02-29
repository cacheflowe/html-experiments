
<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('Snowblinded Sphere', 'Snowblinded Sphere in WebGL', null); ?>
</head>

<body>
	<header>
		<h1>Snowblinded Sphere</h1>
	</header>
	<script src="../../javascripts/three/three.min.js"></script>
	<script src="../../javascripts/modeset/math_util.js"></script>
	<script src="../../javascripts/modeset/pointer-pos.js"></script>
	<script src="../../javascripts/vendor/gyro.js"></script>
	<body>
		<video id="video" autoplay loop width="1920" height="960" src="./images/ShiftVR_VideoProduction_Intro01.mp4" style="display:none"></video>

		<script>
			document.ontouchmove = function(e) { e.preventDefault(); };

			var lerp = function(val1, val2, percent) {
					return val1 + (val2 - val1) * percent;
			};

			// standard global variables
			var container, scene, camera, renderer;
			var lon = 0,
					lat = 0,
					phi = 0,
					theta = 0;


			////////////
			// SCENE & CAMERA
			////////////
			var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
			var VIEW_ANGLE = 75, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 1, FAR = 1100;
			scene = new THREE.Scene();
			camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
			camera.target = new THREE.Vector3( 0, 0, 0 );
			scene.add(camera);


			////////////
			// renderer
			////////////
			renderer = new THREE.WebGLRenderer( {antialias:true} );
			renderer.setClearColor( 0xffffff );
			renderer.setPixelRatio( window.devicePixelRatio );
			renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
			// renderer.shadowMap.enabled = true;
			// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
			container = document.createElement( 'div' );
			document.body.appendChild( container );
			container.appendChild( renderer.domElement );



			////////////
			// Build skybox sphere / equirectangular panorama
			////////////
			var geometry = new THREE.SphereGeometry(500, 60, 40);
			geometry.scale(-1, 1, 1);

			// image or video texture
			var texture = new THREE.VideoTexture(document.getElementById('video'));
			texture.minFilter = THREE.LinearFilter;
			texture.magFilter = THREE.LinearFilter;
			texture.format = THREE.RGBFormat;
			// var texture = THREE.ImageUtils.loadTexture( 'images/IMG_3071.JPG' )

			// build mesh
			var material = new THREE.MeshBasicMaterial({map: texture});
			mesh = new THREE.Mesh( geometry, material );
			scene.add( mesh );


			////////////
			// Animate
			////////////
			function animate() {
				// while dragging
				if(gyro.getOrientation().x != null) {
					lon = lerp(lon, gyro.getOrientation().x * 30, 0.04);
					lat = lerp(lat, (gyro.getOrientation().y + 2 * Math.PI) * -6, 0.04);
				} else {
					lon = lerp(lon, (window.pointerPos.xPercent() - 0.5) * 420, 0.01);
					lat = lerp(lat, (-window.pointerPos.yPercent() + 0.5) * 120, 0.01);
				}

				phi = THREE.Math.degToRad( 90 - lat );
				theta = THREE.Math.degToRad( lon );

				camera.target.x = 500 * Math.sin( phi ) * Math.cos( theta );
				camera.target.y = 500 * Math.cos( phi );
				camera.target.z = 500 * Math.sin( phi ) * Math.sin( theta );

				camera.lookAt( camera.target );


				requestAnimationFrame( animate );
			  renderer.render( scene, camera );

			}
			animate();

			////////////
			// Resize window
			////////////
			window.addEventListener('resize', function() {
				camera.aspect = window.innerWidth / window.innerHeight;
				camera.updateProjectionMatrix();
				renderer.setSize(window.innerWidth, window.innerHeight);
			}, false);

			////////////
			// Scroll wheel
			////////////
			function onDocumentMouseWheel( event ) {
				// WebKit
				if ( event.wheelDeltaY ) {
					camera.fov -= event.wheelDeltaY * 0.05;
				// Opera / Explorer 9
				} else if ( event.wheelDelta ) {
					camera.fov -= event.wheelDelta * 0.05;
				// Firefox
				} else if ( event.detail ) {
					camera.fov += event.detail * 1.0;
				}
				camera.updateProjectionMatrix();
			}
			document.addEventListener( 'mousewheel', onDocumentMouseWheel, false );
			document.addEventListener( 'MozMousePixelScroll', onDocumentMouseWheel, false);

		</script>
  </body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
