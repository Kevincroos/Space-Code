let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");

let image = new Image();
let impact = new Image();

const player = {
  x: window.innerWidth/2,
  y: window.innerHeight/2,
}

let config = {
  ready: false,
  hitBox: false,
  sounds: true,
  spd:40,
  astDelay: 200,
  bulDelay: 100,
}

let bullets = [];
let asteroids = [];

let score = 0;
let background;
let playerSprite;
let laserSprite;
//let btnSprite;

function ready() 
{
  impact.src = "sprites/impact.png";
  background = Math.floor(Math.random()*3)+1;
  laserSprite = Math.floor(Math.random()*2)+1;
  //btnSprite = Math.floor(Math.random()*3)+1;
  playerSprite = Math.floor(Math.random()*15)+1;
  //document.getElementById("main-menu").style.backgroundImage = "url('sprites/btn"+btnSprite+".png')";
  document.body.style.backgroundImage = "url('sprites/background"+background+".png')";

  document.getElementById("again").play();
  resizeCanvas();
  move();
  window.requestAnimationFrame(loop);

  let btn = document.createElement("button");
  btn.setAttribute("id", "main-menu");

  let opt = document.createElement("button");
  btn.setAttribute("id", "main-menu");

  btn.addEventListener('click', (e) => {config.ready = true; 
    document.getElementById("main-menu").parentNode.removeChild(document.getElementById("main-menu")); 
    btn.style.visibility = "hidden";
    opt.style.visibility = "hidden";
    document.getElementById("start").play();
    });

  opt.addEventListener('click', (e) => {
    document.getElementById("main-menu").parentNode.removeChild(document.getElementById("main-menu")); 
    btn.style.visibility = "hidden";
    opt.style.visibility = "hidden";
    document.getElementById("start").play();
    options();
    });

  btn.innerHTML = "Start the Game";
  btn.style.background = "rgb(0, 157, 255)";
  btn.style.fontFamily = "default";
  btn.style.padding = "20px";
  btn.style.color = "white";
  btn.style.border = "solid black 6px";
  btn.style.borderRadius = "10px";

  opt.innerHTML = "Options";
  opt.style.background = "rgb(110, 157, 255)";
  opt.style.fontFamily = "default";
  opt.style.padding = "20px";
  opt.style.color = "white";
  opt.style.border = "solid black 6px";
  opt.style.borderRadius = "10px";
  opt.style.display = "block";
  opt.style.margin = "10px auto";

  document.body.appendChild(btn);
  document.body.appendChild(opt);

}

function loop() {
  resizeCanvas();
  drawPlayer();
  drawBullet();
  drawAsteroid();
  asteroid();
  explosion();
  document.getElementById('score').innerHTML = "Score: "+score;
  window.requestAnimationFrame(loop);
}

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function drawPlayer() {
  if(config.ready == true) {
  image.src = "sprites/player"+playerSprite+".png";
  if (config.hitBox == true) {
  ctx.fillStyle = "red";
  ctx.fillRect(player.x, player.y, 100, 70);
  }
  ctx.drawImage( image, player.x, player.y);
  }
}

function move() {
  window.addEventListener('keydown', (e) => {
    if(e.code === "ArrowLeft") {
      if(player.x > 32) {
      player.x-=config.spd;
      }
    }
    else if(e.code === "ArrowRight") {
      if (player.x < canvas.width-120) {
      player.x+=config.spd;
    }
  }
      if(e.code === "ArrowUp") {
        if (player.y > 50) {
      player.y-=config.spd;
        }
    }
    else if(e.code === "ArrowDown") {
      if (player.y < canvas.height-120) {
      player.y+=config.spd;
    }
  }
  }
   );

  window.addEventListener('keyup', (e) => {
    if(e.code === "Space") {
      if (config.bulDelay == 0) {
        bullet();
        config.bulDelay = 20;
    }
  }
  });
}

function bullet() {
  if (config.ready == true) {
    if (config.sounds == true) {
    document.getElementById("laser").play();
    document.getElementById("laser").playbackRate = 4;
    }
  bullets.push({
    image: new Image(),
    x1: player.x,
    y: player.y,
    x2: player.x+91,
  })
}
}

function drawBullet() {
  if (config.bulDelay > 0) {
    config.bulDelay -= 1;
  }
  bullets.forEach(b => {
    b.image.src = "sprites/laser"+laserSprite+".png";
    ctx.drawImage( b.image, b.x1, b.y);
    ctx.drawImage( b.image, b.x2, b.y);
    b.y -= 15;
    if (b.y <= -10) {
      bullets.splice(0, 1);
        }
  });
}

