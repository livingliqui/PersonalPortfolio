const PIXEL = 4;
let W, H, cols, rows;

let bufSky, bufClouds, bufFar, bufMid, bufNear, bufGround;

let scrollX = 0;

const SCROLL_SPEED  = 0.4;
const CLOUD_SPEED   = 0.05;
const FAR_SPEED     = 0.15;
const MID_SPEED     = 0.4;
const NEAR_SPEED    = 0.6;
const GROUND_SPEED  = 0.7;

const SKY_BANDS = [
  '#1a0a3a', '#2d1b69', '#5c2d91', '#8b3a8f', '#c0476e',
  '#e8654a', '#f4943e', '#f9c74f', '#fce38a', '#fff5cc',
];
const SUN_COLOR = '#ffe066';
const SUN_GLOW  = '#f9a825';

const FAR_BUILDING_COLORS  = ['#1a0a2e', '#1f0f38', '#251545'];
const MID_BUILDING_COLORS  = ['#2a1548', '#331d55', '#3d2562', '#472d6f'];
const NEAR_BUILDING_COLORS = ['#3a1e5c', '#452870', '#503282', '#5a3c90'];
const WINDOW_ON  = '#fce38a';
const WINDOW_DIM = '#f4943e';
const WINDOW_OFF_MID  = '#3a2060';
const WINDOW_OFF_NEAR = '#4a2870';

let stars = [];
let clouds = [];
let farBuildings = [];
let midBuildings = [];
let nearBuildings = [];

function setup() {
  W = windowWidth;
  H = windowHeight;
  createCanvas(W, H);
  noSmooth();
  cols = Math.ceil(W / PIXEL) + 2;
  rows = Math.ceil(H / PIXEL);
  createBuffers();
  generateAll();
}

function createBuffers() {
  bufSky    = createGraphics(cols, rows); bufSky.noSmooth();    bufSky.noStroke();
  bufClouds = createGraphics(cols, rows); bufClouds.noSmooth(); bufClouds.noStroke();
  bufFar    = createGraphics(cols, rows); bufFar.noSmooth();    bufFar.noStroke();
  bufMid    = createGraphics(cols, rows); bufMid.noSmooth();    bufMid.noStroke();
  bufNear   = createGraphics(cols, rows); bufNear.noSmooth();   bufNear.noStroke();
  bufGround = createGraphics(cols, rows); bufGround.noSmooth(); bufGround.noStroke();
}

function generateAll() {
  initStars();
  generateClouds();
  generateFarBuildings();
  generateMidBuildings();
  generateNearBuildings();
}

function initStars() {
  stars = [];
  for (let i = 0; i < 40; i++) {
    stars.push({
      x: Math.floor(random(cols)),
      y: Math.floor(random(rows * 0.28)),
      blink: random(0.02, 0.08),
      phase: random(TWO_PI)
    });
  }
}

function generateClouds() {
  clouds = [];
  let totalW = cols * 4;
  let x = 0;
  while (x < totalW) {
    let w = Math.floor(random(12, 35));
    let h = Math.floor(random(3, 7));
    let y = Math.floor(random(rows * 0.15, rows * 0.4));
    let slices = [];
    for (let sy = 0; sy < h; sy++) {
      let indent = (sy === 0 || sy === h - 1) ? Math.floor(random(2, w * 0.3)) : Math.floor(random(0, 3));
      let sw = w - indent * 2;
      if (sw < 3) sw = 3;
      slices.push({ indent, sw });
    }
    clouds.push({ x, y, w, h, slices });
    x += w + Math.floor(random(20, 60));
  }
}

function generateFarBuildings() {
  farBuildings = [];
  let totalW = cols * 3;
  let x = 0;
  while (x < totalW) {
    let w = Math.floor(random(8, 20));
    let h = Math.floor(random(rows * 0.15, rows * 0.35));
    let col = random(FAR_BUILDING_COLORS);
    let hasSpire = random() > 0.7;
    let spireH = hasSpire ? Math.floor(random(4, 10)) : 0;
    farBuildings.push({ x, w, h, col, hasSpire, spireH });
    x += w + Math.floor(random(1, 4));
  }
}

