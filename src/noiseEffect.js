import { Uniform } from 'three';
import { Effect, BlendFunction } from 'postprocessing';

const fragment = `
uniform float amount;
uniform float noise;
uniform sampler2D tDiffuse;

float random( vec2 p ) {
    vec2 K1 = vec2(
        23.14069263277926, // e^pi (Gelfond's constant)
        2.665144142690225 // 2^sqrt(2) (Gelfond–Schneider constant)
    );
    return fract( cos( dot(p,K1) ) * 12345.6789 );
}

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // outputColor = vec4(vec3(1., 0., 0.), 1.);

    vec4 color = texture2D( tDiffuse, uv );
    vec2 uvRandom = uv;
    uvRandom.y *= random(vec2(uvRandom.y, amount));
    color.rgb += random(uvRandom) * noise;
    outputColor = inputColor + color;
}
`;

export default class NoiseEffect extends Effect {
    constructor({ blendFunction = BlendFunction.NORMAL, noise = 0.1 } = {}) {
        super('BarrelEffect', fragment, {
            blendFunction,
            uniforms: new Map([
                ['tDiffuse', new Uniform(null)],
                ['amount', new Uniform(0.0)],
                ['noise', new Uniform(noise)],
            ])
        })
    }

    update() {
        this.uniforms.get('amount').value += 0.1;
    }
}