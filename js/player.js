class Player {
  constructor(ctx, gameW, gameH, keys, speed) {
    this.ctx = ctx;
    this.gameWidth = gameW;
    this.gameHeight = gameH;

    this.width = 66.6;
    this.height = 66.6;

    this.health = 3;
    this.healedFive = false;
    this.healedSeven = false;
    this.healedNine = false;

    this.takenCoins = 0;

    this.laser = new Audio();
    this.laser.src = "sounds/shootedit.mp3";

    this.image = new Image();
    this.image.src = "img/spaceship.png";

    this.posX = this.gameWidth / 2 - this.width / 2;
    this.posY = this.gameHeight - 6.6 - this.height;

    this.velX = speed; //modificar respecto a las columnas (this.gameWidth/5)

    /* en set dimensions declarar la vel que es igual aal ancho de la pantalla /5, que es lo mismo que la width de las columnas
     */
    this.moveLimit = 0;
    this.keys = keys;

    this.bullets = [];
    this.bullet = undefined;

    this.setListeners();
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      this.posX,
      this.posY,
      this.width,
      this.height
    );

    this.bullets.forEach((bullet) => bullet.draw());
    // this.clearBullets();
  }

  setListeners() {
    document.onkeydown = (e) => {
      // console.log(e);
      switch (e.key) {
        case this.keys.moveLeft:
        case this.keys.moveLeftOpt:
        case this.keys.moveLeftMayus:
          this.moveLeft();
          break;
        case this.keys.moveRight:
        case this.keys.moveRightOpt:
        case this.keys.moveRightMayus:
          this.moveRight();
          break;
        case this.keys.shoot:
        case this.keys.shootOpt:
          this.shoot();
          break;
      }
    };
  }

  setListenersReverse() {
    document.onkeydown = (e) => {
      // console.log(e);
      switch (e.key) {
        case this.keys.moveLeft:
        case this.keys.moveLeftOpt:
          this.moveRight();
          break;
        case this.keys.moveRight:
        case this.keys.moveRightOpt:
          this.moveLeft();
          break;
        case this.keys.shoot:
        case this.keys.shootOpt:
          this.shoot();
          break;
      }
    };
  }

  moveLeft() {
    if (!(this.moveLimit < -2)) {
      this.moveLimit--;
      this.posX -= this.velX;
    }

    if (this.moveLimit === -3) {
      this.posX += this.gameWidth;
      this.moveLimit = 2;
    }
  }

  moveRight() {
    if (!(this.moveLimit > 2)) {
      this.moveLimit++;
      this.posX += this.velX;
    }
    if (this.moveLimit === 3) {
      this.posX -= this.gameWidth;
      this.moveLimit = -2;
    }
  }

  shoot() {
    if (this.bullets.length < 1) {
      this.bullets.push(
        (this.bullet = new Bullet(
          this.ctx,
          this.posX,
          this.height,
          this.gameHeight
        ))
      );
    }
    this.laser.currentTime = 0;
    this.laser.play();
  }

  // ARREGLAR COLISION DE BALA ARRIBA - PREGUNTAR A GUILLE O TEO
  clearBullets() {
    this.bullets = this.bullets.filter(
      (bullets) => bullets.collidedNegative === false
    );
    this.bullets = this.bullets.filter(
      (bull) => bull.posY > -16.6 && bull.posY <= this.gameHeight
    );
  }

  checkCollitionPlayerBullet() {
    if (
      this.bullet !== undefined &&
      !this.bullet.collidedPlayer &&
      this.posY < this.bullet.posY + this.bullet.height &&
      this.posY + this.height > this.bullet.posY &&
      this.posX < this.bullet.posX + this.bullet.width &&
      this.posX + this.width > this.bullet.posX
    ) {
      this.health -= 1;
      this.bullet.collidedPlayer = true;
      this.bullets = this.bullets.filter((bull) => bull.posY < this.posY);
    }
  }
}
