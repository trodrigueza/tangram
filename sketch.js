const gui = 100 * 2.8;
const canvas_side = gui + 200
let grid = true;
let piecePicked;
let buttonPicked;
let parallReverse = false;
let editor = false;
let player = false;
let levelNum = 0;
let check;
let img;
const SCALING = 0.7;


function preload() {
  level1 = loadJSON("./Levels/level.json")
  level2 = loadJSON("./Levels/level1.json")
  level3 = loadJSON("./Levels/level2.json")
  level4 = loadJSON("./Levels/level5.json")
  level5 = loadJSON("./Levels/level4.json")
  level6 = loadJSON("./Levels/level6.json")
  lastLevel = loadJSON("./Levels/level3.json")
  img = loadImage('images/logo.png');
  img1 = loadImage('images/congrats.png')
  }

function setup() {
  pixelDensity(1)
  angleMode(DEGREES)
  rectMode(CENTER);
  createCanvas(canvas_side, canvas_side);
  cuadrado1 = {
    // 1. Data
    _id: "cuadrado",
    _position: createVector(),
    _rotation: 0,
    // _edge: random(40, 80),
    _edge: gui/2.8,
    _color: color('red'),
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // 2. Methods
    randomize: function() {
      this._position = createVector(random(width/2, width-50), random(20, height/6));
      this._rotation = 15 * round(random(0, 25));
      this._color = color(random(0, 254), random(0, 254), random(0, 254), 254);
    },
    // object shape
    shape: function() {
      push();
      rect(0, 0, this._edge, this._edge);  
      pop();
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function() {
      if(colorEquality(get(mouseX, mouseY), this._color.levels))       { 
        piecePicked = this;
      }
      if(piecePicked === this){
        this._strokeColor = color('white')
      }else{
        this._strokeColor = color('black') 
      }
    },
    //translate when dragged
    dragged: function() { 
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        this.position = createVector(mouseX, mouseY); 
      }
    },
    wheel: function(){
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        if(event.deltaY > 0){
          this._rotation += 15;
        } else {
          this._rotation -= 15;
        }
      }
    },
    // 3. object accessors
    // position setter
    set position(position) {
      this._position = position;
    },
    // position getter
    get position() {
      return this._position;
    },
    set rotation(rotation) {
      this._rotation = rotation;
    },
    get rotation() {
      return this._rotation
    },
    // Implement getters and setters for the remaining
    // props: this._rotation, this._edge, this._color
    // 4. Export
    // export: function(){
    //   return {
    //     position: [this.position.x, this.position.y],
    //     rotation: [this.rotation]
    //   }
    };
  triangulo1 = {
    // 1. Data
    _id: "triangulo1",
    _position: createVector(),
    _rotation: 0,
    _color: color('red'),
    _xo: 0,
    _yo: 0,
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // 2. Methods
    randomize: function() {
      this._position = createVector(random(50, width/2), random(20, height/6));
      this._rotation = 15 * round(random(0, 25));
      this._color = color(random(0, 254), random(0, 254), random(0, 254), 254);
    },
    // object shape
    shape: function() {
      triangle(this._xo - gui / 2.8, this._yo - gui / (2 * 2.8), this._xo, this._yo + gui/(2*2.8), this._xo + gui / 2.8, this._yo - gui / (2*2.8)) 
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function(x, y) {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){ 
        piecePicked = this;
      }
      if(piecePicked === triangulo1){
        this._strokeColor = color('white')
      }else{
        this._strokeColor = color('black') 
      }
    },
    // translate when dragged
    dragged: function() { 
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        this._position = createVector(mouseX, mouseY);
        piecePicked = triangulo1;
      }
    },
    wheel: function(){
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        piecePicked = triangulo1;
        if(event.deltaY > 0){
          this._rotation += 15;
        } else {
          this._rotation -= 15;
        }
      }
    },
    // 3. position property object accessors
    // position setter
    set position(position) {
      this._position = position;
    },
    // position getter
    get position() {
      return this._position;
    },
    set rotation(rotation) {
      this._rotation = rotation;
    },
    get rotation() {
      return this._rotation
    }
    // Implement getters and setters for the remaining
    // props: this._rotation, this._edge, this._color
  }; // mediano
  triangulo2 = {
    // 1. Data
    _id: "triangulo2",
    _position: createVector(),
    _rotation: 0,
    _color: color('red'),
    _xo: 0,
    _yo: 0,
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // 2. Methods
    randomize: function() {
      this._position = createVector(random(50, width/6), random(height/1.5, height-50));
      this._rotation = 15 * round(random(0, 25));
      this._color = color(random(0, 254), random(0, 254), random(0, 254), 254);
    },
    // object shape
    shape: function() {
      triangle(this._xo, this._yo + gui/4, this._xo + gui / 2, this._yo - gui / 4, this._xo - gui / 2, this._yo - gui / 4)
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function(x, y) {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){ 
        piecePicked = this;
      }
      if(piecePicked === triangulo2){
        this._strokeColor = color('white')
        this._strokeWeight = 4
      }else{
        this._strokeWeight = 1
        this._strokeColor = color('black') 
      }
    },
    // translate when dragged
    dragged: function() { 
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        this._position = createVector(mouseX, mouseY);
        piecePicked = triangulo2;
      }
    },
    wheel: function(){
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        piecePicked = triangulo2;
        if(event.deltaY > 0){
          this._rotation += 15;
        } else {
          this._rotation -= 15;
        }
      }
    },
    // 3. position property object accessors
    // position setter
    set position(position) {
      this._position = position;
    },
    // position getter
    get position() {
      return this._position;
    },
    set rotation(rotation) {
      this._rotation = rotation;
    },
    get rotation() {
      return this._rotation
    }
    // Implement getters and setters for the remaining
    // props: this._rotation, this._edge, this._color
  }; // grande 
  triangulo22 = {
    // 1. Data
    _id: "triangulo22",
    _position: createVector(),
    _rotation: 0,
    _color: color('red'),
    _xo: 0,
    _yo: 0,
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // 2. Methods
    randomize: function() {
      this._position = createVector(random(7*width/8, width-50), random(height/3, height/2));
      this._rotation = 15 * round(random(0, 25));
      this._color = color(random(0, 254), random(0, 254), random(0, 254), 254);
    },
    // object shape
    shape: function() {
      triangle(this._xo, this._yo + gui/4, this._xo + gui / 2, this._yo - gui / 4, this._xo - gui / 2, this._yo - gui / 4)
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function(x, y) {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){ 
        piecePicked = this;
      }
      if(piecePicked === triangulo22){
        this._strokeColor = color('white')
        this._strokeWeight = 4
      }else{
        this._strokeWeight = 1
        this._strokeColor = color('black') 
      }
    },
    // translate when dragged
    dragged: function() { 
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        piecePicked = triangulo22
        this._position = createVector(mouseX, mouseY);
      }
    },
    wheel: function(){
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        piecePicked = triangulo22
        if(event.deltaY > 0){
          this._rotation += 15;
        } else {
          this._rotation -= 15;
        }
      }
    },
    // 3. position property object accessors
    // position setter
    set position(position) {
      this._position = position;
    },
    // position getter
    get position() {
      return this._position;
    },
    set rotation(rotation) {
      this._rotation = rotation;
    },
    get rotation() {
      return this._rotation
    }
    // Implement getters and setters for the remaining
    // props: this._rotation, this._edge, this._color
  }; // grande
  triangulo3 = {
    // 1. Data
    _id: "triangulo3",
    _position: createVector(),
    _rotation: 0,
    _color: color('red'),
    _xo: 0,
    _yo: 0,
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // 2. Methods
    randomize: function() {
      this._position = createVector(random(50, width/8), random(height/3, height/2));
      this._rotation = 15 * round(random(0, 25));
      this._color = color(random(0, 254), random(0, 254), random(0, 254), 254);
    },
    // object shape
    shape: function() {
      triangle(this._xo, this._yo + gui / 8, this._xo + gui / 4, this._yo - gui/8, this._xo - gui / 4, this._yo - gui / 8) 
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function(x, y) {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){ 
        piecePicked = this;
      }
      if(piecePicked === triangulo3){
        this._strokeColor = color('white')
        this._strokeWeight = 4
      }else{
        this._strokeWeight = 1
        this._strokeColor = color('black') 
      }
    },
    // translate when dragged
    dragged: function() { 
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        this._position = createVector(mouseX, mouseY);
        piecePicked = triangulo3;
      }
    },
    wheel: function(){
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        piecePicked = triangulo3;
        if(event.deltaY > 0){
          this._rotation += 15;
        } else {
          this._rotation -= 15;
        }
      }
    },
    // 3. position property object accessors
    // position setter
    set position(position) {
      this._position = position;
    },
    // position getter
    get position() {
      return this._position;
    },
    set rotation(rotation) {
      this._rotation = rotation;
    },
    get rotation() {
      return this._rotation
    }
    // Implement getters and setters for the remaining
    // props: this._rotation, this._edge, this._color
  }; // pequeño
  triangulo33 = {
    // 1. Data
    _id: "triangulo33",
    _position: createVector(),
    _rotation: 0,
    _color: color('red'),
    _xo: 0,
    _yo: 0,
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // 2. Methods
    randomize: function() {
      this._position = createVector(random(5*width/6, width-20), random(height/1.5, height-20));
      this._rotation = 15 * round(random(0, 25));
      this._color = color(random(0, 254), random(0, 254), random(0, 254), 254);
    },
    // object shape
    shape: function() {
      triangle(this._xo, this._yo + gui / 8, this._xo + gui / 4, this._yo - gui/8, this._xo - gui / 4, this._yo - gui / 8) 
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function(x, y) {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){ 
        piecePicked = this;
      }
      if(piecePicked === triangulo33){
        this._strokeColor = color('white')
        this._strokeWeight = 4
      }else{
        this._strokeWeight = 1
        this._strokeColor = color('black') 
      }
    },
    // translate when dragged
    dragged: function() { 
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        this._position = createVector(mouseX, mouseY);
        piecePicked = triangulo33;
      }
    },
    wheel: function(){
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        piecePicked = triangulo33;
        if(event.deltaY > 0){
          this._rotation += 15;
        } else {
          this._rotation -= 15;
        }
      }
    },
    // 3. position property object accessors
    // position setter
    set position(position) {
      this._position = position;
    },
    // position getter
    get position() {
      return this._position;
    },
    set rotation(rotation) {
      this._rotation = rotation;
    },
    get rotation() {
      return this._rotation
    }
    // Implement getters and setters for the remaining
    // props: this._rotation, this._edge, this._color
  } // pequeño
  parall1 = {
    // 1. Data
    _id: "parall1",
    _position: createVector(),
    _rotation: 0,
    _color: color('red'),
    _xo: 0,
    _yo: 0,
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // 2. Methods
    randomize: function() {
      this._position = createVector(random(width/3, 5*width/6), random(5*height/6, height-20));
      this._rotation = 15 * round(random(0, 25));
      this._color = color(random(0, 254), random(0, 254), random(0, 254), 254);
    },
    // object shape
    shape: function() {
      if(parallReverse){
        push()
        scale(-1,1)
        quad(this._xo - gui / 8, this._yo - gui / 8, this._xo + (6 * gui) / 16, this._yo - gui / 8, this._xo + gui / 8, this._yo + gui / 8, this._xo - (6 * gui) / 16, this._yo + gui / 8) 
        pop()
      }else{
        quad(this._xo - gui / 8, this._yo - gui / 8, this._xo + (6 * gui) / 16, this._yo - gui / 8, this._xo + gui / 8, this._yo + gui / 8, this._xo - (6 * gui) / 16, this._yo + gui / 8)
      }    
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function(x, y) {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){ 
        piecePicked = this;
      }
      if(piecePicked === parall1){
        this._strokeColor = color('white')
        this._strokeWeight = 4
      }else{
        this._strokeWeight = 1
        this._strokeColor = color('black') 
      }
    },
    reverse: function(){
      parallReverse = !parallReverse
    },
    // translate when dragged
    dragged: function() { 
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        this._position = createVector(mouseX, mouseY);
        piecePicked = parall1
      }
    },
    wheel: function(){
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        piecePicked = parall1
        if(event.deltaY > 0){
          this._rotation += 15;
        } else {
          this._rotation -= 15;
        }
      }
    },
      
    // 3. position property object accessors
    // position setter
    set position(position) {
      this._position = position;
    },
    // position getter
    get position() {
      return this._position;
    },
    set rotation(rotation) {
      this._rotation = rotation;
    },
    get rotation() {
      return this._rotation
    }
    // Implement getters and setters for the remaining
    // props: this._rotation, this._edge, this._color
  } // pequeño
  
  saveButton = {
    // 1. Data
    _position: createVector(width-100, height-18),
    _rotation: 0,
    // _edge: random(40, 80),
    _edge: 30,
    _color: color('rgb(0,0,254)'),
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // object shape
    shape: function() {
      push();
      rect(0, 0, this._edge*2, this._edge);  
      let string="Save"  ; 
      let txt="level";
      textSize(12)
      fill(255)
      textFont("Helvetica")
      strokeWeight(0.8)
      textAlign(CENTER)
    text(string,0,3,this._edge*2,this._edge)
      text(txt,0,15,this._edge*2,this._edge)
      pop();
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function() {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){ 
        piecePicked = saveButton
        var level = {
          piezas: []
        }
        for(var element of draws){
          level.piezas.push(expo(element))
        }
        saveJSON(level, `level.json`)
      }
      if(piecePicked === this){
        this._strokeColor = color('white')
      }else{
        this._strokeColor = color('black') 
      }
    },
  };
  editButton = {
    // 1. Data
    _position: createVector(width/2, (height/2) + 35),
    _rotation: 0,
    // _edge: random(40, 80),
    _edge: 30,
    _color: color('rgba(255,165,0,1)'),
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // object shape
    shape: function() {
      push();
      rect(0, 0, this._edge*2, this._edge);  
      let string="Edit"  ; 
      textSize(12)
      fill(5)
      textFont("Helvetica")
      strokeWeight(0.8)
      textAlign(CENTER)
    text(string,0,9,this._edge*2,this._edge)
      pop();
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function() {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){ 
        buttonPicked = editButton
        
      }
      if(buttonPicked === this){
        editor = true
        this._strokeColor = color('white')
      }else{
        editor = false
        this._strokeColor = color('black') 
      }
    },
  };
  playButton = {
    // 1. Data
    _position: createVector(width/2, (height/2) - 60),
    _rotation: 0,
    // _edge: random(40, 80),
    _edge: 30,
    _color: color('rgb(255,112,112))'),
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // object shape
    shape: function() {
      push();
      rect(0, 0, this._edge*2, this._edge);  
      let string="Play"  ; 
      textSize(12)
      fill(5)
      textFont("Helvetica")
      strokeWeight(0.8)
      textAlign(CENTER)
      text(string,0,9,this._edge*2,this._edge)
      pop();
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function() {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){ 
        buttonPicked = playButton
        
      }
      if(buttonPicked === this){
        player = true
        this._strokeColor = color('white')
      }else{
        player = false
        this._strokeColor = color('black') 
      }
    },
  };
  exitButton = {
    // 1. Data
    _position: createVector(width-34, height-18),
    _rotation: 0,
    // _edge: random(40, 80),
    _edge: 30,
    _color: color('red'),
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // object shape
    shape: function() {
      push();
      rect(0, 0, (this._edge*2)-20, this._edge);  
      let string="Exit"  ; 
      textSize(12)
      fill(254)
      textFont("Helvetica")
      strokeWeight(0.8)
      textAlign(CENTER)
      text(string,0,9,this._edge*2,this._edge)
      pop();
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function() {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){ 
        buttonPicked = this
      }
      if(buttonPicked === this){
        for(var element of draws) {
          element.randomize()
        }
        editor = false
        player = false
        levelNum = 0
        this._strokeColor = color('white')
      }else{
        this._strokeColor = color('black') 
      }
    },
  };
  nextButton = {
    // 1. Data
    _position: createVector(40, height-15),
    _rotation: 0,
    // _edge: random(40, 80),
    _edge: 20,
    _color: color('rgba(150,254,193,1)'),
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // object shape
    shape: function() {
      push();
      rect(0, 0, this._edge, this._edge);  
      pop();
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function() {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){

        buttonPicked = this
      }
      if(buttonPicked === this){
        check = true
        buttonPicked = playButton
        this._strokeColor = color('white')
      }else{
        this._strokeColor = color('black') 
      }
    },
  };
  previousButton = {
    // 1. Data
    _position: createVector(14, height-15),
    _rotation: 0,
    // _edge: random(40, 80),
    _edge: 20,
    _color: color('rgb(140,251,185)'),
    _strokeColor: color('black'),
    _strokeWeight: 1,
    // object shape
    shape: function() {
      push();
      rect(0, 0, this._edge, this._edge);  
      pop();
    },
    // Implement this function to select a piece with
    // a pointer device such as a mouse or a touch screen
    pick: function() {
      if(colorEquality(get(mouseX, mouseY), this._color.levels)){
        buttonPicked = this
      }
      if(buttonPicked === this){
        levelNum--
        buttonPicked = playButton
        this._strokeColor = color('white')
      }else{
        this._strokeColor = color('black') 
      }
    },
  };
  
  draws = [cuadrado1, triangulo1, triangulo2, triangulo22, triangulo3, triangulo33, parall1]
  
  buttons = [saveButton, editButton, playButton, exitButton]
  
  levels = [level6, level1, level2, level3, level5, level4, lastLevel]
  // call and executes the piece randomized method:
  for(var element of draws) {
    element.randomize()
  }
}


