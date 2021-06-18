import * as THREE from 'three';

// Textures
// import FacadeTexture from '../textures/facade.png';

// Audios
import { Kaleidoscope, DragDrop } from '../utils/Kaleidoscope';

import IMG from '../images/focus/kaleidoscope/Bollywood.png';
import IMG2 from '../images/focus/kaleidoscope/Britney.png';

function KaleidoscopeComponent(scene) {

    // Init kaleidoscope
    let image = new Image();
    let image2 = new Image();

    image.onload = () => {
        return kaleidoscope.draw();
    };

    image2.onload = () => {
        return kaleidoscope2.draw();
    };

    image.src = IMG2;
    image2.src = IMG;

    let kaleidoscope = new Kaleidoscope({
        image: image,
        slices: 20,
        // zoom: 0.1
    });

    let kaleidoscope2 = new Kaleidoscope({
        image: image2,
        slices: 20,
        // zoom: 0.6
    });

    kaleidoscope.domElement.style.position = "absolute";
    kaleidoscope.domElement.style.left = "0";
    kaleidoscope.domElement.style.top = "0";
    kaleidoscope.domElement.style.zIndex = "999";
    kaleidoscope.domElement.style.width = window.innerWidth;
    kaleidoscope.domElement.style.height = window.innerWidth;
    document.querySelector(".focus-kaleidoscope").appendChild(kaleidoscope.domElement);

    kaleidoscope2.domElement.style.position = "absolute";
    kaleidoscope2.domElement.style.left = "0";
    kaleidoscope2.domElement.style.top = "0";
    kaleidoscope2.domElement.style.zIndex = "999";
    document.querySelector(".focus-kaleidoscope").appendChild(kaleidoscope2.domElement);

    // Init drag & drop
    let dragger = new DragDrop(function (data) {
        return (kaleidoscope.image.src = data);
    });

    let dragger2 = new DragDrop(function (data) {
        return (kaleidoscope2.image.src = data);
    });

    // Mouse events
    let tx = kaleidoscope.offsetX;
    let ty = kaleidoscope.offsetY;
    let tr = kaleidoscope.offsetRotation;

    document.addEventListener('mousemove', function(event) {
        var cx, cy, dx, dy, hx, hy;
        cx = window.innerWidth / 2;
        cy = window.innerHeight / 2;
        dx = event.pageX / window.innerWidth;
        dy = event.pageY / window.innerHeight;
        hx = dx - 0.5;
        hy = dy - 0.5;
        tx = hx * kaleidoscope.radius * -2;
        ty = hy * kaleidoscope.radius * 2;

        let mouseX = (( event.clientX / window.innerWidth ) * 2 - 1);
        let mouseY = - (( event.clientY / window.innerHeight ) * 2 + 1);

        kaleidoscope2.domElement.style.opacity = 0.5 + mouseX;
        // kaleidoscope2.domElement.style.opacity = 1 * -mouseX + 0.25;
        return (tr = Math.atan2(hy, hx));
    });

    function renderer() {
        var delta, theta;
        delta = tr - kaleidoscope.offsetRotation;
        theta = Math.atan2(Math.sin(delta), Math.cos(delta));
        kaleidoscope.offsetX += (tx - kaleidoscope.offsetX) * 0.1;
        kaleidoscope.offsetY += (ty - kaleidoscope.offsetY) * 0.1;
        kaleidoscope.offsetRotation += (theta - kaleidoscope.offsetRotation) * 0.1;
        kaleidoscope.draw();

        delta = tr - kaleidoscope2.offsetRotation;
        theta = Math.atan2(Math.sin(delta), Math.cos(delta));
        kaleidoscope2.offsetX += (tx - kaleidoscope2.offsetX) * 0.1;
        kaleidoscope2.offsetY += (ty - kaleidoscope2.offsetY) * 0.1;
        kaleidoscope2.offsetRotation += (theta - kaleidoscope2.offsetRotation) * 0.1;
        kaleidoscope2.draw();

        requestAnimationFrame(renderer);
    }

    renderer();

    this.update = function(time) {
        // var delta, theta;
        // delta = tr - kaleidoscope.offsetRotation;
        // theta = Math.atan2(Math.sin(delta), Math.cos(delta));
        // kaleidoscope.offsetX += (tx - kaleidoscope.offsetX) * 0.1;
        // kaleidoscope.offsetY += (ty - kaleidoscope.offsetY) * 0.1;
        // kaleidoscope.offsetRotation += (theta - kaleidoscope.offsetRotation) * 0.1;
        // kaleidoscope.draw();

        // delta = tr - kaleidoscope2.offsetRotation;
        // theta = Math.atan2(Math.sin(delta), Math.cos(delta));
        // kaleidoscope2.offsetX += (tx - kaleidoscope2.offsetX) * 0.1;
        // kaleidoscope2.offsetY += (ty - kaleidoscope2.offsetY) * 0.1;
        // kaleidoscope2.offsetRotation += (theta - kaleidoscope2.offsetRotation) * 0.1;
        // kaleidoscope2.draw();
    }

    this.helpers = (gui) => {

        const kali = gui.addFolder("Kaleidoscope");
        kali.add(kaleidoscope, "zoom").min(0.25).max(2.0);
        kali.add(kaleidoscope, "slices").min(6).max(32).step(2);
        kali.add(kaleidoscope, "radius").min(200).max(500);

        kali
            .add(kaleidoscope, "offsetX")
            .min(-kaleidoscope.radius)
            .max(kaleidoscope.radius)
            .listen();

        kali
            .add(kaleidoscope, "offsetY")
            .min(-kaleidoscope.radius)
            .max(kaleidoscope.radius)
            .listen();

        kali.add(kaleidoscope, "offsetRotation").min(-Math.PI).max(Math.PI).listen();
        kali.add(kaleidoscope, "offsetScale").min(0.5).max(4.0);
        // kali.add(options, "interactive").listen();
        kali.close();
    }

    this.wheel = function(Y) {}

    this.keyup = function(e) {}

    this.mousemove = function(event) {
        // var cx, cy, dx, dy, hx, hy;
        // cx = window.innerWidth / 2;
        // cy = window.innerHeight / 2;
        // dx = event.pageX / window.innerWidth;
        // dy = event.pageY / window.innerHeight;
        // hx = dx - 0.5;
        // hy = dy - 0.5;
        // tx = hx * kaleidoscope.radius * -2;
        // ty = hy * kaleidoscope.radius * 2;

        // let mouseX = (( event.clientX / window.innerWidth ) * 2 - 1);
        // let mouseY = - (( event.clientY / window.innerHeight ) * 2 + 1);

        // kaleidoscope2.domElement.style.opacity = 0.5 + mouseX;
        // // kaleidoscope2.domElement.style.opacity = 1 * -mouseX + 0.25;
    }
}

export default KaleidoscopeComponent;