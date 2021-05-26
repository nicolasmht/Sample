import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TimelineMax, Power4, TweenLite, Elastic, Bounce } from 'gsap';

// Object
// import daftPunkModel from '../objects/daftPunk.glb';
import daftPunkModel from '../objects/focus_daft-punk_02.gltf';
import threeTone from '../images/toon.png';

function DaftPunk(scene, camera) {

        const loader = new GLTFLoader();
        let pyramid = new THREE.Object3D();

        loader.load( daftPunkModel, ( gltf ) => {
            pyramid = gltf.scene;
            pyramid.name = "Storage_group"

            pyramid.traverse( (child) => {
                // console.log(child)
                child.material = new THREE.MeshToonMaterial({color:0xff0, side:THREE.DoubleSide, gradientMap: "threeTone"});
             } )

            scene.add(pyramid)
            pyramid.position.y = -15

            console.log(pyramid);
            initInteraction()

        },
        ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log( 'An error happened' );
        }
    )
    
    function initInteraction() {

        let pyramidB = pyramid.getObjectByName('bas')
        let pyramidT = pyramid.getObjectByName('haut')
        let pyramidModel = pyramid.getObjectByName('Pyramid')
        let pyramidB1 = pyramid.getObjectByName('Pyramid_bas')
        let pyramidB2 = pyramid.getObjectByName('Pyramid_bas1')
        let pyramidB3 = pyramid.getObjectByName('Pyramid_bas_1')
        let pyramidB4 = pyramid.getObjectByName('Pyramid_bas2')
        let pyramidBT = pyramid.getObjectByName('Pyramid_Top')
        let baseRotationBot = pyramidB.rotation.y;
        let baseRotationTop = pyramidT.rotation.y;
        let multiplicateur = 1;
        let turn = 0;
        let firstClick = true;
        let isComplete = false;

        let drag = false;
        let mouseDown = false
        let dragProgress = baseRotationBot;

        //RAYCAST HERE
        //if(raycastResult == pyramidB) targetPyramid = pyramidB
        //if(raycastResult == pyramidT) targetPyramid = pyramidT
        let targetPyramid = pyramidB

        document.addEventListener('mousedown', () => {
            drag = false
            mouseDown = true
        });
        document.addEventListener('mousemove', (e) => {
            drag = true
            if(mouseDown) {
                if(firstClick) {
                   if(targetPyramid == pyramidT) {
                        let tlBaseRotation = new TimelineMax({})
                            .to(pyramidB.rotation, 1, {ease:Elastic.easeOut.config(2,1), y: baseRotationTop}, 0)
                            .add(()=> {
                                firstClick = false
                            },1)
                    }
                    firstClick = false
                }
                dragProgress = targetPyramid.rotation.y
                dragProgress += e.movementX/200;
                targetPyramid.rotation.y = dragProgress;
                let rotationY = targetPyramid.rotation.y - ((Math.PI*2)*turn);

                //Less
                if(rotationY < -5.45) { multiplicateur = 0;}
                if(rotationY < -3.9 && rotationY > -5.45) { multiplicateur= -3; turn -= 1;}
                if(rotationY < -2.15 && rotationY > -3.9) { multiplicateur= -2;}
                if(rotationY < -0.52 && rotationY > -2.15) { multiplicateur= -1;}
                if(rotationY < 0.9 && rotationY > -0.52) { multiplicateur= 0;}
                //More
                if(rotationY < 2.5 && rotationY > 0.9) { multiplicateur= 1; }
                if(rotationY < 4.25 && rotationY > 2.5) { multiplicateur= 2; }
                if(rotationY < 5.85 && rotationY > 4.25) { multiplicateur= 3; }
                if(rotationY < 7.15 && rotationY > 5.85) { multiplicateur= 4; turn += 1;}
                if(rotationY >= 7.15) { multiplicateur = 1;}
            }
        });
        document.addEventListener('mouseup', () => {
            let nextFace = ( baseRotationTop + (( Math.PI / 2 ) * multiplicateur )) + (( Math.PI * 2 ) * turn );
            let tlRotation = new TimelineMax({})
                .to(targetPyramid.rotation, 1, {ease:Elastic.easeOut.config(2,1), y: nextFace}, 0)
                .add(()=> {
                    let initialPosition = (nextFace - ((Math.PI*2)*turn)).toFixed(2)
                    let tlFusion = new TimelineMax({})
                    //If two face aligné (soustraction des angles de rotation)
                    if(initialPosition - baseRotationTop.toFixed(2) == 0 && isComplete == false) {
                        isComplete=true
                        tlFusion.to(pyramidT.position, 2, {ease:Bounce.easeIn, y: -1.5}, 0)
                                .to(pyramidB3.position, 1, {ease:Bounce.easeIn, x: -4}, 0)
                                .to(pyramidB4.position, 1, {ease:Bounce.easeIn, z: 4}, 0)
                                .to(pyramidB1.position, 1, {ease:Bounce.easeIn, x: 4}, 0)
                                .to(pyramidB2.position, 1, {ease:Bounce.easeIn, z: -4}, 0)
                                .to(pyramidB3.position, 1, {ease:Bounce.easeIn, x: 0}, 1)
                                .to(pyramidB4.position, 1, {ease:Bounce.easeIn, z: 0}, 1)
                                .to(pyramidB1.position, 1, {ease:Bounce.easeIn, x: 0}, 1)
                                .to(pyramidB2.position, 1, {ease:Bounce.easeIn, z: 0}, 1)
                    } if(initialPosition - baseRotationTop.toFixed(2) != 0 &&isComplete == true) {
                        tlFusion.to(pyramidT.position, 1, {ease:Bounce.easeIn, y: 0.5}, 0)
                        isComplete = false
                    }
                },1)
            mouseDown = false
        });
    }

    this.update = function(time) {
    }

    this.helpers = (gui) => {
    }
}

export default DaftPunk;