var monster;
var cats = [];
var dots = [];
var lives;
var score;
var cat1, cat2, cat3, cat4;
var monsterLeft1, monsterLeft2, monsterLeft3, monsterRight1, monsterRight2, monsterRight3;
var heart;
var stomachGrowling, gameoverSound, startSound, scoreSound;
var gameStarted;

function preload()
{
  // load in cat images
  cat1 = loadImage('img/sprite/cat1.png'); 
  cat2 = loadImage('img/sprite/cat2.png'); 
  cat3 = loadImage('img/sprite/cat3.png');
  cat4 = loadImage('img/sprite/cat4.png');
  
  // load in monster sprites/images
  monsterLeft1 = loadImage('img/sprite/frame-1.png');
  monsterLeft2 = loadImage('img/sprite/frame-2.png');
  monsterLeft3 = loadImage('img/sprite/frame-2.png');
  monsterRight1 = loadImage('img/sprite/frame-3.png');
  monsterRight2 = loadImage('img/sprite/frame-4.png');
  monsterRight3 = loadImage('img/sprite/frame-4.png');
  
  // load heart sprites
  heart = loadImage('img/sprite/heart.png');
  
  // load sound clips
  soundFormats('mp3', 'ogg', 'wav');
  stomachGrowling = loadSound('sound/Stomach_Growling.mp3');
  gameoverSound = loadSound('sound/gameover.mp3');
  scoreSound = loadSound('sound/score.mp3');
  startSound = loadSound('sound/start.mp3');
  
}

function setup() 
{
  // set canvas size
  createCanvas(800, 400);
  
  // create monster objects
  monster = new Monster();
  
  // default lives and score values
  lives = 3;
  score = 0;
  
  // create clear button
  startButton = createButton('Start Game');
  startButton.position(375, 200);
  startButton.mousePressed(startGame);
  
  // set gameStarted equal to false
  gameStarted = false;
  
}

function draw() 
{
  background(0);

  if(gameStarted == true)
  {
  
    // hide start button
    startButton.hide();
  
    // display score
    fill(200);
    noStroke();
    textSize(24);
    text("Score: " + score, 30, 50);
  
    // display number of lives
    switch(lives)
    {
      case 3:
        image(heart, 650, 30);
        image(heart, 690, 30);
        image(heart, 730, 30);
      break;
      case 2:
        image(heart, 690, 30);
        image(heart, 730, 30);
      break;
      case 1:
        image(heart, 730, 30);
      break;
    }

    // display monster sprite
    monster.display();
  
    // random cat hatching
    var catHatch = Math.ceil(random(30));
    if(catHatch == 1)
    {
      cats.push(new Cat());
    }
  
    // random dot hatching
    var dotHatch = Math.ceil(random(30));
    if(dotHatch == 1)
    {
      dots.push(new Dot());
    }
  
    // loop through each cat 1-4
    for (var i=0; i<cats.length; i++) 
    {
      // display cat
      cats[i].display();
    
      // check if cat reaches bottom of the screen
      if(cats[i].ypos > 500)
      {
        // remove cat
        cats.splice(i, 1);
      
      } else {
      
        // check if monster is touching cat
        var d1 = dist(cats[i].xpos, cats[i].ypos, monster.xpos, monster.ypos);
        if(d1 < 50)
        {
          // remove cat
          cats.splice(i, 1);
         
          // decrease lives by one
          lives --;
         
          // play stomachGrowling sound clip
          stomachGrowling.play();
        }
      }
    }

    // loop through each dot
    for (var j=0; j<dots.length; j++) 
    {
      // display dots
      dots[j].display();
    
      // check if dot reaches bottom of screen
      if(dots[j].ypos > 500)
      {
        // remove dot
        dots.splice(j, 1);
    
      } else {
    
        // check if monster is touching dot and play sound effect for "score" and add +1 to counter.
        var d2 = dist(dots[j].xpos, dots[j].ypos, monster.xpos, monster.ypos);
        if(d2 < 25)
        {
          // remove dot from canvas.
          dots.splice(j, 1);
        
          // increase score by one if monster touched the dot.
          score++;
        
          // play score sound
          scoreSound.play();
        }
      }
    }
  
    // check for game over
    if(lives <= 0)
    {
      // reset lives and score
      lives = 3;
      score = 0;
      
      // reset monster's position
      monster.xpos = 400;
      monster.direction = "stopped";
    
      // remove catss and dots
      cats = [];
      dots = [];
      
      // play gameover sound
      gameoverSound.play();
      
      // set gameStarted to false
      gameStarted = false;
    }
  
  } else {
	  
    // show start button
    startButton.show();
	  
  }
}

