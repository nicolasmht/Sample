import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

// Packages
import { TimelineMax, Power4, TweenLite, EaseInOut, EaseOut } from 'gsap';

// Utilis
import getNDCCoordinates from '../utils/mouse';

// Gltf
// import LaboGltf from '../objects/labo.gltf';
import LaboGltf from '../objects/Cabinet_Objets_light.glb';

// Pin
import Aznavour from '../textures/Labo/Aznavour.png';
import Britney from '../textures/Labo/Britney.png';
import DaftPunk from '../textures/Labo/Daft-Punk.png';
import Gainsbourg from '../textures/Labo/Gainsbourg.png';
import Memo from '../textures/Labo/Memo.png';
import Polo from '../textures/Labo/Polo.png';
import Renaud from '../textures/Labo/Renaud.png';
import Retour from '../textures/Labo/Retour.png';

import TextureGravure from '../textures/textures_gravure/brush.png';
import fiveT from '../textures/FiveToneR.jpg';

import RenaudComponent from './Renaud';
import GainsbourgComponent from './Gainsbourg';
import AznavourComponent from './Aznavour';
import MemoryComponent from './Memory';
import PoloComponent from './Polo';
import DaftPunkComponent from './daftPunk';

function LaboComponent(scene, camera, renderer, interactionManager) {

    const mouse = new THREE.Vector2();
    const target = new THREE.Vector2();
    const windowHalf = new THREE.Vector2( window.innerWidth / 2, window.innerHeight / 2 );

    const loader = new GLTFLoader();
    let labo = new THREE.Object3D();

    const texture = new THREE.TextureLoader().load(TextureGravure);

    loader.load( LaboGltf, ( gltf ) => {

        let r, g, b;
        labo = gltf.scene;
        labo.name = "labo"

        const fiveTone = new THREE.TextureLoader().load(fiveT)
        fiveTone.minFilter = THREE.NearestFilter;
        fiveTone.magFilter = THREE.NearestFilter;


        labo.traverse( (child) => {
            //GET OLD COLOR AND USE IT WITH TOON MATERIAL
            if(child.material) {
                r = child.material.color.r
                g = child.material.color.g
                b = child.material.color.b

                if (child.name != 'plante') {
                    child.material = new THREE.MeshToonMaterial({
                        side:THREE.DoubleSide,
                        gradientMap: fiveTone,
                        bumpMap: texture,
                        
                    });

                    child.material.color.setRGB(r, g, b)
                }

                console.log(child.name)
            }
        });

        //CABINET TEST COLORATION
        // let cabinet = labo.getObjectByName('cabinet')
        // cabinet.traverse( (child) => {
        //     child.material = new THREE.MeshToonMaterial({color: 0xa87b32,side:THREE.DoubleSide, gradientMap: fiveTone});
        // });

        labo.position.set(0, 0, -0.5);
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
    camera.position.x = -2.5;
    camera.position.y = 2.45;
    camera.position.z = -1.25;

    // Add labo
    const geometry = new THREE.BoxGeometry(10, 4, 0.1);
    const material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
    const cube = new THREE.Mesh( geometry, material );
    cube.position.set(0, 2, 0);
    // scene.add(cube);

    // Add pin for click
    function CreateSrpite(file) {
        const map = new THREE.TextureLoader().load(file);
        const materialPin = new THREE.SpriteMaterial({ map: map, opacity: 0 });
        return new THREE.Sprite(materialPin);
    }

    const infos = document.querySelector('.container-infos');
    const containerFocus = document.querySelector('.container-focus');
    const discover = document.querySelector('.btn-infos');

    // Close info
    const onInfoClose = (callback) => {
        document.querySelector('.close-infos').addEventListener('click', function() {
            infos.classList.remove('visible');
            infos.classList.remove('full');
            containerFocus.classList.remove('full');
            TweenLite.to(camera.position, 1, { x: 0, y: 3, z: 4, ease: EaseInOut });

            callback();
        });
    }

    const onDiscover = (callback) => {
        // Reset all scenes
        document.querySelector('.focus-renaud').style.display = 'none';
        document.querySelector('.focus-gainsbourg').style.display = 'none';
        document.querySelector('.focus-aznavour').style.display = 'none';
        document.querySelector('.focus-memory').style.display = 'none';
        document.querySelector('.focus-polo').style.display = 'none';
        document.querySelector('.focus-daftpunk').style.display = 'none';

        discover.addEventListener('click', () => {
            infos.classList.add('full');
            document.querySelector('.container-focus').classList.add('full');
            callback();
        }, {
            once: true,
        });
    }

    const onClose = (callback) => {
        discover.addEventListener('click', callback, false);
        document.querySelector('.back-labo').addEventListener('click', function() {
            infos.classList.remove('visible');
            infos.classList.remove('full');
            containerFocus.classList.remove('full');
            TweenLite.to(camera.position, 1, { x: 0, y: 3, z: 4, ease: EaseInOut });

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
    
    function onClick (target, item, callback) {

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
    const aznavourPin = CreateSrpite(Aznavour);
    aznavourPin.position.set(-0.2, 2.7, -1.5);
    scene.add(aznavourPin);
    
    aznavourPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Aznavour',
            subTitle: 'Aznavour sous-titre',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab illo magnam necessitatibus sunt voluptatum neque.'
        }, () => {
            onDiscover(() => {
                document.querySelector('.focus-aznavour').style.display = 'block';
                onClose(() => {});
            })
        });
    });

    interactionManager.add(aznavourPin);

    /*
     * Britney
     */
    const britneyPin = CreateSrpite(Britney);
    britneyPin.position.set(-2.9, 3.9, -1.5);
    scene.add(britneyPin);

    britneyPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Britney',
            subTitle: 'Britney sous-titre',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab illo magnam necessitatibus sunt voluptatum neque.'
        });
    });

    interactionManager.add(britneyPin);

    /*
     * DaftPunk
     */
    const daftPunkPin = CreateSrpite(DaftPunk);
    daftPunkPin.position.set(1.2, 2.9, -1.5);
    scene.add(daftPunkPin);

    daftPunkPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'DaftPunk',
            subTitle: 'DaftPunk sous-titre',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab illo magnam necessitatibus sunt voluptatum neque.'
        }, () => {
            onDiscover(() => {
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
    const gainsbourgPin = CreateSrpite(Gainsbourg);
    gainsbourgPin.position.set(-0.6, 4, -1.5);
    scene.add(gainsbourgPin);

    gainsbourgPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Gainsbourg',
            subTitle: 'Gainsbourg sous-titre',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab illo magnam necessitatibus sunt voluptatum neque.'
        }, () => {
            onDiscover(() => {
                document.querySelector('.focus-gainsbourg').style.display = 'block';
                onClose(() => {});
            })
        });
    });

    interactionManager.add(gainsbourgPin);

    /*
     * Memo
     */
    const memoPin = CreateSrpite(Memo);
    memoPin.position.set(-0.5, 2.1, -0.4);
    scene.add(memoPin);

    memoPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Memo',
            subTitle: 'Memo sous-titre',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab illo magnam necessitatibus sunt voluptatum neque.'
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
    const poloPin = CreateSrpite(Polo);
    poloPin.position.set(1, 3.9, -1.5);
    scene.add(poloPin);

    poloPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Polo et Pan',
            subTitle: 'Polo et Pan sous-titre',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab illo magnam necessitatibus sunt voluptatum neque.'
        }, () => {
            onDiscover(() => {
                document.querySelector('.focus-polo').style.display = 'block';
                onClose(() => {});
            })
        });
    });

    interactionManager.add(poloPin);

    /*
     * Renaud
     */
    const renaudPin = CreateSrpite(Renaud);
    renaudPin.position.set(1.8, 2.4, -1.1);
    scene.add(renaudPin);

    renaudPin.addEventListener("click", (event) => {
        onClick(event.target, {
            title: 'Renaud',
            subTitle: 'Renaud sous-titre',
            description: 'Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ab illo magnam necessitatibus sunt voluptatum neque.',
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

    const retourPin = CreateSrpite(Retour);
    retourPin.position.set(-1.8, 3.1, -1.2);
    scene.add(retourPin);

    retourPin.addEventListener("click", (event) => {
        console.log("Retour");
    });

    interactionManager.add(retourPin);

    // Move camera
    let tlCamera = new TimelineMax({ paused: true })
        .to(camera.position, { x: -0.5, y: 3.3, z: 3, onComplete: () => {
            new TimelineMax()
            .to(camera.position, 1, { x: 0, y: 3, z: 4, ease: EaseInOut })
            .to(aznavourPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(britneyPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(daftPunkPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(gainsbourgPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(memoPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(poloPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(renaudPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(retourPin.material, 0.45, { opacity: 1, ease: EaseInOut });
        }});

    this.wheel = function(Y) {
        if (Y < 2) return;

        // Mutliply Y value
        tlCamera.progress(Y - 2);
    }

    this.update = function(time) {
        target.x = ( 1 - mouse.x ) * 0.00005;
        target.y = ( 1 - mouse.y ) * 0.00005;
        
        camera.rotation.x += 0.1 * ( target.y - camera.rotation.x );
        camera.rotation.y += 0.1 * ( target.x - camera.rotation.y );
    }

    this.mousemove = (event) => {
        mouse.x = ( event.clientX - windowHalf.x );
	    mouse.y = ( event.clientY - windowHalf.x );
    }

    this.keyup = function(e) {
        if (e.key === 'Enter') {
            new TimelineMax()
            .to(camera.position, 1, { x: 0, y: 3, z: 4, ease: EaseInOut })
            .to(aznavourPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(britneyPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(daftPunkPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(gainsbourgPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(memoPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(poloPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(renaudPin.material, 0.45, { opacity: 1, ease: EaseInOut })
            .to(retourPin.material, 0.45, { opacity: 1, ease: EaseInOut });
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