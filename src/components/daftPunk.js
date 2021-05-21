import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TimelineMax, Power4, TweenLite } from 'gsap';

// Object
import daftPunkModel from '../objects/daftPunk.glb';

function DaftPunk(scene, camera) {

        const loader = new GLTFLoader();
        let pyramid = new THREE.Object3D();

        loader.load( daftPunkModel, ( gltf ) => {
            pyramid = gltf.scene;
            pyramid.name = "Storage_group"

            pyramid.traverse( (child) => {
                // console.log(child)
                child.material = new THREE.MeshNormalMaterial({color:0xff0, side:THREE.DoubleSide});
             } )

            scene.add(pyramid)
            pyramid.position.y = -15

            console.log(pyramid);
            initTimeline()

        },
        ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log( 'An error happened' );
        }
    )
    
    function initTimeline() {
        let drag = false;
        let mouseDown = false
        let pyramidB = pyramid.getObjectByName('Pyramid_bas')
        let dragProgress = pyramidB.rotation.y;
        let base = pyramidB.rotation.y;
        let slide = 0;

        document.addEventListener('mousedown', () => {
            drag = false
            mouseDown = true
        });
        document.addEventListener('mousemove', (e) => {
            drag = true
            if(mouseDown) {
                dragProgress -= e.movementX/100;
                pyramidB.rotation.y = dragProgress;
                slide = pyramidB.rotation.y - base;
                // console.log(slide);
            }
        });
        document.addEventListener('mouseup', () => {
            let multiplicateur = Math.floor(slide)
            console.log(multiplicateur);
            let timelineTape = new TimelineMax({})
            .to(pyramidB.rotation, 1, {y: base + ((Math.PI/2) * multiplicateur )}, 0)
            dragProgress = pyramidB.rotation.y

            mouseDown = false
        });
    }


    this.update = function(time) {
    }

    this.helpers = (gui) => {
    }
}

export default DaftPunk;