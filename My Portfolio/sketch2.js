let dotSize = 2;
let spacing = 30;
let dots = [];
let waves = [];

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

function mouseClicked() {
  waves.push({
    x: mouseX,
    y: mouseY,
    radius: 0,
    maxRadius: dist(0, 0, width, height)
  });
}

function draw() {
  background(0, 0, 0, 40);
  noStroke();

  for (let i = waves.length - 1; i >= 0; i--) {
    waves[i].radius += 5;
    if (waves[i].radius > waves[i].maxRadius) {
      waves.splice(i, 1);
    }
  }

  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i];

    let noiseX = noise(dot.gridX * 0.1, dot.gridY * 0.1, frameCount * 0.01) * 10 - 5;
    let noiseY = noise(dot.gridX * 0.1 + 100, dot.gridY * 0.1, frameCount * 0.01) * 10 - 5;

    let waveX = 0;
    let waveY = 0;
    let waveIntensity = 0;

    for (let j = 0; j < waves.length; j++) {
      let wave = waves[j];
      let d = dist(dot.x, dot.y, wave.x, wave.y);
      let waveDist = abs(d - wave.radius);
      if (waveDist < 50) {
        let amount = (1 - waveDist / 50);
        let angle = atan2(dot.y - wave.y, dot.x - wave.x);
        waveX += cos(angle) * amount * 10;
        waveY += sin(angle) * amount * 10;
        waveIntensity = max(waveIntensity, amount);
      }
    }

    let mouseDist = dist(dot.x, dot.y, mouseX, mouseY);
    let swellRadius = 80;
    let swellAmount = 0;
    if (mouseDist < swellRadius) {
      swellAmount = (1 - mouseDist / swellRadius);
      swellAmount = pow(swellAmount, 1.5);
    }

    let finalX = dot.x + noiseX + waveX;
    let finalY = dot.y + noiseY + waveY;

    if (waveIntensity > 0) {
      let r = 100 + waveIntensity * 155;
      let g = 150 + waveIntensity * 105;
      let b = 255;
      fill(r, g, b);
      let size = 6 + waveIntensity * 4;
      triangle(
        finalX, finalY - size / 2,
        finalX - size / 2, finalY + size / 2,
        finalX + size / 2, finalY + size / 2
      );
    } else if (swellAmount > 0) {
      let r = 100 + swellAmount * 100;
      let g = 150 + swellAmount * 80;
      let b = 255;
      fill(r, g, b, swellAmount * 200);
      let size = 4 + swellAmount * 5;
      triangle(
        finalX, finalY - size / 2,
        finalX - size / 2, finalY + size / 2,
        finalX + size / 2, finalY + size / 2
      );
    } else {
      fill(255);
      circle(finalX, finalY, dotSize);
    }
  }
}