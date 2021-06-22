import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';
import { Howler } from 'howler';

// Packages
import { TimelineMax, Power4, TweenLite, EaseInOut, EaseOut } from 'gsap';

// Utilis
import getNDCCoordinates from '../utils/mouse';

// Gltf
import LaboGltf from '../objects/Cabinet.gltf';

// Pin
import Aznavour from '../textures/Labo/Aznavour.png';
import Britney from '../textures/Labo/Britney.png';
import DaftPunk from '../textures/Labo/Daft-Punk.png';
import Gainsbourg from '../textures/Labo/Gainsbourg.png';
import Memo from '../textures/Labo/Memo.png';
import Polo from '../textures/Labo/Polo.png';
import Renaud from '../textures/Labo/Renaud.png';
import Retour from '../textures/Labo/Retour.png';

import PinInactif from '../textures/Labo/Pin_Cab_Inactif.png';
import PinHover from '../textures/Labo/Pin_Cab_Hover.png';

import TextureGravure01 from '../textures/scratch-01.png';
import TextureGravure02 from '../textures/scratch-02.png';
import TextureGravure03 from '../textures/scratch-03.png';

import TextureScene from '../textures/textures_gravure/test02.png';
import TextureScene04 from '../textures/textures_gravure/test03.png';

import fiveT from '../textures/fivetoner.jpg';

import RenaudComponent from './Renaud';
import GainsbourgComponent from './Gainsbourg';
import AznavourComponent from './Aznavour';
import MemoryComponent from './Memory';
import PoloComponent from './Polo';
import DaftPunkComponent from './daftPunk';
import KaleidoscopeComponent from './Kaleidoscope';

import AmbientSound from '../audios/tundra-beats.mp3';

