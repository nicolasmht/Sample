import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { TimelineMax, Power4, TweenLite, Elastic, Bounce } from 'gsap';
import {Howl, Howler} from 'howler';
import { EffectComposer, EffectPass, RenderPass, BlendFunction, BloomEffect } from "postprocessing";

// Object
import daftPunkModel from '../objects/focus_daft-punk_texture.gltf';
import daftPunkCadrillage from '../objects/focus_daft-punk_cadrillage.gltf';
import mistTexture from '../textures/mist2.jpg';
import sound1 from '../audios/tundra-beats.mp3';
import sound2 from '../audios/RFL.mp3';
import { sRGBEncoding } from 'three';

function DaftPunk(sceneMain, cameraMain, interactionManager) {

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

    // POST PROCESSING
    const composer = new EffectComposer(renderer);
    composer.addPass(new RenderPass(scene, camera));
    composer.setSize(window.innerWidth, window.innerHeight);

    composer.addPass(new EffectPass(camera, new BloomEffect()));

    // LIGHT
    const light = new THREE.AmbientLight({ color: 0x404040, intensity: 1 });
    // scene.add(light);

     //PointLight
     let pointLight = new THREE.PointLight( 0xff0000, 10, 350 );
     pointLight.position.set( 0, 0, 0 );
     var pointLightHelper = new THREE.PointLightHelper( pointLight, 2 );
     scene.add( pointLight );
     scene.add( pointLightHelper );

     let pointLight2 = new THREE.PointLight( 0xffffff, 0.5, 250 );
     pointLight2.position.set( 10, -10, 3 );
     var pointLight2Helper = new THREE.PointLightHelper( pointLight2, 2 );
     scene.add( pointLight2 );
     scene.add( pointLight2Helper );

    let soundA = new Howl({ src: [sound1] });
    let soundB = new Howl({ src: [sound2] });


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
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
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
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log( 'An error happened' );
        }
    )

    const texture = new THREE.TextureLoader().load( mistTexture );
    const geoPlane = new THREE.CircleGeometry( 72, 30 );
    const matPlane = new THREE.MeshBasicMaterial( {color: 0xeeeeee,transparent: true, opacity: .5, map:texture, side: THREE.FrontSide} );
    const plane = new THREE.Mesh( geoPlane, matPlane );
    plane.rotation.x = Math.PI/2
    plane.scale.x = 1.23
    plane.position.y = -15
    scene.add( plane );
    
    //Miror
    const geoMiror = new THREE.CircleGeometry( 72, 100 );
    let groundMirror = new Reflector( geoMiror, {
        clipBias: 0.0003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x666666
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

        let drag = false;
        let mouseDown = false
        let dragProgress = baseRotationBot;
                
        //RAYCAST BOT FACE FOR SOUND
        let faceTarget;
        let botArray = [pyramidB1,pyramidB2,pyramidB3,pyramidB4];
        interactionManager.add(pyramidB1);
        interactionManager.add(pyramidB2);
        interactionManager.add(pyramidB3);
        interactionManager.add(pyramidB4);

        botArray.forEach(e => {
            e.addEventListener('mouseover',(t)=> {
                console.log(t.target.name)
                t.stopPropagation()
                faceTarget = t.target.name
                setTimeout(()=> {
                    soundA.stop()
                    soundB.stop()
                    switch (faceTarget) {
                        case 'Pyramid_bas_1': //green
                                console.log('face 1')
                                soundA.play();
                            break;
                        case 'Pyramid_bas2': //blue
                                console.log('face 2')
                                soundB.play();
                            break;
                        default:
                            break;
                    }
                },500)
            })
        });

        //RAYCAST TOP OR BOTTOM TARGET
        let targetPyramid = pyramidB
        let modelArray = [pyramidB,pyramidT];
        interactionManager.add(pyramidB);
        interactionManager.add(pyramidT);
        modelArray.forEach(e => {
            e.addEventListener('mousedown',(t)=> {
                t.stopPropagation()
                switch (t.target.name) {
                    case 'bas':
                        targetPyramid = pyramidB
                        break;
                    case 'haut':
                        targetPyramid = pyramidT
                        break;
                    default:
                        break;
                }
            })
        })

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

    const clock = new THREE.Clock();
    let idAnimation = null;

    var render = function () {
        idAnimation = requestAnimationFrame(render);
        composer.render(clock.getDelta());

        // mirrorSphere.visible = false;
        // mirrorSphereCamera.update( renderer, scene );
        // mirrorSphere.visible = true;

        renderer.render(scene, camera);
    }

    this.start = function() {
        render();
    }

    this.stop = function() {
        window.cancelAnimationFrame(idAnimation);
    }

    this.update = function(time) {
        interactionManager.update();
    }

    this.mousemove = function(event) {}

    this.helpers = (gui) => {
        const folder = gui.addFolder("DaftPunk");
        folder.add(camera.position, "x");
        folder.add(camera.position, "y");
        folder.add(camera.position, "z");

        folder.add(light, 'intensity');
    }

    this.wheel = function(Y) {
        
    }

    this.keyup = function(e) {
       
    }
}

export default DaftPunk;