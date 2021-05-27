import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import Anime from 'animejs/lib/anime.es.js';

// Packages
import { TimelineMax, Power4, TweenLite, EaseInOut } from 'gsap';

// Gltf
// import LaboGltf from '../objects/labo.gltf';
import LaboGltf from '../objects/Cabinet_Objets_04.gltf';

function LaboComponent(scene, camera, interactionManager) {

    const loader = new GLTFLoader();
    let labo = new THREE.Object3D();

    loader.load( LaboGltf, ( gltf ) => {
            labo = gltf.scene;
            labo.name = "labo"

            labo.traverse( (child) => {
                // console.log(child)
                // child.material = new THREE.MeshToonMaterial({color:0xff0, side:THREE.DoubleSide, gradientMap: "threeTone"});
                if(child.material) child.material.metalness = 0;
            });

            labo.position.set(0, 0, -0.5);
            // labo.rotateY(Math.PI);
            labo.scale.set(0.02, 0.02, 0.02);

            scene.add(labo)
            // labo.position.y = -15

            console.log(labo);
        },
        ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log('An error happened', error);
        }
    );

    // Set camera
    camera.position.x = 3;
    camera.position.y = 3.5;
    camera.position.z = -0.8;
    // camera.lookAt(new THREE.Vector3(0, 0, 0));

    // Add labo
    const geometry = new THREE.BoxGeometry(10, 4, 0.1);
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 2, 0);
    // scene.add(cube);

    // Add tapes test
    const geometryTest = new THREE.BoxGeometry(0.25, 0.25, 0.1);
    const materialTest = new THREE.MeshBasicMaterial( {color: 0xff0000} );
    const tapeTest = new THREE.Mesh( geometryTest, materialTest );
    tapeTest.position.set(camera.position.x - 0.25/2 , camera.position.y, 0);
    scene.add(tapeTest);

    // Objects
    const geos = [...Array(4).keys()].map(() => new THREE.BoxGeometry(1, 1, 0.1));
    const mats = [...Array(4).keys()].map(() => new THREE.MeshBasicMaterial( {color: 0x0000ff} ));
    const objs = [...Array(4).keys()].map((i) => new THREE.Mesh( geos[i], mats[i] ));
    
    objs[0].position.set(2, 2, -0.5);
    objs[1].position.set(-2, 2, -0.5);
    objs[2].position.set(1, 2, -0.5);

    objs.forEach(o => {
        o.addEventListener("click", (event) => {

            event.stopPropagation();

            TweenLite.to(camera.position, 1, {
                x: event.target.position.x,
                y: event.target.position.y,
                z: -2.25,
                ease: EaseInOut,
                onUpdate: () => {
                    
                },
                onStart: () => {
                    // camera.lookAt(event.target.position);
                    
                },
                onComplete: () => {
                    // camera.lookAt(event.target.position);
                },
                
            });
        });

        interactionManager.add(o);
    });

    [...Array(4).keys()].map((i) => scene.add(objs[i]));

    // Move camera
    let tlCamera = new TimelineMax({ paused: true })
        .to(camera.position, { x: 0, y: 2, z: -6 });

    this.wheel = function(Y) {
        // Mutliply Y value
        tlCamera.progress(Y);
    }

    this.update = function(time) {
        
    }

    this.keyup = function(e) {
        if (e.key === 'Enter') {
            TweenLite.to(camera.position, 1, {
                x: 0,
                y: 2,
                z: -6,
                ease: EaseInOut
            });
        }
    }

    this.helpers = (gui) => {
        let cameraFolder = gui.addFolder('Initial camera position');
        cameraFolder.add(camera.position, 'x');
        cameraFolder.add(camera.position, 'y');
        cameraFolder.add(camera.position, 'z');
    }

}

export default LaboComponent;