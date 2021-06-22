import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { gsap, TimelineMax, Power4, TweenLite, Elastic, Bounce } from 'gsap';
import {Howl, Howler} from 'howler';
import { EffectComposer, EffectPass, RenderPass, BlendFunction, BloomEffect } from "postprocessing";
import SoundAnalyser from '../utils/soundAnalyser';
import { InteractionManager } from "three.interactive";
import interpolate from 'interpolate-range';

// Object
import daftPunkModel from '../objects/focus_daft-punk_texture.gltf';
import daftPunkCadrillage from '../objects/focus_daft-punk_cadrillage.gltf';
import mistTexture from '../textures/mist2.jpg';
import sound1 from '../audios/tundra-beats.mp3';
import sound2 from '../audios/RFL.mp3';

import sound0101 from '../audios/focus/daftPunk/01_Barry_White_im-gonna-love-you-just-a-little-more-baby.mp3';
import sound0102 from '../audios/focus/daftPunk/01-2_Daft_Punk_Da_Funk.mp3';
import sound0201 from '../audios/focus/daftPunk/02_Sister_sledge_Il-macquillage-lady.mp3';
import sound0202 from '../audios/focus/daftPunk/02-2_Daft_Punk_Aerodynamic.mp3';
import sound0301 from '../audios/focus/daftPunk/03_Daft_Punk_Voyager.mp3';
import sound0302 from '../audios/focus/daftPunk/03-2_Daft_Punk_Technologic.mp3';
import sound0401 from '../audios/focus/daftPunk/04_The_Sherbs_We_Ride_Tonight.mp3';
import sound0402 from '../audios/focus/daftPunk/04-2_Daft_Punk_Contact.mp3';
import Player from './Player';

