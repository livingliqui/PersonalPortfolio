let dotSize = 2;
let spacing = 15;
let dots = [];
let waves = [];
let arrowSet = new Set();
let arrowSideMap = {};

let textDotsMap = { top: new Set(), left: new Set(), right: new Set() };
let revealProgress = { top: 0, left: 0, right: 0 };

const FONT_SMALL = {
  'A': ['01110','10001','11111','10001','10001'],
  'B': ['11110','10001','11110','10001','11110'],
  'C': ['01111','10000','10000','10000','01111'],
  'D': ['11100','10010','10001','10010','11100'],
  'E': ['11111','10000','11110','10000','11111'],
  'H': ['10001','10001','11111','10001','10001'],
  'I': ['11111','00100','00100','00100','11111'],
  'J': ['01111','00010','00010','10010','01100'],
  'M': ['10001','11011','10101','10001','10001'],
  'N': ['10001','11001','10101','10011','10001'],
  'O': ['01110','10001','10001','10001','01110'],
  'P': ['11110','10001','11110','10000','10000'],
  'R': ['11110','10001','11110','10010','10001'],
  'S': ['01111','10000','01110','00001','11110'],
  'T': ['11111','00100','00100','00100','00100'],
  'U': ['10001','10001','10001','10001','01110'],
  'Y': ['10001','01010','00100','00100','00100'],
  ' ': ['00000','00000','00000','00000','00000']
};

const FONT = {
  'A': ['01110','10001','10001','11111','10001','10001','10001'],
  'B': ['11110','10001','10001','11110','10001','10001','11110'],
  'C': ['01110','10001','10000','10000','10000','10001','01110'],
  'D': ['11100','10010','10001','10001','10001','10010','11100'],
  'E': ['11111','10000','10000','11110','10000','10000','11111'],
  'H': ['10001','10001','10001','11111','10001','10001','10001'],
  'I': ['11111','00100','00100','00100','00100','00100','11111'],
  'J': ['01111','00010','00010','00010','00010','10010','01100'],
  'M': ['10001','11011','10101','10101','10001','10001','10001'],
  'N': ['10001','11001','10101','10101','10011','10001','10001'],
  'O': ['01110','10001','10001','10001','10001','10001','01110'],
  'P': ['11110','10001','10001','11110','10000','10000','10000'],
  'R': ['11110','10001','10001','11110','10100','10010','10001'],
  'S': ['01111','10000','10000','01110','00001','00001','11110'],
  'T': ['11111','00100','00100','00100','00100','00100','00100'],
  'U': ['10001','10001','10001','10001','10001','10001','01110'],
  'Y': ['10001','10001','01010','00100','00100','00100','00100'],
  ' ': ['00000','00000','00000','00000','00000','00000','00000']
};

function buildTextDotsForSide(side, text) {
  let set = new Set();
  let cols = Math.floor(width / spacing);
  let rows = Math.floor(height / spacing);
  let midX = Math.floor(cols / 2);
  let midY = Math.floor(rows / 2);

  if (side === 'top') {
    let letterWidth = 6;
    let letterHeight = 7;
    let totalTextWidth = text.length * letterWidth - 1;
    let startCol = Math.floor(midX - totalTextWidth / 2);
    let startRow = 12;
    for (let c = 0; c < text.length; c++) {
      let letter = FONT[text[c]];
      if (!letter) continue;
      for (let r = 0; r < letter.length; r++) {
        for (let k = 0; k < letter[r].length; k++) {
          if (letter[r][k] === '1') {
            let gx = startCol + c * letterWidth + k;
            let gy = startRow + r;
            if (gx >= 0 && gx < cols && gy >= 0 && gy < rows)
              set.add(gx + ',' + gy);
          }
        }
      }
    }
  } else {
    let letterHeight = 5;
    let letterSpacing = letterHeight + 1;
    let totalTextHeight = text.length * letterSpacing - 1;
    let startRow = Math.floor(midY - totalTextHeight / 2);
    let startCol = (side === 'left') ? 10 : cols - 10 - 5;
    for (let c = 0; c < text.length; c++) {
      let ch = text[c];
      let letter = FONT_SMALL[ch];
      if (!letter) continue;
      for (let r = 0; r < letter.length; r++) {
        for (let k = 0; k < letter[r].length; k++) {
          if (letter[r][k] === '1') {
            let gx = startCol + k;
            let gy = startRow + c * letterSpacing + r;
            if (gx >= 0 && gx < cols && gy >= 0 && gy < rows)
              set.add(gx + ',' + gy);
          }
        }
      }
    }
  }

  return set;
}

function buildAllTextDots() {
  textDotsMap.top = buildTextDotsForSide('top', 'ABOUT ME');
  textDotsMap.left = buildTextDotsForSide('left', 'PROJECTS');
  textDotsMap.right = buildTextDotsForSide('right', 'RESEARCH');
}

function getArrowDots(cols, rows) {
  let arrowDots = [];
  let midX = Math.floor(cols / 2);
  let midY = Math.floor(rows / 2);

  for (let i = -5; i <= 5; i++) {
    arrowDots.push({ gridX: 2 + Math.abs(i), gridY: midY + i, side: 'left' });
  }
  for (let i = -5; i <= 5; i++) {
    arrowDots.push({ gridX: (cols - 3) - Math.abs(i), gridY: midY + i, side: 'right' });
  }
  for (let i = -5; i <= 5; i++) {
    arrowDots.push({ gridX: midX + i, gridY: 2 + Math.abs(i), side: 'top' });
  }

  return arrowDots;
}

