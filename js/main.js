$(function () {
  var canvas = $("#canvas")[0],
    context = canvas.getContext('2d'),
    gridWidth = 200,
    gridHeight = 100,
    gridSize = 5;

  GRID.init(gridWidth, gridHeight, gridSize);
});

function randomPop() {
  var randomX = Math.floor(Math.random() * GRID.getWidth());
  var randomY = Math.floor(Math.random() * GRID.getHeight());

  GRID.cellPopulation(randomX, randomY, true);
}

function glider() {
  // GRID.cellPopulation(12, 8, true);
  // GRID.cellPopulation(13, 9, true);
  // GRID.cellPopulation(11, 10, true);
  // GRID.cellPopulation(12, 10, true);
  // GRID.cellPopulation(13, 10, true);

  GRID.cellPopulation(12, 8, true);
  GRID.cellPopulation(11, 7, true);
  GRID.cellPopulation(11, 6, true);
  GRID.cellPopulation(12, 6, true);
  GRID.cellPopulation(13, 6, true);
}

function acorn() {
  GRID.cellPopulation(18, 8, true);
  GRID.cellPopulation(20, 9, true);
  GRID.cellPopulation(17, 10, true);
  GRID.cellPopulation(18, 10, true);
  GRID.cellPopulation(21, 10, true);
  GRID.cellPopulation(22, 10, true);
  GRID.cellPopulation(23, 10, true);
}

function draw() {
  var canvas = $("#canvas")[0],
    context = canvas.getContext('2d'),
    gridPopulation = GRID.gridPopulation(),
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
    gridPopulation = [],
    wrapAround = true;

  return {
    init: function (gridWidth, gridHeight, gridSize) {
      width = gridWidth;
      height = gridHeight;
      size = gridSize
      gridPopulation = [];

      for (var x = 0; x < width; x++) {
        gridPopulation[x] = [];
        for (var y = 0; y < height; y++) {
          gridPopulation[x][y] = false;
        }
      }

      draw();
    },

    gridPopulation: function (grid) {
      // Get
      if (arguments.length < 1) {
        return gridPopulation;
      }
      // Set
      else {
        // Deep copy
        gridPopulation = grid;
        width = gridPopulation.length;
        height = gridPopulation[0].length;

        draw();
      }
    },

    cellPopulation: function (x, y, status) {
      // Get
      if (arguments.length < 3) {
        return gridPopulation[x][y];
      }
      // Set
      else {
        gridPopulation[x][y] = status;
        draw();
      }
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
    }
  }

})();

var GAME = (function () {
  var generation = 0,
    speed = 1,
    isRunning = false,
    intervalId = undefined;

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
      var population = GRID.gridPopulation(),
        width = GRID.getWidth(),
        height = GRID.getHeight(),
        newGrid = [];

      for (var x = 0; x < width; x++) {
        newGrid[x] = [];
        for (var y = 0; y < height; y++) {
          newGrid[x][y] = true;
          amountOfNeighbours = GAME.livingNeighbours(x, y);

          // If alive
          if (population[x][y]) {
            // Under- or overpopulation -> dead
            if (amountOfNeighbours < 2 || amountOfNeighbours > 3) {
              newGrid[x][y] = false;
            }
          }
          // If not alive, if it has exactly 3 living neighbours -> alive
          else if (amountOfNeighbours != 3) {
            newGrid[x][y] = false;
          }
        }
      }

      GRID.gridPopulation(newGrid);
      generation++;
    },

    livingNeighbours: function (x, y) {
      var amountOfNeighbours = 0,
        population = GRID.gridPopulation(),
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
              if (population[a][b]) {
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