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
                    child.material.opacity = 0.5    
                    child.material.transparent = true
                }

            });
            
            tape.name = 'tape'
            object = tape;
            object.scale.set(.2,.2,.2)
            object.position.set(0,0,0)

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
        // object ? object.rotation.z += 0.01 : 0
    }

    this.helpers = (gui) => {
    }


    function initTimeline() {
        var timelineTape = new TimelineMax({ paused: true })
        .to(object.position, 2, {x: 40,y: 30})
        .to(object.position, 2, {x: 15})
        var proxyTween = TweenLite.to({}, 1, {paused: true});
        //   TweenLite.defaultEase = Linear.easeNone;

        window.addEventListener("mousewheel", (e) => {
            // console.log(object)
            //TO FIX
            proxyTween.progress(window.pageYOffset/500).pause();
    
            var progress = timeline.progress();
            var increment = window.pageYOffset/500;
            progress += (increment - progress) * 0.05;
            timelineTape.progress(progress);
    
            // object ? object.rotation.y = window.pageYOffset/100 : 0
            // object ? object.rotation.x = window.pageYOffset/100 : 0
    
          });
    }
}

export default ScrollTimeline;