function LaboComponent(scene, camera, renderer, interactionManager) {

    var sound = new Howl({
        src: [AmbientSound],
        loop: true,
    });

    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
    const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

    // Instantiate a loader
    const loader = new GLTFLoader();

    // Optional: Provide a DRACOLoader instance to decode compressed mesh data
    // const dracoLoader = new DRACOLoader();
    // dracoLoader.setDecoderPath(LaboGltf);
    // loader.setDRACOLoader(dracoLoader);

    let labo = new THREE.Object3D();

    const texture01 = new THREE.TextureLoader().load(TextureGravure01);
    const texture02 = new THREE.TextureLoader().load(TextureScene);
    const texture03 = new THREE.TextureLoader().load(TextureGravure03);
    const texture04 = new THREE.TextureLoader().load(TextureScene04);

    texture04.wrapS = THREE.RepeatWrapping;
    texture04.wrapT = THREE.RepeatWrapping;
    texture01.minFilter = THREE.LinearMipMapLinearFilter;
    texture01.magFilter = THREE.LinearFilter;
    texture01.magFilter = THREE.CubeUVReflectionMapping;

    texture04.rotation = 45;

    loader.load( LaboGltf, ( gltf ) => {

        let mat;
        labo = gltf.scene;
        labo.name = "labo"

        const fiveTone = new THREE.TextureLoader().load(fiveT)

        labo.traverse( (child) => {
            if(child.material) {
                mat = child.material;

                if (child.name == "plante") return;

                if (
                    child.name == 'cloche1' ||
                    child.name == 'verre' ||
                    child.name == 'cloche' ||
                    child.name == 'cordes' ||
                    child.name == 'cloche_1'
                ) {

                    child.material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        color: 0xffffff,
                        transparent: true,
                        opacity: 0.08
                    });
                    
                } else if (
                    child.name == 'cadran_solaire-cadran' ||
                    child.name == "herbier-herbier" ||
                    child.name == "map" ||
                    child.name == "Pochettes_Vinyle_Opti-vynils" ||
                    child.name == "mistral_gagnant-mistral" ||
                    child.name == "billet" ||
                    child.name == "Wings_wings" || 
                    child.name == "Cube012" ||
                    child.name == "plume_1" ||
                    child.name == "toxic" ||
                    child.name == "cordes_1" ||
                    child.name == "Plane2" ||
                    child.name == "carte_dessus" ||
                    child.name == "Cube_4" ||
                    child.name == "paquet"
                ) {

                    if (child.name != "child.material" || child.name == "herbier-herbier") return;

                    child.material = new THREE.MeshBasicMaterial({
                        side: THREE.DoubleSide,
                        map: child.material.map,
                        transparent: true
                    });
                    
                } else {

                    child.material = new THREE.MeshToonMaterial({
                        side: THREE.DoubleSide,
                        gradientMap: fiveTone,
                        map: texture02,
                    });

                    if (child.name == "desk_haut_1") {
                        child.material.map = texture04;
                    }

                    if (child.name == 'wall') child.material.map = null;

                    // if (
                    //     child.name == 'desk_tiroirs001' ||
                    //     child.name == 'desk_tiroirs002' ||
                    //     child.name == 'desk_tiroirs003' ||
                    //     child.name == 'desk_tiroirs004' ||
                    //     child.name == 'desk_tiroirs005' ||
                    //     child.name == 'desk_tiroirs006' ||
                    //     child.name == 'desk_tiroirs009'
                    // ) {
                    //     child.material.map = texture03;
                    // }

                    child.material.color.setRGB(mat.emissive.r, mat.emissive.g, mat.emissive.b);

                    // console.log(child.name)
                }                    

                if (child.name == 'wall') child.material.map = null;
                // console.log(child.name)
            }

        });

        labo.rotateY(Math.PI);

        scene.add(labo);
    },
    ( xhr ) => {
        // console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
    },
    ( error ) => {
        console.log('An error happened', error);
    }
    );

    // Set camera
    camera.position.x = -5;
    camera.position.y = 2.45;
    camera.position.z = -1.25;

    // Add labo
    const geometry = new THREE.BoxGeometry(10, 4, 0.1);
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 2, 0);
    // scene.add(cube);

    // Add pin for click
    function CreateSrpite(file, x, y, z) {
        const mapInactif = new THREE.TextureLoader().load(PinInactif);
        const materialPin = new THREE.SpriteMaterial({ map: mapInactif, opacity: 0 });
        const sprite = new THREE.Sprite(materialPin);
        
        const mapHover = new THREE.TextureLoader().load(PinHover);
        const materialPinHover = new THREE.SpriteMaterial({ map: mapHover, opacity: 0 });
        const spriteHover = new THREE.Sprite(materialPinHover);
        
        sprite.position.set(x, y, z);
        spriteHover.position.set(x, y, z);

        sprite.scale.set(0.20, 0.20, 0.20);
        spriteHover.scale.set(0.20, 0.20, 0.20);

        scene.add(sprite);
        scene.add(spriteHover);

        let isClick = false;

        sprite.addEventListener("mouseover", (event) => {
            if (isClick) return;
            TweenLite.to(sprite.material, 0.2, { opacity: 0, ease: EaseOut });
            TweenLite.to(spriteHover.material, 0.2, { opacity: 1, ease: EaseOut });
            document.body.style.cursor = "pointer";
        });

        sprite.addEventListener("mouseout", (event) => {
            if (isClick) return;
            TweenLite.to(sprite.material, 0.2, { opacity: 1, ease: EaseOut });
            TweenLite.to(spriteHover.material, 0.2, { opacity: 0, ease: EaseOut });
            document.body.style.cursor = "default";
        });

        sprite.addEventListener("click", (event) => {
            isClick = true;
            TweenLite.to(sprite.material, 0.2, { opacity: 0, ease: EaseOut });
            TweenLite.to(spriteHover.material, 0.2, { opacity: 0, ease: EaseOut });
            document.body.style.cursor = "default";
        });

        document.querySelector('.close-infos').addEventListener('click', (event) => {
            isClick = false;
            TweenLite.to(sprite.material, 0.2, { opacity: 1, ease: EaseOut });
            TweenLite.to(spriteHover.material, 0.2, { opacity: 0, ease: EaseOut });
        });

        document.querySelector('.push-cab').addEventListener('click', (event) => {
            isClick = false;
            TweenLite.to(sprite.material, 0.2, { opacity: 1, ease: EaseOut });
            TweenLite.to(spriteHover.material, 0.2, { opacity: 0, ease: EaseOut });
        });

        interactionManager.add(sprite);

        return sprite;
    }

    const infos = document.querySelector('.container-infos');
    const containerFocus = document.querySelector('.container-focus');
    const discover = document.querySelector('.btn-infos');

    function resetCameraPosition() {
        TweenLite.to(camera.position, 1, { x: 0, y: 2.2, z: 3.9, ease: EaseInOut });
    }

    // Close info
    const onInfoClose = (callback) => {
        document.querySelector('.close-infos').addEventListener('click', function() {

            reset();
            
            infos.classList.remove('visible');
            infos.classList.remove('full');
            containerFocus.classList.remove('full');
            
            resetCameraPosition();

            callback();
        });
    }

    function reset() {
        // Reset all scenes
        document.querySelector('.focus-renaud').style.display = 'none';
        document.querySelector('.focus-gainsbourg').style.display = 'none';
        document.querySelector('.focus-aznavour').style.display = 'none';
        document.querySelector('.focus-memory').style.display = 'none';
        document.querySelector('.focus-polo').style.display = 'none';
        document.querySelector('.focus-daftpunk').style.display = 'none';
        document.querySelector('.focus-kaleidoscope').style.display = 'none';

        // Display tuto
        document.querySelectorAll('.container-focus .tuto').forEach(tuto => {
            tuto.style.opacity = 1;
        });

        renaudFocus?.stop();
        gainsbourgFocus?.stop();
        aznavourFocus?.stop();
        memoryFocus?.stop();
        poloFocus?.stop();
        // daftFocus?.stop();
        kaleidoscopeFocus?.stop();
    }

    const onDiscover = (callback) => {

        discover.addEventListener('click', () => {

            reset();

            infos.classList.add('full');
            document.querySelector('.container-focus').classList.add('full');
            sound.stop();

            callback();

            // Remove tuto
            setTimeout(() => {
                document.querySelectorAll('.container-focus .tuto').forEach(tuto => {
                    TweenLite.to(tuto.style, .6, { opacity: 0 });
                });
            }, 4000);
        }, {
            once: true
        });
    }

    const onClose = (callback) => {
        document.querySelector('.push-cab').addEventListener('click', function() {
            infos.classList.remove('visible');
            infos.classList.remove('full');
            containerFocus.classList.remove('full');

            resetCameraPosition();
            sound.play();

            setTimeout(() => {
                reset();
            }, 500);

            callback();
        });
    }

    // FOCUS
    const renaudFocus = new RenaudComponent(scene, camera);
    const gainsbourgFocus = new GainsbourgComponent(scene, camera);
    const aznavourFocus = new AznavourComponent(scene, camera);
    const memoryFocus = new MemoryComponent(scene);
    const poloFocus = new PoloComponent(scene);
    const daftFocus = new DaftPunkComponent(scene, camera, interactionManager);
    const kaleidoscopeFocus = new KaleidoscopeComponent(scene, camera);

    // //TO REMOVE
    // document.querySelector('.container').style.display = 'none';
    // document.querySelector('.container-focus').style.transform = 'none';
    // document.querySelector('.container-focus').style.transition = 'none';
    // document.querySelector('.focus-daftpunk').style.display = 'block';
    // document.querySelector('.focus-renaud').style.display = 'none';
    // document.querySelector('.focus-gainsbourg').style.display = 'none';
    // document.querySelector('.focus-aznavour').style.display = 'none';
    // document.querySelector('.focus-memory').style.display = 'none';
    // document.querySelector('.focus-polo').style.display = 'none';
    // document.querySelector('.focus-kaleidoscope').style.display = 'none';
    // daftFocus.start();
    
    function onClick (target, item, callback) {

        // Assign content to info container
        document.querySelector('.title-infos').innerText = item.title;
        document.querySelector('.subTitle-infos').innerText = item.subTitle;
        document.querySelector('.description-infos').innerHTML = item.description;

        reset();

        const animate = TweenLite.to(camera.position, 3, {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z + 0.15,
            ease: EaseInOut,
            onUpdate: (e) => {
                if (camera.position.z < 1.8) {
                    infos.classList.add('visible');
                }
            },
            onStart: () => {
                // camera.lookAt(event.target.position);
            },
            onComplete: callback
        });

        onInfoClose(() => {
            animate.kill();
        })
    }

    /*
     * Aznavour
     */
    const aznavourPin = CreateSrpite(PinInactif, 0.37, 2, -0.21);
    aznavourPin.addEventListener("click", (event) => {
        event.stopPropagation();
        onClick(event.target, {
            title: 'Aznavour',
            subTitle: 'Music has no borders',
            description: '“La Bohème”, “Emmenez-Moi”, “Hier Encore”... who has never heard of those classics of french music? Well, we found out that those hit have reach way more people than we tought, Aznavour’s songs still inspire people around the world.'
        }, () => {

            onDiscover(() => {

                console.log('Aznavour');

                document.querySelector('.focus-aznavour').style.display = 'block';
                
                aznavourFocus.start();

                onClose(() => {
                    aznavourFocus.stop();
                });
            })
        });
    });

    interactionManager.add(aznavourPin);

    /*
     * Britney
     */
    const britneyPin = CreateSrpite(Britney, -1.8, 3.2, -0.25);

    britneyPin.addEventListener("click", (event) => {
        event.stopPropagation();

        onClick(event.target, {
            title: 'Britney',
            subTitle: 'From Bollywood to Hollywood',
            description: 'If you can find us something funnier than Britney Spears sampling some Bollywood, please reach us! Have a nice time. You are welcome.'
        }, () => {
            onDiscover(() => {
                
                console.log('Britney');

                kaleidoscopeFocus.start();

                document.querySelector('.focus-kaleidoscope').style.display = 'block';
                onClose(() => {
                    kaleidoscopeFocus.stop();
                });
            })
        });
    });

    interactionManager.add(britneyPin);

    /*
     * DaftPunk
     */
    const daftPunkPin = CreateSrpite(DaftPunk, 1.55, 2.5, -0.15);

    daftPunkPin.addEventListener("click", (event) => {
        event.stopPropagation();

        onClick(event.target, {
            title: 'Daft Punk',
            subTitle: 'French touch zooooone',
            description: 'Flash back on the iconic french touch duo ! It’s time to challenge yourself, how much do you you know about them two ? Will you be able to link their influences to their songs... ?'
        }, () => {
            onDiscover(() => {

                document.querySelector('.focus-daftpunk').style.display = 'block';

                daftFocus.start();

                console.log('DaftPunk');

                onClose(() => {
                    daftFocus.stop();
                });
            })
        });
    });

    interactionManager.add(daftPunkPin);

    /*
     * Gainsbourg
     */
    const gainsbourgPin = CreateSrpite(Gainsbourg, -0.04, 3.4, -0.4);

    gainsbourgPin.addEventListener("click", (event) => {
        event.stopPropagation();

        onClick(event.target, {
            title: 'Gainsbourg',
            subTitle: 'A hint of classic behind an iconoclast spirit',
            description: 'Well known for his music, his romances but also because of his <b>scandalous</b> spirit. For instance, he burned a bill on TV in order to show how much taxes he had to pay. But are you aware that under this rebell singer’s mask hides a <b>classical music lover<b/>?'
        }, () => {
            onDiscover(() => {
                document.querySelector('.focus-gainsbourg').style.display = 'block';

                gainsbourgFocus.start();

                onClose(() => {
                    gainsbourgFocus.stop();
                });
            })
        });
    });

    interactionManager.add(gainsbourgPin);

    /*
     * Memo
     */
    const memoPin = CreateSrpite(Memo, 0.065, 1.8, 0.25);

    memoPin.addEventListener("click", (event) => {
        event.stopPropagation();

        onClick(event.target, {
            title: 'Memo',
            subTitle: 'Play around with some nice ex-samples',
            description: 'Weeeeeeell, are you now a great sample tracker? Try to match those card by two then! It works juste like a memory, really intuitivly, we promise!'
        }, () => {
            onDiscover(() => {
                document.querySelector('.focus-memory').style.display = 'block';
                memoryFocus.start();
                onClose(() => {
                    memoryFocus.stop();
                });
            })
        });
    });

    interactionManager.add(memoPin);

    /*
     * Polo
     */
    const poloPin = CreateSrpite(Polo, 1.4, 3.5, -0.4);

    poloPin.addEventListener("click", (event) => {
        event.stopPropagation();

        onClick(event.target, {
            title: 'Polo & Pan',
            subTitle: 'From tropics to hits!',
            description: 'Let go of the stress, we take you on a trip to explore Polo & Pan’s inspirations. To give you a little preview: a bresilian lullaby might get in your way.'
        }, () => {
            onDiscover(() => {
                document.querySelector('.focus-polo').style.display = 'block';
                poloFocus.start();
                onClose(() => {
                    poloFocus.stop();
                });
            })
        });
    });

    interactionManager.add(poloPin);

    /*
     * Renaud
     */
    const renaudPin = CreateSrpite(Renaud, -0.95, 1.9, -0.67);

    renaudPin.addEventListener("click", (event) => {
        event.stopPropagation();

        onClick(event.target, {
            title: 'Renaud',
            subTitle: 'Melody under muscles',
            description: 'Renaud is well known for Mistral Gagnant in which he reminds himself of his childhood, the snacks, the words, a whole bunch of nice memories. Guess who’s the greatest fan of this song?  Booba!',
        }, () => {
            onDiscover(() => {
                document.querySelector('.focus-renaud').style.display = 'block';
                renaudFocus.start();
                console.log(renaudFocus);
                onClose(() => {
                    renaudFocus.stop();
                });
            })
        });
    });

    interactionManager.add(renaudPin);

    /*
     * Retour
     */

    const retourPin = CreateSrpite(Retour, -1, 2.5, -0.4);

    retourPin.addEventListener("click", (event) => {
        event.stopPropagation();
        console.log("Retour");
    });

    interactionManager.add(retourPin);

    // Move camera
    let tlCamera = new TimelineMax({ paused: true })
        .to(camera.position, { x: 0, y: 2.5, z: 2.5, onComplete: () => {
            new TimelineMax()
            .to(camera.position, 1, { x: 0, y: 2.7, z: 1.2, ease: EaseInOut })
            .to(scene.getObjectByName('Storage_group').scale, 1, {x:0.085, y:0.085, z:0.085 })// Scale Case
            .to(aznavourPin.material, 0.25, { opacity: 1, ease: EaseInOut })
            .to(britneyPin.material, 0.25, { opacity: 1, ease: EaseInOut })
            .to(daftPunkPin.material, 0.25, { opacity: 1, ease: EaseInOut })
            .to(gainsbourgPin.material, 0.25, { opacity: 1, ease: EaseInOut })
            .to(memoPin.material, 0.25, { opacity: 1, ease: EaseInOut })
            .to(poloPin.material, 0.25, { opacity: 1, ease: EaseInOut })
            .to(renaudPin.material, 0.25, { opacity: 1, ease: EaseInOut })
            .to(retourPin.material, 0.25, { opacity: 1, ease: EaseInOut });
        }});

    let started = false;

    //MOVE CAMERA
    window.addEventListener('scroll', function(event) {
        const bodyHeight = document.documentElement.scrollHeight;

        if (window.scrollY > bodyHeight - window.screen.height && !started) {

            sound.play();

            document.querySelector('#canvas').style.pointerEvents = 'auto';

            // Move to position
            const tape = scene.getObjectByName('Storage_group');
            tape.position.set(-1, 2.515, -0.5);

            camera.position.set(-0.99, 2.565, -0.305);

            new TimelineMax({ delay: 0.3 })
                .to(camera.position, 2, { x: 0, y: 2.5, z: 4.2, ease: EaseOut })
                .to(aznavourPin.material, 0.15, { opacity: 1, ease: EaseOut })
                .to(britneyPin.material, 0.15, { opacity: 1, ease: EaseOut })
                .to(daftPunkPin.material, 0.15, { opacity: 1, ease: EaseOut })
                .to(gainsbourgPin.material, 0.15, { opacity: 1, ease: EaseOut })
                .to(memoPin.material, 0.15, { opacity: 1, ease: EaseOut })
                .to(poloPin.material, 0.15, { opacity: 1, ease: EaseOut })
                .to(renaudPin.material, 0.15, { opacity: 1, ease: EaseOut })
                .to(retourPin.material, 0.15, { opacity: 1, ease: EaseOut });

            document.querySelector('.container').style.display = 'none';

            TweenLite.to(document.querySelector('.container').style, 0.4, {
                opacity: 0, ease: EaseInOut,
                onComplete: () => {
                    document.querySelector('.container').style.display = 'none';
                }
            });

            started = true;
        }
    })

    this.wheel = function(Y) {
        if (Y < 2) return;

        // Mutliply Y value
        // tlCamera.progress(Y - 2);
    }

    this.update = function(time) {
        target.x = ( 1 - mouse.x ) * 0.00005;
        target.y = ( 1 - mouse.y ) * 0.00005;
        
        camera.rotation.x += 0.1 * ( target.y - camera.rotation.x );
        camera.rotation.y += 0.1 * ( target.x - camera.rotation.y );

        interactionManager.update();
    }

    // Cursor animation
    let cursor = document.querySelector('#cursor');
    let cursorAction = document.querySelector('#cursor .actions');

    this.mousemove = (event) => {
        mouse.x = ( event.clientX - windowHalf.x );
	    mouse.y = ( event.clientY - windowHalf.x );

        cursor.style.left = event.pageX - 15 +'px';
        cursor.style.top = event.pageY - 15 +'px';
    }

    this.keyup = function(e) {
        if (e.key === 'Enter') {

            sound.play();

            new TimelineMax()
            .to(camera.position, 1, { x: 0, y: 2.5, z: 4.2, ease: EaseOut })
            .to(aznavourPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(britneyPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(daftPunkPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(gainsbourgPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(memoPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(poloPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(renaudPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(retourPin.material, 0.25, { opacity: 1, ease: EaseOut });

            document.querySelector('#canvas').style.pointerEvents = 'auto';
            document.querySelector('.container').style.display = 'none';

            document.querySelector('.intro_timeline').style.display = 'none';
        }
    }

    this.helpers = (gui) => {
        let cameraFolder = gui.addFolder('Initial camera position');
        cameraFolder.add(camera.position, 'x');
        cameraFolder.add(camera.position, 'y');
        cameraFolder.add(camera.position, 'z');

        let pin = gui.addFolder('Pins');

        let aznavourGUI = pin.addFolder('Aznavour');
        aznavourGUI.add(aznavourPin.position, 'x');
        aznavourGUI.add(aznavourPin.position, 'y');
        aznavourGUI.add(aznavourPin.position, 'z');

        let britneyGUI = pin.addFolder('Britney');
        britneyGUI.add(britneyPin.position, 'x');
        britneyGUI.add(britneyPin.position, 'y');
        britneyGUI.add(britneyPin.position, 'z');

        let daftPunkGUI = pin.addFolder('Daft Punk');
        daftPunkGUI.add(daftPunkPin.position, 'x');
        daftPunkGUI.add(daftPunkPin.position, 'y');
        daftPunkGUI.add(daftPunkPin.position, 'z');

        let gainsbourgGUI = pin.addFolder('Gainsbourg');
        gainsbourgGUI.add(gainsbourgPin.position, 'x');
        gainsbourgGUI.add(gainsbourgPin.position, 'y');
        gainsbourgGUI.add(gainsbourgPin.position, 'z');

        let memoGUI = pin.addFolder('Memo');
        memoGUI.add(memoPin.position, 'x');
        memoGUI.add(memoPin.position, 'y');
        memoGUI.add(memoPin.position, 'z');

        let poloGUI = pin.addFolder('Polo');
        poloGUI.add(poloPin.position, 'x');
        poloGUI.add(poloPin.position, 'y');
        poloGUI.add(poloPin.position, 'z');

        let renaudGUI = pin.addFolder('Renaud');
        renaudGUI.add(renaudPin.position, 'x');
        renaudGUI.add(renaudPin.position, 'y');
        renaudGUI.add(renaudPin.position, 'z');

        let retourGUI = pin.addFolder('Retour');
        retourGUI.add(retourPin.position, 'x');
        retourGUI.add(retourPin.position, 'y');
        retourGUI.add(retourPin.position, 'z');

        let laboGUI = gui.addFolder('Labo');
        laboGUI.add(labo.position, 'x');
        laboGUI.add(labo.position, 'y');
        laboGUI.add(labo.position, 'z');
    }

}

export default LaboComponent;