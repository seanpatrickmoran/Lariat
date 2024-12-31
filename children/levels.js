
var sliders={
  'MinimumSlider': {
    'valueMin': 0,
    'valueMax': 3,
    'value': 20,
    'sliderX': 0,
    'span': 0,
    'sliderMin': 1,
    'sliderMax': 228
  },
  'FlyingObjects': {
    'valueMin': 1,
    'valueMax': 24,
    'value': 20,
    'sliderX': 0,
    'span': 0,
    'sliderMin': 1,
    'sliderMax': 228
  }
};

var currentSlider, sliderDragMouseX, sliderDragging, sliderTimer

function initSlider(id) {
  var sliderbg, sliderElement, slider;
  slider=sliders[id];
  sliderElement=document.getElementById('sliderThumb'+id);
  sliderbg=document.getElementById('slider'+id);
  slider.sliderSpan=slider.sliderMax-slider.sliderMin;
  slider.sliderX=slider.value/(slider.valueMax-slider.valueMin) * slider.sliderSpan+slider.sliderMin;
  setSliderValue(id, slider.sliderX);
  if (id=='MinimumSlider') {
    registerEvent(sliderElement, 'mousedown', sliderDownToasted);
    registerEvent(sliderbg, 'mousedown', sliderBgDownToasted);
  }
  else {
    registerEvent(sliderElement, 'mousedown', sliderDownFlyingObjects);
    registerEvent(sliderbg, 'mousedown', sliderBgDownFlyingObjects);
  }
}


function releaseSlider(id) {
  var sliderbg, sliderElement;
  sliderElement=document.getElementById('sliderThumb'+id);
  sliderbg=document.getElementById('slider'+id);
  if (id=='MinimumSlider') {
    releaseEvent(sliderElement, 'mousedown', sliderDownToasted);
    releaseEvent(sliderbg, 'mousedown', sliderBgDownToasted);
  }
  else {
    releaseEvent(sliderElement, 'mousedown', sliderDownFlyingObjects);
    releaseEvent(sliderbg, 'mousedown', sliderBgDownFlyingObjects);
  }
}

function sliderDownToasted(e) {
  currentSlider='MinimumSlider';
  sliderDown(e || window.event);
  return false;
}
function sliderDownFlyingObjects(e) {
  currentSlider='FlyingObjects';
  sliderDown(e || window.event);
  return false;
}
function sliderBgDownToasted(e) {
  currentSlider='MinimumSlider';
  sliderBgDown(e || window.event);
  return false;
}
function sliderBgDownFlyingObjects(e) {
  currentSlider='FlyingObjects';
  sliderBgDown(e || window.event);
  return false;
}


function setSliderValue(id, x, isFinal) {
  var el, slider=sliders[id];
  if (x>slider.sliderMax) {
    x=slider.sliderMax;
  }
  else if (x<slider.sliderMin) {
    x=slider.sliderMin;
  }
  if (x!=slider.sliderX || isFinal) {
    slider.value=Math.round( (x-slider.sliderMin)/slider.sliderSpan*(slider.valueMax-slider.valueMin)+slider.valueMin );
    if (id=='MinimumSlider') {
      // settingsToasted=slider.value;
      // updateDisplayToasted();
    }
    else {
      // nFlyers=slider.value;
      // updateDisplayFlyingObjects();
    }
    // if (isFinal) {
    //   updateShortcutLink();
    //   el=document.getElementById('innerLabel'+id);
    //   el.innerHTML= (id=='Toasted')?
    //     ['Light','Medium','Dark','Burned'][settingsToasted]:
    //     nFlyers;
    // }
  }
  document.getElementById('sliderThumb'+id).style.left=x+'px';
  slider.sliderX=x;
}


function sliderUp(e) {
  var x, dx, slider;
  if (window.event) e = window.event;
  if (sliderDragging) {
    slider=sliders[currentSlider];
    x=(typeof e.clientX != 'undefined')? e.clientX:e.pageX;
    dx=x-sliderDragMouseX;
    setSliderValue(currentSlider,slider.sliderX, true);
    sliderDragging=false;
    releaseEvent(document, 'mousemove', sliderDrag);
    releaseEvent(document, 'mouseup', sliderUp);
    document.getElementById('sliderThumb'+currentSlider).style.opacity=1;
  }
  stopEvent(e);
  return false;
}


