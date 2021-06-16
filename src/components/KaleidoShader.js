import { Uniform } from 'three';
import { Effect, BlendFunction } from 'postprocessing';

const fragment = `
uniform sampler2D tDiffuse;
uniform float sides;
uniform float angle;

void mainImage(const in vec4 inputColor, const in vec2 uv, out vec4 outputColor) {
    // outputColor = vec4(vec3(1., 0., 0.), 1.);

    if (sides == 0.0) {
		outputColor = texture2D( inputBuffer, vUv );
	} else {
		// normalize to the center
		vec2 p = vUv - 0.5;

		// cartesian to polar coordinates
		float r = length(p);
		float a = atan(p.y, p.x) + angle;

		// kaleidoscope
		float tau = 2. * 3.1416 ;
		a = mod(a, tau/sides);
		a = abs(a - tau/sides/2.) ;

		// polar to cartesian coordinates
		p = r * vec2(cos(a), sin(a));
		// sample the input texture
		vec4 color = texture2D(inputBuffer, p + 0.5);
		outputColor = color;
	}
	
	// outputColor = vec4(vec3(1., 0., 0.), 1.);
}
`;

export default class KaleiodoscopeEffect extends Effect {
    constructor({ blendFunction = BlendFunction.NORMAL, noise = 0.1 } = {}) {
        super('BarrelEffect', fragment, {
            blendFunction,
            uniforms: new Map([
                ['tDiffuse', new Uniform(null)],
                ['sides', new Uniform(1.0)],
                ['angle', new Uniform(1.0)],
            ])
        })
    }

    update() {
        // this.uniforms.get('amount').value += 0.1;
    }
}