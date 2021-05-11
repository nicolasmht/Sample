import * as THREE from 'three';

function createWindows(layers) {

    let objects = [];

    layers.map(layer => {

        let animations = [];

        layer.animations.map(animation => {

            let aPromise = [];

            for(let i = 0; i < 2; i++) {
                aPromise.push(new Promise(resolve => {

                    const texture = new THREE.TextureLoader().load(animation.texture);
                    texture.minFilter = THREE.LinearFilter;
    
                    resolve({...animation, texture: texture})
                }));
            }

            animations.push(aPromise);
        });

        objects.push({...layer, animations: animations});
    });

    let windows = new THREE.Group();
        windows.name = 'Windows';

    objects.map((object, i) => {

        object.animations.map((animation, ii) => {

            let doubleWindows = new THREE.Group();
            doubleWindows.name = object.name;
            doubleWindows.visible = ii == 0 ? true : false;

            Promise.all(animation).then((anime) => {

                anime.map((windowTexture, ii) => {
                    let sprite = CreateSprite(windowTexture.texture);
                    sprite.position.x = (ii === 0) ? -0.35 : 0.35;
                    doubleWindows.add(sprite);
                });
            });

            windows.position.z = .4;
            windows.add(doubleWindows);
        });

    });

    return windows;

    // windowLeft.position.x = 0.35;
    // windowRight.position.x -= 0.35;
}

function createWindowLayers(WindowTexture, TextureShadow, TextureFrame) {

    let group = new THREE.Group();
    group.position.z = 0.1;

    let window = CreateSprite(new THREE.TextureLoader().load(WindowTexture));
    let shadow = CreateSprite(new THREE.TextureLoader().load(TextureShadow));
    let frame = CreateSprite(new THREE.TextureLoader().load(TextureFrame));

    window.position.z = 0.2;
    shadow.position.z = 0.0;
    frame.position.z = 0.1;

    group.add(window, shadow, frame);

    return group;
}

function CreateSprite(texture) {
    
    let spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
    });

    let sprite = new THREE.Sprite(spriteMaterial);

    sprite.scale.set(0.725, 1, 1);

    return sprite;
}

export default createWindows;