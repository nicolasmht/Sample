import * as THREE from 'three';
import { EffectComposer, EffectPass, RenderPass } from "postprocessing";

// Textures
// import FacadeTexture from '../textures/facade.png';

// Audios
import { Kaleidoscope, DragDrop } from '../utils/Kaleidoscope';

import IMG from '../images/anseo.png';
import IMG2 from '../images/javascript.png';

import KaleidoShader from './KaleidoShader';

function KaleidoscopeComponent(scene, camera, composer) {

    //PLANE
    const pGeometry = new THREE.PlaneBufferGeometry(  10, 10, 10 );
    let textureLoader = new THREE.TextureLoader();
    var texture = textureLoader.load(IMG);
    var texture2 = textureLoader.load(IMG2);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set( 1, 1 );
    const pMaterial = new THREE.MeshBasicMaterial({map: texture,transparent:true})
    const plane = new THREE.Mesh( pGeometry, pMaterial );
    
    const pMaterial2 = new THREE.MeshBasicMaterial({map: texture2,transparent:true})
    const plane2 = new THREE.Mesh( pGeometry, pMaterial2 );
    
    const planeGrp = new THREE.Group()
    planeGrp.add( plane );
    planeGrp.add( plane2 );
    scene.add(planeGrp);

    camera.position.z = 10
    camera.lookAt(plane.position)
    
    //RESCALE PLANE
    let currentBox3 = new THREE.Box3().setFromObject(plane)
    const width = Math.abs(currentBox3.min.x - currentBox3.max.x)
    const height = Math.abs(currentBox3.min.y - currentBox3.max.y)
    const size = getPerspectiveSize(camera, camera.position.z);
    let reScale = (size.width / (Math.abs(currentBox3.max.x) + Math.abs(currentBox3.min.x)))*1.3;
    planeGrp.scale.set(reScale, reScale, reScale);

    // composer.addPass(new EffectPass(camera, new KaleidoShader()));

    this.helpers = (gui) => {}

    this.wheel = function(Y) {}

    this.keyup = function(e) {}

    this.mousemove = function(event) {
        let mouseX = ((( event.clientX / window.innerWidth ) * 2 - 1)*12)+3;
        let mouseY = - (( event.clientY / window.innerHeight ) * 2 + 1);
        
        // planeGrp.position.x = mouseX;
        // planeGrp.position.y = mouseY;
    }

    this.update = function(time) {}

    function getPerspectiveSize(camera, distance) {

        const vFOV = camera.fov * Math.PI / 180;
        const height = 2 * Math.tan( vFOV / 2 ) * Math.abs(distance);
        const aspect = camera.aspect;
        const width = height * aspect;
    
        return { width, height };
    }
}

export default KaleidoscopeComponent;