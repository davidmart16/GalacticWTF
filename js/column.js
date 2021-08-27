class Column {
  constructor(ctx, x, gameW, gameH) {
    this.ctx = ctx;
    this.columnX = x;
    this.columnY = 0;
    this.columnWidth = gameW / 5;
    this.columnHeight = gameH;
  }

  draw() {
    //this.ctx.drawImage(this.image, this.posX, this.posY, this.width, this.height)

    this.ctx.fillStyle = "blue";
    this.ctx.lineWidth = 1.6;
    this.ctx.strokeRect(
      this.columnX,
      this.columnY,
      this.columnWidth,
      this.columnHeight
    );
    //  console.log(this.columnX, this.columnY,this.columnWidth, this.columnHeight)
  }
}