function generateMidBuildings() {
  midBuildings = [];
  let totalW = cols * 3;
  let x = 0;
  while (x < totalW) {
    let w = Math.floor(random(10, 28));
    let h = Math.floor(random(rows * 0.2, rows * 0.45));
    let col = random(MID_BUILDING_COLORS);
    let winCols = Math.floor((w - 2) / 3);
    let winRows = Math.floor((h - 4) / 4);
    let windows = [];
    for (let wy = 0; wy < winRows; wy++) {
      let row = [];
      for (let wx = 0; wx < winCols; wx++) {
        let r = random();
        row.push(r < 0.35 ? 'on' : (r < 0.55 ? 'dim' : 'off'));
      }
      windows.push(row);
    }
    let roofType = random() < 0.4 ? 'flat' : (random() < 0.5 ? 'antenna' : 'watertower');
    midBuildings.push({ x, w, h, col, winCols, winRows, windows, roofType });
    x += w + Math.floor(random(2, 6));
  }
}

function generateNearBuildings() {
  nearBuildings = [];
  let totalW = cols * 3;
  let x = 0;
  while (x < totalW) {
    let w = Math.floor(random(14, 35));
    let h = Math.floor(random(rows * 0.28, rows * 0.55));
    let col = random(NEAR_BUILDING_COLORS);
    let winCols = Math.floor((w - 3) / 4);
    let winRows = Math.floor((h - 6) / 5);
    let windows = [];
    for (let wy = 0; wy < winRows; wy++) {
      let row = [];
      for (let wx = 0; wx < winCols; wx++) {
        let r = random();
        row.push(r < 0.4 ? 'on' : (r < 0.6 ? 'dim' : 'off'));
      }
      windows.push(row);
    }
    let roofType = random() < 0.3 ? 'flat' : (random() < 0.5 ? 'antenna' : 'watertower');
    nearBuildings.push({ x, w, h, col, winCols, winRows, windows, roofType });
    x += w + Math.floor(random(1, 4));
  }
}

function drawSky(buf) {
  let bandH = Math.ceil(rows / SKY_BANDS.length);
  for (let i = 0; i < SKY_BANDS.length; i++) {
    buf.fill(SKY_BANDS[i]);
    buf.rect(0, i * bandH, cols, bandH + 1);
  }
  for (let s of stars) {
    let brightness = Math.sin(frameCount * s.blink + s.phase);
    if (brightness > 0.3) {
      buf.fill(255, 255, 255, Math.floor(map(brightness, 0.3, 1, 60, 220)));
      buf.rect(s.x, s.y, 1, 1);
    }
  }
  let sunR = Math.floor(rows * 0.08);
  let sunX = Math.floor(cols * 0.65);
  let sunY = Math.floor(rows * 0.55);
  buf.fill(SUN_GLOW);
  for (let dy = -(sunR + 2); dy <= sunR + 2; dy++) {
    let hw = Math.floor(Math.sqrt(Math.max(0, (sunR + 2) * (sunR + 2) - dy * dy)));
    buf.rect(sunX - hw, sunY + dy, hw * 2, 1);
  }
  buf.fill(SUN_COLOR);
  for (let dy = -sunR; dy <= sunR; dy++) {
    let hw = Math.floor(Math.sqrt(Math.max(0, sunR * sunR - dy * dy)));
    buf.rect(sunX - hw, sunY + dy, hw * 2, 1);
  }
  buf.fill(249, 199, 79, 170);
  for (let dy = -sunR; dy <= sunR; dy += 3) {
    let hw = Math.floor(Math.sqrt(Math.max(0, sunR * sunR - dy * dy)));
    if (hw > 0) buf.rect(sunX - hw, sunY + dy, hw * 2, 1);
  }
}

