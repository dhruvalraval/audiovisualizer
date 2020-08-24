var cursorX;
var cursorY;
document.onmousemove = function(e) {
  cursorX = e.pageX;
  cursorY = e.pageY;
};

// return true if in range, otherwise false
function inRange(x, min = 0, max) {
  return (x - min) * (x - max) <= 0;
}

function drawStar(ctx, x, y, spikes, outerRadius, innerRadius) {
  let cx = x;
  let cy = y;
  let rot = (Math.PI / 2) * 3;
  let step = Math.PI / spikes;
  ctx.moveTo(cx, cy - outerRadius);
  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }
  ctx.lineTo(cx, cy - outerRadius);
}

// FORK
function fork(x, y, volume) {
  canvasContext.lineWidth = 5;
  canvasContext.strokeStyle = "silver";
  canvasContext.fillStyle = "silver";
  for (let i = 0; i < 4; i++) {
    canvasContext.beginPath();
    canvasContext.moveTo(2 * i * 10, volume);
    canvasContext.bezierCurveTo(
      20 + i * 10,
      150 + i * 10,
      20 + i * 10,
      50 + i * 10,
      100,
      100
    );
    canvasContext.stroke();
  }

  canvasContext.beginPath();
  canvasContext.moveTo(x, y);
  canvasContext.lineTo(x * 3, y * 2);
  canvasContext.lineTo(x * 3 + 20, y * 2);
  canvasContext.closePath();
  canvasContext.stroke();
  canvasContext.fill();
}

// draw spiral
function circlePos(radius, volume, i) {
  return {
    width: (radius + i * (Math.PI * 2)) * Math.cos((i * (Math.PI * 2)) / 50),
    height: (radius + i * (Math.PI * 2)) * Math.sin((i * (Math.PI * 2)) / 50)
  };
}

function drawShape({ ctx, x, y, width, style, stroke, mode, i }) {
  ctx.beginPath();
  ctx.fillStyle = style;
  ctx.strokeStyle = stroke;
  switch (mode) {
    case "square":
      ctx.fillRect(x - width / 2, y - width / 2, width, width);
      stroke && ctx.strokeRect(x - width / 2, y - width / 2, width, width);
      break;
    case "circle":
      ctx.arc(x, y, width, 0, 2 * Math.PI);
      break;
    case "triangle":
      drawStar(ctx, x, y, 3, width, width / 2);
      break;
    case "star":
      drawStar(ctx, x, y, 5, width, width / 2);
      break;
    case "ninja":
      drawStar(ctx, x, y, 4, width, width / 2 + i);

      break;
  }

  ctx.closePath();

  if (stroke) {
    ctx.strokeStyle = stroke;
    ctx.stroke();
  }

  if (style) {
    ctx.fillStyle = style;
    ctx.fill();
  }
}

function drawPattern({
  ctx,
  canvas,
  radius,
  volume,
  i,
  shape,
  mode = "circle",
  twist
}) {
  const modes = {
    circle: {
      x:
        (radius + canvas.width / 20) * Math.cos((i * Math.PI * 2) / 255) +
        canvas.width / 2,
      y:
        (radius + canvas.width / 20) * Math.sin((i * Math.PI * 2) / 255) +
        canvas.height / 2
    },
    spiral: {
      x: circlePos(radius, volume, i).width + canvas.width / 2,
      y: circlePos(radius, volume, i).height + canvas.height / 2
    },
    wave: {
      x: (canvas.width / 255) * i,
      y:
        (radius + canvas.width / 20) * Math.sin((i * Math.PI * 2) / 255) +
        canvas.height / 2
    },
    verticalWave: {
      x:
        (radius + canvas.width / 20) * Math.cos((i * Math.PI * 2) / 255) +
        canvas.width / 2,
      y: (canvas.height / 255) * i
    },
    line: {
      x: (canvas.width / 255) * i,
      y: canvas.height / 2
    },
    diagonal: {
      x: (canvas.width / 255) * i,
      y: canvas.height - (canvas.height / 255) * i
    },
    grid: {
      x: getXpos(15, canvas, i) + canvas.width / 15 / 2,
      y: (canvas.height / 15) * Math.floor(i / 15) - canvas.height / 15 / 2
    },
    center: {
      x: canvas.width / 2,
      y: canvas.height / 2
    },
    cursor: {
      x: cursorX,
      y: cursorY
    },
    random: {
      x: Math.floor(Math.random() * canvas.width) + 1,
      y:
        (canvas.height / 15) * Math.floor(i / 15) -
        (volume * size) / 2 +
        canvas.height / 15 / 2
    }
  };
  const xPos = modes[mode].x;
  const yPos = modes[mode].y;

  rotate({
    ctx,
    x: xPos,
    y: yPos,
    drawShape: () => shape(xPos, yPos),
    degree: twist && (360 / 255) * (volume / 255)
  });
}

const getXpos = (colNumber, canvas, i) => {
  let position = canvas.width / 2;

  if (Math.floor(i / colNumber) > 0) {
    position = (canvas.width / colNumber) * (i % colNumber);
  }

  if (i < colNumber) {
    position = (canvas.width / colNumber) * i;
  }

  return position;
};
