
let isDrag = false;
let objDrag = null;

function startDrag(e) {
   
    if(isDrag) return;

    isDrag = true;
    objDrag = e.target;
    // determine event object
    if (!e) {
        var e = window.event;
    }
    if(e.preventDefault) e.preventDefault();

    // IE uses srcElement, others use target
    var targ = e.target ? e.target : e.srcElement;

    // if (targ.className != 'draggable') {return};
    // calculate event X, Y coordinates
        offsetX = e.clientX;
        offsetY = e.clientY;

    // assign default values for top and left properties
    if(!targ.style.left) { targ.style.left='0px'};
    if (!targ.style.top) { targ.style.top='0px'};

    // calculate integer values for top and left 
    // properties
    coordX = parseInt(targ.style.left);
    coordY = parseInt(targ.style.top);
    drag = true;

    // move div element
        document.onmousemove=dragDiv;
    return false;
    
}
function dragDiv(e) {
    if(e.target !== objDrag) return;
    if (!drag) {return};
    if (!e) { var e= window.event};
    var targ=e.target?e.target:e.srcElement;
    // move div element
    targ.style.left=coordX+e.clientX-offsetX+'px';
    targ.style.top=coordY+e.clientY-offsetY+'px';
    return false;
}
function stopDrag() {
    drag=false;
    isDrag = false;
}
window.onload = function() {
    document.onmousedown = startDrag;
    document.onmouseup = stopDrag;
}

// Stamps 
let stamps = document.querySelectorAll('.draggable');

stamps.forEach((stamp) => {
    stamp.addEventListener('mouseover', playSound);
});

function playSound(){

    // Play the sound
    if(currentSound) currentSound.fade(1, 0, 300),   currentSound.stop();

    currentSound = SOUNDS[this.dataset.id];

    if(currentSound) currentSound.play(), currentSound.fade(0, 1, 300);
    
}

// Current sound
let currentSound = null;
const SOUNDS = [];

let jtm = new Howl({
    src: ['./sounds/jtm.mp3'],
    volume: 0
});

SOUNDS.push(jtm);


let charlotte = new Howl({
    src: ['./sounds/charlotte.mp3'],
    volume: 0
});


SOUNDS.push(charlotte);

let clopes = new Howl({
    src: ['./sounds/Gainsbourg_TheInitials.mp3'],
    volume: 0
});

SOUNDS.push(clopes);

function isHidden(el) {
    return (el.offsetParent === null);
}

var el = document.querySelector('.jtm');

// let stamps = document.querySelectorAll('.draggable');

    // stamps.forEach((stamp) => {
    //     // stamp.addEventListener('mouseover', playSound);
    //     // stamp.addEventListener('mouseout', stopSound);
    // });

    // function playSound() {
    //     // Play the sound
    //     currentSound = SOUNDS[this.dataset.id];
    //     if (currentSound && !isPlay) {
    //         currentSound.play();
    //         currentSound.fade(0, 1, 0);
    //         isPlay = true;
    //     }
    // }

    // function stopSound() {
    //     if (isPlay) {
    //         currentSound.stop();
    //         isPlay = false;
    //     }
    // }

    // let papers = document.querySelectorAll('img:not(.stamp)');
    // const PAPERS_POSITIONS = [];

    // papers.forEach((paper) => {

    //     let _top = paper.offsetTop;
    //     let _bottom = paper.offsetBottom;
    //     let _left = paper.offsetLeft;
    //     let _right = paper.offsetRight;

    //     PAPERS_POSITIONS.push({
    //         top: _top,
    //         bottom: _bottom,
    //         left: _left,
    //         right: _right
    //     })
    // });

    // document.addEventListener('mousemove', function(e) {



    // });
    
