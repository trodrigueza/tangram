const SCALING = 0.7;
let player = false;
let editor = false;
let parallReverse = false;
let levelReverse;
let levelNum = 0;
let piecePicked;
let buttonPicked;
let pieces;
let buttons;
let levels;
let check;

class Piece{
    constructor(id, color, length = 90, position = [0, 0], rotation = 0) {
      this.id = id; // "etiqueta" de la pieza (tener idea de si es un trian, cuad,...)
      this.position = position; 
      this.rotation = rotation;
      this.color = color;
      this.length = length;
    }
    randomize() {
      this.position = createVector(random(40, width - 40), random(40, height) - 40);
      this.rotation = 15 * round(random(0, 25)); // se generan múltiplos de 15º
    } 
    display() {
      push();
      translate(this.position);
      rotate(this.rotation);
      fill(this._color);
      scale(SCALING);
      this.shape();
      pop();
    }
    pick(x, y) {
      return red(get(x, y)) === red(this.color) && green(get(x, y)) === green(this.color) &&
        blue(get(x, y)) === blue(this.color);
    }
    // getters and setters, position:
    set position(position) {
      if (Array.isArray(position)) {
        this._position = createVector(position[0], position[1]);
      }
      else if (position instanceof p5.Vector) {
        this._position = position;
      }
      else {
        console.error('position should be either an array or a p5.Vector');
      }
    }    
    get position() {
      return this._position;
    }
    // rotation:
    set rotation(rotation) {
      if (typeof rotation === 'number') {
        this._rotation = rotation;
      }
      else {
        console.error('rotation should be a number');
      }
    }
    get rotation() {
      return this._rotation;
    }
    // color:
    set color(color) {
      if (typeof color === 'string' || Array.isArray(color)) {
        this._color = color;
      }
      else {
        console.error('color should be a string or an array');
      }
    }
    get color() {
      return this._color;
    }
    // length:
    set length(length) {
      if (typeof length === 'number') {
        this._length = length;
      }
      else {
        console.error('length should be a number');
      }
    }
    get length() {
      return this._length;
    }
    // id:
    set id(id) {
      if (typeof id === 'string') {
        this._id = id;
      }
      else {
        console.error('id should be a string');
      }
    }
    get id() {
      return this._id;
    }
}

class IsoscelesTriangle extends Piece {
  shape() {
    triangle((-2 / 3) * this.length, (1 / 3) * this.length,
              (1 / 3) * this.length, (1 / 3) * this.length,
              (1 / 3) * this.length, (-2 / 3) * this.length);
  }
}

class Square extends Piece {
  shape() {
    rect(0, 0, this.length, this.length);
  } 
}

class Parall extends Piece {
  shape() {
    if(parallReverse & this.id != "silueta") {
      scale(1, -1); // si se le pasan dos valores a scale, el primero cambia la escala en x & el segundo en y, en este caso del paralelogramo (scale(1, -1): -1 invierte los valores en y y por tanto la figura se "refleja")
    }
    if(levelReverse) {
      scale(-1, 1)
    }
    quad(-0.33 * this.length, -0.34 * this.length,
        -1.02 * this.length, 0.34 * this.length,
        0.33 * this.length, 0.35 * this.length,                   
        1.02 * this.length, -0.35 * this.length);
  }
}

class Button extends Piece{
  shape() {
    rect(0, 0, this.length*2, this.length-3); 
  }
}

function preload() {
  level1 = loadJSON("./Levels/level-1.json");
  level2 = loadJSON("./Levels/level-2.json");
  level3 = loadJSON("./Levels/level-3.json");
  level4 = loadJSON("./Levels/level-4.json");
  lastLevel = loadJSON("./Levels/empty-level.json");
  levels = [level1, level2, level3, level4, lastLevel];
  img = loadImage('images/logo.png'); // imagen del inicio TANGRAM
  img1 = loadImage('images/congrats.png'); // imagen del final CONGRATS
}

function setup() {
  createCanvas(1000, 480);
  angleMode(DEGREES);
  rectMode(CENTER);
  
  pieces = [];
  {pieces.push(new IsoscelesTriangle('triangulo', 'rgb(240,57,57)', 144));
  pieces.push(new IsoscelesTriangle('triangulo', 'rgb(240,170,20)', 200));
  pieces.push(new IsoscelesTriangle('triangulo', 'rgb(38,113,240)', 200));
  pieces.push(new IsoscelesTriangle('triangulo', 'rgb(230, 120, 240)', 100));
  pieces.push(new IsoscelesTriangle('triangulo', 'rgb(26,240,194)', 100));
  pieces.push(new Square('cuadrado', 'rgb(46,240,111)', 100));
  pieces.push(new Parall('parall', 'rgb(86,52,240)', 102.5));} // creación piezas a partir de las subclases
  
  buttons = [];
  {buttons.push(new Button('play', 'rgb(247, 243, 243)', 45));
  buttons.push(new Button('edit', 'rgb(240, 165, 1)', 45));
  buttons.push(new Button('exit', 'rgb(231,11,57)', 40));
  buttons.push(new Button('save', 'rgb(61, 240, 130)', 40));
  buttons.push(new Button('next', 'rgb(15,15,15)', 30))
  buttons[0].position = [width/2, height/2-60];
  buttons[1].position = [width/2, height/2+35];
  buttons[2].position = [width-34, height-18];
  buttons[3].position = [width-100, height-18];} // creación botones a partir de la subclase botones
}

