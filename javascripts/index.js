const board = ['pink', 'blue', 'green', 'red', 'purple', 'orange'];
const myBoard = [];
const tempBoard = [
    1, 1, 1, 1, 1, 1, 1, 1, 1, 1
    , 1, 4, 4, 4, 2, 2, 2, 2, 2, 1
    , 1, 1, 1, 1, 2, 2, 2, 2, 2, 1
    , 1, 2, 1, 1, 1, 1, 1, 1, 2, 1
    , 1, 2, 3, 2, 2, 2, 2, 2, 2, 1
    , 1, 2, 1, 1, 1, 1, 1, 1, 2, 1
    , 1, 2, 2, 2, 2, 1, 2, 2, 2, 1
    , 1, 2, 1, 1, 1, 1, 1, 1, 2, 1
    , 1, 2, 2, 2, 2, 2, 2, 2, 2, 1
    , 1, 1, 1, 1, 1, 1, 1, 1, 1, 1
];
const keyz = {
  ArrowRight: false
  , ArrowLeft: false
  , ArrowUp: false
  , ArrowDown: false
};
const g = {
  x: ''
  , y: ''
  , h: 50
  , size: 10
  , inplay: false
}
const player = {
  pos: 32
  , speed: 6
  , cool: 0
  , pause: false
  , score: 0
  , lives: 1
  , gameover: true
  , gamewin: false
  , powerup: false
  , powerCount: 0
}

const escapeDoor = {
  pos: 0
}

const startGame = document.querySelector('.btn');
////EVENT LISTENERS
document.addEventListener('DOMContentLoaded', () => {
  g.grid = document.querySelector('.grid'); ///gameBoard
  g.agent = document.querySelector('.agent'); ///agent
  g.escape = document.querySelector('.escape'); ///escape door
  g.eye = document.querySelector('.eye');
  g.mouth = document.querySelector('.mouth');
  g.score = document.querySelector('.score');
  g.lives = document.querySelector('.lives');
  g.status = document.querySelector('.status');
  g.agent.style.display = 'none';
  g.grid.style.display = 'none';
  g.escape.style.display = 'none';
})
document.addEventListener('keydown', (e) => {
  //console.log(e.code); // Key presses
  if (e.code in keyz) {
    keyz[e.code] = true;
  }
  if (!g.inplay && !player.pause) {
    player.play = requestAnimationFrame(move);
    g.inplay = true;
  }
})
document.addEventListener('keyup', (e) => {
    if (e.code in keyz) {
      keyz[e.code] = false;
    }
  })
  //startGame.addEventListener('click',starterGame);
startGame.addEventListener('click', boardBuilder);

function boardBuilder() {
  console.log(tempBoard);
  tempBoard.length = 0;
  let boxSize = (document.documentElement.clientHeight < document.documentElement.clientWidth) ? document.documentElement.clientHeight : document.documentElement.clientWidth;
  console.log(boxSize);
  g.h = (boxSize / g.size) - (boxSize / (g.size * 5));
  console.log(g.h);
  let tog = false;
  for (let x = 0; x < g.size; x++) {
    let wallz = 0;
    for (let y = 0; y < g.size; y++) {
      let val = 2;
      wallz--;
      if (wallz > 0 && (x - 1) % 2) {
        val = 1;
      }
      else {
        wallz = Math.floor(Math.random() * (g.size / 2));
      }
      if (x == 1 || x == (g.size - 3) || y == 1 || y == (g.size - 2)) {
        val = 2; //place dot
      }
      if (x == (g.size - 2)) {
        if (!tog) {
          tog = true;
        }
        val = 4;
      }
      if ((y == 3) || (y == (g.size - 4))) {
        if (x == 1 || x == (g.size - 3)) {
          val = 3;
        }
      }
      if (x == 0 || x == (g.size - 1) || y == 0 || y == (g.size - 1)) {
        val = 1;
      }
      tempBoard.push(val);
    }
  }
  starterGame();
}
///MAIN GAMEPLAY
function move() {
  if (g.inplay) {
    player.cool--; //player cooldown slowdown
    if (player.cool < 0) {
      //placing movement 
      let tempPower = 0;
      if (player.powerup) {
        player.powerCount--;
        g.agent.style.backgroundColor = 'white';
        if (player.powerCount < 20) {
          g.agent.style.backgroundColor = 'white';
          if (player.powerCount % 2) {
            g.agent.style.backgroundColor = 'white';
          }
        }
        if (player.powerCount <= 0) {
          player.powerup = false;
          g.agent.style.backgroundColor = 'white';
          console.log('Power Down');
          tempPower = 1;
        }
      }
   
        //Keyboard events movement of player
      let tempPos = player.pos; //current pos
      if (keyz.ArrowRight) {
        player.pos += 1;
        g.eye.style.left = '20%';
        g.mouth.style.left = '60%';
      }
      else if (keyz.ArrowLeft) {
        player.pos -= 1;
        g.eye.style.left = '60%';
        g.mouth.style.left = '0%';
      }
      else if (keyz.ArrowUp) {
        player.pos -= g.size;
      }
      else if (keyz.ArrowDown) {
        player.pos += g.size;
      }
      let newPlace = myBoard[player.pos]; //future position
      if (newPlace.t == 1 || newPlace.t == 4) {
        //console.log('wall');
        player.pos = tempPos;
      }
      //powerup
      if (newPlace.t == 3) {
        player.powerCount = 100;
        player.powerup = true;
        console.log('powerup');
        myBoard[player.pos].innerHTML = '';
        player.score += 10;
        updateScore();
        newPlace.t = 0;
      }
      if (newPlace.t == 2) {
        //console.log('dot'); //dot eaten 
        //dots left
        myBoard[player.pos].innerHTML = '';

        let tempDoor = document.querySelectorAll('.escape');
   
           if (tempDoor.length == 0) {
             playerWins();
             g.status.innerHTML = 'Agent escaped! Good job!!';
             window.alert("Good job!!  Press the Start Game button to start again");
           };
        player.score++;
        updateScore();
        newPlace.t = 0;
      }
      if (player.pos != tempPos) { //check if agent moved
        //Open and close mouth
        if (player.tog) {
          g.mouth.style.height = '30%';
          player.tog = false;
        }
        else {
          g.mouth.style.height = '10%';
          player.tog = true;
        }
      }
      player.cool = player.speed; // set cooloff
      //console.log(newPlace.t);
    }
    if (!player.pause) {
      myBoard[player.pos].append(g.agent);
      player.play = requestAnimationFrame(move);
    }
  }
}
///Starting and Restarting
function starterGame() {
  myBoard.length = 0;
  g.grid.innerHTML = '';
  g.x = '';
  player.gameover = false;
  createGame(); //create game board
  updateScore();
  g.grid.focus();
  g.grid.style.display = 'grid';
  startGame.style.display = 'none';
  g.agent.style.display = 'block';
  g.escape.style.display = 'block';
}

