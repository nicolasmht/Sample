import * as THREE from 'three';
import {Howl, Howler} from 'howler';

// Textures
import FacadeTexture from '../textures/facade.png';

// Audios
import CityAudio from '../audios/city.mp3';

function FacadeComponent(scene) {

    const facadeSpriteMaterial = new THREE.SpriteMaterial({ map: new THREE.TextureLoader().load(FacadeTexture) });
    const facadeSprite = new THREE.Sprite(facadeSpriteMaterial);

    facadeSprite.scale.set(4.5, 4.5 / 0.95, 1);
    facadeSprite.position.z = 0.1;

    scene.add(facadeSprite);

    // Audio
    var sound = new Howl({
        src: CityAudio,
        volume: 1,
        loop: true,
    }).play();

    this.update = function(time) {
        
    }

    this.helpers = (gui) => {
        
    }

}

export default FacadeComponent;