function draw() {
  background(130);
  
  if(editor== false && player == false){
    displayButton(editButton)
    displayButton(playButton)
    image(img, -25, -20);
  }
  
  if(editor || player) {
    if (player){
      displayLevel(levels[levelNum])
      if(check && levelNum != levels.length-1){   
        levelNum++
        console.log(`Level ${levelNum} completed!`)
        for(var elementt of draws) {
          elementt.randomize()
        }
      }
    }
    if (grid) {
      gridHint(10);
    }
    if(levelNum != levels.length-1){
      for(var element of draws){
        displayPiece(element)
      }
    }
    if(levelNum < levels.length-1 && player){
        displayButton(nextButton)
    }
    // if(levelNum > 0){
    //   displayButton(previousButton)
    // }
    if(editor){
      displayButton(saveButton)
    }
    displayButton(exitButton)
    if(levelNum == levels.length-1){
      image(img1, -15, -15)
      console.log("Congrats!, you've completed all the levels.")
    }
  }
  keyDown()
  check = isCorrect()
}

function displayPiece(piece) {
  push();
  piece.pick()
  // translate according to the piece position getter
  translate(piece._position.x, piece._position.y);
  // Implement piece getters for the rotation and color
  fill(piece._color);
  stroke(piece._strokeColor);
  // strokeWeight(piece._strokeWeight);
  rotate(piece._rotation);
  scale(SCALING);
  piece.shape();
  pop();
}

