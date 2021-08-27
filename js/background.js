class Background {
  constructor(ctx, w, h) {
    this.ctx = ctx;
    this.width = w;
    this.height = h;
    this.image = new Image();
    this.image2 = new Image();
    this.image.src = "img/bgbg.jpg";
    this.image2.src = "img/bgbg.jpg";
    this.posX = 0;
    this.posY = 0;
    this.imageVelY = 1;

    this.bgMusic = new Audio();
    this.bgMusic.src = "sounds/ingame.mp3";
  }

  draw() {
    this.ctx.drawImage(
      this.image,
      this.posX,
      this.posY,
      this.width,
      this.height
    );

    this.posY += this.imageVelY;

    // if (this.posY >= this.height) {
    //   console.log("object");
    //   this.posY = 0 - this.height;
    // }
  }

  drawLoop() {
    this.ctx.drawImage(
      this.image2,
      this.posX,
      this.posY - this.height,
      this.width,
      this.height
    );
    this.posY += this.imageVelY;

    if (this.posY >= this.height) {
      this.posY = 0;
    }
  }
}