function playerWins() {
  player.gamewin = true;
  g.inplay = false;
  player.pause = true;
  startGame.style.display = 'block';
}

function endGame() {
  player.gamewin = false;
  startGame.style.display = 'block';
}

function gameReset() {
  //console.log('paused');
  window.cancelAnimationFrame(player.play);
  g.inplay = false;
  player.pause = true;
  if (player.lives <= 0) {
    player.gameover = true;
    endGame();
  }
  if (!player.gameover) {
    setTimeout(startPos, 3000);
  }
}

function startPos() {
  //player start squares
  player.pause = false;
  let firstStartPos = 81;
  player.pos = startPosPlayer(firstStartPos);
  escapeDoor.pos = 18;
  myBoard[player.pos].append(g.agent);
  myBoard[escapeDoor.pos].append(g.escape);
}

function startPosPlayer(val) {
  if (myBoard[val].t != 1) {
    return val;
  }
  return startPosPlayer(val + 1);
}
/// Game Updates
function updateScore() {
}
///Game board Setup
function createGame() {
  tempBoard.forEach((cell) => {
    ////console.log(cell);
    createSquare(cell);
  })
  for (let i = 0; i < g.size; i++) {
    g.x += ` ${g.h}px `; //cell grid height
  }
  g.grid.style.gridTemplateColumns = g.x;
  g.grid.style.gridTemplateRows = g.x;
  startPos();
}

function createSquare(val) {
  const div = document.createElement('div');
  div.classList.add('box');
  if (val == 1) {
    div.classList.add('wall');
  } //add wall to element
  if (val == 2) {
    // const dot = document.createElement('div');
    // dot.classList.add('dot');
    // div.append(dot);
  } //add dot 
  if (val === 4) {
    // div.classList.add('hideout');

  }
  if (val == 3) {
    // const dot = document.createElement('div');
    // dot.classList.add('superdot');
    // div.append(dot);
  } //add superdot 
  g.grid.append(div);
  myBoard.push(div);
  div.t = val; // element type of content
  div.idVal = myBoard.length;
  div.addEventListener('click', (e) => {
    console.dir(div);
  })
}

function changeDir(ene) {
  let gg = findDir(ene);
  let pp = findDir(player);
  ////console.log(gg);
  ////console.log(pp);
  let ran = Math.floor(Math.random() * 3);
  console.log(ran);
  if (ran < 2) {
    ene.dx = (gg[0] < pp[0]) ? 2 : 3;
  } //hor
  else {
    ene.dx = (gg[1] < pp[1]) ? 1 : 0;
  } //ver
  
  //ene.dx = Math.floor(Math.random()*4);
  ene.counter = (Math.random() * 8) + 1;
}