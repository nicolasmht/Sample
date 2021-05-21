import * as THREE from 'three';
import Anime from 'animejs/lib/anime.es.js';

// Packages
import { TimelineMax, Power4, TweenLite, EaseInOut } from 'gsap';

// Textures
// import FacadeTexture from '../textures/facade.png';

// Audios
// import CityAudio from '../audios/city.mp3';

function LaboComponent(scene, camera, interactionManager) {

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
    scene.add(cube);

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
            TweenLite.to(camera.position, 1, {
                x: event.target.position.x,
                y: event.target.position.y,
                z: -2.25,
                ease: EaseInOut,
                onUpdate: () => {
                    // camera.lookAt(camera.target);
                },
                onStart: () => {
                    
                }
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