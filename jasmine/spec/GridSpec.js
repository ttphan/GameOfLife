describe("Grid", function () {
  var gridWidth = 10,
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
    GRID.draw();
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
    var pos_1_x = 1,
      pos_1_y = 2,
      pos_2_x = 7,
      pos_2_y = 3;

    expect(GAME.isAlive(pos_1_x, pos_1_y)).toBe(false);
    expect(GAME.isAlive(pos_2_x, pos_2_y)).toBe(false);

    GAME.isAlive(pos_1_x, pos_1_y, true);

    expect(GAME.isAlive(pos_1_x, pos_1_y)).toBe(true);
    expect(GAME.isAlive(pos_2_x, pos_2_y)).toBe(false);

    GAME.isAlive(pos_2_x, pos_2_y, true);

    expect(GAME.isAlive(pos_1_x, pos_1_y)).toBe(true);
    expect(GAME.isAlive(pos_2_x, pos_2_y)).toBe(true);

    GAME.isAlive(pos_1_x, pos_1_y, false);

    expect(GAME.isAlive(pos_1_x, pos_1_y)).toBe(false);
    expect(GAME.isAlive(pos_2_x, pos_2_y)).toBe(true);
  });

});