function draw() {
  background(5, 5, 5); 
  keyDown() // ejecutar constantemente la función keyDown() (detecta las teclas wasd)
  if(editor == false && player == false){
    buttons[0].display(); // dibujar botón de jugar
    buttons[1].display(); // dibujar botón de editar
    texto("Play", 'black', width/2-15, height/2-55);
    texto("Edit", 'black', width/2-15, height/2+40);
    image(img, -25, -20); // mostrar la imagen TANGRAM
  } // interfaz: si editor es false y player es false (pantalla de inicio)
  if(player || editor){
    if(player) {
      displayLevel(levels[levelNum]) // dibujar niveles
      buttons[4].display()
      if(check && levelNum != levels.length - 1){   
        levelNum++
        console.log(`Level ${levelNum} completed!`) 
        randomizePieces()// randomizar posición y rotación de las piezas cada que un nivel sea completado
      }
      if(levelNum == levels.length - 1){
        image(img1, -15, -15) // mostrar la imagen de CONGRATS
        console.log("Congrats!, you've completed all the levels.") 
      }
    } // interfaz: si sólo player es true
    if(levelNum != levels.length - 1){
      for(var pieza of pieces){
        push();
        piecePicked === pieza ? stroke('rgb(251,255,0)') : noStroke();
        pieza.display();
        pop();
      } 
    }
    if(editor){
      buttons[3].display()
      texto("Save", 'black', width-118, height-13)
     } // interfaz: si sólo editor es true
    buttons[2].display() // dibujar botón de exit
    texto("Exit", 'white', width-47, height-13)
  } // interfaz: si player es true o editor es true
  check = isCorrect()
} 
    
function texto(str, color, x, y){
    push()
    fill(color)
    textSize(15)
    text(str, x, y)
    pop()
}

function displayLevel(level){
  level_pieces = []
  for (var pieza of level.piezas){
    if(pieza.id == "triangulo"){
      level_pieces.push(new IsoscelesTriangle('silueta', 'rgb(247, 244, 244)', pieza.length, position = pieza.position, rotation = pieza.rotation))
    }
    if(pieza.id == "cuadrado"){
      level_pieces.push(new Square('silueta', 'rgb(247, 244, 244)', pieza.length, position = pieza.position, rotation = pieza.rotation))
    }
    if(pieza.id == "parall"){
      level_pieces.push(new Parall('silueta', 'rgb(247, 244, 244)', pieza.length, position = pieza.position, rotation = pieza.rotation))
    }
  }
  levelReverse = level.reverse
  noStroke()
  for(var siluetas of level_pieces){
    siluetas.display()
  }
}

function exportar() {
  var level = { piezas: [], reverse: parallReverse }
    for(var piece of pieces){
      level.piezas.push({
      id: piece.id,
      position: [piece.position.x, piece.position.y],
      rotation: piece.rotation, 
      length: piece.length})
    }
    levels.unshift(level)
    saveJSON(level, `level.json`)
}

function countPixels(num){
  loadPixels()
  var count = 0;
  for(var i = 0; i < pixels.length; i++){
    if(pixels[i] == num)
        count++;
  }
  return count
}

function isCorrect() {
  if(countPixels(247) < 2500) { 
    return true
  }
  return false
}

function mouseClicked() {
  piecePicked = undefined;
  for(const piece of pieces) {
    if (piece.pick(mouseX, mouseY)) {
      piecePicked = piece;
      break;
    }
  }
  for(const button of buttons){
    if(button.pick(mouseX, mouseY)){
      buttonPicked = button
      if(buttonPicked == buttons[0]){
        player = true
        editor = false
        randomizePieces()
        console.log('Good luck!')
      }else if(buttonPicked == buttons[1]){
        player = false
        editor = true
        randomizePieces()
        console.log("Welcome to editor! When you're done creating your level, click save (It'll be shown in player mode). Remember to don't overleap the pieces.")
      }else if(buttonPicked == buttons[2]){
        editor = false
        player = false
        parallReverse = false
        levelNum = 0
        console.log('Back to menu!')
      }else if(buttonPicked == buttons[3]){
        if(countPixels(240) < 158500){
          throw new Error('Please, do not overlap the pieces!')
        }
        exportar()
      }else if(buttonPicked == buttons[4]){
        levelNum++
        randomizePieces()
      }
    }
  }
} 

function mouseDragged() {
  if (piecePicked) {
    piecePicked.position = [mouseX, mouseY];
  }
} 

function mouseWheel(event) {
  if(piecePicked){
    if(event.deltaY > 0){
      piecePicked.rotation += 15;
    } else{
        piecePicked.rotation -= 15;
    }
  }
}

function keyPressed() {
  // console.log(key)
  if(!isNaN(Number(key))){
    piecePicked = pieces[key - 1]
  }
  if(!piecePicked){
    throw new Error("Select a piece")
  } 
  if (key === 'q' || key === 'Q') {
    if(piecePicked){
      piecePicked.rotation -= 15
    }
  } 
  if (key === 'e' || key === 'E') {
    if(piecePicked){
      piecePicked.rotation += 15
    }
  }
  if (key === 'r') {
    if(piecePicked != pieces[6]) {
      throw new Error("Select the parallelogram")
    }
    parallReverse = !parallReverse
  }
}

function keyDown(){
  if (keyIsDown(87) & piecePicked != undefined) {
    piecePicked.position.y -= 1
  } // la tecla W es representado por el número 87
  if (keyIsDown(83) & piecePicked != undefined) {
    piecePicked.position.y += 1
  } // la tecla S es representado por el número 83
  if (keyIsDown(65) & piecePicked != undefined) {
    piecePicked.position.x -= 1
  } // la tecla A es representado por el número 65
  if (keyIsDown(68) & piecePicked != undefined) {
    piecePicked.position.x += 1
  } // la tecla D es representado por el número 68
}

function randomizePieces(){
  for(var piece of pieces){
    piece.randomize()
  }
}
