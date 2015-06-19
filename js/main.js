$(function () {
  var canvas = $("#canvas")[0],
    context = canvas.getContext('2d'),
    gridWidth = 40,
    gridHeight = 20,
    gridSize = 10;

  GRID.init(gridWidth, gridHeight, gridSize);
});

function randomPop() {
  var randomX = Math.floor(Math.random() * GRID.getWidth());
  var randomY = Math.floor(Math.random() * GRID.getHeight());

  GRID.setPopulation(randomX, randomY, true);
}

function draw() {
  var canvas = $("#canvas")[0],
    context = canvas.getContext('2d'),
    gridPopulation = GRID.getPopulation(),
    width = GRID.getWidth(),
    height = GRID.getHeight(),
    size = GRID.getSize();

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.fillStyle = "red";

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      context.beginPath();

      context.rect(x * size, y * size, size, size);
      context.stroke();

      if (gridPopulation[x][y]) {
        context.fill();
      }

      context.closePath();
    }
  }
}

var GRID = (function () {
  var width,
    height,
    size,
    gridPopulation = [];

  return {
    init: function (gridWidth, gridHeight, gridSize) {
      width = gridWidth;
      height = gridHeight;
      size = gridSize;

      for (var x = 0; x < width; x++) {
        gridPopulation[x] = [];
        for (var y = 0; y < height; y++) {
          gridPopulation[x][y] = false;
        }
      }

      draw();
    },

    getPopulation: function () {
      return gridPopulation;
    },

    setPopulation: function (x, y, status) {
      gridPopulation[x][y] = status;
      draw();
    },

    getWidth: function () {
      return width;
    },

    getHeight: function () {
      return height;
    },

    getSize: function () {
      return size;
    }
  }

})();

var GAME = (function () {
  var generation = 0,
    speed = 1;

  return {
    currentGeneration: function () {
      return generation;
    },

    currentSpeed: function () {
      return speed;
    },

    setSpeed: function (newSpeed) {
      if (newSpeed > 0 && newSpeed < 4) {
        speed = newSpeed;
      } else {
        speed = 1;
      }
    },

    step: function () {
      generation++;
    }
  }
})();