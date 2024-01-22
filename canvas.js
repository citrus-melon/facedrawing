var canvas = document.getElementById('canvas'), g = canvas.getContext("2d");
g.strokeStyle = "#222222";
g.lineJoin = "round";
g.lineWidth = 5;
g.filter = "blur(1px)";

const
relPos = pt => [pt.pageX - canvas.offsetLeft, pt.pageY - canvas.offsetTop],
drawStart = pt => { with(g) { beginPath(); moveTo.apply(g, pt); stroke(); }},
drawMove = pt => { with(g) { lineTo.apply(g, pt); stroke(); }},

pointerDown = e => drawStart(relPos(e.touches ? e.touches[0] : e)),
pointerMove = e => drawMove(relPos(e.touches ? e.touches[0] : e)),

draw = (method, move, stop) => e => {
    if(method=="add") pointerDown(e);
    canvas[method+"EventListener"](move, pointerMove);
    canvas[method+"EventListener"](stop, g.closePath);
};

canvas.addEventListener("mousedown", draw("add","mousemove","mouseup"));
canvas.addEventListener("touchstart", draw("add","touchmove","touchend"));
canvas.addEventListener("mouseup", draw("remove","mousemove","mouseup"));
canvas.addEventListener("touchend", draw("remove","touchmove","touchend"));
canvas.addEventListener("touchmove", (e) => e.preventDefault());

function saveImage(name) {
  var imgURL = canvas.toDataURL("image/png");
  var link = document.createElement("a");
  link.download = name;
  link.href = imgURL;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  delete link;
  clearImage();
}

function clearImage() {
  g.clearRect(0, 0, canvas.width, canvas.height);
}