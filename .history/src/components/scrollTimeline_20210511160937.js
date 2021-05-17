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

            let textureLoader = new THREE.TextureLoader();
            let textureColor = textureLoader.load('https://i.ibb.co/b3yXW5z/Moon-001-COLOR.jpg');
            let textureNormal = textureLoader.load('https://i.ibb.co/4FG9jy7/Moon-001-NORM.jpg');
            let textureDisp = textureLoader.load('https://i.ibb.co/tYyrMQq/Moon-001-DISP.png');
            let textureBump = textureLoader.load('https://i.ibb.co/L8SQpgh/Moon-001-SPEC.jpg')
            let textureAlpha = textureLoader.load('https://i.ibb.co/yXTsBMm/Moon-001-OCC.jpg')
            let textureEnv = textureLoader.load('https://images.unsplash.com/photo-1532040675891-5991e7e3d0cd?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1275&q=80')
            let material = new THREE.MeshStandardMaterial({
              map: textureColor,
              normalMap: textureColor,
              displacementMap: textureDisp,
              bumpMap: textureBump,
              alphaMap: textureAlpha,
              bumpScale: 1,
              color: 0x2194ce,
              emissive: 0x51003f,
              roughness: 0,
              metalness: 0,
              wireframe: false,
              envMap: textureEnv,
              displacementScale: 20,
              normalScale: new THREE.Vector2(1, 1)
            }); 
           
            let mesh = new THREE.Mesh(tape, material);
            scene.add( mesh );
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