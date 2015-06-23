var ALIVE = 4,
  DEAD = 0,
  SPEED_CONSTANT = 32,
  DEFAULT_GRID_WIDTH = 100,
  DEFAULT_GRID_HEIGHT = 50,
  DEFAULT_CELL_SIZE = 10,
  canvas,
  context,
  GRID_COLOR = {
    1: "#e5e5e5",
    2: "#b2b2b2",
    3: "#000000"
  },
  CELL_COLOR = {
    1: "#666666",
    2: "yellow",
    3: "orange",
    4: "red"
  };

$(function () {
  init();

  addListeners();
});

/**
 * @restart
 *
 * Restarts the grid with the given grid options if given,
 * else use previous grid options
 */
function restart(gridWidth, gridHeight, cellSize) {
  var width,
    height,
    size;

  if (arguments.length === 3) {
    width = gridWidth;
    height = gridHeight;
    size = cellSize;
  } else {
    width = GRID.getWidth();
    height = GRID.getHeight();
    size = GRID.getCellSize();
  }

  GAME.stop();
  $("#generationLabel").text("Generation: 0");
  $("#cellsAliveLabel").text("Cells alive: 0 (0.00%)");
  init(width, height, size);
}

/**
 * @addListeners
 *
 * Event listeners
 */
function addListeners() {
  var mouseDown = false,
    gridCanvas = $("#gridOverlay"),
    x, y;


  gridCanvas.mousedown(function (event) {
    x = Math.floor((event.pageX - gridCanvas.offset().left) / GRID.getCellSize());
    y = Math.floor((event.pageY - gridCanvas.offset().top) / GRID.getCellSize());

    mouseDown = true;

    // Ensure the only fire if the cursor is not-of-bounds, useful for the 25x12 board
    if (x < GRID.getWidth() && y < GRID.getHeight()) {
      if (GAME.getCellStatus(x, y) !== ALIVE) {
        GAME.setCellStatus(x, y, ALIVE);
      } else {
        GAME.setCellStatus(x, y, DEAD);
      }

      GRID.drawCell(x, y, true);
    }
  });

  $(document).mouseup(function () {
    mouseDown = false;
  });

  gridCanvas.mousemove(function (event) {
    if (mouseDown) {
      var new_x = Math.floor((event.pageX - gridCanvas.offset().left) / GRID.getCellSize()),
        new_y = Math.floor((event.pageY - gridCanvas.offset().top) / GRID.getCellSize());

      // Only fire if the mouse moves to a new cell while held down
      if (new_x !== x || new_y !== y) {
        x = new_x;
        y = new_y;
        if (x < GRID.getWidth() && y < GRID.getHeight()) {
          if (GAME.getCellStatus(x, y) !== ALIVE) {
            GAME.setCellStatus(x, y, ALIVE);
          } else {
            GAME.setCellStatus(x, y, DEAD);
          }

          GRID.drawCell(x, y, true);
        }
      }
    }
  });

  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    $("#menu-toggle").toggleClass("toggled");
    $("#menu-toggle-icon").toggleClass("glyphicon glyphicon-menu-right glyphicon glyphicon-menu-left");
  });

  $("#sizeSelection").change(function () {
    var size = $(this).val().split("x");
    restart(parseInt(size[0]), parseInt(size[1]), parseInt(size[2]));
  });

  $("#speedSelection").change(function () {
    var speed = parseInt($(this).val());
    GAME.setSpeed(speed);
  });

  $("#gridSelection").change(function () {
    var style = parseInt($(this).val());
    GRID.setGridStyle(style);
  });

  $("#trailSelection").change(function () {
    var trailSize = parseInt($(this).val());
    GRID.setTrailSize(trailSize);
  });

  $("#stepButton").click(function () {
    GAME.stop();
    GAME.nextGeneration();
  });

  $("#runButton").click(function () {
    GAME.toggleRun();
  });
}

/**
 * @init
 *
 * Initializes the game with given grid options if given,
 * else initialize with default values.
 */
function init(width, height, size) {
  canvas = $("#mainCanvas")[0];
  context = canvas.getContext('2d');

  if (arguments.length === 3) {
    GRID.init(width, height, size);
  } else {
    GRID.init(DEFAULT_GRID_WIDTH, DEFAULT_GRID_HEIGHT, DEFAULT_CELL_SIZE);
  }
  GAME.init();
  GRID.draw();
}

/**
 * @glider
 *
 * Constructs glider in the center of the grid
 */