function DaftPunk(sceneMain, cameraMain, interactionManagerMain) {

    let player = null;

    //AUDIO ANALYSER
    let context = new (window.AudioContext || window.webkitAudioContext)(); // Création de l'instance
    let analyser = context.createAnalyser();
    let frequencyData = new Uint8Array(analyser.frequencyBinCount);
    
    let arraySound = [sound0101, sound0201, sound0301, sound0401];
    let baseSound = 0;

    let isStart = false;

    let ambiantSound1 = new SoundAnalyser(context, sound0101, analyser, function (th) { /*th.play()*/ })
    let ambiantSound2 = new SoundAnalyser(context, sound0201, analyser, function () {})
    let ambiantSound3 = new SoundAnalyser(context, sound0301, analyser, function () {})
    let ambiantSound4 = new SoundAnalyser(context, sound0401, analyser, function () {})
    
    let winScreen = document.querySelector('.focus-daftpunk .win');

    //SCENE
    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 200);
    camera.position.z = 9;
    
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    // renderer.setClearColor(0xEEF2FF, 1);
    renderer.setClearColor(0x000000, 1);
    document.querySelector('.focus-daftpunk').appendChild(renderer.domElement);

    camera.position.set(0, 15, 40);
    camera.lookAt(new THREE.Vector3(0, 0, 0));

    //INIT INTERACTIONMANAGER
    const interactionManager = new InteractionManager(
        renderer,
        camera,
        renderer.domElement
    );

    // POST PROCESSING
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.setSize(window.innerWidth, window.innerHeight);

    composer.addPass(new EffectPass(camera, new BloomEffect()));

    // LIGHT
    // const light = new THREE.AmbientLight({ color: 0x404040, intensity: 1 });
    // scene.add(light);

     //POINTLIGHT
     let pointLight = new THREE.PointLight( 0xff0000, 0, 350 );
     pointLight.position.set( 0, 0, 0 );
    //  let pointLightHelper = new THREE.PointLightHelper( pointLight, 2 );
     scene.add( pointLight );
    //  scene.add( pointLightHelper );

     let pointLight2 = new THREE.PointLight( 0xffffff, 0.5, 250 );
     pointLight2.position.set( 10, -10, 3 );
    //  let pointLight2Helper = new THREE.PointLightHelper( pointLight2, 2 );
     scene.add( pointLight2 );
    //  scene.add( pointLight2Helper );

     let pointLight3 = new THREE.PointLight( 0xffffff, 0, 250 );
     pointLight3.position.set( 0, 10, 2 );
    //  let pointLight3Helper = new THREE.PointLightHelper( pointLight3, 2 );
     scene.add( pointLight3 );
    //  scene.add( pointLight3Helper );

    let soundA = new Howl({ src: [sound0102] });
    let soundB = new Howl({ src: [sound0202] });
    let soundC = new Howl({ src: [sound0302] });
    let soundD = new Howl({ src: [sound0402] });


    const loader = new GLTFLoader();
    let pyramid = new THREE.Object3D();
    let cadrillage = new THREE.Object3D();

    loader.load( daftPunkModel, ( gltf ) => {
            pyramid = gltf.scene;
            pyramid.name = "Storage_group"

            pyramid.traverse( (child) => {
                if(child.material) {
                    const oldMat = child.material;
                    //Lambert light / Basic perf
                    child.material = new THREE.MeshBasicMaterial({
                        map: oldMat.map
                    });

                    oldMat.dispose();
                }
            });

            scene.add(pyramid)
            pyramid.position.y = -10;

            initInteraction();
        },
        ( xhr ) => {
            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log( 'An error happened' );
        }
    );

    loader.load( daftPunkCadrillage, ( gltf ) => {
            cadrillage = gltf.scene;
            cadrillage.name = "Cadrillage"

            cadrillage.traverse( (child) => {
                // console.log(child)
                child.material = new THREE.MeshPhongMaterial({ color:0x0000ff, shininess:50, side:THREE.FrontSide });
            });

            scene.add(cadrillage);
            cadrillage.position.y = -7;
            cadrillage.position.x = 10;
            cadrillage.scale.x = 1.5;
        },
        ( xhr ) => {
            // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log( 'An error happened' );
        }
    )
    
    //Floor
    const texture = new THREE.TextureLoader().load( mistTexture );
    const geoPlane = new THREE.CircleGeometry( 72, 30 );
    const matPlane = new THREE.MeshBasicMaterial( {color: 0xeeeeee,transparent: true, opacity: .5, map:texture, side: THREE.FrontSide} );
    const plane = new THREE.Mesh( geoPlane, matPlane );
    plane.rotation.x = Math.PI/2
    plane.scale.x = 1.27
    plane.position.y = -15
    scene.add( plane );
    
    //Miror
    const geoMiror = new THREE.CircleGeometry( 72, 100 );
    let groundMirror = new Reflector( geoMiror, {
        clipBias: 0.0003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x222222
    } );
    groundMirror.rotation.x = -Math.PI/2
    groundMirror.scale.x = 1.23
    groundMirror.position.y = -15
    scene.add( groundMirror );
    
    function initInteraction() {

        let pyramidB = pyramid.getObjectByName('bas')
        let pyramidT = pyramid.getObjectByName('haut')
        let pyramidModel = pyramid.getObjectByName('Pyramid')
        let pyramidB1 = pyramid.getObjectByName('Pyramid_bas_1')
        let pyramidB2 = pyramid.getObjectByName('Pyramid_bas2')
        let pyramidB3 = pyramid.getObjectByName('Pyramid_bas3')
        let pyramidB4 = pyramid.getObjectByName('Pyramid_bas4')
        let baseRotationBot = pyramidB.rotation.y;
        let baseRotationTop = pyramidT.rotation.y;
        let multiplicateur = 1;
        let turn = 0;
        let firstClick = true;
        let isComplete = false;
        let faceFind = 0;

        let ambiantSound = 1;

        let drag = false;
        let mouseDown = false
        let dragProgress = baseRotationBot;

        //RAYCAST BOT FACE FOR SOUND
        let faceTarget;
        let botArray = [pyramidB1,pyramidB2,pyramidB3,pyramidB4,pyramidT];
        interactionManager.add(pyramidB1);
        interactionManager.add(pyramidB2);
        interactionManager.add(pyramidB3);
        interactionManager.add(pyramidB4);
        interactionManager.add(pyramidT);

        botArray.forEach(e => {
            e.addEventListener('mouseover',(t)=> {
                // console.log(t.target.name)
                t.stopPropagation()
                faceTarget = t.target.name
                setTimeout(()=> {
                    soundA.stop()
                    soundB.stop()
                    soundC.stop()
                    soundD.stop()
                    switch (faceTarget) {
                        case 'haut': //Dog
                            if(ambiantSound = 1) { ambiantSound4.upVolume(); }
                            if(ambiantSound = 2) { ambiantSound1.upVolume(); }
                            if(ambiantSound = 3) { ambiantSound2.upVolume(); }
                            if(ambiantSound = 4) { ambiantSound3.upVolume(); }
                            break;
                        case 'Pyramid_bas_1': //Dog
                                // console.log('Face 1: Dog')
                                soundA.play();
                                player.playSound({title: 'Da Funk', artist: 'Daft Punk', date: '1995'})//0102
                                if(ambiantSound = 1) { ambiantSound4.stop(); }
                                if(ambiantSound = 2) { ambiantSound1.stop(); }
                                if(ambiantSound = 3) { ambiantSound2.stop(); }
                                if(ambiantSound = 4) { ambiantSound3.stop(); }
                            break;
                        case 'Pyramid_bas2': //Spatial
                                // console.log('Face 2: SPatial')
                                soundB.play();
                                player.playSound({title: 'Aerodynamic', artist: 'Daft Punk', date: '2001'})//0202
                                if(ambiantSound = 1) { ambiantSound4.stop(); }
                                if(ambiantSound = 2) { ambiantSound1.stop(); }
                                if(ambiantSound = 3) { ambiantSound2.stop(); }
                                if(ambiantSound = 4) { ambiantSound3.stop(); }
                            break;
                        case 'Pyramid_bas3': //Hand
                                // console.log('Face 3: Hand')
                                soundC.play();
                                player.playSound({title: 'Touch it / Technologic (Alive 2007)', artist: 'Daft Punk', date: '2007'})//0302
                                if(ambiantSound = 1) { ambiantSound4.stop(); }
                                if(ambiantSound = 2) { ambiantSound1.stop(); }
                                if(ambiantSound = 3) { ambiantSound2.stop(); }
                                if(ambiantSound = 4) { ambiantSound3.stop(); }
                            break;
                        case 'Pyramid_bas4': //Phone
                                // console.log('Face 4: Phone')
                                soundD.play();
                                player.playSound({title: 'Contact', artist: 'Daft Punk', date: '2013'})//0402
                                if(ambiantSound = 1) { ambiantSound4.stop(); }
                                if(ambiantSound = 2) { ambiantSound1.stop(); }
                                if(ambiantSound = 3) { ambiantSound2.stop(); }
                                if(ambiantSound = 4) { ambiantSound3.stop(); }
                            break;
                        default:
                            break;
                    }
                },500)
            })
        });

        //RAYCAST TOP OR BOTTOM TARGET
        let targetPyramid = pyramidB
        // let modelArray = [pyramidB,pyramidT];
        // interactionManager.add(pyramidB);
        // interactionManager.add(pyramidT);
        // modelArray.forEach(e => {
        //     e.addEventListener('mousedown',(t)=> {
        //         t.stopPropagation()
        //         switch (t.target.name) {
        //             case 'bas':
        //                 targetPyramid = pyramidB
        //                 break;
        //             case 'haut':
        //                 targetPyramid = pyramidT
        //                 break;
        //             default:
        //                 break;
        //         }
        //     })
        // })

        let mousedown = document.addEventListener('mousedown', () => {
            drag = false
            mouseDown = true
        });
        let mousemove = document.addEventListener('mousemove', (e) => {
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
        let mouseup = document.addEventListener('mouseup', () => {
            let nextFace = ( baseRotationTop + (( Math.PI / 2 ) * multiplicateur )) + (( Math.PI * 2 ) * turn );
            let tlRotation = new TimelineMax({})
                .to(targetPyramid.rotation, 1, {ease:Elastic.easeOut.config(2,1), y: nextFace}, 0)
                .add(()=> {
                    let initialPosition = (nextFace - ((Math.PI*2)*turn)).toFixed(2)
                    let tlFusion = new TimelineMax({})
                    //If two face aligné (soustraction des angles de rotation)
                    // console.log('initialPositionIncrement:',parseFloat(initialPosition),'baseRotationTop:',(baseRotationTop+((Math.PI/2)*faceFind)).toFixed(2));
                    // console.log('result:',(initialPosition - (baseRotationTop+((Math.PI/2)*faceFind)).toFixed(2)));
                    if((parseFloat(initialPosition) - (baseRotationTop+((Math.PI/2)*faceFind)).toFixed(2)) == 0 && isComplete == false) {
                        if(faceFind<3) {
                            faceFind += 1;
                        } else {
                            faceFind = 0;
                        }
                        isComplete=true
                        tlFusion.to(pyramidT.position, 2, {ease:Bounce.easeIn, y: -1}, 0)
                                .to(pyramidT.scale, 2, {ease:Bounce.easeIn, x: 1.28, y:1.29, z:1.29}, 0)
                                .to(pyramid.rotation, 2, { y: Math.PI*2}, 1)
                                .to(pointLight3, 2, { intensity:1}, 1.5)
                    
                    //SWITCH SOUND +1
                    // } if((parseFloat(initialPosition) - (baseRotationTop+((Math.PI/2)*faceFind)).toFixed(2)) != 0 && isComplete == true) { //turn after find
                    // } if(parseFloat(initialPosition) - baseRotationTop.toFixed(2) != 0 && isComplete == true) { //turn after find
                    } if(pyramidT.position.y == -1 && isComplete == true) { //turn after find
                        // setTimeout(()=>{
                            // console.log('remove');
                            // ambiantSound.onStop()
                            if(baseSound<3){
                                baseSound += 1;
                            } else {
                                baseSound = 0;
                            }

                            switch (baseSound) {
                                case 0:
                                        soundA.stop()
                                        soundB.stop()
                                        soundC.stop()
                                        soundD.stop()
                                        ambiantSound4.stop();
                                        setTimeout(()=>{
                                            winScreen.classList.add('show');
                                            ambiantSound = 1;
                                        },200)
                                    break;
                                case 1:
                                        soundA.stop()
                                        soundB.stop()
                                        soundC.stop()
                                        soundD.stop()
                                        ambiantSound1.stop();
                                        setTimeout(()=>{
                                            ambiantSound2.play();
                                            ambiantSound2.upVolume();
                                            player.playSound({title: 'Il Macquillage lady', artist: 'Sister sledge ', date: '1982'})//0201
                                            ambiantSound = 2;
                                        },200)
                                    break;
                                case 2:
                                        soundA.stop()
                                        soundB.stop()
                                        soundC.stop()
                                        soundD.stop()
                                        ambiantSound2.stop();
                                        setTimeout(()=>{
                                            ambiantSound3.play();
                                            ambiantSound3.upVolume();
                                            player.playSound({title: 'Voyager', artist: 'Daft Punk', date: '2001'})//0301
                                            ambiantSound = 3;
                                        },200)
                                    break;
                                case 3:
                                        soundA.stop()
                                        soundB.stop()
                                        soundC.stop()
                                        soundD.stop()
                                        ambiantSound3.stop();
                                        setTimeout(()=>{
                                            ambiantSound4.play();
                                            ambiantSound4.upVolume();
                                            player.playSound({title: 'We Ride Tonight', artist: 'The Sherbs', date: '1972'})//0401
                                            ambiantSound = 4;
                                        },200)
                                    break;
                                default:
                                    break;
                            }

                            tlFusion.to(pyramidT.position, 1, { y: 2.8129539489746094}, 0)
                                    .to(pyramidT.scale, 1, {ease:Bounce.easeIn, x: 1, y:1, z:1}, 0)
                                    .to(pyramidT.rotation, 1, {ease:Bounce.easeIn, y:pyramidT.rotation.y + (Math.PI/2)}, 0)//turn top pyramid 1time
                                    .to(pyramid.rotation, 0, {y:0}, 0)
                                    .to(pointLight3, 2, { intensity:0}, 1)
                            isComplete = false
                        // },4000)
                    }
                },1)
            mouseDown = false
        });
    }

    const clock = new THREE.Clock();
    let idAnimation = null;

    var render = function () {
        idAnimation = requestAnimationFrame(render);
        composer.render(clock.getDelta());

        //POINTLIGHT SOUND INTENSITY
        analyser.getByteFrequencyData(frequencyData);
        pointLight.intensity = frequencyData[0]/20;
        if(frequencyData[0]/20 < 4) {
            pointLight.intensity = 2
            // gsap.to(pointLight, .05, {intensity: 2})
        }
        if(frequencyData[0]/20 > 4 && frequencyData[0]/20 < 6) {
            pointLight.intensity = 4
            // gsap.to(pointLight, .05, {intensity: 4})
        }
        if(frequencyData[0]/20 > 6 && frequencyData[0]/20 < 6.5) {
            pointLight.intensity = 8
            // gsap.to(pointLight, .05, {intensity: 8})
        }
        if(frequencyData[0]/20 > 6.5 && frequencyData[0]/20 < 7) {
            pointLight.intensity = 15
            // gsap.to(pointLight, .05, {intensity: 17})
        }
        if(frequencyData[0]/20 > 7 && frequencyData[0]/20 < 7.3) {
            pointLight.intensity = 22
            // gsap.to(pointLight, .05, {intensity: 22})
        }
        if(frequencyData[0]/20 > 7.3 && frequencyData[0]/20 < 9) {
            pointLight.intensity = 26
            // gsap.to(pointLight, .05, {intensity: 22})
        }
        if(frequencyData[0]/20 > 9 ) {
            pointLight.intensity = 30
            // gsap.to(pointLight, .05, {intensity: 30})
        }

        interactionManager.update();

        renderer.render(scene, camera);
    }

    this.start = function() {

        player = new Player();
        player.playSound({title: 'Im gonna love you just a little more baby', artist: 'Barry White', date: '1973'})//0101

        if (isStart) return;

        ambiantSound1.play();
        render();

        isStart = true;
    }

    this.stop = function() {

        player.toggle(false);

        isStart = false;

        ambiantSound1.stop();
        ambiantSound2.stop();
        ambiantSound3.stop();
        ambiantSound4.stop();

        mousemove.removeEventListener();
        mousedown.removeEventListener();
        mouseup.removeEventListener();

        soundA.stop();
        soundB.stop();
        soundC.stop();
        soundD.stop();

        window.cancelAnimationFrame(idAnimation);
    }

    this.update = function(time) {
    }

    this.mousemove = function(event) {}

    this.helpers = (gui) => {
        const folder = gui.addFolder("DaftPunk");
        folder.add(camera.position, "x");
        folder.add(camera.position, "y");
        folder.add(camera.position, "z");

        // folder.add(light, 'intensity');
    }

    this.wheel = function(Y) {
        
    }

    this.keyup = function(e) {
       
    }
}

export default DaftPunk;