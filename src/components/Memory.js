import * as THREE from 'three';
import { TimelineMax, Power4, TweenLite, Elastic, Bounce } from 'gsap';

import CardVerso from '../images/focus/memory/card-verso.jpeg';

function Component(sceneMain) {

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 50);
    camera.position.z = 9;
    
    var renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xEEF2FF, 1);
    document.querySelector('.focus-memory').appendChild(renderer.domElement);

    const loader = new THREE.TextureLoader();
 
    let materialVerso = new THREE.MeshBasicMaterial({
        side: THREE.FrontSide,
        map: loader.load(CardVerso),
    });

    let geometry = new THREE.PlaneGeometry(8, 12, 32);

    var asap = new Howl({
        src: ['./memory/sounds/1_AsapRocky.mp3'],
        sprite: {
            sample: [19000, 15000]
        }
    });

    var steve = new Howl({
        src: ['./memory/sounds/1_SteveJobs.mp3'],
        sprite: {
            sample: [0, 15000]
        }
    });

    var bowie = new Howl({
        src: ['./memory/sounds/2_DavidBowie.mp3'],
        sprite: {
            sample: [17000, 15000]
        }
    });

    var lana = new Howl({
        src: ['./memory/sounds/2_LanaDelRey.mp3'],
        sprite: {
            sample: [206000, 15000]
        }
    });

    var fanfare = new Howl({
        src: ['./memory/sounds/3_Fanfare.mp3'],
        sprite: {
            sample: [128000, 15000]
        }
    });

    var queen = new Howl({
        src: ['./memory/sounds/3_Queen.mp3'],
        sprite: {
            sample: [25000, 15000]
        }
    });

    var david = new Howl({
        src: ['./memory/sounds/4_DavidGilmour.mp3'],
        sprite: {
            sample: [4000, 15000]
        }
    });

    var sncf = new Howl({
        src: ['./memory/sounds/4_SNCF.mp3'],
        sprite: {
            sample: [0, 15000]
        }
    });

    var ketchup = new Howl({
        src: ['./memory/sounds/5_LasKetchup.mp3'],
        sprite: {
            sample: [36000, 15000]
        }
    });

    var sugar = new Howl({
        src: ['./memory/sounds/5_TheSugarHill.mp3'],
        sprite: {
            sample: [34000, 15000]
        }
    });

    const data = [
        {id: 1, same: 2, sound: asap},
        {id: 2, same: 1, sound: steve},
        {id: 3, same: 4, sound: bowie},
        {id: 4, same: 3, sound: lana},
        {id: 5, same: 6, sound: fanfare},
        {id: 6, same: 5, sound: queen},
        {id: 7, same: 8, sound: david},
        {id: 8, same: 7, sound: sncf},
        {id: 9, same: 10, sound: ketchup},
        {id: 10, same: 9, sound: sugar},
    ];
    
    // Create sounds
    const positions = [
        { x: 0, y: 12.5},
        { x: 8.5, y: -8},
        { x: -8.5, y: 7},
        { x: -8.5, y: -5.5},
        { x: 0, y: 0},
        { x: 0, y: -12.5},
        { x: 2, y: -23, isRotate: true},
        { x: -8.5, y: -18},
        { x: 10.5, y: 2.5, isRotate: true},
        { x:  10.5, y: 11, isRotate: true},
    ];
    
    // Groupe de cartes
    const cards = new THREE.Group();
    
    data.forEach((item) => {
    
        let random = Math.floor(Math.random() * positions.length);
    
        // Nouvelle carte
        let card = new THREE.Group(); 
        card.position.set(positions[random].x, positions[random].y);
        if(positions[random].isRotate) card.rotation.z = Math.PI / 2;
    
        let materialRecto = new THREE.MeshBasicMaterial({
            side: THREE.BackSide,
            map: loader.load(`/memory/card-recto-${item.id}.jpeg`),
        });
    
        materialRecto.map.wrapS = THREE.RepeatWrapping;
        materialRecto.map.repeat.x = -1;
    
        var verso = new THREE.Mesh(geometry, materialVerso);
        var recto = new THREE.Mesh(geometry, materialRecto);
        recto.position.z = -.1;
    
        card.data = item;
    
        card.add(verso);
        card.add(recto);
        cards.add(card);
    
        // Delete the used position
        if (random > -1) {
            positions.splice(random, 1);
        }
    });

    scene.add(cards)

    let cardVisible = [];
    let soundPlayed = null;

    function initCameraPosition(){

        // Animate the camera before they go in some object in the 3D scene 
        TweenLite.to(camera.position, 1, {z: 27});
        TweenLite.to(cards.rotation, 1, {z: -.8});
    }

    function showCard(object) {

        if (cardVisible.length < 2 && !object.parent.data.valid) {
    
            cardVisible.push(object.parent);
            TweenLite.to(object.parent.rotation, .5, {
                y: Math.PI, onStart: ()=> {
                    if(soundPlayed) {
                        soundPlayed.fade(1, 0, 300)
                        setTimeout(() => { soundPlayed.seek(0)}, 500)
                    }
                    soundPlayed = object.parent.data.sound;
                    object.parent.data.sound.fade(0, 1, 300);
                    object.parent.data.sound.play('sample');
                }
            });
    
            if (cardVisible.length == 2 && cardVisible[0].data.same == cardVisible[1].data.id) {
                cardVisible.forEach((card) => {
                    card.data.valid = true;
                });
    
                setTimeout(() => {
                    cardVisible.splice(0, 2);
                }, 1000);
    
            } else if (cardVisible.length == 2 && (cardVisible[0].data.same != cardVisible[1].data.id)) {
                cardVisible.forEach((card) => {
    
                    setTimeout(() => {
                        TweenLite.to(card.rotation, .5, {
                            y: 0,
                            onUpdate: () => {}
                        });
                    }, 1000)
                });
    
                cardVisible.splice(0, 2);
            }
    
        }
    }
    
    setTimeout(() => {
        initCameraPosition();
    }, 2000);

    var raycaster = new THREE.Raycaster();
    var mouse = new THREE.Vector2();

    function onMouseDown(event) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
        // update the picking ray with the camera and mouse position
        raycaster.setFromCamera(mouse, camera);
        // calculate objects intersecting the picking ray
        var intersects = raycaster.intersectObjects(cards.children, true);
        for (var i = 0; i < intersects.length; i++) {
            //intersects[ i ].object.material.color.set( 0xff0000 );
            showCard(intersects[i].object);
        }
    }

    let idAnimation = null;
    
    var render = function () {
        idAnimation = requestAnimationFrame(render);
        renderer.render(scene, camera);
    }

    this.start = function() {
        window.addEventListener('mousedown', onMouseDown, false);
        render();
    }

    this.stop = function() {
        window.cancelAnimationFrame(idAnimation);
        // window.removeEventListener('mousedown');

        soundPlayed.stop();
    }

    this.update = function(time) {}

    this.helpers = (gui) => {}

    this.wheel = function(Y) {}

    this.keyup = function(e) {}

    this.mousemove = function(e) {}

}

export default Component;