class PositiveBall {
  constructor(ctx, column, velY) {
    this.ctx = ctx;
    // this.size = 35
    this.posY = 0;
    this.posX = column - 25;
    this.velY = velY * 1.5;
    this.points = 200;
    this.width = 49.9;
    this.height = 49.9;
    this.collided = false;

    this.image = new Image();
    this.image.src = "img/coinframes.png";

    this.image.frames = 4;
    this.image.framesIndex = 0;
  }

  draw(framesCounter) {
    this.turn(framesCounter);
    // this.ctx.drawImage(
    //   this.coinImg,
    //   this.posX,
    //   this.posY,
    //   this.width,
    //   this.height
    // );
    this.move();
  }

  move() {
    this.posY += this.velY;
  }

  turn(framesCounter) {
    this.ctx.drawImage(
      this.image,
      this.image.framesIndex * Math.floor(this.image.width / this.image.frames),
      0,
      Math.floor(this.image.width / this.image.frames),
      this.image.height,
      this.posX,
      this.posY,
      this.width,
      this.height
    );

    this.animateSprite(framesCounter);
  }

  animateSprite(framesCounter) {
    if (framesCounter % 4 === 0) {
      this.image.framesIndex++;
    }

    if (this.image.framesIndex >= this.image.frames) {
      this.image.framesIndex = 0;
    }
  }
}

// METER BONUS - BOLAS CON EFECTOS POSITIVOS
