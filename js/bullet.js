class Bullet {
  constructor(ctx, playerX, playerH, gameH) {
    this.ctx = ctx;
    this.posX = playerX + 26.6;
    this.posY = gameH - playerH - 33.3;
    this.width = 13.3;
    this.height = 50;
    this.speedY = 25;
    this.radius = 4;

    this.collidedPlayer = false;
    this.collidedNegative = false;

    this.laser = new Image();
    this.laser.src = "img/pixellaser.png";
  }

  draw() {
    this.ctx.drawImage(
      this.laser,
      this.posX,
      this.posY,
      this.width,
      this.height
    );
    this.move();
  }
  move() {
    this.posY -= this.speedY;
    if (this.posY < 33.3) {
      this.speedY *= -1;
    }
  }
}
