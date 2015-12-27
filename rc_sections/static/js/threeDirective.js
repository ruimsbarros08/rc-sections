app.directive('ngSection', function() {
	return {
		restrict: 'A',
		scope: {
			'width': '=',
			'height': '=',
			'fillcontainer': '=',
			'scale': '=',
			'materialType': '=',
			'geometry': '='
		},
		link: function postLink(scope, element, attrs) {

			var camera, scene, renderer,
				shadowMesh, icosahedron, light, cube, material, geometry
			mouseX = 0,
				mouseY = 0,
				contW = (scope.fillcontainer) ?
				element[0].clientWidth : scope.width,
				contH = scope.height,
				windowHalfX = contW / 2,
				windowHalfY = contH / 2,
				materials = {},
				targetRotation = 0,
				targetRotationOnMouseDown = 0;


			scope.init = function() {

				// Camera
				camera = new THREE.PerspectiveCamera(20, contW / contH, 1, 10000);
				camera.position.z = 1800;

				// Scene
				scene = new THREE.Scene();

				// Ligthing
				light = new THREE.DirectionalLight(0xffffff);
				light.position.set(0, 0, 1);
				scene.add(light);

				// Shadow
				var canvas = document.createElement('canvas');
				canvas.width = scope.width;
				canvas.height = scope.height;

				// Render a 2d gradient to use as shadow
				var context = canvas.getContext('2d');
				var gradient = context.createRadialGradient(canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2);

				gradient.addColorStop(0.1, 'rgba(200,200,200,1)');
				gradient.addColorStop(1, 'rgba(255,255,255,1)');

				context.fillStyle = gradient;
				context.fillRect(0, 0, canvas.width, canvas.height);

				var shadowTexture = new THREE.Texture(canvas);
				shadowTexture.needsUpdate = true;

				var shadowMaterial = new THREE.MeshBasicMaterial({
					map: shadowTexture
				});
				var shadowGeo = new THREE.PlaneGeometry(300, 300, 1, 1);

				// Apply the shadow texture to a plane
				shadowMesh = new THREE.Mesh(shadowGeo, shadowMaterial);
				shadowMesh.position.y = -250;
				shadowMesh.rotation.x = -Math.PI / 2;
				scene.add(shadowMesh);

				geometry = new THREE.BoxGeometry(scope.geometry.width * 1000, scope.geometry.height * 1000, 2000);
				geometry.verticesNeedUpdate = true;
				geometry.elementsNeedUpdate = true;
				geometry.morphTargetsNeedUpdate = true;
				geometry.uvsNeedUpdate = true;
				geometry.normalsNeedUpdate = true;
				geometry.colorsNeedUpdate = true;
				geometry.tangentsNeedUpdate = true;

				for (var i = 0; i < geometry.faces.length; i += 2) {

					var hex = Math.random() * 0xffffff;
					geometry.faces[i].color.setHex(hex);
					geometry.faces[i + 1].color.setHex(hex);

				}

				material = new THREE.MeshBasicMaterial({
					vertexColors: THREE.FaceColors,
					overdraw: 0.5
				});

				cube = new THREE.Mesh(geometry, material);
				cube.position.y = 20;
				scene.add(cube);

				// var faceIndices = [ 'a', 'b', 'c', 'd' ];

				// var color, f, p, n, vertexIndex,
				//   radius = 200,
				//   geometry  = new THREE.IcosahedronGeometry( radius, 1 );


				// for (var i = 0; i < geometry.faces.length; i ++) {

				//   f  = geometry.faces[ i ];

				//   n = ( f instanceof THREE.Face3 ) ? 3 : 4;

				//   for( var j = 0; j < n; j++ ) {

				//     vertexIndex = f[ faceIndices[ j ] ];

				//     p = geometry.vertices[ vertexIndex ];

				//     color = new THREE.Color( 0xffffff );
				//     color.setHSL( 0.125 * vertexIndex/geometry.vertices.length, 1.0, 0.5 );

				//     f.vertexColors[ j ] = color;

				//   }

				// }

				// materials.lambert = new THREE.MeshLambertMaterial({
				// 	color: 0xffffff,
				// 	shading: THREE.FlatShading,
				// 	vertexColors: THREE.VertexColors
				// });

				// materials.phong = new THREE.MeshPhongMaterial({
				// 	ambient: 0x030303,
				// 	color: 0xdddddd,
				// 	specular: 0x009900,
				// 	shininess: 30,
				// 	shading: THREE.FlatShading,
				// 	vertexColors: THREE.VertexColors
				// });

				// materials.wireframe = new THREE.MeshBasicMaterial({
				// 	color: 0x000000,
				// 	shading: THREE.FlatShading,
				// 	wireframe: true,
				// 	transparent: true
				// });

				// Build and add the icosahedron to the scene
				// icosahedron = new THREE.Mesh( geometry, materials[scope.materialType] );
				// icosahedron.position.x = 0;
				// icosahedron.rotation.x = 0;
				// scene.add( icosahedron );

				renderer = new THREE.WebGLRenderer({
					antialias: true
				});
				renderer.setClearColor(0xffffff);
				renderer.setSize(contW, contH);

				// element is provided by the angular directive
				element[0].appendChild(renderer.domElement);

				// document.addEventListener('mousemove', scope.onDocumentMouseMove, false);
				// document.addEventListener( 'mousemove', scope.onDocumentMouseMove, false );
				element[0].addEventListener('mousedown', onDocumentMouseDown, false);
				element[0].addEventListener('touchstart', onDocumentTouchStart, false);
				element[0].addEventListener('touchmove', onDocumentTouchMove, false);

				window.addEventListener('resize', scope.onWindowResize, false);

			};

			//Set geometry

			// var createCube = function(geometry, material) {
			// 	return new THREE.Mesh(geometry, material);
			// }

			// var setGeometry = function(geometry) {
			// 	return new THREE.BoxGeometry(geometry.width * 1000, geometry.height * 1000, 2000);
			// }



			// -----------------------------------
			// Event listeners
			// -----------------------------------
			scope.onWindowResize = function() {

				scope.resizeCanvas();

			};

			// scope.onDocumentMouseMove = function(event) {

			// 	mouseX = (event.clientX - windowHalfX);
			// 	mouseY = (event.clientY - windowHalfY);

			// };



			function onDocumentMouseDown(event) {

				event.preventDefault();

				element[0].addEventListener('mousemove', onDocumentMouseMove, false);
				element[0].addEventListener('mouseup', onDocumentMouseUp, false);
				element[0].addEventListener('mouseout', onDocumentMouseOut, false);

				mouseXOnMouseDown = event.clientX - windowHalfX;
				targetRotationOnMouseDown = targetRotation;

			}

			function onDocumentMouseMove(event) {

				mouseX = event.clientX - windowHalfX;

				targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.02;

			}

			function onDocumentMouseUp(event) {

				element[0].removeEventListener('mousemove', onDocumentMouseMove, false);
				element[0].removeEventListener('mouseup', onDocumentMouseUp, false);
				element[0].removeEventListener('mouseout', onDocumentMouseOut, false);

			}

			function onDocumentMouseOut(event) {

				element[0].removeEventListener('mousemove', onDocumentMouseMove, false);
				element[0].removeEventListener('mouseup', onDocumentMouseUp, false);
				element[0].removeEventListener('mouseout', onDocumentMouseOut, false);

			}

			function onDocumentTouchStart(event) {

				if (event.touches.length === 1) {

					event.preventDefault();

					mouseXOnMouseDown = event.touches[0].pageX - windowHalfX;
					targetRotationOnMouseDown = targetRotation;

				}

			}

			function onDocumentTouchMove(event) {

				if (event.touches.length === 1) {

					event.preventDefault();

					mouseX = event.touches[0].pageX - windowHalfX;
					targetRotation = targetRotationOnMouseDown + (mouseX - mouseXOnMouseDown) * 0.05;

				}

			}


			// -----------------------------------
			// Updates
			// -----------------------------------
			scope.resizeCanvas = function() {

				contW = (scope.fillcontainer) ?
					element[0].clientWidth : scope.width;
				contH = scope.height;

				windowHalfX = contW / 2;
				windowHalfY = contH / 2;

				camera.aspect = contW / contH;
				camera.updateProjectionMatrix();

				renderer.setSize(contW, contH);

			};

			scope.resizeObject = function() {

				cube.scale.set(scope.scale, scope.scale, scope.scale);
				shadowMesh.scale.set(scope.scale, scope.scale, scope.scale);

			};

			// scope.changeMaterial = function () {

			//   icosahedron.material = materials[scope.materialType];

			// };


			// -----------------------------------
			// Draw and Animate
			// -----------------------------------
			scope.animate = function() {

				requestAnimationFrame(scope.animate);

				scope.render();

			};

			scope.render = function() {

				camera.position.x += (mouseX - camera.position.x) * 0.05;
				// camera.position.y += ( - mouseY - camera.position.y ) * 0.05;

				camera.lookAt(scene.position);

				renderer.render(scene, camera);

			};

			// -----------------------------------
			// Watches
			// -----------------------------------
			scope.$watch('fillcontainer + width + height', function() {

				scope.resizeCanvas();

			});

			scope.$watch('scale', function() {
				scope.resizeObject();

			});

			// scope.$watchCollection('geometry', function(newValue, oldValue, scope) {

			// 	// console.log('hey');
			// 	// scene.remove(cube);
			// 	// geometry = setGeometry(newValue);
			// 	for (var i = 0; i < cube.geometry.vertices.length; i=i++) {
			// 		if (cube.geometry.vertices[i].x<0){
			// 			cube.geometry.vertices[i].x = -newValue.width/2;

			// 		} else {
			// 			cube.geometry.vertices[i].x = newValue.width/2;
			// 		}

			// 	}
			// 	console.log(cube.geometry.parameters)
			// 	// cube.geometry.parameters.width += 100;
			// 	// cube.geometry.parameters.height += 100;

			// 	cube.geometry.verticesNeedUpdate = true;
			// 	cube.geometry.elementsNeedUpdate = true;
			// 	cube.geometry.morphTargetsNeedUpdate = true;
			// 	cube.geometry.uvsNeedUpdate = true;
			// 	cube.geometry.normalsNeedUpdate = true;
			// 	cube.geometry.colorsNeedUpdate = true;
			// 	cube.geometry.tangentsNeedUpdate = true;
			// 	// cube.geometry.computeMorphNormals()
			// 	// cube = createCube(geometry, material);
			// 	// cube.position.y = 20;
			// 	// console.log(cube);
			// 	// scene.add(cube);


			// });

			// scope.$watch('materialType', function () {

			//   scope.changeMaterial();

			// });

			// Begin
			scope.init();
			scope.animate();
		}
	};
});