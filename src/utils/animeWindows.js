const AnimeWindows = (time, timeline, currentApartment) => {
    timeline.map((layer, i) => {
        layer.animations.map((animation, ii) => {

            if (ii <= 0) return;

            if (time > animation.time && animation.passed == undefined) {

                currentApartment.getObjectByName('Windows').children[ii].visible = true;

                if (currentApartment.getObjectByName('Windows').children[ii - 1]) {
                    currentApartment.getObjectByName('Windows').children[ii - 1].visible = false;
                }

                animation.passed = true;
            }
        })
    });
};

export default AnimeWindows;