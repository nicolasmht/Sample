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





    var timeline = new TimelineMax({ paused: true })
  .to(".box", 2, {
    x: '200px'
  });
   var timeline2 = new TimelineMax({ paused: true })
  .to(".box2", 2, {
    x: '300px'
  })
   .to(".box2", 2, {top:'100px'})
   .to(".box2", 2, {x:0})
  
//   var proxyTween = TweenLite.to({}, 1, {paused: true});

//   TweenLite.defaultEase = Linear.easeNone;

    window.addEventListener("mousewheel", (e) => {
        // console.log(e.clientY, e.y)
        proxyTween.progress(window.pageYOffset/10).pause();

        console.log(window.pageYOffset/500);

        object ? object.rotation.y = window.pageYOffset/100 : 0
        object ? object.rotation.x = window.pageYOffset/100 : 0

      });

      TweenLite.ticker.addEventListener("tick", function() {
        var progress = timeline.progress();
        // ease can be anything from 0.5 to 0.01
        progress += (proxyTween.progress() - progress) * 0.05; 
        timeline.progress(progress);
    });

}

export default ScrollTimeline;