function startGame()
{
  // change gameStarted variable
  gameStarted = true;
  
  // play starting sound
  startSound.play();
}

function keyPressed()
{
  // if the right arrow was pressed
  if(keyCode == RIGHT_ARROW)
  {
    // change monster's direction property
    monster.direction = 'right';
  }
  
  // if the left arrow was pressed
  if(keyCode == LEFT_ARROW)
  {
    // change monster's direction property
    monster.direction = 'left';
  }
}


// MONSTER //


function Monster()
{
  // set default properties
  this.xpos = 400;
  this.ypos = 350;
  this.speed = 4;
  this.direction = "stopped";
  
  // mouthCounter will determine which monster sprite to display (1, 2 or 3)
  this.mouthCounter = 1;
}

Monster.prototype.display = function()
{
  // check for every fifth frame
  // is the current frameCount divisible by 5?
  if(frameCount % 5 === 0)
  {
    // if the mouthCounter is equal to 3, reset mouthCounter by setting it equal to 1
    // otherwise, increment mouthCounter
    if(this.mouthCounter == 3)
    {
      this.mouthCounter = 1;
    } else {
      this.mouthCounter++;
    }
  }
  
  imageMode(CENTER);
  
  // if monster is facing right
  if(this.direction == 'right')
  {
    // display the correct sprite image based on the mouthCounter
    switch(this.mouthCounter)
    {
      case 1: 
        image(monsterRight1, this.xpos, this.ypos); 
      break;
      case 2: 
        image(monsterRight2, this.xpos, this.ypos); 
      break;
      case 3: 
        image(monsterRight3, this.xpos, this.ypos); 
      break;
    }
    
    // move monster to the right
    this.xpos = this.xpos + this.speed;
  }
  
  // if monster is facing left
  if(this.direction == 'left')
  {
    // display the correct sprite image based on the mouthCounter
    switch(this.mouthCounter)
    {
      case 1: 
        image(monsterLeft1, this.xpos, this.ypos); 
      break;
      case 2: 
        image(monsterLeft2, this.xpos, this.ypos); 
      break;
      case 3: 
        image(monsterLeft3, this.xpos, this.ypos); 
      break;
    }
    
    // move monster to the left
    this.xpos = this.xpos - this.speed;
  }
  
  // if monster is just starting out and hasn't started moving yet
  if(this.direction == 'stopped')
  {
    image(monsterLeft1, this.xpos, this.ypos);
  }
  
  // set borders so that the monster does not leave the canvas boundary.
  if(this.xpos > 800)
  {
    this.xpos = 0;
  }
  if(this.xpos < 0)
  {
    this.xpos = width;
  }
}


// CAT //


function Cat()
{
  // set default properties
  this.xpos = random(0, width);
  this.ypos = 0;
  this.speed = random(1, 4);
  this.type = Math.ceil(random(4));
}

Cat.prototype.display = function()
{
  imageMode(CENTER);
  
  // show different cat sprites 
  switch(this.type)
  {
    case 1: image(cat1, this.xpos, this.ypos, 42, 44); break;
    case 2: image(cat2, this.xpos, this.ypos, 42, 44); break;
    case 3: image(cat3, this.xpos, this.ypos, 42, 44); break;
    case 4: image(cat4, this.xpos, this.ypos, 42, 44); break; 
  }
  this.ypos = this.ypos + this.speed;
}


// DOT //


function Dot()
{
  // set default properties for random position of dot.
  this.xpos = random(0, 600);
  this.ypos = 0;
  this.speed = random(1, 4);
}

Dot.prototype.display = function()
{
  ellipseMode(CENTER);
  fill(200);
  noStroke();
  ellipse(this.xpos, this.ypos, 25, 25);
  this.ypos = this.ypos + this.speed;
}
