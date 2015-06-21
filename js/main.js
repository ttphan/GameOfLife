var ALIVE = 4,
  DEAD = 0,
  SPEED = 32;

$(function () {
  var DEFAULT_GRID_WIDTH = 100,
    DEFAULT_GRID_HEIGHT = 50,
    DEFAULT_CELL_SIZE = 10;

  init(DEFAULT_GRID_WIDTH, DEFAULT_GRID_HEIGHT, DEFAULT_CELL_SIZE);

  addMouseListeners();
});

function addMouseListeners() {
  var mouseDown = false,
    gridCanvas = $("#gridOverlay"),
    x,
    y;

  gridCanvas.mousedown(function (event) {
    x = Math.floor((event.pageX - gridCanvas.offset().left) / GRID.getCellSize());
    y = Math.floor((event.pageY - gridCanvas.offset().top) / GRID.getCellSize());

    mouseDown = true;

    if (GAME.cellStatus(x, y) !== ALIVE) {
      GAME.cellStatus(x, y, ALIVE);
    } else {
      GAME.cellStatus(x, y, DEAD);
    }

    GRID.draw();
  });

  $(document).mouseup(function () {
    mouseDown = false;
  });

  gridCanvas.mousemove(function (event) {
    if (mouseDown) {
      var new_x = Math.floor((event.pageX - gridCanvas.offset().left) / GRID.getCellSize()),
        new_y = Math.floor((event.pageY - gridCanvas.offset().top) / GRID.getCellSize());

      if (new_x !== x || new_y !== y) {
        x = new_x;
        y = new_y;

        if (GAME.cellStatus(x, y) !== ALIVE) {
          GAME.cellStatus(x, y, ALIVE);
        } else {
          GAME.cellStatus(x, y, DEAD);
        }

        GRID.draw();
      }
    }
  });
}

function init(width, height, size) {
  GRID.init(width, height, size);
  GAME.init();
  GRID.draw();
}

function randomPop() {
  var randomX = Math.floor(Math.random() * GRID.getWidth()),
    randomY = Math.floor(Math.random() * GRID.getHeight());

  GAME.cellStatus(randomX, randomY, ALIVE);
  GRID.draw();
}

function glider() {
  var center_x = Math.floor(GRID.getWidth() / 2),
    center_y = Math.floor(GRID.getHeight() / 2);

  GAME.cellStatus(center_x, center_y - 1, ALIVE);
  GAME.cellStatus(center_x + 1, center_y, ALIVE);
  GAME.cellStatus(center_x - 1, center_y + 1, ALIVE);
  GAME.cellStatus(center_x, center_y + 1, ALIVE);
  GAME.cellStatus(center_x + 1, center_y + 1, ALIVE);
  GRID.draw();
}

function acorn() {
  var center_x = Math.floor(GRID.getWidth() / 2),
    center_y = Math.floor(GRID.getHeight() / 2);

  GAME.cellStatus(center_x - 2, center_y - 1, ALIVE);
  GAME.cellStatus(center_x, center_y, ALIVE);
  GAME.cellStatus(center_x - 3, center_y + 1, ALIVE);
  GAME.cellStatus(center_x - 2, center_y + 1, ALIVE);
  GAME.cellStatus(center_x + 1, center_y + 1, ALIVE);
  GAME.cellStatus(center_x + 2, center_y + 1, ALIVE);
  GAME.cellStatus(center_x - 1 + ALIVE, center_y + 1, ALIVE);
  GRID.draw();
}

function changeGridSize() {
  var size = $('#sizeSelection').val().split("x");
  GAME.stop();
  init(parseInt(size[0]), parseInt(size[1]), parseInt(size[2]));
}

function selectSpeed() {
  var speed = parseInt($('#speedSelection').val());
  GAME.setSpeed(speed);
}

function selectGridStyle() {
  var style = parseInt($('#gridSelection').val());
  GRID.setGridStyle(style);
}


function selectTrailSize() {
  var trailSize = parseInt($('#trailSelection').val());
  GRID.setTrailSize(trailSize);
}

