import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Packages
import { TimelineMax, Power4, TweenLite, EaseInOut, EaseOut } from 'gsap';

// Utilis
import getNDCCoordinates from '../utils/mouse';

// Gltf
// import LaboGltf from '../objects/labo.gltf';
import LaboGltf from '../objects/Cabinet_Objets_09.gltf';

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

import fiveT from '../textures/fivetoner.jpg';

import RenaudComponent from './Renaud';
import GainsbourgComponent from './Gainsbourg';
import AznavourComponent from './Aznavour';
import MemoryComponent from './Memory';
import PoloComponent from './Polo';
import DaftPunkComponent from './daftPunk';
import KaleidoscopeComponent from './Kaleidoscope';

function LaboComponent(scene, camera, renderer, interactionManager) {

    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
    const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

    const loader = new GLTFLoader();
    let labo = new THREE.Object3D();

    const texture01 = new THREE.TextureLoader().load(TextureGravure01);
    const texture02 = new THREE.TextureLoader().load(TextureScene);
    const texture03 = new THREE.TextureLoader().load(TextureGravure03);

    texture01.wrapS = THREE.RepeatWrapping;
    texture01.wrapT = THREE.RepeatWrapping;
    texture01.minFilter = THREE.LinearMipMapLinearFilter;
    texture01.magFilter = THREE.LinearFilter;
    texture01.magFilter = THREE.CubeUVReflectionMapping;

    loader.load( LaboGltf, ( gltf ) => {

        let mat;
        labo = gltf.scene;
        labo.name = "labo"

        const fiveTone = new THREE.TextureLoader().load(fiveT)

        labo.traverse( (child) => {
            //GET OLD COLOR AND USE IT WITH TOON MATERIAL
            if(child.material) {
                mat = child.material;

                if (child.name != 'plante') {
                    if (
                        child.name == 'cloche1' ||
                        child.name == 'verre' ||
                        child.name == 'cloche' ||
                        child.name == 'cordes' ||
                        child.name == 'cloche_1'
                    ) {
                        
                    } else {

                        // texture02.rotation = Math.random() * 360 * (Math.PI/180);

                        // console.log(texture02.rotation)

                        child.material = new THREE.MeshToonMaterial({
                            side: THREE.DoubleSide,
                            gradientMap: fiveTone,
                            // normalMap: texture02,
                            // displacementMap: texture02,
                            // bumpMap: texture02,
                            map: texture02,
                        });

                        if (child.name == 'wall') {
                            child.material.map = null;
                        }

                        if (
                            child.name == 'desk_tiroirs001' ||
                            child.name == 'desk_tiroirs002' ||
                            child.name == 'desk_tiroirs003' ||
                            child.name == 'desk_tiroirs004' ||
                            child.name == 'desk_tiroirs005' ||
                            child.name == 'desk_tiroirs006' ||
                            child.name == 'desk_tiroirs009'
                        ) {
                            child.material.map = texture03;
                        }

                        child.material.color.setRGB(mat.emissive.r, mat.emissive.g, mat.emissive.b);
                    }
                }
            }
        });

        //CABINET TEST COLORATION
        // let cabinet = labo.getObjectByName('cabinet')
        // cabinet.traverse( (child) => {
        //     child.material = new THREE.MeshToonMaterial({color: 0xa87b32,side:THREE.DoubleSide, gradientMap: fiveTone});
        // });

        // labo.position.set(0, 0, -0.5);
        labo.rotateY(Math.PI);
        labo.scale.set(0.02, 0.02, 0.02);

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

        sprite.scale.set(0.25, 0.25, 0.25);
        spriteHover.scale.set(0.25, 0.25, 0.25);

        scene.add(sprite);
        scene.add(spriteHover);

        sprite.addEventListener("mouseover", (event) => {
            TweenLite.to(sprite.material, 0.6, { opacity: 0, ease: EaseInOut });
            TweenLite.to(spriteHover.material, 0.6, { opacity: 1, ease: EaseInOut });
            document.body.style.cursor = "pointer";
        });

        sprite.addEventListener("mouseout", (event) => {
            TweenLite.to(sprite.material, 0.6, { opacity: 1, ease: EaseInOut });
            TweenLite.to(spriteHover.material, 0.6, { opacity: 0, ease: EaseInOut });
            document.body.style.cursor = "default";
        });

        sprite.addEventListener("click", (event) => {
            console.log('click')
        });

        interactionManager.add(sprite);

        return sprite;
    }

    const infos = document.querySelector('.container-infos');
    const containerFocus = document.querySelector('.container-focus');
    const discover = document.querySelector('.btn-infos');

    // Close info
    const onInfoClose = (callback) => {
        document.querySelector('.close-infos').addEventListener('click', function() {

            reset();
            
            infos.classList.remove('visible');
            infos.classList.remove('full');
            containerFocus.classList.remove('full');
            TweenLite.to(camera.position, 1, { x: 0, y: 2.7, z: 2.5, ease: EaseInOut });

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
    }

    const onDiscover = (callback) => {
        reset();
        discover.addEventListener('click', () => {
            infos.classList.add('full');
            document.querySelector('.container-focus').classList.add('full');
            callback();
        }, {
            once: true,
        });
    }

    const onClose = (callback) => {

        // reset();

        discover.addEventListener('click', callback, false);
        document.querySelector('.back-labo').addEventListener('click', function() {
            infos.classList.remove('visible');
            infos.classList.remove('full');
            containerFocus.classList.remove('full');
            TweenLite.to(camera.position, 1, { x: 0, y: 2.7, z: 2.5, ease: EaseInOut });

            callback();
        });
    }

    // FOCUS
    const renaudFocus = new RenaudComponent(scene, camera);
    const gainsbourgFocus = new GainsbourgComponent(scene, camera);
    const anavourFocus = new AznavourComponent(scene, camera);
    const memoryFocus = new MemoryComponent(scene);
    const poloFocus = new PoloComponent(scene);
    const daftFocus = new DaftPunkComponent(scene, camera, interactionManager);
    const kaleidoscopeFocus = new KaleidoscopeComponent(scene, camera);

    //TO REMOVE
    document.querySelector('.container').style.display = 'none';
    document.querySelector('.container-focus').style.transform = 'none';
    document.querySelector('.container-focus').style.transition = 'none';
    document.querySelector('.focus-daftpunk').style.display = 'block';
    document.querySelector('.focus-renaud').style.display = 'none';
    document.querySelector('.focus-gainsbourg').style.display = 'none';
    document.querySelector('.focus-aznavour').style.display = 'none';
    document.querySelector('.focus-memory').style.display = 'none';
    document.querySelector('.focus-polo').style.display = 'none';
    document.querySelector('.focus-kaleidoscope').style.display = 'none';
    daftFocus.start();
    
    function onClick (target, item, callback) {

        // reset();

        // Assign content to info container
        document.querySelector('.title-infos').innerText = item.title;
        document.querySelector('.subTitle-infos').innerText = item.subTitle;
        document.querySelector('.description-infos').innerText = item.description;

        const animate = TweenLite.to(camera.position, 5, {
            x: target.position.x,
            y: target.position.y,
            z: target.position.z + 1.5,
            ease: EaseOut,
            onUpdate: (e) => {
                if (camera.position.z < 3.5) {
                    infos.classList.add('visible');
                }
            },
            onStart: () => {
                // camera.lookAt(event.target.position);
            },
            onComplete: callback()
        });

        onInfoClose(() => {
            animate.kill();
            renaudFocus.stop();
            memoryFocus.stop();
        })
    }

    /*
     * Aznavour
     */
    const aznavourPin = CreateSrpite(PinInactif, -0.15, 2.1, -1.1);
    aznavourPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Aznavour',
            subTitle: 'Music has no boarders',
            description: '“La Bohème”, “Emmenez-Moi”, “Hier Encore”...who has never heard of those classics of french music? Well, we found out that those hit have reach way more people than we tought, Aznavour’s songs still inspire people around the world.'
        }, () => {
            onDiscover(() => {
                reset();
                document.querySelector('.focus-aznavour').style.display = 'block';
                onClose(() => {});
            })
        });
    });

    interactionManager.add(aznavourPin);

    /*
     * Britney
     */
    const britneyPin = CreateSrpite(Britney, -2.3, 3.2, -1.2);

    britneyPin.addEventListener("click", (event) => {
        console.log('okokok')
        onClick(event.target, {
            title: 'Britney',
            subTitle: 'From Bollywood to Hollywood',
            description: 'If you can find us something funnier than Britney Spears sampling some Bollywood, please reach us! Have a nice time. You are welcome.'
        }, () => {
            onDiscover(() => {
                reset();
                document.querySelector('.focus-kaleidoscope').style.display = 'block';
                onClose(() => {});
            })
        });
    });

    // interactionManager.add(britneyPin);

    /*
     * DaftPunk
     */
    const daftPunkPin = CreateSrpite(DaftPunk, 0.9, 2.5, -1);

    daftPunkPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'DaftPunk',
            subTitle: 'French touch zooooone',
            description: 'Flash back on the iconic french touch duo! It’s time to challenge yourself, how much do you you know about them two? Will you be able to link their influences to their songs...?'
        }, () => {
            onDiscover(() => {
                reset();
                document.querySelector('.focus-daftpunk').style.display = 'block';
                daftFocus.start();
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
    const gainsbourgPin = CreateSrpite(Gainsbourg, -0.49, 3.3, -1.5);

    gainsbourgPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Gainsbourg',
            subTitle: 'A hint of classic behind an iconoclast spirit',
            description: 'Well known for his music, his romances but also because of his scandalous spirit. For instance, he burned a bill on TV in order to show how much taxes he had to pay. But are you aware that under this rebell singer’s mask hides a classical music lover?'
        }, () => {
            onDiscover(() => {
                reset();
                document.querySelector('.focus-gainsbourg').style.display = 'block';

                gainsbourgFocus.start();

                onClose(() => {});
            })
        });
    });

    interactionManager.add(gainsbourgPin);

    /*
     * Memo
     */
    const memoPin = CreateSrpite(Memo, -0.37, 1.7, -0.4);

    memoPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Memo',
            subTitle: 'Play around with some nice ex-samples',
            description: 'Weeeeeeell, are you now a great sample tracker? Try to match those card by two then! It works juste like a memory, really intuitivly, we promise!'
        }, () => {
            onDiscover(() => {
                reset();
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
    const poloPin = CreateSrpite(Polo, 0.8, 3.6, -1);

    poloPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Polo et Pan',
            subTitle: 'From tropics to hits!',
            description: 'Let go of the stress, we take you on a trip to explore Polo & Pan’s inspirations. To give you a little preview: a bresilian lullaby might get in your way.'
        }, () => {
            onDiscover(() => {
                reset();
                document.querySelector('.focus-polo').style.display = 'block';
                onClose(() => {});
            })
        });
    });

    interactionManager.add(poloPin);

    /*
     * Renaud
     */
    const renaudPin = CreateSrpite(Renaud, -1.45, 1.9, -0.9);

    renaudPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Renaud',
            subTitle: 'Melody under muscles',
            description: 'Renaud is well known for Mistral Gagnant in which he reminds himself of his childhood, the snacks, the words, a whole bunch of nice memories. Guess who’s the greatest fan of this song?  Booba! The rapper has proved it a few times... Take a look!',
        }, () => {
            onDiscover(() => {
                reset();
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

    const retourPin = CreateSrpite(Retour, -1.5, 2.55, -1.2);

    retourPin.addEventListener("click", (event) => {
        console.log("Retour");
    });

    interactionManager.add(retourPin);

    // Move camera
    let tlCamera = new TimelineMax({ paused: true })
        .to(camera.position, { x: 0, y: 2.7, z: 2.5, onComplete: () => {
            new TimelineMax()
            .to(camera.position, 1, { x: 0, y: 2.7, z: 1.2, ease: EaseInOut })
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

    window.addEventListener('scroll', function(event) {
        const bodyHeight = document.documentElement.scrollHeight;

        if (window.scrollY > bodyHeight - window.screen.height && !started) {
            new TimelineMax()
            .to(camera.position, 1, { x: 0, y: 2.7, z: 2.5, ease: EaseOut })
            .to(aznavourPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(britneyPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(daftPunkPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(gainsbourgPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(memoPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(poloPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(renaudPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(retourPin.material, 0.25, { opacity: 1, ease: EaseOut });

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

    this.mousemove = (event) => {
        mouse.x = ( event.clientX - windowHalf.x );
	    mouse.y = ( event.clientY - windowHalf.x );
    }

    this.keyup = function(e) {
        if (e.key === 'Enter') {
            new TimelineMax()
            .to(camera.position, 1, { x: 0, y: 2.7, z: 2.5, ease: EaseOut })
            .to(aznavourPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(britneyPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(daftPunkPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(gainsbourgPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(memoPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(poloPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(renaudPin.material, 0.25, { opacity: 1, ease: EaseOut })
            .to(retourPin.material, 0.25, { opacity: 1, ease: EaseOut });
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
    }

}

export default LaboComponent;