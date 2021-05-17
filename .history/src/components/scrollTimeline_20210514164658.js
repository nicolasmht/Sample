import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import getNDCCoordinates from '../utils/mouse';
import { TimelineMax, Power4, TweenLite } from 'gsap';


// Textures
import TapeTexture from '../textures/tape_texture.png';
import TapeTexture2 from '../textures/tape2.png';

// Object
import TapeModel from '../objects/AudioTape/TapeCaseLast.glb';

function ScrollTimeline(scene) {

        const loader = new GLTFLoader();
        let tape = new THREE.Object3D();

        loader.load( TapeModel, ( gltf ) => {
            tape = gltf.scene;
            tape.name = "Storage_group"
            tape.traverse( (child) => {

                // if ( object.isMesh ) object.material.map = texture;
             
             } )
            scene.add(tape)

            console.log(tape);
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

        let tapeGroup = tape.getObjectByName('Tape_obj')
        let caseT = tape.getObjectByName('Case_t')
        let tapeObj = tape.getObjectByName('Tape')
        const textureLoader = new THREE.TextureLoader()

        
        //TIMELINE
        let timelineTape = new TimelineMax({ paused: true })
        .to(tapeGroup.position, 2, {x: 2,y: -13},0)
        .to(caseT.rotation, 2, {y: -2},0)
        .to(tapeGroup.rotation, 2, {x: 8, y:7}, 0)
        .to(tapeGroup.rotation, 2, {x: 1.5, y:0, z: 1.5}, 1)
        .to(tapeGroup.rotation, 5, {z: 20}, 2)
        .add(()=> {
            let texture = textureLoader.load(TapeTexture);
            tapeObj.children[0].material = new THREE.MeshPhongMaterial({map: texture});
        },2)
        .add(()=> {
            let texture2 = textureLoader.load(TapeTexture2);
            tapeObj.children[0].material = new THREE.MeshPhongMaterial({map: texture2});
        },2)
        .to(tapeObj.position, 8, {x: -8},2)


        let proxyTween = TweenLite.to({}, 1, {paused: true});

        window.addEventListener("mousewheel", (e) => {
            
            let documentHeight = document.querySelector('.container').offsetHeight;
            let windowHeight = window.innerHeight;

            let scrollTop = window.pageYOffset;
            let scrollPercent = Math.max(scrollTop / (documentHeight - windowHeight),0);

            proxyTween.progress(scrollPercent).pause();
    
            let progress = timelineTape.progress();
            progress += (proxyTween.progress() - progress) * 0.05;
            timelineTape.progress(progress);
    
          });
    }

    this.update = function(time) {
    }

    this.helpers = (gui) => {
    }
}

export default ScrollTimeline;