import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TimelineMax, Power4, TweenLite } from 'gsap';

// Utils
import getPerspectiveSize from '../utils/getPerspectiveSize';

// Textures
import TapeTexture from '../textures/tape_texture.png';
import TapeTexture2 from '../textures/tape2.png';
import Orange from '../textures/orange.jpeg';

// Object
import TapeModel from '../objects/AudioTape/TapeCaseLast2.glb';

function ScrollTimeline(scene, camera) {

        const loader = new GLTFLoader();
        let tape = new THREE.Object3D();

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
             } )
            scene.add(tape)
            tape.position.y = -8.75

            console.log(tape);

            reScale(tape)
            initTimeline();
        },
        ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log( 'An error happened' );
        }
    )

    function reScale(tape) {
        let currentBox3 = new THREE.Box3().setFromObject(tape)

        const width = Math.abs(currentBox3.min.x - currentBox3.max.x)
        const height = Math.abs(currentBox3.min.y - currentBox3.max.y)
        const size = getPerspectiveSize(camera, camera.position.z); //Camera coord
        let reScale = (size.width / (Math.abs(currentBox3.max.x) + Math.abs(currentBox3.min.x))) * .78;
        tape.scale.set(reScale, reScale, reScale)
    }

    function initTimeline() {
        let tapeGroup = tape.getObjectByName('Tape_obj')
        let storage = tape.getObjectByName('Storage')
        let caseObj = tape.getObjectByName('Case')
        let tapeObj = tape.getObjectByName('Tape')
        let caseT = tape.getObjectByName('Case_t')
        let sticker = tape.getObjectByName('Tape_elem_2')
        let centre = tape.getObjectByName('Tape_elem_4')
        let wheels = tape.getObjectByName('Tape_elem_1')

        // wheels.material.transparent = true;
        // wheels.material.opacity = 0;
        
        const textureLoader = new THREE.TextureLoader()
        
        let vertShader = `
        varying vec2 vUv;
        
        void main() {
            vUv = uv;
            
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
        }
        `
        let fragShader = ` 
        uniform sampler2D texture1;
        uniform sampler2D texture2;
        uniform float progress;
        
        varying vec2 vUv;
        
        void main() {
            gl_FragColor = vec4( mix( texture2D(texture1, vUv).xyz, texture2D(texture2, vUv).xyz, progress ), 1. );
        }
        `
        let uniforms = {
            texture1: { value: textureLoader.load(TapeTexture) },
            texture2: { value: textureLoader.load(TapeTexture2) },
            progress:  { value: 0 }
        };
        
        sticker.material = new THREE.ShaderMaterial({
            uniforms: uniforms,
            vertexShader: vertShader,
            fragmentShader: fragShader,
        });
        
        centre.material.transparent = true;
        centre.material.opacity = 0;

        //TIMELINE
        let timelineTape = new TimelineMax({ paused: true })
        
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

            .to(uniforms.progress, 1, {value: 0},1.75) //fade to texture1
            .to(uniforms.progress, 1, {value: 1},1.75) //fade to texture2
            .add(()=> { uniforms.texture1.value = textureLoader.load(TapeTexture) },2.75)// keep texture1
            .add(()=> { uniforms.texture1.value = textureLoader.load(Orange) },2.75)// change texture1
            .to(uniforms.progress, 1, {value: 0},2.75) //fade to texture1

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

        let proxyTween = TweenLite.to({}, 1, {paused: true});

        //PROGRESS LINK TO THE PERCENT SCROLL PAGE
        document.addEventListener("mousewheel", (e) => {
            
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

    this.wheel = function(Y) {
        
    }
}

export default ScrollTimeline;