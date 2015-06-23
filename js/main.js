var ALIVE = 4,
  DEAD = 0,
  SPEED = 32,
  DEFAULT_GRID_WIDTH = 100,
  DEFAULT_GRID_HEIGHT = 50,
  DEFAULT_CELL_SIZE = 10,
  canvas,
  context;

$(function () {
  init();

  addListeners();
});

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

function addListeners() {
  var mouseDown = false,
    gridCanvas = $("#gridOverlay"),
    x,
    y;

  gridCanvas.mousedown(function (event) {
    x = Math.floor((event.pageX - gridCanvas.offset().left) / GRID.getCellSize());
    y = Math.floor((event.pageY - gridCanvas.offset().top) / GRID.getCellSize());

    mouseDown = true;
    if (x < GRID.getWidth() && y < GRID.getHeight()) {
      if (GAME.cellStatus(x, y) !== ALIVE) {
        GAME.cellStatus(x, y, ALIVE);
      } else {
        GAME.cellStatus(x, y, DEAD);
      }

      GRID.drawCell(x, y);
    }
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
        if (x < GRID.getWidth() && y < GRID.getHeight()) {
          if (GAME.cellStatus(x, y) !== ALIVE) {
            GAME.cellStatus(x, y, ALIVE);
          } else {
            GAME.cellStatus(x, y, DEAD);
          }

          GRID.drawCell(x, y);
        }
      }
    }
  });

  $("#menu-toggle").click(function (e) {
    e.preventDefault();
    $("#wrapper").toggleClass("toggled");
    $("#menu-toggle").toggleClass("toggled");
    $("#menu-toggle-icon").toggleClass("glyphicon glyphicon-menu-right glyphicon glyphicon-menu-left")
  });
}

function init(width, height, size) {
  canvas = $("#mainCanvas")[0];
  context = canvas.getContext('2d');

  if (arguments.length < 3) {
    GRID.init(DEFAULT_GRID_WIDTH, DEFAULT_GRID_HEIGHT, DEFAULT_CELL_SIZE);
  } else {
    GRID.init(width, height, size);
  }
  GAME.init();
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

function gliderGun() {
  var center_x = Math.floor(GRID.getWidth() / 2),
    center_y = Math.floor(GRID.getHeight() / 2);

  GAME.cellStatus(center_x + 6, center_y - 4, ALIVE);
  GAME.cellStatus(center_x + 4, center_y - 3, ALIVE);
  GAME.cellStatus(center_x + 6, center_y - 3, ALIVE);
  GAME.cellStatus(center_x - 5, center_y - 2, ALIVE);
  GAME.cellStatus(center_x + 3, center_y - 2, ALIVE);
  GAME.cellStatus(center_x + 5, center_y - 2, ALIVE);
  GAME.cellStatus(center_x + 17, center_y - 2, ALIVE);
  GAME.cellStatus(center_x + 18, center_y - 2, ALIVE);
  GAME.cellStatus(center_x - 6, center_y - 1, ALIVE);
  GAME.cellStatus(center_x - 5, center_y - 1, ALIVE);
  GAME.cellStatus(center_x + 2, center_y - 1, ALIVE);
  GAME.cellStatus(center_x + 5, center_y - 1, ALIVE);
  GAME.cellStatus(center_x + 17, center_y - 1, ALIVE);
  GAME.cellStatus(center_x + 18, center_y - 1, ALIVE);
  GAME.cellStatus(center_x - 17, center_y, ALIVE);
  GAME.cellStatus(center_x - 16, center_y, ALIVE);
  GAME.cellStatus(center_x - 7, center_y, ALIVE);
  GAME.cellStatus(center_x - 6, center_y, ALIVE);
  GAME.cellStatus(center_x - 1, center_y, ALIVE);
  GAME.cellStatus(center_x, center_y, ALIVE);
  GAME.cellStatus(center_x + 3, center_y, ALIVE);
  GAME.cellStatus(center_x + 5, center_y, ALIVE);
  GAME.cellStatus(center_x - 17, center_y + 1, ALIVE);
  GAME.cellStatus(center_x - 16, center_y + 1, ALIVE);
  GAME.cellStatus(center_x - 8, center_y + 1, ALIVE);
  GAME.cellStatus(center_x - 7, center_y + 1, ALIVE);
  GAME.cellStatus(center_x - 6, center_y + 1, ALIVE);
  GAME.cellStatus(center_x - 1, center_y + 1, ALIVE);
  GAME.cellStatus(center_x, center_y + 1, ALIVE);
  GAME.cellStatus(center_x + 4, center_y + 1, ALIVE);
  GAME.cellStatus(center_x + 6, center_y + 1, ALIVE);
  GAME.cellStatus(center_x - 7, center_y + 2, ALIVE);
  GAME.cellStatus(center_x - 6, center_y + 2, ALIVE);
  GAME.cellStatus(center_x - 1, center_y + 2, ALIVE);
  GAME.cellStatus(center_x, center_y + 2, ALIVE);
  GAME.cellStatus(center_x + 6, center_y + 2, ALIVE);
  GAME.cellStatus(center_x - 6, center_y + 3, ALIVE);
  GAME.cellStatus(center_x - 5, center_y + 3, ALIVE);
  GAME.cellStatus(center_x - 5, center_y + 4, ALIVE);
  GRID.draw();
}

function randomize() {
  var width = GRID.getWidth(),
    height = GRID.getHeight(),
    threshold = 0.75;

  restart();

  for (var x = 0; x < width; x++) {
    for (var y = 0; y < height; y++) {
      if (Math.random() > threshold) {
        GAME.cellStatus(x, y, ALIVE);
      }
    }
  }

  GRID.draw();
}

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
      context.clearRect(0, 0, canvas.width, canvas.height);

      for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
          GRID.drawCell(x, y);
        }
      }
    },

    drawCell: function (x, y) {
      var status = GAME.cellStatus(x, y);
      if (status > DEAD) {
        context.beginPath();
        context.rect(x * cellSize, y * cellSize, cellSize, cellSize);
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
        context.closePath();
      }
    }
  };
})();

var GAME = (function () {
  var generation,
    speed = 1,
    isRunning = false,
    intervalId,
    population,
    activeCells,
    cellsAlive;

  return {
    init: function () {
      population = [];
      activeCells = [];
      generation = 0,
      cellsAlive = 0;

      for (var i = 0; i < GRID.getWidth() * GRID.getHeight(); i++) {
        population[i] = DEAD;
      }
    },

    population: function () {
      return population;
    },

    cellStatus: function (x, y, status) {
      var width = GRID.getWidth(),
        height = GRID.getHeight(),
        percentage;

      // Get
      if (arguments.length < 3) {
        return population[y * width + x];
      }
      // Set
      else {
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
        cellsToLive = [],
        activeCells = GAME.getActiveCells(),
        index,
        x,
        y;

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
        if (GAME.cellStatus(x, y) === 3) {
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

        GAME.cellStatus(x, y, ALIVE);
      }

      GRID.draw();

      generation++;
      $("#generationLabel").text("Generation: " + generation);
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
        intervalId = setInterval(GAME.step, SPEED / Math.pow(2, GAME.currentSpeed()));
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