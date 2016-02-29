var GifRenderer = function(saveEl) {

  var gifFrames = 0;
  var rendered = false;
  var renderingGif = true;

  var gif = new GIF({
    workers: 40,
    quality: 10,
    workerScript: '../../javascripts/gif/gif.worker.js'
  });
  gif.on('finished', function(blob) {
    if(typeof saveEl === "undefined") {
      window.open(URL.createObjectURL(blob));
    } else {
      var imgTag = document.createElement('img');
      imgTag.src = URL.createObjectURL(blob);
      saveEl.innerHTML = '';
      saveEl.appendChild(imgTag);
    }
  });

  var addFrame = function(canvas, frames) {
    if(renderingGif == true) {
      if(gifFrames < frames) {
        gif.addFrame(canvas, {copy:true, delay: 16});
      } else if(rendered == false) {
        gif.render();
        rendered = true;
      }
      gifFrames++;
    }
  }

  return {
    addFrame: addFrame
  }
};
