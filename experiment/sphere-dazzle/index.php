<?php ob_start(); ?>
<html>
<head>
	<?php include('../../php/head.php'); writeHead('Sphere Dazzle', 'Sphere Dazzle in WebGL', 'http://cacheflowe.com/code/html/experiment/sphere-dazzle/preview.gif'); ?>
</head>

<body>
	<header>
		<h1>Sphere Dazzle</h1>
	</header>
	<script src="../../javascripts/three/three.min.js"></script>
	<script src="../../javascripts/modeset/pointer-pos.js"></script>
  <!-- <script src="../../javascripts/gif/gif.js"></script>
	<script src="../../javascripts/gif/gif-renderer.js"></script> -->
	<script>
		window.addEventListener('load', function(){

				document.ontouchmove = function(e) { e.preventDefault(); };

				var lerp = function(val1, val2, percent) {
					return val1 + (val2 - val1) * percent;
				};

				// standard global variables
				var container, scene, camera, renderer;

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
				renderer = new THREE.WebGLRenderer( {antialias:true} );
				renderer.setClearColor( 0xffffff );
				renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
				container = document.createElement( 'div' );
				document.body.appendChild( container );
				container.appendChild( renderer.domElement );

				////////////
				// LIGHTS
				////////////
				// var ambientLight = new THREE.AmbientLight( 0x555555 );
				var ambientLight = new THREE.AmbientLight( 0xffffff );
				scene.add( ambientLight );

				// var pointLight = new THREE.PointLight( 0xffffff, 1, 0 );
				// pointLight.position.set( 200, 300, 200 );
				// scene.add( pointLight );
				// var pointLight2 = new THREE.PointLight( 0xffffff, 1, 0 );
				// pointLight2.position.set( -200, -300, 200 );
				// scene.add( pointLight2 );

				// var directionalLight = new THREE.DirectionalLight( 0x333333 );
				// directionalLight.position.set( 0, -500, 500 );
				// scene.add( directionalLight );



				////////////
				// CUSTOM
				////////////
				_canvas = document.createElement('canvas');
				_canvas.width = 512;
				_canvas.height = 512;
				_context = _canvas.getContext('2d');

				var stripeSize = _canvas.width * 0.02;
				function updateCanvas() {
					// stripeSize = _canvas.width * 0.025 + Math.sin(Date.now()*0.0001) * 3;
					// _context.clearRect(0,0,_canvas.width,_canvas.height);
					_context.fillStyle = "#ffffff";
					_context.fillRect(0,0,_canvas.width,_canvas.height);
					var isEven = true;
					_context.fillStyle = "#000000";
					for(var x = (-stripeSize * 2) + frameCount % (stripeSize*2); x < _canvas.width + stripeSize; x += stripeSize) {
						isEven = !isEven;
						if(isEven == true) {
							_context.fillRect(0, x, _canvas.width, stripeSize);
						}
					}
				}

				// build sphere texture
				_texture = new THREE.Texture(_canvas);
				_material = new THREE.MeshPhongMaterial({
					map: _texture,
					color: 0xffffff,
					emissive : 0x333333,
					specular : 0xffffff,
					// specular : 0x999999, // if point lighting
					metal: true,
					shininess : 30,
					shading : THREE.SmoothShading,
					side: THREE.FrontSide, // DoubleSide, //
					transparent: true,
					wireframe : false
				});
				// scene.fog = new THREE.Fog( 0x004400, 100, 800 );


				// create mesh
				var smallerSide = (window.innerHeight < window.innerWidth) ? window.innerHeight : window.innerWidth;
				var geometry = new THREE.SphereGeometry( smallerSide * 0.075, 100, 100 );
				var geometryDefault = new THREE.SphereGeometry( smallerSide * 0.075, 100, 100 );
				var sphere = new THREE.Mesh( geometry, _material );
				scene.add( sphere );

				// var geometry = new THREE.SphereGeometry( 1000, 100, 100 );
				// var sphereHuge = new THREE.Mesh( geometry, _material );
				// scene.add( sphereHuge );


				var deformSphere = function(percentComplete) {
					for(var i=0; i < sphere.geometry.vertices.length; i++) {
						vertex = sphere.geometry.vertices[i];
						vertexOrig = geometryDefault.vertices[i];
						vertex.set(
							vertexOrig.x * (1 + 0.1 * Math.sin(percentComplete * (Math.PI*2) + vertexOrig.y/20)),
							vertexOrig.y,
							vertexOrig.z * (1 + 0.1 * Math.sin(percentComplete * (Math.PI*2) + vertexOrig.y/20))
						);
					}
					sphere.geometry.verticesNeedUpdate = true;
				};


				////////////
				// ANIMATE & RESIZE
				////////////
				var gifRenderer = null;//new GifRenderer();


				var frameCount = 0;
				var frames = Math.round(stripeSize*2);
				var progress = 0;
				function animate() {
					frameCount++;
					progress = ((frameCount/2 % frames)/frames);
					requestAnimationFrame( animate );
					renderer.render( scene, camera );

					updateCanvas();
					_texture.needsUpdate = true;
					deformSphere(progress);

					var newX = 5 * (window.pointerPos.yPercent() - 0.5);
					var newY = Math.PI + 5 * -(window.pointerPos.xPercent() - 0.5);
					sphere.rotation.x = lerp(sphere.rotation.x, newX, 0.2);
					sphere.rotation.z = lerp(sphere.rotation.z, newY, 0.2);
					// sphereHuge.rotation.x = -sphere.rotation.x;
					// sphereHuge.rotation.z = -sphere.rotation.z;
					// sphere.rotation.x = Math.PI - 0.13;

					if(gifRenderer != null && frameCount > 40) gifRenderer.addFrame(renderer.context.canvas, frames*2);
				}
				animate();

				window.addEventListener('resize', function() {
					camera.aspect = window.innerWidth / window.innerHeight;
					camera.updateProjectionMatrix();
					renderer.setSize(window.innerWidth, window.innerHeight);
				}, false);

		});
	</script>
</body>
</html>
<?php file_put_contents('./index.html', ob_get_contents()); ob_end_flush(); ?>
