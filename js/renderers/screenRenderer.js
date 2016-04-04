function screenRenderer() {
  this.renderNowCanvas = document.createElement("canvas");
  this.renderNowCanvas.width = 640;
  this.renderNowCanvas.height = 480;
  this.isRenderNow = false;
}

screenRenderer.prototype.render = function (context) {
  this.board = rpgtoolkit.craftyBoard;
  
  // Draw a black background.  
  context.fillStyle = "#000000";
  context.fillRect(0, 0, rpgtoolkit.craftyBoard.width * 32, rpgtoolkit.craftyBoard.height * 32);
  
  if (!this.board.layerCache.length) {
    this.board.generateLayerCache();
  }

  var layer, row, tile, source, data, renderer;

  // Loop through layers.
  for (var i = 0; i < this.board.layerCount; i++) {
    layer = this.board.tiles[i];

    /*
     * Step 1: Render this layer. 
     */
    context.drawImage(this.board.layerCache[i], 0, 0);

    /*
     * Step 2: Render items.
     */
    // TODO: render any items on this layer.

    /*
     * Step 3: Render npcs.
     */
    // TODO: render any npcs on this layer.

    /*
     * Step 4: Render the player above everything on this layer.
     */
    var player = rpgtoolkit.craftyPlayer.player;
    if (player.layer === i && player.renderReady) {
      var frame = Crafty.assets[player.graphics.active.frames[player.graphics.frameIndex]];
      context.drawImage(
              frame,
              rpgtoolkit.craftyPlayer.x - (frame.width / 2),
              rpgtoolkit.craftyPlayer.y - (frame.height / 2),
              player.graphics.active.animationWidth,
              player.graphics.active.animationHeight);

      // Draw player collision rectangle.
      context.beginPath();
      context.lineWidth="2";
      context.strokeStyle="#FFFFFF";
      context.rect(
              rpgtoolkit.craftyPlayer.x - 20,
              rpgtoolkit.craftyPlayer.y + 10,
              player.graphics.active.boundingBox.width,
              player.graphics.active.boundingBox.height);
      context.stroke();
    }
  }

  /*
   * Step 5: (Optional) Render Vectors.
   */
  this.board.vectors.forEach(function (vector) {
    var haveMoved = false;
    context.strokeStyle = "#FFFFFF";
    context.lineWidth = 2.0;
    context.beginPath();
    vector.points.forEach(function (point) {
      if (!haveMoved) {
        context.moveTo(point.x, point.y);
        haveMoved = true;
      } else {
        context.lineTo(point.x, point.y);
      }
    }, this);
    context.closePath();
    context.stroke();
  }, this);

  /*
   * Step 6: (Optional) Render Programs.
   */
  this.board.programs.forEach(function (program) {
    var haveMoved = false;
    context.strokeStyle = "#FFFF00";
    context.lineWidth = 2.0;
    context.beginPath();
    program.points.forEach(function (point) {
      if (!haveMoved) {
        context.moveTo(point.x, point.y);
        haveMoved = true;
      } else {
        context.lineTo(point.x, point.y);
      }
    }, this);
    context.closePath();
    context.stroke();
  }, this);
  
  /*
   * Step 7: renderNowCanvas
   */
  if (this.isRenderNow) {
    var x = rpgtoolkit.craftyPlayer.x - Crafty.viewport.x;
    var y = rpgtoolkit.craftyPlayer.y - Crafty.viewport.y;
    context.drawImage(this.renderNowCanvas, x, y);
  }
};