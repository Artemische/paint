let isDrawing = false;
let x = 0;
let y = 0;
let color = document.getElementById("myColor").value;
let width = document.getElementById('line-width').value;
let imgData;
let frameIndx = currentIndx = 0;

const canv = document.getElementById('myPics');
const context = canv.getContext('2d');

let newImgData = context.getImageData(0, 0, canv.width, canv.height);
let imgDataArr = [newImgData];
let imgUrlArr = [''];
const rect = canv.getBoundingClientRect();

function drawLine(context, x1, y1, x2, y2) {
  context.beginPath();
  context.strokeStyle = color;
  context.lineWidth = width;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

canv.addEventListener('mousedown', e => {
  color = document.getElementById('myColor').value;
  width = document.getElementById('line-width').value;
  isDrawing = true;
  x = e.clientX - rect.left;
  y = e.clientY - rect.top;
});
canv.addEventListener('mousemove', e => {
  if (isDrawing) {
    drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
    x = e.clientX - rect.left;
    y = e.clientY - rect.top;
  }
});
canv.addEventListener('mouseup', e => {
  if (isDrawing) {
    drawLine(context, x, y, e.clientX - rect.left, e.clientY - rect.top);
    x = 0;
    y = 0;
    isDrawing = false;
  }
  let hz = canv.toDataURL();
  imgData = context.getImageData(0, 0, canv.width, canv.height);
  imgDataArr[currentIndx] = imgData;
  imgUrlArr[currentIndx] = hz;
  document.getElementById(currentIndx).style.backgroundImage = `url(${hz})`;
  // console.log(imgDataArr);
});
////////////////////////////////FRAMES//////////////////////////////////////

document.getElementById('copy').addEventListener('click', e => {
  imgData = context.getImageData(0, 0, canv.width, canv.height);
  imgDataArr[frameIndx] = imgData;
});

document.getElementById('clear').addEventListener('click', e => {
  context.clearRect(0, 0, canv.width, canv.height);
});

document.getElementById('paste').addEventListener('click', e => {
  context.putImageData(imgData, 0, 0);
});

document.getElementById('add-frame').addEventListener('click', e => {
  let newDiv = document.createElement('div');
  let delBut = document.createElement('button');
  delBut.id = 'delBut';
  delBut.innerHTML = 'DEL';
  frameIndx +=1;
  newDiv.id = frameIndx.toString();
  newDiv.className = 'frame';
  newDiv.innerHTML = `
    <button id="delFrame">Del</button>
  `
  frame_container.appendChild(newDiv);
  imgDataArr.push(newImgData);
  imgUrlArr.push('');
  // console.log(imgUrlArr);
  // console.log(imgDataArr, imgDataArr.length);
});

document.getElementById('frame_container').addEventListener('click',e => {
  let target = e.target;
  if (target.tagName != 'DIV') return;
  currentIndx = target.id;
  imgData = imgDataArr[currentIndx];
  context.putImageData(imgData, 0, 0);
  // console.log('new');
  // console.log(target.id, currentIndx);
});

///////////////////////////////Animation/////////////////////////////////////
let FPS = 200;
let i = 0;
function colFPS() {
  document.getElementById('fps-value').innerHTML = 
  document.getElementById('fps').value;
  FPS = 1000/document.getElementById('fps').value;
}
  let timerId = setInterval(startInterval, FPS)
function startInterval() {
  if (imgUrlArr[i] === undefined) i=0;
  document.getElementById('animation').style.backgroundImage = `url(${imgUrlArr[i]})`;
  i += 1;
  clearInterval(timerId);
  timerId = setInterval(startInterval, FPS);
}
//////////////////////////////Delete-Frame////////////////////////////////////
document.getElementById('frame_container').addEventListener('click',e => {
  if ( e.target.tagName != 'BUTTON') return;
  frameIndx -=1;
  let parent = e.target.parentElement;
  let id = parent.id;
  document.getElementById('frame_container').removeChild(parent);
  imgUrlArr.splice(id, 1);
  imgDataArr.splice(id, 1);
  re_id();
});

function re_id() {
  let childArr = document.getElementById('frame_container').childNodes;
  let n = 0;
  for (let i = 0; i < childArr.length; i++) {
    if (childArr[i].className == 'frame') {
      childArr[i].id = n + '';
      console.log(n, childArr[i].id, childArr);
      n += 1;
    }
  }
}
