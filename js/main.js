$(function () {
  init();
});

function init() {
  gridWidth = 200,
  gridHeight = 100,
  gridSize = 5;

  GRID.init(gridWidth, gridHeight, gridSize);
  GAME.init();
  GRID.draw();
}

function randomPop() {
  var randomX = Math.floor(Math.random() * GRID.getWidth());
  var randomY = Math.floor(Math.random() * GRID.getHeight());

  GAME.isAlive(randomX, randomY, true);
}

function glider() {
  GAME.isAlive(12, 8, true);
  GAME.isAlive(11, 7, true);
  GAME.isAlive(11, 6, true);
  GAME.isAlive(12, 6, true);
  GAME.isAlive(13, 6, true);
}

function acorn() {
  GAME.isAlive(18, 8, true);
  GAME.isAlive(20, 9, true);
  GAME.isAlive(17, 10, true);
  GAME.isAlive(18, 10, true);
  GAME.isAlive(21, 10, true);
  GAME.isAlive(22, 10, true);
  GAME.isAlive(23, 10, true);
}

var GRID = (function () {
  var width,
    height,
    size,
    wrapAround = false;

  return {
    init: function (gridWidth, gridHeight, gridSize) {
      width = gridWidth;
      height = gridHeight;
      size = gridSize
    },

    getWidth: function () {
      return width;
    },

    getHeight: function () {
      return height;
    },

    getSize: function () {
      return size;
    },

    wrapAround: function (bool) {
      // Get
      if (arguments.length < 1) {
        return wrapAround;
      }
      // Set
      else {
        wrapAround = bool;
      }
    },

    draw: function () {
      var canvas = $("#canvas")[0],
        context = canvas.getContext('2d');

      context.clearRect(0, 0, canvas.width, canvas.height);
      context.fillStyle = "red";

      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          context.beginPath();

          context.rect(x * size, y * size, size, size);
          context.stroke();
          if (GAME.isAlive(x, y)) {
            context.fill();
          }

          context.closePath();
        }
      }
    }
  }

})();

var GAME = (function () {
  var generation = 0,
    speed = 1,
    isRunning = false,
    intervalId = undefined,
    population;

  return {
    init: function () {
      var gridWidth = GRID.getWidth();
      var gridHeight = GRID.getHeight();

      population = new Array(gridWidth * gridHeight);

      for (var i = 0; i < gridWidth * gridHeight; i++) {
        population[i] = false;
      }
    },

    population: function (grid) {
      // Get
      if (arguments.length < 1) {
        return population;
      }
      // Set
      else {
        // Deep copy
        population = grid;

        GRID.draw();
      }
    },

    isAlive: function (x, y, status) {
      // Get
      if (arguments.length < 3) {
        return population[y * GRID.getWidth() + x];
      }
      // Set
      else {
        population[y * GRID.getWidth() + x] = status;
        GRID.draw();
      }
    },

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
      var width = GRID.getWidth(),
        height = GRID.getHeight(),
        newGrid = [];

      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          newGrid[y * width + x] = true;
          amountOfNeighbours = GAME.livingNeighbours(x, y);

          // If alive
          if (GAME.isAlive(x, y)) {
            // Under- or overpopulation -> dead
            if (amountOfNeighbours < 2 || amountOfNeighbours > 3) {
              newGrid[y * width + x] = false;
            }
          }
          // If not alive, if it has exactly 3 living neighbours -> alive
          else if (amountOfNeighbours != 3) {
            newGrid[y * width + x] = false;
          }
        }
      }

      GAME.population(newGrid);
      generation++;
    },

    livingNeighbours: function (x, y) {
      var amountOfNeighbours = 0,
        population = GAME.population(),
        width = GRID.getWidth(),
        height = GRID.getHeight();

      for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
          // Check if it is a legal spot (unless wrap around, then skip test)
          if (GRID.wrapAround() || (i >= 0 && j >= 0 && i < width && j <= GRID.getHeight())) {
            // Check if it is itself
            if (!(i == x && j == y)) {
              // Take into account wrap around cells if applicable
              var a = i,
                b = j;
              if (GRID.wrapAround()) {
                a = (i + width) % width;
                b = (j + height) % height;
              }

              // check if it is alive
              if (GAME.isAlive(x, y)) {
                amountOfNeighbours++;
              }
            }
          }
        }
      }

      return amountOfNeighbours;
    },

    toggleRun: function () {
      if (isRunning) {
        clearInterval(intervalId);
      } else {
        intervalId = setInterval(GAME.step, 100);
      }

      isRunning = !isRunning;
    },

    clickStep: function () {
      if (isRunning) {
        clearInterval(intervalId);
        isRunning = false;
      }

      GAME.step();
    }
  }
})();