function explosion() {
  for (let e1 = 0; e1 < bullets.length; e1++) {
    for (let e2 = 0; e2 < asteroids.length; e2++) {

      try {
        if (bullets[e1].x1 >= asteroids[e2].x && bullets[e1].x1 <= asteroids[e2].x+60 && bullets[e1].y >= asteroids[e2].y && bullets[e1].y <= asteroids[e2].y+60 || bullets[e1].x2 >= asteroids[e2].x && bullets[e1].x2 <= asteroids[e2].x+60) {
          ctx.drawImage(impact, asteroids[e2].x, asteroids[e2].y, 50, 50);
          setTimeout(700);
          bullets.splice(e1, 1);
          asteroids.splice(e2, 1);
          score+=1
        }
      } catch (error) {
        //prompt("O jogo travou!");
      }
      
    }
    
  }
}

function asteroid() {
if (config.astDelay > 0) {
    config.astDelay -= 1;
  }
if (config.astDelay === 0 && config.ready == true) {
  asteroids.push({
    image: new Image(),
    x: Math.floor(Math.random()*canvas.width),
    y: 0,
    dir: Math.floor(Math.random()*-10)+5,
    spd: Math.floor(Math.random()*10)+3,
    xx: Math.floor(Math.random()*6)+1,
  }
  )
    config.astDelay = Math.floor(Math.random()*50);
  }
}

function drawAsteroid() {
  asteroids.forEach(b => {
    b.image.src = "sprites/meteor"+b.xx+".png";
    if (config.hitBox == true) {
    ctx.fillStyle = "red";
    ctx.fillRect(b.x, b.y, 60, 60);
    }
    ctx.drawImage( b.image, b.x, b.y);

    b.y +=b.spd;
    b.x+=b.dir;

    if (b.x <= player.x+100 && b.y <= player.y+70 && b.x >= player.x && b.y > player.y) {
        if (config.ready == true) 
        {
          lose();
          config.ready = false;
        }
    }

    if (b.y > canvas.height) {
      asteroids.splice(0, 1);
        }
  });
}

function lose() {
  if (config.sounds == true) {
  document.getElementById("end").play();
  }
  document.getElementById("score").style.opacity = 0;

  var title = document.createElement("h1");
  var finalScore = document.createElement("h3");
  var thanks = document.createElement("h3");
  var button = document.createElement("button");

  title.setAttribute("id", "lose");
  finalScore.setAttribute("id", "lose");
  thanks.setAttribute("id", "lose");
  button.setAttribute("id","lose");

  title.innerHTML = "Your ship has been destroyed :(";
  finalScore.innerHTML = "your final score: "+score;
  thanks.innerHTML = "Thanks by play!";
  button.innerHTML = "Play Again";
  button.addEventListener("click", (e) => {
    location.reload();
  })

  title.style.color = "red";
  button.style.background = "rgb(0, 157, 255)";
  //button.style.fontFamily = "default";
  button.style.padding = "20px";
  button.style.color = "white";
  button.style.border = "solid black 6px";
  button.style.borderRadius = "10px";

  document.body.appendChild(title);
  document.body.appendChild(finalScore);
  document.body.appendChild(thanks);
  document.body.appendChild(button);
}

function options() 
{
  var title = document.createElement("h1");
  var hitBox = document.createElement("button");
  var sound = document.createElement("button");
  var thanks = document.createElement("h3");
  var button = document.createElement("button");

  title.setAttribute("id", "lose");
  hitBox.setAttribute("id", "lose");
  sound.setAttribute("id", "lose");
  thanks.setAttribute("id", "lose");
  button.setAttribute("id","lose");

  title.innerHTML = "Options";
  hitBox.innerHTML = "Show HitBox: "+config.hitBox;
  sound.innerHTML = "Sounds: "+config.sounds;
  thanks.innerHTML = "This Game has been developed under 3 days, by only one person.";
  button.innerHTML = "Start Game!";

  button.addEventListener("click", (e) => {
    for (let index = 0; index < 5; index++) {
    document.getElementById("lose").parentNode.removeChild(document.getElementById("lose"));
    }
    config.ready = true;
  })

  hitBox.addEventListener("click", (e) => {
    if (config.hitBox == true) {
      config.hitBox = false
      } else if(config.hitBox == false) {config.hitBox = true}
      hitBox.innerHTML = "Show HitBox: "+config.hitBox;
  })

  sound.addEventListener("click", (e) => {
    if (config.sounds == true) {
    config.sounds = false
    } else if(config.sounds == false) {config.sounds = true}
    sound.innerHTML = "Sounds: "+config.sounds;
  });

  title.style.color = "red";
  button.style.background = "rgb(0, 157, 255)";
  button.style.padding = "20px";
  button.style.color = "white";
  button.style.border = "solid black 6px";
  button.style.borderRadius = "10px";
  thanks.style.textDecoration = "underline";

  document.body.appendChild(title);
  document.body.appendChild(hitBox);
  document.body.appendChild(sound);
  document.body.appendChild(thanks);
  document.body.appendChild(button);
}

ready();