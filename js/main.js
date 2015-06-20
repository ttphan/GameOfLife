var canvas,
  context;

$(function () {
  var gridWidth = 100,
    gridHeight = 50,
    gridSize = 10;

  canvas = $("#canvas")[0];
  context = canvas.getContext('2d');

  init(gridWidth, gridHeight, gridSize);
});

function init(width, height, size) {
  GRID.init(width, height, size);
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
  var center_x = Math.floor(GRID.getWidth() / 2);
  var center_y = Math.floor(GRID.getHeight() / 2);

  GAME.isAlive(center_x, center_y - 1, true);
  GAME.isAlive(center_x + 1, center_y, true);
  GAME.isAlive(center_x - 1, center_y + 1, true);
  GAME.isAlive(center_x, center_y + 1, true);
  GAME.isAlive(center_x + 1, center_y + 1, true);
  GRID.draw();
}

function acorn() {
  var center_x = Math.floor(GRID.getWidth() / 2);
  var center_y = Math.floor(GRID.getHeight() / 2);

  GAME.isAlive(center_x - 1, center_y - 1, true);
  GAME.isAlive(center_x + 1, center_y, true);
  GAME.isAlive(center_x - 2, center_y + 1, true);
  GAME.isAlive(center_x - 1, center_y + 1, true);
  GAME.isAlive(center_x + 2, center_y + 1, true);
  GAME.isAlive(center_x + 3, center_y + 1, true);
  GAME.isAlive(center_x + 4, center_y + 1, true);
  GRID.draw();
}

function changeGridSize() {
  var size = $('#sizeSelection').val().split("x");

  GAME.stop();
  GRID.init(parseInt(size[0]), parseInt(size[1]), parseInt(size[2]));
  GAME.init();
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
      var button = $("#runButton");

      if (isRunning) {
        button.text("Start")
          .removeClass("btn-danger")
          .addClass("btn-success");
        clearInterval(intervalId);
      } else {
        button.text("Stop")
          .removeClass("btn-success")
          .addClass("btn-danger");
        intervalId = setInterval(GAME.step, 10);
      }

      isRunning = !isRunning;
    },

    stop: function () {
      $("#runButton").text("Start")
        .removeClass("btn-danger")
        .addClass("btn-success");

      clearInterval(intervalId);
      isRunning = false;
    }
  }
})();