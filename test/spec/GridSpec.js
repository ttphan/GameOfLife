describe("Grid", function () {
  var gridWidth = 5,
    gridHeight = 5,
    cellSize = 10;

  beforeEach(function () {
    $("#mainCanvas").remove();
    $("#gridOverlay").remove();

    $("body").prepend($("<canvas></canvas>")
      .prop({
        id: "mainCanvas",
        width: 200,
        height: 100
      })
    );
    $("body").prepend($("<canvas></canvas>")
      .prop({
        id: "gridOverlay",
        width: 200,
        height: 100
      })
    );

    GRID.init(gridWidth, gridHeight, cellSize);
    GAME.init();
  })

  afterEach(function () {
    $("#mainCanvas").remove();
    $("#gridOverlay").remove();
  })

  it("should be initialized correctly", function () {
    expect(GRID.getWidth()).toEqual(gridWidth);
    expect(GRID.getHeight()).toEqual(gridHeight);
    expect(GRID.getCellSize()).toEqual(cellSize);
  });

  it("should contain an empty population upon creation", function () {
    var isEmpty = true;

    for (var i = 0; i < GRID.getWidth(); i++) {
      for (var j = 0; j < GRID.getHeight(); j++) {
        if (GAME.getCellStatus(i, j) > 0) {
          isEmpty = false;
        }
      }
    }

    expect(isEmpty).toBe(true);
  });

  it("should be able to change the population", function () {
    expect(GAME.getCellStatus(1, 2)).toBe(DEAD);
    expect(GAME.getCellStatus(4, 3)).toBe(DEAD);

    GAME.setCellStatus(1, 2, ALIVE);

    expect(GAME.getCellStatus(1, 2)).toBe(ALIVE);
    expect(GAME.getCellStatus(4, 3)).toBe(DEAD);

    GAME.setCellStatus(4, 3, ALIVE);

    expect(GAME.getCellStatus(1, 2)).toBe(ALIVE);
    expect(GAME.getCellStatus(4, 3)).toBe(ALIVE);

    GAME.setCellStatus(1, 2, DEAD);

    expect(GAME.getCellStatus(1, 2)).toBe(DEAD);
    expect(GAME.getCellStatus(4, 3)).toBe(ALIVE);
  });

});