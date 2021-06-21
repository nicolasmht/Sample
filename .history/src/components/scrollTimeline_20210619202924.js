import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { TimelineMax, Power4, TweenLite, TweenMax } from 'gsap';

// Utils
import getPerspectiveSize from '../utils/getPerspectiveSize';

// Textures
import TapeTexture from '../textures/tape_texture.png';
import TapeTexture2 from '../textures/tape2.png';
import Orange from '../textures/orange.jpeg';

// Object
// import TapeModel from '../objects/AudioTape/TapeCaseLast2.glb';
// import TapeModel from '../objects/AudioTape/case_closed-m.glb';
import TapeModel from '../objects/AudioTape/case_closed-m.gltf';

import soundA from '../audios/timeline/sound01.mp3'
import soundB from '../audios/timeline/sound02.mp3'
import soundC from '../audios/timeline/sound03.mp3'
import soundD from '../audios/timeline/sound04.mp3'
import soundE from '../audios/timeline/sound05.mp3'
import soundF from '../audios/timeline/sound06.mp3'
import soundG from '../audios/timeline/sound07.mp3'
import soundH from '../audios/timeline/sound08.mp3'
import soundI from '../audios/timeline/sound09.mp3'
import soundJ from '../audios/timeline/sound10.mp3'
import soundK from '../audios/timeline/sound11.mp3'
import soundL from '../audios/timeline/sound12.mp3'

import textureA from  '../textures/tape/case01.png'
import textureB from  '../textures/tape/case02.png'
import textureC from  '../textures/tape/case03.png'
import textureD from  '../textures/tape/case04.png'
import textureE from  '../textures/tape/case05.png'
import textureF from  '../textures/tape/case06.png'

