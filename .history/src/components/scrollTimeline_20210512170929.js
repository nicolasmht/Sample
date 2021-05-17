import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import getNDCCoordinates from '../utils/mouse';
// import {TweenMax, Power2, TimelineLite} from 'gsap/TweenMax';
import { TimelineMax, Power4, TweenLite } from 'gsap';


// Textures
import TapeTexture from '../textures/tape_texture.png';

// Object
import TapeModel from '../objects/AudioTape/tape.obj';

function ScrollTimeline(scene) {


    let textureLoader = new THREE.TextureLoader();

    var texture = textureLoader.load(TapeTexture);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 1 );

    var material = new THREE.MeshPhongMaterial({map: texture});

    const loader = new OBJLoader();
    let object = null;
    // // load a resource
    loader.load(TapeModel,
        // called when resource is loaded
        ( tape ) => {

            tape.traverse((child) => {
                console.log(child)
                if(child.isMesh) {
                    child.material = material
                    child.material.color = new THREE.Color('rgb(255, 255, 255)')
                    // element.material.emissive = new THREE.Color('rgb(193, 145, 51)')
                    // element.material.map.needsUpdate = true;
                    child.material.opacity = 0.9    
                    child.material.transparent = true
                }

            });
            
            tape.name = 'tape'
            object = tape;
            object.scale.set(.2,.2,.2)
            object.position.set(0,0,0)
            object.rotation.set(1.55,0,1.55)

            scene.add( tape );

            initTimeline()
        },
        ( xhr ) => {
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        },
        ( error ) => {
            console.log( 'An error happened' );
        }
    );

    this.update = function(time) {
        // object ? object.rotation.y += 0.01 : 0
    }

    this.helpers = (gui) => {
    }


    function initTimeline() {
        // var timeline = new TimelineMax({ paused: true })
        // .to(".box", 2, {x: '200px',y: '500px'})
        // .to(".box", 2, {x:'500px'})

        var timelineTape = new TimelineMax({ paused: true })
        .to(object.position, 2, {x: 2,y: -13},0)
        .to(object.rotation, 2, {x: 8, y:7}, 0)
        .to(object.rotation, 2, {x: 1.5, y:0, z: 1.5}, 1)
        .to(object.rotation, 2, {x: 2}, 1)
        .to(object.position, 2, {x: 14})

        var proxyTween = TweenLite.to({}, 1, {paused: true});
        // TweenLite.defaultEase = Linear.easeNone;

        window.addEventListener("mousewheel", (e) => {
            //PERCENT SCROLL TO FIX
            proxyTween.progress(window.pageYOffset/500).pause();
    
            var progress = timelineTape.progress();
            var increment = window.pageYOffset/500;
            progress += (increment - progress) * 0.05;
            timelineTape.progress(progress);
    
          });
    }
}

export default ScrollTimeline;