function drawClouds(buf, intOffset) {
  buf.clear();
  let wrapW = cols * 4;
  for (let c of clouds) {
    let cx = ((c.x - intOffset) % wrapW + wrapW) % wrapW - cols * 0.5;
    if (cx + c.w < -5 || cx > cols + 5) continue;
    for (let sy = 0; sy < c.h; sy++) {
      let sl = c.slices[sy];
      buf.fill(255, 255, 255, 30);
      buf.rect(cx + sl.indent, c.y + sy, sl.sw, 1);
    }
  }
}

function drawFarSkyline(buf, intOffset) {
  buf.clear();
  let groundY = Math.floor(rows * 0.68);
  let wrapW = cols * 3;
  for (let b of farBuildings) {
    let bx = ((b.x - intOffset) % wrapW + wrapW) % wrapW - cols * 0.5;
    if (bx + b.w < -2 || bx > cols + 2) continue;
    let by = groundY - b.h;
    buf.fill(b.col);
    buf.rect(bx, by, b.w, b.h + (rows - groundY));
    if (b.hasSpire) {
      let sx = bx + Math.floor(b.w / 2);
      buf.fill(b.col);
      buf.rect(sx, by - b.spireH, 1, b.spireH);
      if (Math.sin(frameCount * 0.015 + b.x) > 0.3) {
        buf.fill('#ff3344');
        buf.rect(sx, by - b.spireH, 1, 1);
      }
    }
  }
}

function drawMidBuildings(buf, intOffset) {
  buf.clear();
  let groundY = Math.floor(rows * 0.72);
  let wrapW = cols * 3;
  for (let b of midBuildings) {
    let bx = ((b.x - intOffset) % wrapW + wrapW) % wrapW - cols * 0.5;
    if (bx + b.w < -2 || bx > cols + 2) continue;
    let by = groundY - b.h;
    buf.fill(b.col);
    buf.rect(bx, by, b.w, b.h + (rows - groundY));
    if (b.roofType === 'antenna') {
      let ax = bx + Math.floor(b.w * 0.3);
      buf.fill(b.col); buf.rect(ax, by - 6, 1, 6);
      if (Math.sin(frameCount * 0.02 + b.x * 0.5) > 0.2) {
        buf.fill('#ff5555'); buf.rect(ax, by - 6, 1, 1);
      }
    } else if (b.roofType === 'watertower') {
      let wtx = bx + Math.floor(b.w * 0.5) - 2;
      buf.fill('#2a1845'); buf.rect(wtx, by - 4, 1, 4); buf.rect(wtx + 3, by - 4, 1, 4);
      buf.fill('#3d2562'); buf.rect(wtx - 1, by - 7, 6, 3);
    }
    let wx0 = bx + 2, wy0 = by + 3;
    for (let wy = 0; wy < b.winRows; wy++) {
      for (let wx = 0; wx < b.winCols; wx++) {
        let st = b.windows[wy][wx];
        let flickering = st === 'on' && Math.sin(frameCount * 0.03 + b.x + wx * 7 + wy * 13) > 0.95;
        buf.fill((st === 'on' && !flickering) ? WINDOW_ON : (st === 'dim' ? WINDOW_DIM : WINDOW_OFF_MID));
        buf.rect(wx0 + wx * 3, wy0 + wy * 4, 2, 2);
      }
    }
  }
}

