import media from '../videos/Tear.mp4';

function TearCanvas(scene, camera) {

  let videoDom = document.createElement("video");
  videoDom.setAttribute('src', media);
  let canvas = document.querySelector(".tear-canvas");
  canvas.width = document.body.clientWidth;
  canvas.height = document.body.clientHeight;
  let canvasW = canvas.width;
  let canvasH = canvas.height;
  let canvasContext = canvas.getContext("2d");
  

  function drawCanvas() {
    canvasContext.drawImage(videoDom, 0, 0, canvasW, canvasH);
    setTimeout(drawCanvas, 0);
  }

  setTimeout(()=> {
    videoDom.play()
    setTimeout(()=> {
      videoDom.pause()
    },10)
  },500)

  videoDom.addEventListener("play", drawCanvas);

  let drag = false;
  let mouseDown = false
  let dragProgress = 0;
  let scrollpos = 0;
  videoDom.currentTime = 0;

  document.addEventListener('mousedown', () => {
    drag = false
    mouseDown = true
  });
  document.addEventListener('mousemove', (e) => {
    drag = true
    if(mouseDown) {
      if(dragProgress >= 0) {
        dragProgress += e.movementY/500;
      } else {
        dragProgress =0
      }
    }
  });
  document.addEventListener('mouseup', () => {
    mouseDown = false
  });


  setInterval(()=>{
    scrollpos += (dragProgress - scrollpos) * 0.5;
    videoDom.currentTime = scrollpos;
  }, 100);


    this.update = function(time) {
    }

    this.helpers = (gui) => {
    }
}

export default TearCanvas;