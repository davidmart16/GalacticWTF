const Game = {
  canvas: undefined,
  ctx: undefined,
  width: undefined,
  height: undefined,
  counter: 0,
  counterEvent: 0,
  framesCounter: 0,
  framesCounterTwo: 0,
  score: 0,
  ballScore: 0,
  timeScore: 0,
  currentLevel: 1,
  speedMultiplier: 0,
  frequency: 5,
  negBaseBallSpeed: 4,
  posBaseBallSpeed: 6,
  ranBaseBallSpeed: 5,

  background: undefined,
  player: undefined,
  positiveBall: undefined,
  negativeBall: undefined,
  randomBall: undefined,

  explosionImg: undefined,
  winImg: undefined,
  gameOverImg: undefined,
  hpImg: undefined,

  coinAudio: undefined,
  gameOverAudio: undefined,
  winAudio: undefined,
  slowAudio: undefined,

  positiveBalls: [],
  negativeBalls: [],
  randomBalls: [],

  keys: {
    moveLeft: "a",
    moveLeftMayus: "A",
    moveLeftOpt: "ArrowLeft",
    moveRight: "d",
    moveRightMayus: "D",
    moveRightOpt: "ArrowRight",
    shoot: "w",
    shootOpt: " ",
  },

  init() {
    this.canvas = document.getElementById("canvas");
    this.ctx = this.canvas.getContext("2d");
    this.setDimensions();

    this.start();
  },

  setDimensions() {
    this.width = window.innerWidth * 0.8;
    this.height = window.innerHeight * 0.8;
    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.columnWidth = this.width / 5;
    this.column1Center = this.columnWidth / 2;
    this.column2Center = this.column1Center + this.columnWidth * 1;
    this.column3Center = this.column1Center + this.columnWidth * 2;
    this.column4Center = this.column1Center + this.columnWidth * 3;
    this.column5Center = this.column1Center + this.columnWidth * 4;
  },

  start() {
    this.reset();

    this.interval = setInterval(() => {
      this.framesCounter > 5000
        ? (this.framesCounter = 0)
        : this.framesCounter++;

      this.framesCounterTwo > 5000
        ? (this.framesCounterTwo = 0)
        : this.framesCounterTwo++;

      this.clear();
      this.drawAll();

      this.generatePositiveBalls();
      this.generateNegativeBalls();
      this.generateRandomBalls();

      this.addScore();
      this.drawScore();
      this.printCoins();

      this.defineLevels();
      this.printCurrentLevel();
      this.isGameover();
      this.checkWin();

      this.callEvents();

      this.clearPositiveBalls();
      this.clearNegativeBalls();
      this.clearRandomBalls();
      this.player.clearBullets();

      this.printLives();

      this.isColission();

      this.counter++;
    }, 1000 / 60);
  },

  reset() {
    this.background = new Background(this.ctx, this.width, this.height);
    this.background.bgMusic.play();

    this.column1 = new Column(this.ctx, 0, this.width, this.height);
    this.column2 = new Column(
      this.ctx,
      this.columnWidth,
      this.width,
      this.height
    );
    this.column3 = new Column(
      this.ctx,
      2 * this.columnWidth,
      this.width,
      this.height
    );
    this.column4 = new Column(
      this.ctx,
      3 * this.columnWidth,
      this.width,
      this.height
    );
    this.column5 = new Column(
      this.ctx,
      4 * this.columnWidth,
      this.width,
      this.height
    );
    this.player = new Player(
      this.ctx,
      this.width,
      this.height,
      this.keys,
      this.columnWidth
    );

    this.positiveBalls = [];
    this.negativeBalls = [];
    this.randomBalls = [];

    this.counter = 0;

    this.loadAssets();
    this.hideRestart();
    this.hideMenu();

    this.score = 0;
    this.counter = 0;
    this.counterEvent = 0;
    this.framesCounter = 0;
    this.framesCounterTwo = 0;
    this.ballScore = 0;
    this.timeScore = 0;
    this.currentLevel = 1;
    this.speedMultiplier = 0;
    this.frequency = 5;
  },

  hideRestart() {
    let restartButton = document.getElementById("restart_id");
    if (restartButton.classList.contains("restart_container")) {
      restartButton.classList.add("restart_container_hidden");
      restartButton.classList.remove("restart_container");
    }
  },

  hideMenu() {
    let menuButton = document.getElementById("menu_id");
    if (menuButton.classList.contains("menu_container")) {
      menuButton.classList.add("menu_container_hidden");
      menuButton.classList.remove("menu_container");
    }
  },

  drawAll() {
    this.background.draw();
    this.background.drawLoop();

    this.positiveBalls.forEach((positive) => positive.draw(this.framesCounter));
    this.negativeBalls.forEach((negative) =>
      negative.draw(this.framesCounterTwo)
    );
    this.randomBalls.forEach((random) => random.draw());
    this.player.draw();
  },

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  },

  clearPositiveBalls() {
    this.positiveBalls = this.positiveBalls.filter(
      (positive) => positive.collided === false
    );

    this.positiveBalls = this.positiveBalls.filter(
      (positive) => positive.posY <= this.height
    );
  },

  clearNegativeBalls() {
    this.negativeBalls = this.negativeBalls.filter(
      (negative) => negative.collided === false
    );

    this.negativeBalls = this.negativeBalls.filter(
      (negative) => negative.posY <= this.height
    );

    this.negativeBalls = this.negativeBalls.filter(
      (negative) => negative.reachedBottom === false
    );
  },

  clearRandomBalls() {
    this.randomBalls = this.randomBalls.filter(
      (random) => random.collided === false
    );

    this.randomBalls = this.randomBalls.filter(
      (random) => random.posY <= this.height
    );
  },

  pickRandomEvent() {
    let randomNum = Math.floor(Math.random() * 2) + 1;
    return randomNum;
  },

  pickRandomColumn() {
    let randomNum = Math.floor(Math.random() * 5);

    switch (randomNum) {
      case 0:
        return this.column1Center;
        break;

      case 1:
        return this.column2Center;
        break;

      case 2:
        return this.column3Center;
        break;

      case 3:
        return this.column4Center;
        break;

      case 4:
        return this.column5Center;
        break;
    }
  },

  generatePositiveBalls() {
    if (this.counter % 105 === 0) {
      this.positiveBalls.push(
        (this.positiveBall = new PositiveBall(
          this.ctx,
          this.pickRandomColumn(),
          this.posBaseBallSpeed + this.speedMultiplier
        ))
      );
    }
  },

  generateNegativeBalls() {
    if (this.counter % (55 - this.frequency) === 0) {
      this.negativeBalls.push(
        (this.negativeBall = new NegativeBall(
          this.ctx,
          this.pickRandomColumn(),
          this.negBaseBallSpeed + this.speedMultiplier
        ))
      );
    }
  },

  generateRandomBalls() {
    if (this.counter % 500 === 0 && this.score > 1000) {
      this.randomBalls.push(
        (this.randomBall = new RandomBall(
          this.ctx,
          this.pickRandomColumn(),
          this.ranBaseBallSpeed + this.speedMultiplier
        ))
      );
    }
  },

  drawScore() {
    this.score = this.timeScore + this.ballScore;

    this.ctx.font = "36.6px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Score: ${this.score}`, 100, 60);
  },

  addScore() {
    this.timeScore = Math.floor(this.counter / 2);
  },

  addHealth() {
    if (
      !this.player.healedFive &&
      this.player.health < 3 &&
      this.currentLevel === 5
    ) {
      this.player.health += 1;
      this.player.healedFive = true;
    }
    if (
      !this.player.healedSeven &&
      this.player.health < 3 &&
      this.currentLevel === 7
    ) {
      this.player.health += 1;
      this.player.healedSeven = true;
    }
    if (
      !this.player.healedNine &&
      this.player.health < 3 &&
      this.currentLevel === 9
    ) {
      this.player.health += 1;
      this.player.healedNine = true;
    }
  },

  defineLevels() {
    if (this.score > 1000 && this.score <= 2000) {
      this.speedMultiplier = 1;
      this.currentLevel = 2;
    } else if (this.score > 2000 && this.score < 3000) {
      this.speedMultiplier = 2;
      this.currentLevel = 3;
      this.frequency = 5;
      this.player.setListenersReverse();
      this.ctx.font = "42.6px 'Press Start 2P'";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(`REVERSE`, this.width / 2 - 141.6, this.height / 2);
    } else if (this.score > 3000 && this.score < 4000) {
      this.speedMultiplier = 3;
      this.currentLevel = 4;
      this.addHealth();
      this.player.setListeners();
    } else if (this.score > 4000 && this.score < 5000) {
      this.speedMultiplier = 4;
      this.currentLevel = 5;
      this.frequency = 10;
    } else if (this.score > 5000 && this.score < 6000) {
      this.speedMultiplier = 4;
      this.currentLevel = 6;
      this.player.setListenersReverse();
      this.ctx.font = "42.6px 'Press Start 2P'";
      this.ctx.fillStyle = "white";
      this.ctx.fillText(`REVERSE`, this.width / 2 - 141.6, this.height / 2);
    } else if (this.score > 6000 && this.score < 7000) {
      this.speedMultiplier = 5;
      this.currentLevel = 7;
      this.addHealth();
      this.frequency = 15;
      this.player.setListeners();
    } else if (this.score > 7000 && this.score < 8000) {
      this.speedMultiplier = 5;
      this.currentLevel = 8;
    } else if (this.score > 8000 && this.score < 9000) {
      this.speedMultiplier = 5;
      this.currentLevel = 9;
      this.frequency = 20;
    } else if (this.score > 9000 && this.score < 10000) {
      this.speedMultiplier = 7;
      this.currentLevel = 10;
    }
  },

  printLevel(currentLvl) {
    this.ctx.font = "36.6px 'Press Start 2'P";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`Level: ${currentLvl}`, this.width / 2 - 175, 60);
  },

  printCurrentLevel() {
    this.printLevel(this.currentLevel);
  },

  printCoins() {
    this.ctx.drawImage(this.coinImage, 120, 130, 50, 50);

    this.ctx.font = "42.6px 'Press Start 2P'";
    this.ctx.fillStyle = "white";
    this.ctx.fillText(`${this.player.takenCoins}`, 183, 183);
  },

  isColission() {
    this.player.checkCollitionPlayerBullet();
    this.positiveCollition();
    this.negativeCollition();
    this.randomCollition();
    this.negativeBulletCollition();
    this.deleteRandomBall();
  },

  positiveCollition() {
    if (
      this.player.posX < this.positiveBall.posX + this.positiveBall.width &&
      this.player.posX + this.player.width > this.positiveBall.posX &&
      this.player.posY < this.positiveBall.posY + this.positiveBall.height &&
      !this.positiveBall.collided
    ) {
      this.coinAudio.play();
      this.positiveBall.collided = true;
      this.player.takenCoins += 1;
      this.ballScore += this.positiveBall.points;
    }
  },

  deleteRandomBall() {
    if (this.randomBall !== undefined && this.randomBall.posY > this.height) {
      delete this.randomBall.posY;
      delete this.randomBall.posX;
    }
  },

  randomCollition() {
    if (
      this.randomBall !== undefined &&
      !this.randomBall.collided &&
      this.player.posX < this.randomBall.posX + this.randomBall.width &&
      this.player.posX + this.player.width > this.randomBall.posX &&
      this.player.posY < this.randomBall.posY + this.randomBall.height
    ) {
      this.randomBall.collided = true;

      if (this.player.health < 3) {
        this.player.health += 1;
        this.randomBall.healAudio.play();
      }
    }
  },

  negativeCollition() {
    if (
      this.negativeBalls[0] &&
      this.negativeBalls[0].posY > this.height - this.player.height &&
      !this.negativeBalls[0].reachedBottom
    ) {
      this.negativeBalls[0].reachedBottom = true;
      this.player.health--;
      this.negativeBall.asteroidHit.play();
    }
  },

  isValid(i) {
    return this.player.bullet !== undefined && !this.negativeBalls[i].collided;
  },
  negativeBulletCollition() {
    const bullet = this.player.bullet;
    this.player.bullet &&
      this.negativeBalls.some((ball) => {
        if (
          ball.posX < bullet.posX + bullet.width &&
          ball.posX + ball.width > bullet.posX &&
          ball.posY + ball.height > bullet.posY &&
          ball.posY < bullet.posY + bullet.height
        ) {
          ball.collided = true;
          bullet.collidedNegative = true;
          delete bullet.posY;
          delete bullet.posX;
          this.ballScore += 25;
        }
      });
  },

  /************* EVENTS **************/

  moveBallsRight() {
    if (this.counter % 950 === 0) {
      for (let i = 0; i < this.negativeBalls.length; i++) {
        this.negativeBalls[i].posX += this.columnWidth;
        if (this.negativeBalls[i].posX > this.width) {
          delete this.negativeBalls[i].posX;
          delete this.negativeBalls[i].posY;
        }
      }
    }
  },

  moveBallsLeft() {
    if (this.counter % 950 === 0) {
      for (let i = 0; i < this.negativeBalls.length; i++) {
        this.negativeBalls[i].posX -= this.columnWidth;
        if (this.negativeBalls[i].posX < 0) {
          delete this.negativeBalls[i].posX;
          delete this.negativeBalls[i].posY;
        }
      }
    }
  },

  slowBalls() {
    if (this.player.takenCoins === 10) {
      this.slowAudio.play();
      let counterTwo = this.counter;
      this.negativeBalls.forEach((negative) => {
        negative.velY = 1;
      });
      this.player.takenCoins = 0;
    }
  },

  callEvents() {
    this.slowBalls();
    switch (this.pickRandomEvent()) {
      case 1:
        this.moveBallsRight();
        break;

      case 2:
        this.moveBallsLeft();
        break;
    }
  },

  printLives() {
    this.ctx.fillStyle = "black";
    this.ctx.fillRect(1066.6, 33.3, 383.3, 33.3);
    if (this.player.health === 3) {
      this.ctx.fillStyle = "green";
      this.ctx.fillRect(1070.5, 36.6, 373.3, 26.6);
    } else if (this.player.health === 2) {
      this.ctx.fillStyle = "orange";
      this.ctx.fillRect(1070.5, 36.6, 248.9, 26.6);
    } else if (this.player.health === 1) {
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(1070.5, 36.6, 124.3, 26.6);
    }
    this.ctx.drawImage(this.hpImg, 1033.2, 10, 83.33, 83.33);
  },

  loadAssets() {
    this.coinImage = new Image();
    this.coinImage.src = "img/coin.png";

    this.hpImg = new Image();
    this.hpImg.src = "img/spaceship.png";

    this.explosionImg = new Image();
    this.explosionImg.src = "img/explosionGafas.png";

    this.winImg = new Image();
    this.winImg.src = "img/youwin.png";

    this.gameOverImg = new Image();
    this.gameOverImg.src = "img/gameover.png";

    this.coinAudio = new Audio();
    this.coinAudio.src = "sounds/takecoin.mp3";

    this.slowAudio = new Audio();
    this.slowAudio.src = "sounds/slow.mp3";

    this.gameOverAudio = new Audio();
    this.gameOverAudio.src = "sounds/gameoversound.mp3";

    this.winAudio = new Audio();
    this.winAudio.src = "sounds/win.mp3";
  },

  isGameover() {
    if (this.player.health <= 0) {
      clearInterval(this.interval);
      this.gameOverAudio.play();
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(1454.9, 36.6, 1.6, 26.6);

      this.ctx.drawImage(
        this.explosionImg,
        this.width / 2 - 333.3,
        this.height / 2 - 333.3,
        666.6,
        666.6
      );

      this.ctx.drawImage(
        this.gameOverImg,
        this.width / 2 - 333.3,
        this.height / 2 + 116.6,
        666.6,
        166.6
      );
      this.background.bgMusic.pause();

      let restartButton = document.querySelector(".restart_container_hidden");
      restartButton.classList.add("restart_container");
      restartButton.classList.remove("restart_container_hidden");

      let menuButton = document.querySelector(".menu_container_hidden");
      menuButton.classList.add("menu_container");
      menuButton.classList.remove("menu_container_hidden");
    }
  },

  checkWin() {
    if (this.score >= 5000) {
      this.ctx.fillStyle = "red";
      this.ctx.fillRect(1454.9, 36.6, 1.6, 26.6);
      this.winAudio.play();
      this.background.bgMusic.pause();
      clearInterval(this.interval);

      this.ctx.drawImage(
        this.winImg,
        this.width / 2 - 600,
        this.height / 2 - 250
      );

      let restartButton = document.querySelector(".restart_container_hidden");
      restartButton.classList.add("restart_container");
      restartButton.classList.remove("restart_container_hidden");

      let menuButton = document.querySelector(".menu_container_hidden");
      menuButton.classList.add("menu_container");
      menuButton.classList.remove("menu_container_hidden");
    }
  },
};
