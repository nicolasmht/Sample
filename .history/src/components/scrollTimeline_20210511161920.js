import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';


// Textures
// import FacadeTexture from '../textures/facade.png';

// Object
import tape from '../objects/AudioTape/tape.obj';

function ScrollTimeline(scene) {


    let textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load('https://i.ibb.co/b3yXW5z/Moon-001-COLOR.jpg');
    var material = new THREE.MeshPhongMaterial({map: map});

    const loader = new OBJLoader();
    let object = null;
    // // load a resource
    loader.load(tape,
        // called when resource is loaded
        ( tape ) => {

            tape.traverse(( node ) => {
                node.isMesh ? node.material = material : node.material = undefined
            });
            
            tape.name = 'tape'
            object = tape;
            object.scale.set(.2,.2,.2)

            scene.add( tape );
        },
        ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log( 'An error happened' );
        }
    );

    this.update = function(time) {
        object ? object.rotation.y += 0.01 : 0
        object ? object.rotation.z += 0.01 : 0
    }

    this.helpers = (gui) => {
    }

}

export default ScrollTimeline;