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

  GRID.setCellPopulation(randomX, randomY, true);
}

function glider() {
  GRID.setCellPopulation(2, 1, true);
  GRID.setCellPopulation(3, 2, true);
  GRID.setCellPopulation(1, 3, true);
  GRID.setCellPopulation(2, 3, true);
  GRID.setCellPopulation(3, 3, true);
}

function draw() {
  var canvas = $("#canvas")[0],
    context = canvas.getContext('2d'),
    gridPopulation = GRID.getGridPopulation(),
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

    getGridPopulation: function () {
      return gridPopulation;
    },

    setGridPopulation: function (grid) {
      // Deep copy
      gridPopulation = $.extend(true, [], grid);
      width = gridPopulation.length;
      height = gridPopulation[0].length;

      draw();
    },

    getCellPopulation: function (x, y) {
      return gridPopulation[x][y];
    },

    setCellPopulation: function (x, y, status) {
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
      var population = GRID.getGridPopulation(),
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

      GRID.setGridPopulation(newGrid);
      generation++;
    },

    livingNeighbours: function (x, y) {
      var amountOfNeighbours = 0,
        population = GRID.getGridPopulation();

      for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
          // Check if it is a legal spot
          if (i >= 0 && j >= 0 && i < GRID.getWidth() && j <= GRID.getHeight()) {
            // Check if it is itself
            if (!(i == x && j == y)) {
              // check if it is alive;
              if (population[i][j]) {
                amountOfNeighbours++;
              }
            }
          }
        }
      }

      return amountOfNeighbours;
    }
  }
})();