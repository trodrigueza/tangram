// Tangram (p5.js)
//
// Modos:
//   'menu'   - logo + botones Play / Edit
//   'editor' - mover piezas libremente y guardar la disposición como nivel
//   'player' - cubrir las siluetas blancas de cada nivel
//
// Controles:
//   arrastrar        mover pieza (mantiene el punto de agarre)
//   rueda del mouse  rotar pieza bajo el cursor (pasos de 15°)
//   clic derecho     espejar el paralelogramo
//   1-7 / c          seleccionar pieza / deseleccionar
//   q / e            rotar la pieza seleccionada
//   r                espejar el paralelogramo si está seleccionado
//   WASD / flechas   mover la pieza seleccionada con precisión (mantener)
//   g                mostrar/ocultar cuadrícula

const gui = 100 * 2.8;
const canvas_side = gui + 200;
const SCALING = 0.7;

// Archivos de nivel en orden de juego. El original los barajaba dos veces
// (en preload y al armar el arreglo); este es el orden neto resultante.
const LEVEL_FILES = ['level6', 'level', 'level1', 'level2', 'level4', 'level5', 'level3'];

// Orden fijo para seleccionar con las teclas 1-7, independiente del
// orden de dibujado (que cambia al traer piezas al frente).
const KEY_ORDER = [
  'cuadrado',
  'triangulo1',
  'triangulo2',
  'triangulo22',
  'triangulo3',
  'triangulo33',
  'parall1',
];

// isLevelSolved() cuenta canales de color en 255. El canal alfa aporta
// width*height (230400) por sí solo; superar este umbral significa que
// todavía se ven píxeles blancos de las siluetas.
const SOLVED_PIXEL_THRESHOLD = 232030;
// Revisar la victoria cada N frames: recorrer todos los píxeles del canvas
// en cada frame (como hacía el original) arruinaba el framerate.
const WIN_CHECK_PERIOD = 10;

let mode = 'menu';
let levels = [];
let levelNum = 0;
let pieces = [];
let piecesById = {};
let buttons = {};
let selectedPiece = null;
let draggedPiece = null;
let dragOffset = null;
let showGrid = true;
let logoImg;
let congratsImg;

function preload() {
  for (const name of LEVEL_FILES) {
    levels.push(loadJSON(`./Levels/${name}.json`));
  }
  logoImg = loadImage('images/logo.png');
  congratsImg = loadImage('images/congrats.png');
}

function setup() {
  pixelDensity(1);
  angleMode(DEGREES);
  rectMode(CENTER);
  const canvas = createCanvas(canvas_side, canvas_side);
  // El clic derecho espeja el paralelogramo; sin esto aparece el menú
  // contextual del navegador encima del juego.
  canvas.elt.oncontextmenu = (e) => e.preventDefault();
  createPieces();
  createButtons();
  randomizeAll();
}

function createPieces() {
  const edge = gui / 2.8;
  pieces = [
    new Square('cuadrado', edge, {
      xMin: width / 2, xMax: width - 50, yMin: 20, yMax: height / 6,
    }),
    new Triangle('triangulo1', gui / 2.8, gui / 5.6, {
      xMin: 50, xMax: width / 2, yMin: 20, yMax: height / 6,
    }),
    new Triangle('triangulo2', gui / 2, gui / 4, {
      xMin: 50, xMax: width / 6, yMin: height / 1.5, yMax: height - 50,
    }),
    new Triangle('triangulo22', gui / 2, gui / 4, {
      xMin: (7 * width) / 8, xMax: width - 50, yMin: height / 3, yMax: height / 2,
    }),
    new Triangle('triangulo3', gui / 4, gui / 8, {
      xMin: 50, xMax: width / 8, yMin: height / 3, yMax: height / 2,
    }),
    new Triangle('triangulo33', gui / 4, gui / 8, {
      xMin: (5 * width) / 6, xMax: width - 20, yMin: height / 1.5, yMax: height - 20,
    }),
    new Parallelogram('parall1', gui, {
      xMin: width / 3, xMax: (5 * width) / 6, yMin: (5 * height) / 6, yMax: height - 20,
    }),
  ];
  piecesById = {};
  for (const piece of pieces) {
    piecesById[piece.id] = piece;
  }
}