function glider() {
  buildPattern([[0, -1], [1, 0], [-1, 1], [0, 1], [1, 1]]);
}

/**
 * @acorn
 *
 * Constructs acorn in the center of the grid
 */
function acorn() {
  buildPattern([[-2, -1], [0, 0], [-3, 1], [-2, 1], [1, 1], [2, 1], [3, 1]]);
}

/**
 * @gliderGun
 *
 * Constructs acorn in the center of the grid
 */
function gliderGun() {
  buildPattern([[6, -4], [4, -3], [6, -3], [-5, -2], [3, -2], [5, -2], [17, -2],
    [18, -2], [-6, -1], [-5, -1], [2, -1], [5, -1], [17, -1], [18, -1], [-17, 0],
    [-16, 0], [-7, 0], [-6, 0], [-1, 0], [0, 0], [3, 0], [5, 0], [-17, 1], [-16, 1],
    [-8, 1], [-7, 1], [-6, 1], [-1, 1], [0, 1], [4, 1], [6, 1], [-7, 2], [-6, 2],
    [-1, 2], [0, 2], [6, 2], [-6, 3], [-5, 3], [-5, 4]]);
}

/**
 * @buildPattern
 *
 * Build a pattern based on the positions given, positions are relative to
 * the center of the grid.
 */
function buildPattern(positions) {
  var position,
    center_x = Math.floor(GRID.getWidth() / 2),
    center_y = Math.floor(GRID.getHeight() / 2);

  while (positions.length) {
    position = positions.pop();
    GAME.setCellStatus(center_x + position[0], center_y + position[1], ALIVE);
  }

  GRID.draw();
}

/**
 * @randomize
 *
 * Resets the board and fills board randomly.
 */
function randomize() {
  var width = GRID.getWidth(),
    height = GRID.getHeight(),

    // ~25% of the board lives
    threshold = 0.25;

  restart();

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      if (Math.random() < threshold) {
        GAME.setCellStatus(x, y, ALIVE);
      }
    }
  }

  GRID.draw();
}