function drawNearBuildings(buf, intOffset) {
  buf.clear();
  let groundY = Math.floor(rows * 0.76);
  let wrapW = cols * 3;
  for (let b of nearBuildings) {
    let bx = ((b.x - intOffset) % wrapW + wrapW) % wrapW - cols * 0.5;
    if (bx + b.w < -5 || bx > cols + 5) continue;
    let by = groundY - b.h;
    buf.fill(b.col);
    buf.rect(bx, by, b.w, b.h + (rows - groundY));
    buf.fill(255, 255, 255, 15);
    buf.rect(bx, by, 1, b.h);
    if (b.roofType === 'antenna') {
      let ax = bx + Math.floor(b.w * 0.4);
      buf.fill(b.col); buf.rect(ax, by - 5, 1, 5);
      if (Math.sin(frameCount * 0.02 + b.x * 0.7) > 0.3) {
        buf.fill('#ff4444'); buf.rect(ax, by - 5, 1, 1);
      }
    } else if (b.roofType === 'watertower') {
      let wtx = bx + Math.floor(b.w * 0.6) - 2;
      buf.fill('#3a1e5c'); buf.rect(wtx, by - 4, 1, 4); buf.rect(wtx + 4, by - 4, 1, 4);
      buf.fill('#503282'); buf.rect(wtx - 1, by - 7, 7, 3);
    }
    let wx0 = bx + 3, wy0 = by + 4;
    for (let wy = 0; wy < b.winRows; wy++) {
      for (let wx = 0; wx < b.winCols; wx++) {
        let st = b.windows[wy][wx];
        let flickering = st === 'on' && Math.sin(frameCount * 0.025 + b.x + wx * 11 + wy * 17) > 0.96;
        buf.fill((st === 'on' && !flickering) ? WINDOW_ON : (st === 'dim' ? WINDOW_DIM : WINDOW_OFF_NEAR));
        buf.rect(wx0 + wx * 4, wy0 + wy * 5, 2, 3);
      }
    }
  }
}

function drawGroundLayer(buf, intOffset) {
  buf.clear();
  let groundY = Math.floor(rows * 0.76);
  buf.fill('#2d1b50');
  buf.rect(0, groundY, cols, 3);
  buf.fill('#3a2568');
  buf.rect(0, groundY + 3, cols, 1);
  buf.fill('#1a0a2e');
  buf.rect(0, groundY + 4, cols, rows - groundY - 4);
  let dashY = groundY + 4 + Math.floor((rows - groundY - 4) * 0.45);
  buf.fill('#3a2568');
  for (let dx = 0; dx < cols + 20; dx += 12) {
    let ddx = ((dx - intOffset) % (cols + 20) + (cols + 20)) % (cols + 20) - 10;
    buf.rect(ddx, dashY, 6, 1);
  }
}

function draw() {
  scrollX += SCROLL_SPEED;
  let cloudScroll  = scrollX * CLOUD_SPEED;
  let farScroll    = scrollX * FAR_SPEED;
  let midScroll    = scrollX * MID_SPEED;
  let nearScroll   = scrollX * NEAR_SPEED;
  let groundScroll = scrollX * GROUND_SPEED;

  let cloudInt  = Math.floor(cloudScroll),  cloudFrac  = cloudScroll  - cloudInt;
  let farInt    = Math.floor(farScroll),    farFrac    = farScroll    - farInt;
  let midInt    = Math.floor(midScroll),    midFrac    = midScroll    - midInt;
  let nearInt   = Math.floor(nearScroll),   nearFrac   = nearScroll   - nearInt;
  let gndInt    = Math.floor(groundScroll), gndFrac    = groundScroll - gndInt;

  drawSky(bufSky);
  drawClouds(bufClouds, cloudInt);
  drawFarSkyline(bufFar, farInt);
  drawMidBuildings(bufMid, midInt);
  drawNearBuildings(bufNear, nearInt);
  drawGroundLayer(bufGround, gndInt);

  background(0);
  image(bufSky,    0,                  0, W,         H);
  image(bufClouds, -cloudFrac * PIXEL, 0, W + PIXEL, H);
  image(bufFar,    -farFrac   * PIXEL, 0, W + PIXEL, H);
  image(bufMid,    -midFrac   * PIXEL, 0, W + PIXEL, H);
  image(bufNear,   -nearFrac  * PIXEL, 0, W + PIXEL, H);
  image(bufGround, -gndFrac   * PIXEL, 0, W + PIXEL, H);
}

function windowResized() {
  W = windowWidth;
  H = windowHeight;
  resizeCanvas(W, H);
  cols = Math.ceil(W / PIXEL) + 2;
  rows = Math.ceil(H / PIXEL);
  createBuffers();
  generateAll();
}