function sliderDown(e) {
  if (window.event) e = window.event;
  sliderDragMouseX = (typeof e.clientX != 'undefined')? e.clientX:e.pageX;
  registerEvent(document, 'mousemove', sliderDrag);
  registerEvent(document, 'mouseup', sliderUp);
  sliderDragging=true;
  document.getElementById('sliderThumb'+currentSlider).style.opacity=0.75;
  stopEvent(e);
}
function sliderDrag(e) {
  var x, dx, sx, slider;
  if (window.event) e = window.event;
  if (sliderDragging) {
    slider=sliders[currentSlider];
    x=(typeof e.clientX != 'undefined')? e.clientX:e.pageX;
    dx=x-sliderDragMouseX;
    sx=slider.sliderX;
    setSliderValue(currentSlider, sx+dx, false);
    sliderDragMouseX+=slider.sliderX-sx;
  }
  stopEvent(e);
  return false;
}
function sliderUp(e) {
  var x, dx, slider;
  if (window.event) e = window.event;
  if (sliderDragging) {
    slider=sliders[currentSlider];
    x=(typeof e.clientX != 'undefined')? e.clientX:e.pageX;
    dx=x-sliderDragMouseX;
    setSliderValue(currentSlider,slider.sliderX, true);
    sliderDragging=false;
    releaseEvent(document, 'mousemove', sliderDrag);
    releaseEvent(document, 'mouseup', sliderUp);
    document.getElementById('sliderThumb'+currentSlider).style.opacity=1;
  }
  stopEvent(e);
  return false;
}
function setSliderValue(id, x, isFinal) {
  var el, slider=sliders[id];
  if (x>slider.sliderMax) {
    x=slider.sliderMax;
  }
  else if (x<slider.sliderMin) {
    x=slider.sliderMin;
  }
  if (x!=slider.sliderX || isFinal) {
    slider.value=Math.round( (x-slider.sliderMin)/slider.sliderSpan*(slider.valueMax-slider.valueMin)+slider.valueMin );
    if (id=='MinimumSlider') {
      // settingsToasted=slider.value;
      // updateDisplayToasted();
    }
    else {
      // nFlyers=slider.value;
      // updateDisplayFlyingObjects();
    }
    if (isFinal) {
      // updateShortcutLink();
      // el=document.getElementById('innerLabel'+id);
      // el.innerHTML= (id=='Toasted')?
      //   ['Light','Medium','Dark','Burned'][settingsToasted]:
      //   nFlyers;
    }
  }
  document.getElementById('sliderThumb'+id).style.left=x+'px';
  slider.sliderX=x;
}

function sliderBgDown(e) {
  if (sliderDragging) return;
  if (window.event) e = window.event;
  var x, slider=sliders[currentSlider];
  if (typeof e.offsetX != 'undefined') {
    x=e.offsetX;
  }
  else if (typeof e.layerX != 'undefined') {
    x=e.layerX;
  }
  else return;
  if (x<slider.sliderMin) {
    x=slider.sliderMin;
  }
  else if (x>slider.sliderMax) {
    x=slider.sliderMax;
  }
  if (sliderTimer) clearTimeout(sliderTimer);
  sliderMoveTo(x);
  stopEvent(e);
}
function sliderMoveTo(x) {
  var slider=sliders[currentSlider], dx=x-slider.sliderX;
  if (Math.abs(dx)>3) {
    slider.sliderX+=(dx>0)? 3:-3;
    document.getElementById('sliderThumb'+currentSlider).style.left=slider.sliderX+'px';
    sliderTimer=setTimeout( function() { sliderMoveTo(x); }, 10);
  }
  else {
    setSliderValue(currentSlider, x, true);
  }
}