function createButtons() {
  buttons.play = new Button({
    label: 'Play',
    x: width / 2, y: height / 2 - 60, w: 60, h: 30,
    background: color(255, 112, 112), textColor: 5,
    onPress: () => { mode = 'player'; },
  });
  buttons.edit = new Button({
    label: 'Edit',
    x: width / 2, y: height / 2 + 35, w: 60, h: 30,
    background: color(255, 165, 0), textColor: 5,
    onPress: () => { mode = 'editor'; },
  });
  buttons.save = new Button({
    label: 'Save\nlevel',
    x: width - 100, y: height - 18, w: 60, h: 30,
    background: color(0, 0, 254), textColor: 254,
    onPress: saveLevel,
  });
  buttons.exit = new Button({
    label: 'Exit',
    x: width - 34, y: height - 18, w: 40, h: 30,
    background: color('red'), textColor: 254,
    onPress: exitToMenu,
  });
  buttons.next = new Button({
    label: 'Next',
    x: 40, y: height - 15, w: 44, h: 22,
    background: color(150, 254, 193), textColor: 5,
    onPress: nextLevel,
  });
}

function draw() {
  background(130);
  if (mode === 'menu') {
    drawMenu();
  } else {
    drawGame();
  }
  handleHeldKeys();
  updateCursor();
}

function drawMenu() {
  image(logoImg, -25, -20);
  buttons.play.display();
  buttons.edit.display();
}

function drawGame() {
  if (mode === 'player' && !onLastLevel()) {
    displayLevel(levels[levelNum]);
  }
  if (showGrid) {
    gridHint(10);
  }
  if (!onLastLevel()) {
    for (const piece of pieces) {
      piece.display(piece === selectedPiece);
    }
  }

  if (mode === 'player' && !onLastLevel()) {
    buttons.next.display();
    if (frameCount % WIN_CHECK_PERIOD === 0 && isLevelSolved()) {
      console.log(`Level ${levelNum + 1} completed!`);
      nextLevel();
    }
  }
  if (mode === 'editor') {
    buttons.save.display();
  }
  buttons.exit.display();

  if (onLastLevel()) {
    image(congratsImg, -15, -15);
  }
}

function onLastLevel() {
  return mode === 'player' && levelNum === levels.length - 1;
}

function displayLevel(level) {
  for (const pieza of level.piezas) {
    const piece = piecesById[pieza.id];
    if (piece) {
      piece.displaySilhouette(pieza);
    }
  }
}

function isLevelSolved() {
  loadPixels();
  let count = 0;
  for (let i = 0; i < pixels.length; i++) {
    if (pixels[i] === 255) {
      count++;
    }
  }
  return count <= SOLVED_PIXEL_THRESHOLD;
}

function nextLevel() {
  if (mode !== 'player' || levelNum >= levels.length - 1) {
    return;
  }
  levelNum++;
  randomizeAll();
}

function exitToMenu() {
  randomizeAll();
  mode = 'menu';
  levelNum = 0;
  selectedPiece = null;
  draggedPiece = null;
}

function saveLevel() {
  const level = { piezas: pieces.map((piece) => piece.export()) };
  saveJSON(level, 'level.json');
}

function randomizeAll() {
  for (const piece of pieces) {
    piece.randomize();
  }
}

function gridHint(spacing) {
  push();
  stroke(200, 100, 200, 20);
  strokeWeight(1);
  for (let i = 0; i <= width / spacing; i++) {
    line(i * spacing, 0, i * spacing, height);
  }
  for (let i = 0; i <= height / spacing; i++) {
    line(0, i * spacing, width, i * spacing);
  }
  pop();
}

// --- Entrada -----------------------------------------------------------

// Devuelve la pieza visible bajo el punto (la dibujada más arriba).
function pieceAt(x, y) {
  for (let i = pieces.length - 1; i >= 0; i--) {
    if (pieces[i].contains(x, y)) {
      return pieces[i];
    }
  }
  return null;
}

