var canvas,
  context;

$(function () {
  canvas = $("#canvas")[0];
  context = canvas.getContext('2d');

  init();
});

function init() {
  var gridWidth = 100,
    gridHeight = 50,
    gridSize = 10;

  GRID.init(gridWidth, gridHeight, gridSize);
  GAME.init();
  GRID.draw();
}

function randomPop() {
  var randomX = Math.floor(Math.random() * GRID.getWidth());
  var randomY = Math.floor(Math.random() * GRID.getHeight());

  GAME.isAlive(randomX, randomY, true);
  GRID.draw();
}

function glider() {
  GAME.isAlive(3, 1, true);
  GAME.isAlive(4, 2, true);
  GAME.isAlive(2, 3, true);
  GAME.isAlive(3, 3, true);
  GAME.isAlive(4, 3, true);
  GRID.draw();
}

function acorn() {
  GAME.isAlive(38, 23, true);
  GAME.isAlive(40, 24, true);
  GAME.isAlive(37, 25, true);
  GAME.isAlive(38, 25, true);
  GAME.isAlive(41, 25, true);
  GAME.isAlive(42, 25, true);
  GAME.isAlive(43, 25, true);
  GRID.draw();
}

var GRID = (function () {
  var width,
    height,
    size;

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

    draw: function () {
      GRID.clearGrid();
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
    },

    clearGrid: function () {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
  }

})();

var GAME = (function () {
  var generation = 0,
    speed = 1,
    isRunning = false,
    intervalId = undefined,
    population,
    activeCells;

  return {
    init: function () {
      var gridWidth = GRID.getWidth();
      var gridHeight = GRID.getHeight();

      population = [];
      activeCells = [];

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
      var width = GRID.getWidth(),
        height = GRID.getHeight();

      // Get
      if (arguments.length < 3) {
        return population[y * width + x];
      }
      // Set
      else {
        population[y * width + x] = status;

        // Add changed cell with its neighbours to active cell list
        for (var i = x - 1; i <= (x + 1); i++) {
          for (var j = y - 1; j <= (y + 1); j++) {
            // Wrap around
            var a = (i + width) % width;
            var b = (j + height) % height;

            // Convert 2D coordinates to 1D
            var index = b * width + a;

            // Only add if not already in active cell
            if (activeCells.indexOf(index) < 0) {
              activeCells.push(index);
            }
          }
        }

        //GRID.draw();
      }
    },

    getActiveCells: function () {
      return activeCells;
    },

    resetActiveCells: function () {
      activeCells = [];
    },

    resetGame: function () {
      GAME.resetActiveCells();
      for (var i = 0; i < GRID.getWidth() * GRID.getHeight(); i++) {
        population[i] = false;
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
        changedCells = [],
        activeCells = GAME.getActiveCells();


      // Track which cells are alive for next generation
      for (var i = 0; i < activeCells.length; i++) {
        var index = activeCells[i];
        var x = index % width;
        var y = Math.floor(index / width);

        var amountOfNeighbours = GAME.livingNeighbours(x, y);

        // If alive
        if (GAME.isAlive(x, y)) {
          // Not under- or overpopulation -> keep alive
          if (amountOfNeighbours == 2 || amountOfNeighbours == 3) {
            changedCells.push(index);
          }
        }
        // If not alive, if it has exactly 3 living neighbours -> alive
        else if (amountOfNeighbours == 3) {
          changedCells.push(index);
        }
      }

      // Clear grid and redraw the living cells.
      GAME.resetGame();
      GRID.clearGrid();

      for (var i = 0; i < changedCells.length; i++) {
        var index = changedCells[i];
        var x = index % width;
        var y = Math.floor(index / width);

        GAME.isAlive(x, y, true);
      }

      GRID.draw();

      generation++;
    },

    livingNeighbours: function (x, y) {
      var amountOfNeighbours = 0,
        width = GRID.getWidth(),
        height = GRID.getHeight();

      for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
          // Check if it is itself
          if (!(i == x && j == y)) {
            // check if it is alive
            if (GAME.isAlive((i + width) % width, (j + height) % height)) {
              amountOfNeighbours++;
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
        intervalId = setInterval(GAME.step, 10);
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