function ScrollTimeline(scene, camera) {

        const loader = new GLTFLoader();
        let tape = new THREE.Object3D();

        let sound01 = new Howl({src: [soundA]});
        let sound02 = new Howl({src: [soundB], volume:0});
        let initialPose = 0;
        let isBack = false;
        let isNotPlaying = false;

         // Set camera
        // camera.position.x = -2.5;
        // camera.position.y = 2.45;
        // camera.position.z = -1.25;

        document.querySelector('#canvas').style.pointerEvents = 'none'

        // let scrollY = 0;

        loader.load( TapeModel, ( gltf ) => {
            tape = gltf.scene;
            tape.name = "Storage_group"

            tape.traverse( (child) => {
                let modelPart = child.name;
                console.log(child.name)
                switch(modelPart) {
                    case 'Storage':
                        // child.material = new THREE.MeshNormalMaterial({color:0xff0, side:THREE.DoubleSide});
                    break;
                    case 'Tape_obj':
                        // child.material.emissive = new THREE.Color('rgb(193, 145, 51)');
                        // child.position.x = -10
                    break;
                    case 'Wheel_left':
                        child.material = new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide});
                    break;
                    case 'Wheel_right':
                        child.material = new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide});
                    break;
                    case 'Tape-black_plastic':
                        child.material = new THREE.MeshBasicMaterial({color:0xD2D4BC, transparent: true, opacity: .9, side:THREE.DoubleSide});
                    break;
                    case 'case':
                        child.material = new THREE.MeshBasicMaterial({color:0xD2D4BC, transparent: true, opacity: .9, side:THREE.DoubleSide});
                    break;
                    case 'Case_b_Case_b_elem'://Grey case
                        child.material = new THREE.MeshBasicMaterial({color:0x111111, transparent: true, opacity: .9, side:THREE.DoubleSide});
                    break;
                    case 'Case_t_Case_t_elem'://Grey case
                        child.material = new THREE.MeshBasicMaterial({color:0x111111, transparent: true, opacity: .9, side:THREE.DoubleSide});
                    break;
                }
            });

            // camera.position.x = -5;
            camera.position.y = 2.45;
            camera.position.z = -1.25;

            // tape.position.z = -5;

            tape.scale.set(0.01125, 0.012, 0.012);
            // tape.position.set(-2.5115, 2.37, -1.45);
            tape.position.set(camera.position.x -0.012 , camera.position.y -0.1, camera.position.z -0.2005);
            tape.rotateY(Math.PI);

            scene.add(tape);
            console.log('cam-pos:',camera.position);
            console.log('tape-pos:',tape.position);
            // tape.position.y = 2.41

            // reScale(tape);

            initTimeline();
            initSlider();
        },
        ( xhr ) => {
            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log('An error happened');
        }
    )
    let isClosed = true;

    for(let i=1; i<7; i++) {
        document.querySelector('.cta-'+i).addEventListener('click',()=>{
            if(isClosed) {
                document.querySelector('.container_artist-panel-'+i).style.transform = 'translateX(-100%)';
                setTimeout(()=>{document.querySelector('.cross-'+i).classList.add('cross-visible')},250)
                isClosed = false;
            } else {
                document.querySelector('.container_artist-panel-'+i).style.transform = 'translateX(0%)';
                setTimeout(()=>{document.querySelector('.cross-'+i).classList.remove('cross-visible')},250)
                isClosed = true;
            }
        })
        document.querySelector('.cross-'+i).addEventListener('click',()=>{
            document.querySelector('.container_artist-panel-'+i).style.transform = 'translateX(0%)';
            setTimeout(()=>{document.querySelector('.cross-'+i).classList.remove('cross-visible')},250)
            isClosed = true;
        })
    }


    function reScale(tape) {
        let currentBox3 = new THREE.Box3().setFromObject(tape);
        const width = Math.abs(currentBox3.min.x - currentBox3.max.x);
        const height = Math.abs(currentBox3.min.y - currentBox3.max.y);
        const size = getPerspectiveSize(camera, camera.position.z); //Camera coord

        let reScale = (size.width / (Math.abs(currentBox3.max.x) + Math.abs(currentBox3.min.x))) * .78;
        // tape.scale.set(reScale, reScale, reScale);
    }

    function initTimeline() {
        let tapeGroup = tape.getObjectByName('case_tape')//Tape_obj
        let storage = tape.getObjectByName('shelves')//Storage
        let facade = tape.getObjectByName('flat_tapes')
        let caseObj = tape.getObjectByName('case')
        let tapeObj = tape.getObjectByName('Tape')
        let bobine = tape.getObjectByName('Tape-Mat1')
        let plastic = tape.getObjectByName('Tape-black_plastic')
        let caseT = tape.getObjectByName('Case_t_Case_t_elem')//Case_t
        let caseB = tape.getObjectByName('Case_b_Case_b_elem')//Case_t
        let sticker = tape.getObjectByName('Tape-sticker')//Tape_elem_2
        let centre = tape.getObjectByName('Tape-glass')//Tape_elem_4
        // let wheels = tape.getObjectByName('Tape_elem_1')
        let wheelsL = tape.getObjectByName('Wheel_left')
        let wheelsR = tape.getObjectByName('Wheel_right')

        tapeGroup.position.z = -0.4;

        // wheelsL.material = new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide});
        // wheelsR.material = new THREE.MeshBasicMaterial({color:0xffffff, side:THREE.DoubleSide});
        
        //Base color
        // plastic.material = new THREE.MeshBasicMaterial({color:0xD2D4BC, transparent: true, opacity: .9, side:THREE.DoubleSide});
        // caseObj.material = new THREE.MeshBasicMaterial({color:0xD2D4BC, transparent: true, opacity: .9, side:THREE.DoubleSide});

        // caseB.material = new THREE.MeshBasicMaterial({color:0x111111, transparent: true, opacity: .9, side:THREE.DoubleSide});
        // caseT.material = new THREE.MeshBasicMaterial({color:0x111111, transparent: true, opacity: .9, side:THREE.DoubleSide});


        // let tapeGroup = tape.getObjectByName('Tape_obj')
        // let storage = tape.getObjectByName('Storage')
        // let caseObj = tape.getObjectByName('Case')
        // let tapeObj = tape.getObjectByName('Tape')
        // let caseT = tape.getObjectByName('Case_t_Case_t_elem')
        // let sticker = tape.getObjectByName('Tape_Tape_elem-sticker')
        // let centre = tape.getObjectByName('Tape_Tape_elem-glass')
        // let wheels = tape.getObjectByName('Tape_Tape_elem-white_plastic')

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
            texture1: { value: textureLoader.load(textureA) },
            texture2: { value: textureLoader.load(textureB) },
            progress:  { value: 0 }
        };
        
        // texture1 visible a 0 
        // texture2 visible a 1
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
        .to(tapeGroup.position, 1, {z: -25}, 0.35) //decalage cassette
        .to(tapeGroup.position, 1, {y:1}, 0.5) //decalage cassette
        .to(tapeGroup.rotation, 1, {x: -2, y:1}, 0.5) //bascule cassette
        .to(storage.position, 1, {y: 40}, .65) //etagere disapear
        .to(facade.position, 1, {y: 48.804056167602539}, .65) //etagere disapear
        .to(tapeGroup.position, 1, {x: 10,y:10, z:0}, .75) //decalage cassette position page
        .to(tapeGroup.rotation, 1, {x: -3, y:2}, 1) //rotation cassette
        .to(tapeGroup.rotation, 1, {y:4.75}, 1.25) //rotation cassette sur elle meme
        .to(caseT.rotation, .5, {y: 2},1) //ouverture case
        .to(caseObj.position, .5, {x:-2,z:-2},1) //eloignement case
        .to(caseObj.position, 1, {x: -12},1.25) //eloignement case
        .to(caseT.material, .5, {opacity: 0},1.25) //degage case opacity
        .to(caseB.material, .5, {opacity: 0},1.25) //degage case opacity

        // .to(tapeGroup.rotation, 2, {y:-1.75}, 2.5) //rotation cassette sur elle meme
        .to(tapeGroup.rotation, 4, {y:-4.75,x:4}, 2) //rotation cassette sur elle meme
            
            // //Bounce txt
            // .add(()=> { if(document.querySelector('.bounce')){document.querySelector('.kaki').classList.remove('bounce')} },1) //remove bounce
            // .add(()=> { document.querySelector('.kaki').classList.add('bounce') },1.3) //add bounce
            // .add(()=> { document.querySelector('.kaki').classList.remove('bounce') },1.5) //remove bounce

        .to(tapeObj.rotation, .5, {x:-1.2,y:3.5,z:0.15}, 2) //rotation cassette droite
        .to(storage.position, 0, {y: -38.804056167602539}, 2) //etagere tp bot
        .to(facade.position, 0, {y: -30}, 2) //etagere tp bot
        //Put back
        .to(caseT.material, .5, {opacity: .9},5) //degage case opacity
        .to(caseB.material, .5, {opacity: .9},5) //degage case opacity
        .to(storage.position, 1, {y: 0}, 5.25) //etagere appear bot
        .to(facade.position, 1, {y: 8.804056167602539}, 5.25) //etagere appear bot
        .to(tapeGroup.position, 1, {x:8.560792922973633,y:8.795806884765625,z:-13}, 5) //rotation cassette sur elle meme
        .to(tapeGroup.rotation, 1, {x:0,y:0,z:0}, 5) //rotation cassette sur elle meme
        .to(caseT.rotation, 1, {x:0,y:4,z:0},5) //ouverture case
        .to(caseT.rotation, 1, {x:0,y:0,z:0},5.5) //ouverture case
        .to(caseObj.position, 1, {x:0,y:0,z:0},5) //eloignement case
        .to(tapeObj.rotation, 1, {x:0,y:0,z:0}, 5) //rotation cassette droite
        .to(tapeGroup.position, 1, {x:8.560792922973633,y:8.795806884765625,z:-0.4}, 6) //rotation cassette sur elle meme


        //PLAY SOUND AND CHANGE TEXTURE
        .add(()=> { console.log('Step 1 t:1')
            if(isBack && isNotPlaying) {
                switchSound(soundA, soundB)
                switchSoundText('1948','Pierre Schaeffer','Études de bruits','1948','Pierre Schaeffer','Études aux chemins de fer')
                isNotPlaying = false
            }
        },1) // STEP 1
        .add(()=> { console.log('Step 2 t:1.75')
            switchSound(soundC, soundD)
            switchSoundText('1966','The Beatles','Tomorrow Never Knows','1967','The Beatles','Flying')
            isNotPlaying = true;
            isBack = true;
        },1.75) // STEP 2 passage texture 2
        .to(plastic.material.color, .25, {r:210/255,g:212/255, b:188/255 }, 1.75) //color 1
        .to(plastic.material.color, .25, {r:244/255,g:220/255, b:181/255 }, 1.75) //color 2
        .to(uniforms.progress, .25, {value: 0},1.5) //fade to textureA
        .to(uniforms.progress, .25, {value: 1},1.5) //fade to textureB
        .add(()=> { uniforms.texture1.value = textureLoader.load(textureA) },1.75) //blue
        .add(()=> { uniforms.texture2.value = textureLoader.load(textureB) },1.75) //cyan

        .add(()=> { console.log('Step 3 t:2.35')
            switchSound(soundE, soundF)
            switchSoundText('1969','The Winstons','Amen Brother','2011','Nicky Minaj','Save Me')
        },2.35) // STEP 3 passage texture 1
        .to(plastic.material.color, .25, {r:244/255,g:220/255, b:181/255 }, 2.35) //color 2
        .to(plastic.material.color, .25, {r:195/255,g:191/255, b:215/255 }, 2.35) //color 3
        .to(uniforms.progress, .25, {value: 1},2.1) //fade to textureC
        .add(()=> { uniforms.texture2.value = textureLoader.load(textureB) },2.35) //cyan
        .add(()=> { uniforms.texture1.value = textureLoader.load(textureC) },2.35) //prune
        .to(uniforms.progress, .25, {value: 0},2.35) //fade to texture1
        
        .add(()=> { console.log('Step 4 t:3.15')
            switchSound(soundG, soundH)
            switchSoundText('1984','Jean Michel Jarre','Zoolook','1978','Jean Michel Jarre','Equinox')
        },3.15) // STEP 4 passage texture 2
        .to(plastic.material.color, .25, {r:195/255,g:191/255, b:215/255 }, 3.3) //color 3
        .to(plastic.material.color, .25, {r:200/255,g:209/255, b:208/255 }, 3.3) //color 4
        .add(()=> { uniforms.texture2.value = textureLoader.load(textureB) },2.9) //cyan
        .add(()=> { uniforms.texture2.value = textureLoader.load(textureD) },2.9) //orange
        .to(uniforms.progress, .25, {value: 1},3.15) //fade to texture2
        .add(()=> { uniforms.texture1.value = textureLoader.load(textureC) },3.3) //prune

        .add(()=> { console.log('Step 5 t:3.85')
            switchSound(soundI, soundJ)
            switchSoundText('1989','Ice Cube','Interview about SP-1200','1997','DJ Muggs of Cypress Hill','Rhyme & Reason" documentary')
        },3.85) // STEP 5
        .to(plastic.material.color, .25, {r:200/255,g:209/255, b:208/255 }, 4) //color 4
        .to(plastic.material.color, .25, {r:213/255,g:200/255, b:218/255 }, 4) //color 5
        .add(()=> { uniforms.texture2.value = textureLoader.load(textureD) },3.6) //keep orange
        .add(()=> { uniforms.texture1.value = textureLoader.load(textureE) },3.6) //change purple
        .to(uniforms.progress, .25, {value: 0},3.85) //fade to texture1
        .add(()=> { uniforms.texture2.value = textureLoader.load(textureD) },4) //keep orange

        .add(()=> { console.log('Step 6 t:4.65')
            switchSound(soundK, soundL)
            switchSoundText('1997','The Verve','Bitter Sweet Symphony','1965','The Rolling Stones','The Last Time')
        },4.65) // STEP 6
        .to(plastic.material.color, .25, {r:213/255,g:200/255, b:218/255 }, 4.65) //color 5
        .to(plastic.material.color, .25, {r:190/255,g:219/255, b:219/255 }, 4.65) //color 6
        .add(()=> { uniforms.texture1.value = textureLoader.load(textureE) },4.65) //keep purple
        .add(()=> { uniforms.texture2.value = textureLoader.load(textureF) },4.65) //change green
        .to(uniforms.progress, .25, {value: 1},4.65) //fade to texture2

        .add(()=> { document.querySelector('#canvas').style.pointerEvents = 'none' },6) //remove
        .add(()=> { document.querySelector('#canvas').style.pointerEvents = 'initial' },6.1) //remove

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

            wheelsL.rotation.x += 0.025;
            wheelsR.rotation.x += 0.025;
        });
    }

    function switchSoundText(dateT, artistT, titleT, dateB, artistB, titleB) {
        document.querySelector('.txt_slider-top').style.opacity = 0
        document.querySelector('.txt_slider-bot').style.opacity = 0

        setTimeout(()=> {
            document.querySelector('.txt_slider-top').style.opacity = 1
            document.querySelector('.txt_slider-bot').style.opacity = 1
            document.querySelector('.txt_slider-top .date').innerHTML = dateT
            document.querySelector('.txt_slider-top .artist').innerHTML = artistT
            document.querySelector('.txt_slider-top .title').innerHTML = titleT
            
            document.querySelector('.txt_slider-bot .date').innerHTML = dateB
            document.querySelector('.txt_slider-bot .artist').innerHTML = artistB
            document.querySelector('.txt_slider-bot .title').innerHTML = titleB
        },500)
    }

    function switchSound(soundOne, soundTwo) {
        sound01.once( 'fade', () => { 
            sound01.stop() 
            sound01 = new Howl({src: [soundOne]})
            sound01.seek(0);
            sound01.play()
            sound01.fade(0,1,100)
        });
        sound01.fade( sound01.volume(), 0, 1000 );

        sound02.once( 'fade', () => { 
            sound02.stop() 
            sound02 = new Howl({src: [soundTwo],volume:0})
            sound02.seek(0);
            sound02.play()
        });
        sound02.fade( sound02.volume(), 0, 1000 );

        
        // gsap.to(document.querySelector('.slider').style, {top: 0 , duration:700})
        // TweenMax.to(document.querySelector('.slider').style, 1, {top:-10});
        document.querySelector('.slider').style.top = -20+'px'
        document.querySelector('.slider').style.transition = 'all .25s ease-out'
        setTimeout(()=>{
            document.querySelector('.slider').style.transition = 'none'
        },250)
        // document.querySelector('.slider').style.top = -10+'px'

        initialPose = 0
    }

    //SLIDER
    function initSlider() {
        
        sound01.play();
        sound02.play();

        let sliderPos;
        let currentPos = 0;

        const slider = document.querySelector( '.slider' );

        function onPointerDown(e) {

            if ( event.isPrimary === false ) return;
           
            currentPos = e.clientY;

            window.addEventListener( 'pointermove', onPointerMove );
            window.addEventListener( 'pointerup', onPointerUp );

        }

        function onPointerUp(e) {

            window.removeEventListener( 'pointermove', onPointerMove );
            window.removeEventListener( 'pointerup', onPointerUp );
            // initialPose = slider.style.top
            initialPose = parseFloat(slider.style.top.replace('px','')) + 10

        }

        function onPointerMove( e ) {

            if ( event.isPrimary === false ) return;

            // console.log( e);
            sliderPos = Math.max( 0, Math.min( 200, (e.clientY + initialPose) - currentPos) );
            // console.log(sliderPos);


            // Mets le slider à une position - sa propre taille 
            slider.style.top = sliderPos - ( slider.offsetWidth / 2 ) + "px";

            console.log((((sliderPos - slider.offsetWidth)/1000)+0.04)*5);
            console.log(((((1000 - sliderPos) - slider.offsetWidth)/1000)-0.76)*5);
            sound02.volume((((sliderPos - slider.offsetWidth)/1000)+0.04)*5);
            sound01.volume(((((1000 - sliderPos) - slider.offsetWidth)/1000)-0.76)*5);

            // console.log((sliderPos - slider.offsetWidth)/1000);
            // console.log(((1000 - sliderPos) - slider.offsetWidth)/1000);

            // sound02.volume((sliderPos - slider.offsetWidth)/1000);
            // sound01.volume(((1000 - sliderPos) - slider.offsetWidth)/1000);

        }

        slider.style.touchAction = 'none'; // disable touch scroll
        slider.addEventListener( 'pointerdown', onPointerDown);

    }


    this.update = function(time) {
    }

    this.helpers = (gui) => {
    }

    this.wheel = function(Y) {
        // scrollY = Y/3;
    }

    this.mousemove = function(event) {}

    this.keyup = function(e) {}
}

export default ScrollTimeline;