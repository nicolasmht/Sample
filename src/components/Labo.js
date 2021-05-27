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
                if(child.material) child.material.metalness = 0;
            });

            labo.position.set(0, 0, 0);
            labo.scale.set(0.025, 0.025, 0.025);
            labo.rotateY(Math.PI);

            scene.add(labo);
        },
        ( xhr ) => {
            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log('An error happened', error);
        }
    );

    // Set camera
    camera.position.x = -2.5;
    camera.position.y = 2.45;
    camera.position.z = -1.25;

    // camera.position.z = -5;

    // Add labo
    const geometry = new THREE.BoxGeometry(10, 4, 0.1);
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 2, 0);
    // scene.add(cube);

    // Objects
    const geos = [...Array(4).keys()].map(() => new THREE.SphereGeometry(0.05, 0.05, 0.05));
    const mats = [...Array(4).keys()].map(() => new THREE.MeshBasicMaterial({color: 0x0000ff}));
    const objs = [...Array(4).keys()].map((i) => new THREE.Mesh( geos[i], mats[i] ));
    
    // Keys position
    objs[0].position.set(-0.25, 3.45, -1.8);
    objs[1].position.set(-0.70, 2.8, -1.8);
    objs[2].position.set(1.25, 2.8, -1.8);

    objs.forEach(o => {
        o.addEventListener("click", (event) => {

            event.stopPropagation();

            TweenLite.to(camera.position, 1, {
                x: event.target.position.x,
                y: event.target.position.y,
                z: event.target.position.z + 1,
                ease: EaseInOut,
                onUpdate: () => {
                    
                },
                onStart: () => {
                    // camera.lookAt(event.target.position);
                    
                },
                onComplete: () => {
                    // camera.lookAt(event.target.position);
                    // document.querySelector('#canvas').style.top = '150px';
                    document.querySelector('#canvas').style.opacity = 0;
                },
                
            });
        });

        interactionManager.add(o);
    });

    // Add all key in scene
    [...Array(4).keys()].map((i) => scene.add(objs[i]));

    // Move camera
    let tlCamera = new TimelineMax({ paused: true })
        .to(camera.position, { x: 0, y: 3, z: 4 });

    this.wheel = function(Y) {
        console.log(Y)
        if (Y < 2) return;

        // Mutliply Y value
        tlCamera.progress(Y - 2);
    }

    this.update = function(time) {
        
    }

    this.keyup = function(e) {
        if (e.key === 'Enter') {
            TweenLite.to(camera.position, 1, {
                x: 0,
                y: 3,
                z: 4,
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