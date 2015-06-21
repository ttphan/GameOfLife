describe("Grid", function () {
  var gridWidth = 5,
    gridHeight = 5,
    gridSize = 10;

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

    GRID.init(gridWidth, gridHeight, gridSize);
    GAME.init();
  })

  afterEach(function () {
    $("#mainCanvas").remove();
    $("#gridOverlay").remove();
  })

  it("should be initialized correctly", function () {
    expect(GRID.getWidth()).toEqual(gridWidth);
    expect(GRID.getHeight()).toEqual(gridHeight);
    expect(GRID.getSize()).toEqual(gridSize);
  });

  it("should contain an empty population upon creation", function () {
    var isEmpty = true;

    for (var i = 0; i < GRID.getWidth(); i++) {
      for (var j = 0; j < GRID.getHeight(); j++) {
        if (GAME.cellStatus(i, j) > 0) {
          isEmpty = false;
        }
      }
    }

    expect(isEmpty).toBe(true);
  });

  it("should be able to change the population", function () {
    expect(GAME.cellStatus(1, 2)).toBe(0);
    expect(GAME.cellStatus(4, 3)).toBe(0);

    GAME.cellStatus(1, 2, 4);

    expect(GAME.cellStatus(1, 2)).toBe(4);
    expect(GAME.cellStatus(4, 3)).toBe(0);

    GAME.cellStatus(4, 3, 4);

    expect(GAME.cellStatus(1, 2)).toBe(4);
    expect(GAME.cellStatus(4, 3)).toBe(4);

    GAME.cellStatus(1, 2, 0);

    expect(GAME.cellStatus(1, 2)).toBe(0);
    expect(GAME.cellStatus(4, 3)).toBe(4);
  });

});