function displayButton(button) {
  push();
  button.pick()
  // translate according to the piece position getter
  translate(button._position.x, button._position.y);
  // Implement piece getters for the rotation and color
  fill(button._color);
  stroke(button._strokeColor);
  // strokeWeight(piece._strokeWeight);
  button.shape();
  pop();
}

function displayLevel(level) {
  for (var pieza of level.piezas){
    push();
    // translate according to the piece position getter
    translate(pieza.position[0], pieza.position[1]);
    // Implement piece getters for the rotation and color
    fill(color("white"));
    stroke(color("white"))
    rotate(pieza.rotation[0]);
    scale(SCALING);
    if(pieza.id[0] == 'c') {
      rect(0, 0, cuadrado1._edge); 
    }
    if(pieza.id == 'triangulo1'){
      triangulo1.shape()
    }
    if(pieza.id == 'triangulo2'){
      triangulo2.shape()
    }
    if(pieza.id == 'triangulo22'){
      triangulo22.shape()
    }
    if(pieza.id == 'triangulo3'){
      triangulo3.shape()
    }
    if(pieza.id == 'triangulo33'){
      triangulo33.shape()
    }
    if(pieza.id == 'parall1'){
      parall1.shape()
    }
    pop();
  }
}

function isCorrect() {
  loadPixels()
  var count = 0;
  for(var i = 0; i < pixels.length; ++i){
    if(pixels[i] == 255)
        count++;
  }
  if(count > 232030) {
    return false
  }
  return true

      
    // if (colorEquality(pixelColor.levels, color("white").levels)) {
    //   return false
    // }else{
    //   return true  
    // }
}

