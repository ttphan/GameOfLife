describe("Grid", function () {
  var gridWidth = 5,
    gridHeight = 5,
    gridSize = 10;

  beforeEach(function () {
    $("#canvas").remove();
    $("body").prepend($("<canvas></canvas>")
      .prop({
        id: "canvas",
        width: 200,
        height: 100
      })
    );

    GRID.init(gridWidth, gridHeight, gridSize);
    GAME.init();
  })

  afterEach(function () {
    $("#canvas").remove();
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
        if (GAME.isAlive(i, j)) {
          isEmpty = false;
        }
      }
    }

    expect(isEmpty).toBe(true);
  });

  it("should be able to change the population", function () {
    expect(GAME.isAlive(1, 2)).toBe(false);
    expect(GAME.isAlive(4, 3)).toBe(false);

    GAME.isAlive(1, 2, true);

    expect(GAME.isAlive(1, 2)).toBe(true);
    expect(GAME.isAlive(4, 3)).toBe(false);

    GAME.isAlive(4, 3, true);

    expect(GAME.isAlive(1, 2)).toBe(true);
    expect(GAME.isAlive(4, 3)).toBe(true);

    GAME.isAlive(1, 2, false);

    expect(GAME.isAlive(1, 2)).toBe(false);
    expect(GAME.isAlive(4, 3)).toBe(true);
  });

});