// La pieza agarrada pasa al final del arreglo para dibujarse encima
// de las demás mientras se mueve.
function bringToFront(piece) {
  const index = pieces.indexOf(piece);
  pieces.splice(index, 1);
  pieces.push(piece);
}

function mousePressed() {
  if (mode === 'menu') {
    buttons.play.handlePress(mouseX, mouseY);
    buttons.edit.handlePress(mouseX, mouseY);
    return;
  }

  // Los botones tienen prioridad sobre las piezas.
  if (buttons.exit.handlePress(mouseX, mouseY)) {
    return;
  }
  if (mode === 'editor' && buttons.save.handlePress(mouseX, mouseY)) {
    return;
  }
  if (mode === 'player' && !onLastLevel() && buttons.next.handlePress(mouseX, mouseY)) {
    return;
  }
  if (onLastLevel()) {
    return;
  }

  const piece = pieceAt(mouseX, mouseY);
  if (piece) {
    selectedPiece = piece;
    bringToFront(piece);
    if (mouseButton === RIGHT) {
      if (piece instanceof Parallelogram) {
        piece.reverse();
      }
      return;
    }
    draggedPiece = piece;
    // Guardar el desfase entre el cursor y el centro evita que la pieza
    // "salte" al centrarse en el mouse al empezar a arrastrar.
    dragOffset = createVector(
      piece.position.x - mouseX,
      piece.position.y - mouseY
    );
  } else if (mouseButton === LEFT) {
    selectedPiece = null;
  }
}

function mouseDragged() {
  if (draggedPiece) {
    // Seguir siempre al mouse, aunque se mueva rápido y el cursor salga
    // momentáneamente de la pieza (el original soltaba la pieza).
    draggedPiece.position = createVector(
      mouseX + dragOffset.x,
      mouseY + dragOffset.y
    );
  }
}

function mouseReleased() {
  draggedPiece = null;
}

function mouseWheel(event) {
  if (mode === 'menu' || onLastLevel()) {
    return;
  }
  const piece = pieceAt(mouseX, mouseY);
  if (piece) {
    selectedPiece = piece;
    piece.rotateBy(event.deltaY > 0 ? 15 : -15);
    return false; // evita que la página haga scroll mientras se rota
  }
}

function keyPressed() {
  if (key === 'g') {
    showGrid = !showGrid;
  }
  const index = parseInt(key, 10);
  if (index >= 1 && index <= KEY_ORDER.length) {
    selectedPiece = piecesById[KEY_ORDER[index - 1]];
  }
  if (key === 'c') {
    selectedPiece = null;
  }
  if (!selectedPiece) {
    return;
  }
  if (key === 'q') {
    selectedPiece.rotateBy(-15);
  }
  if (key === 'e') {
    selectedPiece.rotateBy(15);
  }
  if (key === 'r' && selectedPiece instanceof Parallelogram) {
    selectedPiece.reverse();
  }
}

// Movimiento fino continuo mientras se mantienen WASD o las flechas.
function handleHeldKeys() {
  if (!selectedPiece || mode === 'menu') {
    return;
  }
  if (keyIsDown(87) || keyIsDown(UP_ARROW)) {
    selectedPiece.moveBy(0, -1);
  }
  if (keyIsDown(83) || keyIsDown(DOWN_ARROW)) {
    selectedPiece.moveBy(0, 1);
  }
  if (keyIsDown(65) || keyIsDown(LEFT_ARROW)) {
    selectedPiece.moveBy(-1, 0);
  }
  if (keyIsDown(68) || keyIsDown(RIGHT_ARROW)) {
    selectedPiece.moveBy(1, 0);
  }
}

function updateCursor() {
  if (mode === 'menu') {
    cursor(ARROW);
    return;
  }
  if (draggedPiece) {
    cursor('grabbing');
    return;
  }
  if (!onLastLevel() && pieceAt(mouseX, mouseY)) {
    cursor('grab');
  } else {
    cursor(ARROW);
  }
}
