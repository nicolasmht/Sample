let iles = document.querySelectorAll('section');
let map = document.querySelector('#map');

iles.forEach((ile) =>{

    ile.addEventListener('click', (e) => {

        // console.log(e);
        // map.style.transformOrigin = `${e.clientX}px ${e.clientY}px`;
        // setTimeout(() =>  {
        //     map.style.transform = 'scale(2)';
        // }, 1000);

        //console.log(ile)
        if(e.target.classList.contains('active')) return;
        
        e.target.style.zIndex = 10;
        e.target.classList.add('active');
    });
});


document.addEventListener('DOMContentLoaded', function() {

    let ele = document.querySelector('html');
    ele.style.cursor = 'grab';

    let pos = { top: 0, left: 0, x: 0, y: 0 };

    const mouseDownHandler = function(e) {
        ele.style.cursor = 'grabbing';
        ele.style.userSelect = 'none';

        pos = {
            left: ele.scrollLeft,
            top: ele.scrollTop,
            // Get the current mouse position
            x: e.clientX,
            y: e.clientY,
        };

        document.addEventListener('mousemove', mouseMoveHandler);
        document.addEventListener('mouseup', mouseUpHandler);
    };

    const mouseMoveHandler = function(e) {
        // How far the mouse has been moved
        const dx = e.clientX - pos.x;
        const dy = e.clientY - pos.y;

        // Scroll the element
        ele.scrollTop = pos.top - dy;
        ele.scrollLeft = pos.left - dx;
    };

    const mouseUpHandler = function() {
        ele.style.cursor = 'grab';
        ele.style.removeProperty('user-select');

        document.removeEventListener('mousemove', mouseMoveHandler);
        document.removeEventListener('mouseup', mouseUpHandler);
    };

    // Attach the handler
    ele.addEventListener('mousedown', mouseDownHandler);
});