function registerEvent(obj, eventType, handler) {
  if (obj.addEventListener) {
    obj.addEventListener(eventType.toLowerCase(), handler, false);
  }
  else if (obj.attachEvent) {
    obj.attachEvent('on'+eventType.toLowerCase(), handler);
  }
}
function releaseEvent(obj, eventType, handler) {
  if (obj.removeEventListener) {
    obj.removeEventListener(eventType.toLowerCase(), handler, false);
  }
  else if (obj.detachEvent) {
    obj.detachEvent('on'+eventType.toLowerCase(), handler);
  }
}

function stopEvent(e) {
  if (e.preventDefault) e.preventDefault();
  if (e.stopPropagation) e.stopPropagation();
  e.cancelBubble=true;
  e.returnValue=false;
}



initSlider('MinimumSlider');
initSlider('FlyingObjects');


/////////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////////

document.addEventListener("DOMContentLoaded", async () => {

  // var image = new Image();
  // image.onload = () => { ctx.drawImage(image, 0, 0) }
  // image.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAQAAAAngNWGAAAAF0lEQVR42mNk+M9AFGAcVTiqcFQhCAAAf0sUAaSRMCEAAAAASUVORK5CYII="
  // image.src ="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbEAAAFcCAMAAABx1HDfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKtQTFRF////AAAAzs7O3t7ec3NznJycISEAZmZmUlJS7u7u2NjY+fn5ra2tQkIhCwsLAAD/AACmQkJChYWFhSEAu7u7QiEATExMTU1NdHR0WVlZ6Ojovb2sNzc3ZGRkzc29WFhYw8PDISEhqqqqzMzMpqam6enp19fXsrKyeXl57u7/m5ub3t7/f39/vb29jIyMrKysiIiIx8fHzc3NHBwc0tLSenp6xsbGQEBAIiIifLaDnwAAADl0Uk5T//////////////////////////////////////////////////////////////////////////8AOqxlQAAAFOlJREFUeNrsnQtjoziyhVUh417sth27e6bnJvFkM5OdR+9072zvfeT//7IrHoIqqXgZDDicSmITDBjr8ykVklAZgl2VvRoysOuxm5TYDexq7DsiELtOYpdX89u2cTyi0Njtpe2NI7sdw0bXWBbr2KfwA2eviBUti6rYL32uOTZ/qeLoFJzGTctzerMaqylVb31bYuV2tcdue8TajepefJsaK0o1/yKzL3RBLF9XyiL/S3+J8+Gbsz30Y9+Ig90Em8pt/YNQeGr5OTmJv32N8T+tOP0t6UbfXtOYdmyVWLipdxBlWTunBWhMK1WPSrBlH2LqS83EyhqQ9HcoX1qKxohCjbHy7UVMHvs8jTFy0qcTOyrdLEpjfuRRXXTdNXZzMxSxG+9bdCOeaVH12I1Sj4k6g3oQG0pjgae+Kc/JLSxCY3WxIkemEWNhnK5TPVbk12Z+bVURKzKv6EWz3CuizeOCVnPJdk1tHgsx7SKbBiGGtvuLCSyEU9syBWIwEFsgsZvvYNdjCTHYdZmhCHZFlhLDCKWrsehvIHZd9h2IgRgMxGAgBmIwEIOBGIjBQAwGYosjlrYTF0tu2SQLRMG2psWafB2ph2BvZZoPBmJGLSWBqa4EWxArjpe9UkmsHX4Qa0Ms7UzL11NR+O5/oUp1Dd9Wvp4fVnIN3hPAuhOTlHzdqIxN6VpDjTGKPlfDXymJglgdMU8grKjPI8aEGRBTfCer7tTKDcTaeMUGYhrjeo0R6cQkSwC7FDE/WGjjFWVk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"
  // const base64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAbEAAAFcCAMAAABx1HDfAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAKtQTFRF////AAAAzs7O3t7ec3NznJycISEAZmZmUlJS7u7u2NjY+fn5ra2tQkIhCwsLAAD/AACmQkJChYWFhSEAu7u7QiEATExMTU1NdHR0WVlZ6Ojovb2sNzc3ZGRkzc29WFhYw8PDISEhqqqqzMzMpqam6enp19fXsrKyeXl57u7/m5ub3t7/f39/vb29jIyMrKysiIiIx8fHzc3NHBwc0tLSenp6xsbGQEBAIiIifLaDnwAAADl0Uk5T//////////////////////////////////////////////////////////////////////////8AOqxlQAAAFOlJREFUeNrsnQtjoziyhVUh417sth27e6bnJvFkM5OdR+9072zvfeT//7IrHoIqqXgZDDicSmITDBjr8ykVklAZgl2VvRoysOuxm5TYDexq7DsiELtOYpdX89u2cTyi0Njtpe2NI7sdw0bXWBbr2KfwA2eviBUti6rYL32uOTZ/qeLoFJzGTctzerMaqylVb31bYuV2tcdue8TajepefJsaK0o1/yKzL3RBLF9XyiL/S3+J8+Gbsz30Y9+Ig90Em8pt/YNQeGr5OTmJv32N8T+tOP0t6UbfXtOYdmyVWLipdxBlWTunBWhMK1WPSrBlH2LqS83EyhqQ9HcoX1qKxohCjbHy7UVMHvs8jTFy0qcTOyrdLEpjfuRRXXTdNXZzMxSxG+9bdCOeaVH12I1Sj4k6g3oQG0pjgae+Kc/JLSxCY3WxIkemEWNhnK5TPVbk12Z+bVURKzKv6EWz3CuizeOCVnPJdk1tHgsx7SKbBiGGtvuLCSyEU9syBWIwEFsgsZvvYNdjCTHYdZmhCHZFlhLDCKWrsehvIHZd9h2IgRgMxGAgBmIwEIOBGIjBQAwGYosjlrYTF0tu2SQLRMG2psWafB2ph2BvZZoPBmJGLSWBqa4EWxArjpe9UkmsHX4Qa0Ms7UzL11NR+O5/oUp1Dd9Wvp4fVnIN3hPAuhOTlHzdqIxN6VpDjTGKPlfDXymJglgdMU8grKjPI8aEGRBTfCer7tTKDcTaeMUGYhrjeo0R6cQkSwC7FDE/WGjjFWVk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"


  // createHistogramFromBase64(base64);
});

