import * as THREE from 'three';
// import { OBJLoader } from 'three/examples/js/loaders/OBJLoader';


// Textures
// import FacadeTexture from '../textures/facade.png';

// Audios
// import CityAudio from '../audios/city.mp3';
import tape from '../objects/AudioTape/tape.obj';

function ScrollTimeline(scene) {

    const loader = new THREE.OBJLoader();

    // // load a resource
    // loader.load(
    //     // resource URL
    //     'models/monster.obj',
    //     // called when resource is loaded
    //     function ( tape ) {
    //         scene.add( tape );
    //     },
    //     // called when loading is in progresses
    //     function ( xhr ) {
    //         console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    //     },
    //     // called when loading has errors
    //     function ( error ) {
    //         console.log( 'An error happened' );
    //     }
    // );

    // const facadeSpriteMaterial = new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load(FacadeTexture) });
    // const facadeSprite = new THREE.Sprite(facadeSpriteMaterial);

    // facadeSprite.scale.set(4.5, 4.5 / 0.95, 1);
    // facadeSprite.position.z = 0.1;

    // scene.add(facadeSprite);


    this.update = function(time) {
        
    }

    this.helpers = (gui) => {
        
    }

}

export default ScrollTimeline;