function gridHint(scale) {
  push();
  stroke(200, 100, 200, 20);
  strokeWeight(1);
  let i;
  for (i = 0; i <= width / scale; i++) {
    line(i * scale, 0, i * scale, height);
  }
  for (i = 0; i <= height / scale; i++) {
    line(0, i * scale, width, i * scale);
  }
  pop();
}

// Translation
function mouseDragged() {
  for(var element of draws) {
    element.pick()
    element.dragged()
  }
}

// Rotation
function mouseWheel(event) {
  for(var element of draws) {
    element.pick()
    element.wheel()
  }
}

function mousePressed() {
  if(colorEquality(get(mouseX, mouseY), parall1._color.levels) && piecePicked === parall1){
    if(mouseButton == RIGHT){
          parall1.reverse()
        }
  }
  for(var element of draws) {
    element.pick()
  }
  for(var button of buttons) {
    button.pick()
  }
}

// Show grid
function keyPressed() {
  // toggle grid hint
  if (key === 'g') {
    grid = !grid;
  }
  
  if (key === '1') {
    piecePicked = cuadrado1
  }
  
  if (key === '2') {
    piecePicked = triangulo1
  }
  
  if (key === '3') {
    piecePicked = triangulo2
  }
  
  if (key === '4') {
    piecePicked = triangulo22
  }
  
  if (key === '5') {
    piecePicked = triangulo3
  }
  
  if (key === '6') {
    piecePicked = triangulo33
  }
  
  if (key === '7') {
    piecePicked = parall1
  }
  
  if (key === 'c') {
    piecePicked = undefined
  }
  
  if (key === 'q') {
    if(piecePicked === undefined) {
      throw new Error("Select a piece")
    }
    piecePicked._rotation -= 15
  }
  
  if (key === 'e') {
    if(piecePicked === undefined) {
      throw new Error("Select a piece")
    }
    piecePicked._rotation += 15
  }
  
  if (key === 'r') {
    if(piecePicked !== parall1) {
      throw new Error("Select the parallelogram")
    }
    piecePicked.reverse()
  }
  
  if (keyCode === UP_ARROW) {
    piecePicked._position.y -= 1
  } 
  if (keyCode === DOWN_ARROW) {
    piecePicked._position.y += 1
  } 
  if (keyCode === LEFT_ARROW) {
    piecePicked._position.x -= 1
  } 
  if (keyCode === RIGHT_ARROW) {
    piecePicked._position.x += 1
  } 
}

function keyDown(){
  if (keyIsDown (87)) {
    piecePicked._position.y -= 1
  } 
  if (keyIsDown (83)) {
    piecePicked._position.y += 1
  } 
  if (keyIsDown (65)) {
    piecePicked._position.x -= 1
  } 
  if (keyIsDown (68)) {
    piecePicked._position.x += 1
  } 
}

function expo(piece) {
    return {
      id: piece._id,
      position: [piece.position.x, piece.position.y],
      rotation: [piece.rotation],
      rever: parallReverse
    }
}

// Check if object color and get color are equal
function colorEquality(rgb1, rgb2) {
  if(rgb1[0] == rgb2[0] && rgb1[1] == rgb2[1] && rgb1[2] == rgb2[2]) {
    return true
  }
  return false
}
