<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('Mode Set Logo 3d', 'Mode Set Logo 3d in WebGL', 'http://cacheflowe.com/code/html/experiment/mode-set-logo-3d/preview.gif'); ?>
</head>

<body>
	<header>
		<h1>Mode Set Logo 3d</h1>
	</header>
	<script src="../../javascripts/three/threex-geometry-utils.js"></script>
	<script src="../../javascripts/three/three.min.js"></script>
	<script src="../../javascripts/modeset/pointer-pos.js"></script>
	<script src="../../javascripts/modeset/math_util.js"></script>
	<script>
		document.ontouchmove = function(e) { e.preventDefault(); };

		// standard global variables
		var container, scene, camera, renderer, modeSetSolid;
		var clock = new THREE.Clock();

		////////////
		// SCENE & CAMERA
		////////////
		var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
		var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 0.1, FAR = 20000;
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
		scene.add(camera);
		camera.position.set(0,0,400);
		camera.lookAt(scene.position);

		////////////
		// renderer
		////////////
		// renderer = new THREE.CanvasRenderer( {antialias:true} );
		renderer = new THREE.WebGLRenderer( {antialias:true} );
		renderer.setClearColor( 0xffffff );
		renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
		renderer.shadowMapEnabled = true;
		renderer.shadowMapType = THREE.PCFSoftShadowMap;
		container = document.createElement( 'div' );
		document.body.appendChild( container );
		container.appendChild( renderer.domElement );

		////////////
		// LIGHTs
		////////////
		var ambientLight = new THREE.AmbientLight( 0x000000 );
		scene.add( ambientLight );

		var lights = [];
		lights[0] = new THREE.PointLight( 0xffffff, 1, 0 );
		lights[0].position.set( 100, -300, 0 );
		scene.add( lights[0] );

		////////////
		// CUSTOM //
		////////////

		var modeSetPoints = [];

		modeSetPoints.push( new THREE.Vector2( 176, 77 ));
		modeSetPoints.push( new THREE.Vector2( 176, -81 ));
		modeSetPoints.push( new THREE.Vector2( 132, -145 ));
		modeSetPoints.push( new THREE.Vector2( 132, -72 ));
		modeSetPoints.push( new THREE.Vector2( 32, -216 ));
		modeSetPoints.push( new THREE.Vector2( 32, -113 ));
		modeSetPoints.push( new THREE.Vector2( 4, -79 ));
		modeSetPoints.push( new THREE.Vector2( 4, -237 ));
		modeSetPoints.push( new THREE.Vector2( -97, -141 ));
		modeSetPoints.push( new THREE.Vector2( -97, -61 ));
		modeSetPoints.push( new THREE.Vector2( -119, -41 ));
		modeSetPoints.push( new THREE.Vector2( -119, -84 ));
		modeSetPoints.push( new THREE.Vector2( -174, -34 ));
		modeSetPoints.push( new THREE.Vector2( -174, 239 ));
		modeSetPoints.push( new THREE.Vector2( -119, 186 ));
		modeSetPoints.push( new THREE.Vector2( -119, 108 ));
		modeSetPoints.push( new THREE.Vector2( -97, 87 ));
		modeSetPoints.push( new THREE.Vector2( -97, 131 ));
		modeSetPoints.push( new THREE.Vector2( -45, 82 ));
		modeSetPoints.push( new THREE.Vector2( 49, 218 ));
		modeSetPoints.push( new THREE.Vector2( 49, 82 ));
		modeSetPoints.push( new THREE.Vector2( 147, 224 ));
		modeSetPoints.push( new THREE.Vector2( 147, 109 ));

		var modeSetShape = new THREE.Shape( modeSetPoints );

		var extrusionSettings = {
		  amount: 80,
			bevelEnabled: false,
			material: 0,
			extrudeMaterial: 1
		};
		var modeSetLogoGeometry = new THREE.ExtrudeGeometry( modeSetShape, extrusionSettings );

		THREEx.GeometryUtils.center(modeSetLogoGeometry, true, true, true);

		// add a wireframe to model
		var materialFront = new THREE.MeshPhongMaterial({
		  color: 0x00bce4,
			emissive : 0x000000,
			specular : 0x111111,
		  shininess : 20,
		  shading : THREE.SmoothShading,
			wireframe : false
		});
		// var materialFront = new THREE.MeshLambertMaterial({
		//   color: 0x00bce4,
		//   shininess: 100,
		//   specular: 0xcccccc,
		//   emissive: 0x000000
		// });
		var materialSide = new THREE.MeshLambertMaterial({
		  color: 0xffffff,
		  shininess: 100,
		  specular: 0xcccccc,
		  emissive: 0x888888
		});
		var materialArray = [ materialFront, materialSide ];

		modeSetSolid = new THREE.Mesh( modeSetLogoGeometry, new THREE.MeshFaceMaterial(materialArray) );
		modeSetSolid.position.set(0,0,-1000);
		modeSetSolid.rotation.x = -0.2;
		modeSetSolid.rotation.y = Math.PI;
		modeSetSolid.castShadow = true;
		scene.add(modeSetSolid);

		// add spotlight
		var spotlight = new THREE.SpotLight( 0xffffff );
		spotlight.position.set( 0, 3000, -800 );
		spotlight.target = modeSetSolid;
		spotlight.castShadow = true;
		spotlight.shadowDarkness	= 0.15;
		spotlight.shadowCameraVisible	= false;
		spotlight.shadowBias = 0.0001;
		spotlight.shadowMapWidth = 2048;
		spotlight.shadowMapHeight = 2048;
		scene.add( spotlight );
		window.spotlight = spotlight;

		// add plane floor
		var geometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
		var material = new THREE.MeshBasicMaterial({color: 0xffffff, side: THREE.DoubleSide});
		var plane = new THREE.Mesh( geometry, material );
		plane.rotation.x = Math.PI/2;
		plane.position.set(0,-360,-1000);
		plane.receiveShadow = true;
		scene.add(plane);


		function animate() {
		  requestAnimationFrame( animate );
		  renderer.render( scene, camera );

		  var newX = 2 * (window.pointerPos.yPercent() - 0.5);
		  var newY = Math.PI + 2 * (window.pointerPos.xPercent() - 0.5);
		  modeSetSolid.rotation.x = MathUtil.lerp(modeSetSolid.rotation.x, newX, 0.2);
		  modeSetSolid.rotation.y = MathUtil.lerp(modeSetSolid.rotation.y, newY, 0.2);
		}
		animate();
	</script>
</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
