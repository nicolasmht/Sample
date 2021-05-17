import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';


// Textures
// import FacadeTexture from '../textures/facade.png';

// Object
import tape from '../objects/AudioTape/tape.obj';

function ScrollTimeline(scene) {

    const loader = new OBJLoader();
    let object = null;
    // // load a resource
    loader.load(tape,
        // called when resource is loaded
        ( tape ) => {
            tape.name = 'tape'
            object = tape;
            object.scale.set(.2,.2,.2)
            scene.add( tape );
        },
        // called when loading is in progresses
        ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        // called when loading has errors
        ( error ) => {
            console.log( 'An error happened' );
        }
    );

    // const facadeSpriteMaterial = new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load(FacadeTexture) });
    // const facadeSprite = new THREE.Sprite(facadeSpriteMaterial);

    // facadeSprite.scale.set(4.5, 4.5 / 0.95, 1);
    // facadeSprite.position.z = 0.1;

    // scene.add(facadeSprite);


    this.update = function(time) {

        object ? object.rotation.y += 0.01 : 0
        object ? object.rotation.z += 0.01 : 0
        
    }

    this.helpers = (gui) => {
        
    }

}

export default ScrollTimeline;