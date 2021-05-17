import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';


// Textures
import TapeTexture from '../textures/tape_texture.jpg';

// Object
import TapeModel from '../objects/AudioTape/tape.obj';

function ScrollTimeline(scene) {


    let textureLoader = new THREE.TextureLoader();
    var map = textureLoader.load(TapeTexture);
    var material = new THREE.MeshPhongMaterial({map: map});

    const loader = new OBJLoader();
    let object = null;
    // // load a resource
    loader.load(TapeModel,
        // called when resource is loaded
        ( tape ) => {

            tape.traverse((element) => {
                if(element.isMesh) {
                    element.material = material
                    // element.material.emissive = new THREE.Color('rgb(193, 145, 51)')
                    // element.material.map.needsUpdate = true;
                }

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