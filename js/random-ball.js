class RandomBall {
  constructor(ctx, column, velY) {
    this.ctx = ctx;
    // this.size = 35
    this.posY = 0;
    this.posX = column - 25;
    this.velY = velY * 1.5;
    this.points = 33.3;
    this.width = 66;
    this.height = 66;
    this.collided = false;

    this.healthImg = new Image();
    this.healthImg.src = "img/oneupimg.png";

    this.healAudio = new Audio();
    this.healAudio.src = "sounds/healsound.mp3";
  }

  draw() {
    this.ctx.drawImage(
      this.healthImg,
      this.posX,
      this.posY,
      this.width,
      this.height
    );
    this.move();
  }

  move() {
    this.posY += this.velY;
  }
}
