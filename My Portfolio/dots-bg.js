let dotSize = 2;
let spacing = 15;
let dots = [];
let showFlag = false;
let flagProgress = 0;

function setup() {
  createCanvas(windowWidth, windowHeight);
  buildDots();
}

function buildDots() {
  dots = [];
  let cols = Math.floor(width / spacing);
  let rows = Math.floor(height / spacing);
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      dots.push({
        x: i * spacing + spacing / 2,
        y: j * spacing + spacing / 2,
        gridX: i,
        gridY: j
      });
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  buildDots();
}

function getFlagColor(dot) {
  // UAE flag: red vertical bar on left, then green/white/black horizontal stripes
  let cols = Math.floor(width / spacing);
  let rows = Math.floor(height / spacing);

  // Flag area — centered on screen
  let flagWidth = Math.floor(cols * 0.6);
  let flagHeight = Math.floor(rows * 0.5);
  let startCol = Math.floor((cols - flagWidth) / 2);
  let startRow = Math.floor((rows - flagHeight) / 2);
  let endCol = startCol + flagWidth;
  let endRow = startRow + flagHeight;

  let gx = dot.gridX;
  let gy = dot.gridY;

  // Outside the flag
  if (gx < startCol || gx >= endCol || gy < startRow || gy >= endRow) {
    return null;
  }

  // Red vertical bar on the left (1/4 of flag width)
  let redWidth = Math.floor(flagWidth / 4);
  if (gx < startCol + redWidth) {
    return { r: 206, g: 17, b: 38 }; // Red
  }

  // Remaining area: 3 horizontal stripes
  let stripeArea = gy - startRow;
  let stripeHeight = flagHeight / 3;

  if (stripeArea < stripeHeight) {
    return { r: 0, g: 151, b: 57 }; // Green
  } else if (stripeArea < stripeHeight * 2) {
    return { r: 255, g: 255, b: 255 }; // White
  } else {
    return { r: 0, g: 0, b: 0 }; // Black (we'll use dark gray so it's visible)
  }
}

function draw() {
  background(0);
  noStroke();

  if (showFlag) {
    flagProgress = min(flagProgress + 0.02, 1);
  } else {
    flagProgress = max(flagProgress - 0.02, 0);
  }

  let cols = Math.floor(width / spacing);
  let midX = Math.floor(cols / 2);

  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i];
    let noiseX = noise(dot.gridX * 0.1, dot.gridY * 0.1, frameCount * 0.01) * 10 - 5;
    let noiseY = noise(dot.gridX * 0.1 + 100, dot.gridY * 0.1, frameCount * 0.01) * 10 - 5;

    let finalX = dot.x + noiseX;
    let finalY = dot.y + noiseY;

    let flagColor = getFlagColor(dot);

    if (flagColor && flagProgress > 0) {
      // Gradual reveal from center outward
      let d = abs(dot.gridX - midX);
      let maxD = cols / 2;
      let dotDelay = map(d, 0, maxD, 0, 0.5, true);
      let dotProgress = constrain((flagProgress - dotDelay) / 0.5, 0, 1);
      dotProgress = dotProgress * dotProgress * (3 - 2 * dotProgress);

      if (dotProgress > 0) {
        let r = lerp(255, flagColor.r, dotProgress);
        let g = lerp(255, flagColor.g, dotProgress);
        let b = lerp(255, flagColor.b, dotProgress);

        // For black stripe, make dots slightly brighter so they're visible
        if (flagColor.r === 0 && flagColor.g === 0 && flagColor.b === 0) {
          r = lerp(255, 40, dotProgress);
          g = lerp(255, 40, dotProgress);
          b = lerp(255, 40, dotProgress);
        }

        fill(r, g, b);
        let size = lerp(dotSize, dotSize * 2.5, dotProgress);
        circle(finalX, finalY, size);
      } else {
        fill(255);
        circle(finalX, finalY, dotSize);
      }
    } else {
      fill(255);
      circle(finalX, finalY, dotSize);
    }
  }
}