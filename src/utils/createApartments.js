import * as THREE from 'three';

function CreateApartment(layers, name) {
    
    const apartment = new THREE.Group();
    apartment.name = name;

    let objects = [];
    
    layers.map(layer => {

        let animations = [];

        layer.animations.map(animation => {

            animations.push(new Promise(resolve => {

                const texture = new THREE.TextureLoader().load(animation.texture);
                texture.minFilter = THREE.LinearFilter;

                resolve({...animation, texture: texture})
            }));
        });

        objects.push({...layer, animations});
    });

    objects.map(object => {

        const objectGroup = new THREE.Group();
        objectGroup.name = object.name;
        objectGroup.parallax = {
            level: object.level,
        };

        Promise.all(object.animations).then((animation) => {
            
            animation.map((animation, i) => {
                let sprite = CreateSprite(animation.texture);
            
                sprite.position.z = 0 //i * 0.001 - 0.1;

                sprite.parallax = {
                    level: object.level,
                };

                sprite.visible = i === 0 ? true : false;
                sprite.name = object.name;

                objectGroup.add(sprite)
            })

        })

        apartment.add(objectGroup);

    })

    return apartment;
}

function CreateSprite(texture) {
    
    let spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
    });

    let sprite = new THREE.Sprite(spriteMaterial);

    sprite.scale.set(1.2, 1.2 / 1.4, 1);

    return sprite;
}

export default CreateApartment;