var GRID = (function () {
  var width,
    height,
    cellSize,
    gridStyle = 2,
    trailSize = 3;

  return {
    init: function (gridWidth, gridHeight, size) {
      var gridCanvas = $("#gridOverlay")[0],
        gridContext = gridCanvas.getContext('2d'),
        color;

      gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

      width = gridWidth;
      height = gridHeight;
      cellSize = size;

      if (gridStyle > 0) {
        color = "#000000";
        if (gridStyle === 1) {
          color = "#e5e5e5";
        }
        for (var x = 0; x < width; x++) {
          for (var y = 0; y < height; y++) {
            gridContext.beginPath();
            gridContext.strokeStyle = color;
            gridContext.rect(x * cellSize, y * cellSize, cellSize, cellSize);
            gridContext.stroke();
            gridContext.closePath();
          }
        }
      }
    },

    getWidth: function () {
      return width;
    },

    getHeight: function () {
      return height;
    },

    getCellSize: function () {
      return cellSize;
    },

    setGridStyle: function (style) {
      gridStyle = style;
      GRID.init(width, height, cellSize);
    },

    setTrailSize: function (size) {
      trailSize = size;
      GRID.draw();
    },

    draw: function () {
      var canvas = $("#mainCanvas")[0],
        context = canvas.getContext('2d');

      context.clearRect(0, 0, canvas.width, canvas.height);

      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          var status = GAME.cellStatus(x, y);

          context.beginPath();
          context.rect(x * cellSize, y * cellSize, cellSize, cellSize);

          if (status > DEAD) {
            if (status === ALIVE) {
              context.fillStyle = "red";
            } else if (status === 3) {
              context.fillStyle = "orange";
            } else if (status === 2) {
              context.fillStyle = "yellow";
            } else {
              context.fillStyle = "#666666";
            }

            if (status >= ALIVE - trailSize) {
              context.fill();
            }
          }

          context.closePath();
        }
      }
    }
  };

})();

var GAME = (function () {
  var generation = 0,
    speed = 1,
    isRunning = false,
    intervalId,
    population,
    activeCells;

  return {
    init: function () {
      var gridWidth = GRID.getWidth(),
        gridHeight = GRID.getHeight();

      population = [];
      activeCells = [];

      for (var i = 0; i < gridWidth * gridHeight; i++) {
        population[i] = DEAD;
      }
    },

    population: function () {
      return population;
    },

    cellStatus: function (x, y, status) {
      var width = GRID.getWidth(),
        height = GRID.getHeight();

      // Get
      if (arguments.length < 3) {
        return population[y * width + x];
      }
      // Set
      else {
        population[y * width + x] = status;

        if (status === ALIVE) {
          // Add changed cell with its neighbours to active cell list
          for (var i = x - 1; i <= (x + 1); i++) {
            for (var j = y - 1; j <= (y + 1); j++) {
              // Wrap around
              var a = (i + width) % width,
                b = (j + height) % height,
                // Convert 2D coordinates to 1D
                index = b * width + a;

              // Only add if not already in active cell
              if (activeCells.indexOf(index) < 0) {
                activeCells.push(index);
              }
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

    currentGeneration: function () {
      return generation;
    },

    currentSpeed: function () {
      return speed;
    },

    setSpeed: function (newSpeed) {
      if (newSpeed >= 0 && newSpeed <= 3) {
        speed = newSpeed;
      } else {
        speed = 1;
      }

      if (isRunning) {
        clearInterval(intervalId);
        intervalId = setInterval(GAME.step, SPEED / Math.pow(2, GAME.currentSpeed()));
      }
    },

    step: function () {
      var width = GRID.getWidth(),
        height = GRID.getHeight(),
        livingCells = [],
        activeCells = GAME.getActiveCells(),
        index,
        x,
        y;

      for (var i = 0; i < width * height; i++) {
        if (population[i] !== DEAD) {
          population[i] = population[i] - 1;
        }
      }

      // Track which cells are alive for next generation
      for (var j = 0; j < activeCells.length; j++) {
        index = activeCells[j];
        x = index % width;
        y = Math.floor(index / width);

        var amountOfNeighbours = GAME.livingNeighbours(x, y);

        // If alive
        if (GAME.cellStatus(x, y) === 3) {
          // Not under- or overpopulation -> keep alive
          if (amountOfNeighbours === 2 || amountOfNeighbours === 3) {
            livingCells.push(index);
          }
        }
        // If not alive, if it has exactly 3 living neighbours -> alive
        else if (amountOfNeighbours === 3) {
          livingCells.push(index);
        }
      }

      // Clear grid and redraw the living cells.
      GAME.resetActiveCells();

      for (var k = 0; k < livingCells.length; k++) {
        index = livingCells[k];
        x = index % width;
        y = Math.floor(index / width);

        GAME.cellStatus(x, y, ALIVE);
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
          if (!(i === x && j === y)) {
            // check if it is alive
            if (GAME.cellStatus((i + width) % width, (j + height) % height) >= 3) {
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
        intervalId = setInterval(GAME.step, SPEED / Math.pow(2, GAME.currentSpeed()));
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
  };
})();