<<<<<<< HEAD
function changeGridSize() {
  var size = $('#sizeSelection').val().split("x");
  restart(parseInt(size[0]), parseInt(size[1]), parseInt(size[2]));
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

=======
/**
 * @GRID
 *
 * Grid module, handles the logic and visual aspects of the board.
 *
 * width: amount of cells in the x-axis
 * height: amount of cells in the y-axis
 * cellSize: size of the cells
 * gridStyle[0..3]: Grid style, 0: no grid, 1: partial, 2: light, 3: full
 * trailSize[0..3]: Amount of trailing, 3 means cells died up to 3 generations ago will be shown, 0 means no trail.
 */
>>>>>>> master
var GRID = (function () {
  var width,
    height,
    cellSize,
    gridStyle = 3,
    trailSize = 3;

  return {
    /**
     * @GRID.init
     *
     * Initializes the grid with given properties, (re)draws the grid.
     */
    init: function (gridWidth, gridHeight, size) {
      var gridCanvas = $("#gridOverlay")[0],
        gridContext = gridCanvas.getContext('2d'),
        color;

      gridContext.clearRect(0, 0, gridCanvas.width, gridCanvas.height);

      width = gridWidth;
      height = gridHeight;
      cellSize = size;

      if (gridStyle > 0) {
        gridContext.strokeStyle = GRID_COLOR[gridStyle];
        for (var x = 0; x < width; x++) {
          for (var y = 0; y < height; y++) {
            gridContext.beginPath();
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

    /**
     * @GRID.draw
     *
     * Draws the entire grid population.
     */
    draw: function () {
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          GRID.drawCell(x, y);
        }
      }
    },

    /**
     * @GRID.drawCell
     *
     * Draws specific cell at (x, y), if function is called as a
     * result from a mouse event, swap cell from ALIVE to DEAD or
     * vice versa.
     */
    drawCell: function (x, y, clicked) {
      var status = GAME.getCellStatus(x, y);

      if (status > DEAD) {
        context.beginPath();

        context.rect(x * cellSize, y * cellSize, cellSize, cellSize);
        context.fillStyle = CELL_COLOR[status];

        // Draw only if trailSize is set sufficiently large.
        if (status >= ALIVE - trailSize) {
          context.fill();
        }

        context.closePath();

      }
      // If cell status is DEAD as a result from a mouse event, clear it
      else if (clicked) {
        context.clearRect(x * cellSize, y * cellSize, cellSize, cellSize);
      }
    }
  };
})();

/**
 * @GAME
 *
 * Game module, controls the game logic and keeps track of the population status
 *
 * generation: current generation number
 * speed[1..4]: current speed variable, final speed is caculated as (SPEED_CONSTANT / 2^speed)ms per generation
 * isRunning: true if the simulation is running, false otherwise
 * intervalId: id of the interval function, used to start/stop the simulation
 * population: current population status per cell, 4 means ALIVE, 0 means DEAD (absolute states), 3/2/1 means it died 1/2/3 generations ago
 * activeCells: list of active cells. Cell is considered active if either itself or one of its neighbours changed absolute states
 * cellsAlive: current number of cells alive
 */
var GAME = (function () {
  var generation,
    speed = 1,
    isRunning = false,
    intervalId,
    population,
    activeCells,
    cellsAlive;

  return {
    /**
     * @GAME.init
     *
     * Initializes the game
     */
    init: function () {
      population = [];
      activeCells = [];
      generation = 0;
      cellsAlive = 0;

      for (var i = 0; i < GRID.getWidth() * GRID.getHeight(); i++) {
        population[i] = DEAD;
      }
    },

    getCellStatus: function (x, y) {
      return population[y * GRID.getWidth() + x];
    },

    setCellStatus: function (x, y, status) {
      var width = GRID.getWidth(),
        height = GRID.getHeight(),
        percentage;

      // Only raise cell count if cell wasn't alive already
      if (status === ALIVE && population[y * width + x] !== ALIVE) {
        cellsAlive++;
      }

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
      } else if (status === DEAD) {
        cellsAlive--;
      }

      percentage = ((cellsAlive / (width * height)) * 100).toFixed(2);
      $("#cellsAliveLabel").text("Cells alive: " + cellsAlive + " (" + percentage + "%)");

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
        intervalId = setInterval(GAME.nextGeneration, SPEED_CONSTANT / Math.pow(2, GAME.currentSpeed()));
      }
    },

    /**
     * @nextGeneration
     *
     * Steps the game to the next generation.
     */
    nextGeneration: function () {
      var width = GRID.getWidth(),
        height = GRID.getHeight(),
        cellsToLive = [],
        activeCells = GAME.getActiveCells(),
        index,
        x, y;

      // If cell just died, decrease amount of cells alive, decrease the status of all
      // cells by 1 for grid trailing purposes
      for (var i = 0; i < width * height; i++) {
        if (population[i] !== DEAD) {
          if (population[i] === ALIVE) {
            cellsAlive--;
          }
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
        if (GAME.getCellStatus(x, y) === 3) {
          // Not under- or overpopulation -> keep alive
          if (amountOfNeighbours === 2 || amountOfNeighbours === 3) {
            cellsToLive.push(index);
          }
        }
        // If not alive, if it has exactly 3 living neighbours -> alive
        else if (amountOfNeighbours === 3) {
          cellsToLive.push(index);
        }
      }

      // Clear grid and redraw the living cells.
      GAME.resetActiveCells();

      for (var k = 0; k < cellsToLive.length; k++) {
        index = cellsToLive[k];
        x = index % width;
        y = Math.floor(index / width);

        GAME.setCellStatus(x, y, ALIVE);
      }

      GRID.draw();

      generation++;
      $("#generationLabel").text("Generation: " + generation);
    },

    /**
     * @livingNeighbours
     *
     * Returns the amount of living neighbours around a given cell position
     */
    livingNeighbours: function (x, y) {
      var amountOfNeighbours = 0,
        width = GRID.getWidth(),
        height = GRID.getHeight();

      for (var i = x - 1; i <= x + 1; i++) {
        for (var j = y - 1; j <= y + 1; j++) {
          // Check if it is itself
          if (!(i === x && j === y)) {
            // check if it is alive
            if (GAME.getCellStatus((i + width) % width, (j + height) % height) >= 3) {
              amountOfNeighbours++;
              // More neighbour checking is useless
              if (amountOfNeighbours > 3) {
                return amountOfNeighbours;
              }
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
          .removeClass("running");
        clearInterval(intervalId);
      } else {
        button.text("Stop")
          .addClass("running");
        intervalId = setInterval(GAME.nextGeneration, SPEED_CONSTANT / Math.pow(2, GAME.currentSpeed()));
      }

      isRunning = !isRunning;
    },

    stop: function () {
      $("#runButton").text("Start")
        .removeClass("running");
      clearInterval(intervalId);
      isRunning = false;
    }
  };
})();