window.api.recieve("base64-arrives-levels", base64 => {
  const canvas = document.getElementById("levelsCanvas");
  canvas.height = 260;
  canvas.width = 360;
  const ctx = canvas.getContext('2d');
  console.log('5')
  createHistogramFromBase64(base64);
});


document.addEventListener("onbeforeunload", () => {
  window.send('window-closing', 'levelsWindow');
})




function createHistogramFromBase64(base64Image) {
  const canvashidden = document.createElement('canvas');
  const ctxh = canvashidden.getContext('2d');

  const canvas = document.getElementById('levelsCanvas');
  canvas.width = 360;
  canvas.height = 200;
  const ctx = canvas.getContext('2d');
  const img = new Image();

  img.onload = function() {
    canvashidden.width = 450;
    canvashidden.height = 450;
    ctxh.drawImage(img, 0, 0);

    const imageData = ctxh.getImageData(0, 0, canvashidden.width, canvashidden.height);
    console.log(imageData);
    const histogram = new Array(256).fill(0);

    for (let i = 0; i < imageData.data.length; i += 4) {
      const grayscaleValue = Math.round((imageData.data[i] + imageData.data[i + 1] + imageData.data[i + 2]) / 3);
      histogram[grayscaleValue]++;

      
    }
    drawHistogram(canvas, histogram);
  };

  img.src = base64Image;
}

function drawHistogram(canvas, histogram) {
  const ctx = canvas.getContext('2d');
  const maxFrequency = Math.max(...histogram);
  const barWidth = canvas.width / 256;
  ctx.fillStyle = "#fcf3e2"; 
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'black';
  for (let i = 0; i < 256; i++) {
    const barHeight = (histogram[i] / maxFrequency) * canvas.height;
    ctx.fillRect(i * barWidth, canvas.height - barHeight, barWidth, barHeight);
  }
}




