function rebuildArrowSet() {
  let cols = Math.floor(width / spacing);
  let rows = Math.floor(height / spacing);
  let arrowDots = getArrowDots(cols, rows);
  arrowSet = new Set();
  arrowSideMap = {};
  for (let ad of arrowDots) {
    let key = ad.gridX + ',' + ad.gridY;
    arrowSet.add(key);
    arrowSideMap[key] = ad.side;
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  buildDots();
  rebuildArrowSet();
  buildAllTextDots();
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
  rebuildArrowSet();
  buildAllTextDots();
  revealProgress = { top: 0, left: 0, right: 0 };
}

function mouseClicked() {
  let hoverZone = 150;

  if (mouseY < hoverZone) {
    window.location.href = 'about.html';
    return;
  } else if (mouseX < hoverZone) {
    window.location.href = 'projects.html';
    return;
  } else if (mouseX > width - hoverZone) {
    window.location.href = 'research.html';
    return;
  }

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

  let hoveredSide = null;
  let hoverZone = 150;
  if (mouseY < hoverZone) hoveredSide = 'top';
  else if (mouseX < hoverZone) hoveredSide = 'left';
  else if (mouseX > width - hoverZone) hoveredSide = 'right';

  let sides = ['top', 'left', 'right'];
  for (let s of sides) {
    if (hoveredSide === s) {
      revealProgress[s] = min(revealProgress[s] + 0.03, 1);
    } else {
      revealProgress[s] = max(revealProgress[s] - 0.03, 0);
    }
  }

  let mouseNearArrow = (hoveredSide !== null);

  for (let i = 0; i < dots.length; i++) {
    let dot = dots[i];
    let key = dot.gridX + ',' + dot.gridY;
    let isArrow = arrowSet.has(key);

    let textSide = null;
    for (let s of sides) {
      if (textDotsMap[s].has(key)) { textSide = s; break; }
    }

    let noiseX = noise(dot.gridX * 0.1, dot.gridY * 0.1, frameCount * 0.01) * 10 - 5;
    let noiseY = noise(dot.gridX * 0.1 + 100, dot.gridY * 0.1, frameCount * 0.01) * 10 - 5;

    let waveX = 0, waveY = 0, waveIntensity = 0;
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

    let swellAmount = 0;
    if (!mouseNearArrow && !isArrow) {
      let mouseDist = dist(dot.x, dot.y, mouseX, mouseY);
      let swellRadius = 80;
      if (mouseDist < swellRadius) {
        swellAmount = (1 - mouseDist / swellRadius);
        swellAmount = pow(swellAmount, 1.5);
      }
    }

    let finalX = dot.x + noiseX + waveX;
    let finalY = dot.y + noiseY + waveY;

    if (isArrow) {
      let side = arrowSideMap[key];
      let isHovered = (side === hoveredSide);
      let targetSize = isHovered ? dotSize * 6 : dotSize * 3.5;
      let shimmer = sin(frameCount * 0.04 + dot.gridX * 0.3 + dot.gridY * 0.3) * 0.5 + 0.5;
      let r, g, b;
      if (isHovered) {
        r = lerp(255, 255, shimmer);
        g = lerp(200, 230, shimmer);
        b = lerp(50, 100, shimmer);
      } else {
        r = lerp(218, 255, shimmer);
        g = lerp(155, 200, shimmer);
        b = lerp(32, 80, shimmer);
      }
      fill(r, g, b);
      circle(finalX, finalY, targetSize);

    } else if (textSide !== null && revealProgress[textSide] > 0) {
      let progress = revealProgress[textSide];
      let cols = Math.floor(width / spacing);
      let rows = Math.floor(height / spacing);
      let midX = Math.floor(cols / 2);
      let midY = Math.floor(rows / 2);

      let d, maxD;
      if (textSide === 'top') {
        d = abs(dot.x - midX * spacing);
        maxD = 400;
      } else {
        d = abs(dot.y - midY * spacing);
        maxD = 400;
      }
      let dotDelay = map(d, 0, maxD, 0, 0.5, true);
      let dotProgress = constrain((progress - dotDelay) / 0.5, 0, 1);
      dotProgress = dotProgress * dotProgress * (3 - 2 * dotProgress);

      if (dotProgress > 0) {
        let shimmer = sin(frameCount * 0.04 + dot.gridX * 0.2 + dot.gridY * 0.2) * 0.5 + 0.5;
        let r = lerp(218, 255, shimmer);
        let g = lerp(155, 200, shimmer);
        let b = lerp(32, 80, shimmer);
        fill(r, g, b, dotProgress * 255);
        let size = lerp(dotSize, dotSize * 3, dotProgress);
        circle(finalX, finalY, size);
      } else {
        fill(255);
        circle(finalX, finalY, dotSize);
      }

    } else if (waveIntensity > 0) {
      fill(100 + waveIntensity * 155, 150 + waveIntensity * 105, 255);
      let size = 6 + waveIntensity * 4;
      triangle(finalX, finalY - size/2, finalX - size/2, finalY + size/2, finalX + size/2, finalY + size/2);

    } else if (swellAmount > 0) {
      fill(100 + swellAmount * 100, 150 + swellAmount * 80, 255, swellAmount * 200);
      let size = 4 + swellAmount * 5;
      triangle(finalX, finalY - size/2, finalX - size/2, finalY + size/2, finalX + size/2, finalY + size/2);

    } else {
      fill(255);
      circle(finalX, finalY, dotSize);
    }
  }
}