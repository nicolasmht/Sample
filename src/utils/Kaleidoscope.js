export class Kaleidoscope {
    constructor(options1 = {
        PI: Math.PI / 2,
        PII: Math.PI * 2,
    }) {
        var key, ref, ref1, val;
        this.options = options1;
        this.defaults = {
            offsetRotation: 0.0,
            offsetScale: 1.5,
            offsetX: 0,
            offsetY: 0.0,
            radius: 360,
            slices: 3,
            zoom: 1.0
        };

        ref = this.defaults;
        for (key in ref) { val = ref[key]; this[key] = val; }

        ref1 = this.options;

        for (key in ref1) { val = ref1[key]; this[key] = val; }

        if (this.domElement == null) {
            this.domElement = document.createElement("canvas");
        }

        if (this.context == null) {
            this.context = this.domElement.getContext("2d");
        }

        if (this.image == null) {
            this.image = document.createElement("img");
        }
    }

    draw() {
        var cx, i, index, ref, results, scale, step;

        this.domElement.width = this.domElement.height = this.radius * 2;
        this.context.fillStyle = this.context.createPattern(
            this.image,
            "repeat"
        );

        scale = this.zoom * (this.radius / Math.min(this.image.width, this.image.height));
        step = Math.PI * 2 / this.slices;
        cx = this.image.width / 2;
        results = [];

        for ( index = i = 0, ref = this.slices; 0 <= ref ? i <= ref : i >= ref; index = 0 <= ref ? ++i : --i) {
            this.context.save();
            this.context.translate(this.radius, this.radius);
            this.context.rotate(index * step);
            this.context.beginPath();
            this.context.moveTo(-0.5, -0.5);
            this.context.arc(0, 0, this.radius, step * -0.51, step * 0.51);
            this.context.lineTo(0.5, 0.5);
            this.context.closePath();
            this.context.rotate(Math.PI / 2);
            this.context.scale(scale, scale);
            this.context.scale([-1, 1][index % 2], 1);
            this.context.translate(this.offsetX - cx, this.offsetY);
            this.context.rotate(this.offsetRotation);
            this.context.scale(this.offsetScale, this.offsetScale);
            this.context.fill();
            results.push(this.context.restore());
        }
        
        return results;
    }
}

export class DragDrop {
    constructor(callback, context = document, filter = /^image/i) {
        var disable;
        this.onDrop = this.onDrop.bind(this);
        this.callback = callback;
        this.context = context;
        this.filter = filter;
        disable = function (event) {
            event.stopPropagation();
            return event.preventDefault();
        };

        this.context.addEventListener("dragleave", disable);
        this.context.addEventListener("dragenter", disable);
        this.context.addEventListener("dragover", disable);
        this.context.addEventListener("drop", this.onDrop, false);
    }

    onDrop(event) {
        var file, reader;
        event.stopPropagation();
        event.preventDefault();
        file = event.dataTransfer.files[0];

        if (this.filter.test(file.type)) {
            reader = new FileReader();
            reader.onload = (event) => {
            return typeof this.callback === "function"
                ? this.callback(event.target.result)
                : void 0;
            };
            return reader.readAsDataURL(file);
        }
    }
};