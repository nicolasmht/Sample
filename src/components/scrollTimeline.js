import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TimelineMax, Power4, TweenLite } from 'gsap';

// Utils
import getPerspectiveSize from '../utils/getPerspectiveSize';

// Textures
import TapeTexture from '../textures/tape_texture.png';
import TapeTexture2 from '../textures/tape2.png';

// Object
import TapeModel from '../objects/AudioTape/TapeCaseLast2.glb';

function ScrollTimeline(scene, camera) {

        const loader = new GLTFLoader();
        let tape = new THREE.Object3D();

        let scrollY = 0;

        loader.load( TapeModel, ( gltf ) => {
            tape = gltf.scene;
            tape.name = "Storage_group"

            tape.traverse( (child) => {
                let modelPart = child.name;
                // console.log(child.name)
                switch(modelPart) {
                    case 'Storage':
                        child.material = new THREE.MeshNormalMaterial({color:0xff0, side:THREE.DoubleSide});
                    break;
                    case 'Tape_obj':
                        // child.material.emissive = new THREE.Color('rgb(193, 145, 51)');
                        child.position.x = -10
                    break;
                }
            });

            tape.scale.set(0.01, 0.01, 0.01);
            tape.position.set(-2.5, 2.38, -1.45);
            tape.rotateY(Math.PI);

            scene.add(tape);

            // reScale(tape);

            initTimeline();
        },
        ( xhr ) => {
            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log('An error happened');
        }
    )

    function reScale(tape) {
        let currentBox3 = new THREE.Box3().setFromObject(tape);
        const width = Math.abs(currentBox3.min.x - currentBox3.max.x);
        const height = Math.abs(currentBox3.min.y - currentBox3.max.y);
        const size = getPerspectiveSize(camera, camera.position.z); //Camera coord

        let reScale = (size.width / (Math.abs(currentBox3.max.x) + Math.abs(currentBox3.min.x))) * .78;
        // tape.scale.set(reScale, reScale, reScale);
    }

    function initTimeline() {
        let tapeGroup = tape.getObjectByName('Tape_obj')
        let storage = tape.getObjectByName('Storage')
        let caseObj = tape.getObjectByName('Case')
        let tapeObj = tape.getObjectByName('Tape')
        let caseT = tape.getObjectByName('Case_t')
        const textureLoader = new THREE.TextureLoader()

        
        //TIMELINE
        let timelineTape = new TimelineMax({ paused: true })
        // .to(tapeGroup.position, 2, {x: 2,y: -13},0)
        // .to(caseT.rotation, 2, {y: 2},0)
        // .to(tapeGroup.rotation, 2, {x: 8, y:7}, 0)
        // .to(tapeGroup.rotation, 2, {x: 1.5, y:0, z: 1.5}, 1)
        // .to(tapeGroup.rotation, 5, {z: 20}, 2)
        // .add(()=> {
        //     let texture = textureLoader.load(TapeTexture);
        //     tapeObj.children[0].material.map =texture;
        // },2)
        // .add(()=> {
        //     let texture2 = textureLoader.load(TapeTexture2);
        //     tapeObj.children[0].material.map= texture2;
        // },2)
        // .to(tapeObj.position, 8, {x: 8},2)
        
        .to(tapeGroup.position, 1, {z: -8}, 0) //decalage cassette
        .to(tapeGroup.position, 1, {z: -14}, 0.35) //decalage cassette
        .to(tapeGroup.position, 1, {y:1}, 0.5) //decalage cassette
        .to(tapeGroup.rotation, 1, {x: -2, y:1}, 0.5) //bascule cassette
        .to(storage.position, 1, {y: 20}, .75) //etagere disapear
        .to(tapeGroup.position, 1, {x: 0, z:0}, 1) //decalage cassette
        .to(tapeGroup.rotation, 1, {x: -3, y:2}, 1) //rotation cassette
        .to(tapeGroup.rotation, 1, {y:4.75}, 1.5) //rotation cassette sur elle meme
        .to(caseT.rotation, 1, {y: 2},1.5) //ouverture case
        .to(caseObj.position, 1, {x: -12},1.75) //eloignement case
        .to(tapeObj.rotation, .5, {x:-1.2,y:3.5,z:0.15}, 2) //rotation cassette droite
        .to(storage.position, 0, {y: -30}, 2) //etagere tp bot
        //Put back
        .to(storage.position, 1, {y: -5.8}, 3.25) //etagere appear bot
        .to(tapeGroup.position, 1, {x:-10,y:0.75,z:-13}, 3) //rotation cassette sur elle meme
        .to(tapeGroup.rotation, 1, {x:0,y:0,z:0}, 3) //rotation cassette sur elle meme
        .to(caseT.rotation, 1, {x:0,y:4,z:0},3) //ouverture case
        .to(caseT.rotation, 1, {x:0,y:0,z:0},3.5) //ouverture case
        .to(caseObj.position, 1, {x:0,y:0,z:0},3) //eloignement case
        .to(tapeObj.rotation, 1, {x:0,y:0,z:0}, 3) //rotation cassette droite
        .to(tapeGroup.position, 1, {x:-10,y:0.75,z:0}, 4) //rotation cassette sur elle meme

        let proxyTween = TweenLite.to({}, 1, { paused: true });

        //PROGRESS LINK TO THE PERCENT SCROLL PAGE
        document.addEventListener("mousewheel", (e) => {
            
            // let documentHeight = document.querySelector('.container').offsetHeight;
            // let windowHeight = window.innerHeight;

            // let scrollTop = window.pageYOffset;
            // let scrollPercent = Math.max(scrollTop / (documentHeight - windowHeight), 0);

            proxyTween.progress(scrollY).pause();
    
            let progress = timelineTape.progress();
            progress += (proxyTween.progress() - progress) * 0.05;
            timelineTape.progress(progress);

        });
    }

    this.update = function(time) {
    }

    this.helpers = (gui) => {
    }

    this.wheel = function(Y) {
        scrollY = Y;
    }

    this.mousemove = function(event) {}

    this.keyup = function(e) {}
}

export default ScrollTimeline;