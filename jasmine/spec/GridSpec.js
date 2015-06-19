describe("Grid", function () {
  var gridWidth,
    gridHeight,
    gridSize,
    gridPopulation;

  beforeEach(function () {
    gridWidth = 10;
    gridHeight = 5;
    gridSize = 50;

    GRID.init(gridWidth, gridHeight, gridSize);

    gridPopulation = GRID.getPopulation();
  })

  afterEach(function () {
    GRID.init(gridWidth, gridHeight, gridSize);
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
        if (gridPopulation[i][j]) {
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

    expect(gridPopulation[pos_1_x][pos_1_y]).toBe(false);
    expect(gridPopulation[pos_2_x][pos_2_y]).toBe(false);

    GRID.setPopulation(pos_1_x, pos_1_y, true);

    expect(gridPopulation[pos_1_x][pos_1_y]).toBe(true);
    expect(gridPopulation[pos_2_x][pos_2_y]).toBe(false);

    GRID.setPopulation(pos_2_x, pos_2_y, true);

    expect(gridPopulation[pos_1_x][pos_1_y]).toBe(true);
    expect(gridPopulation[pos_2_x][pos_2_y]).toBe(true);

    GRID.setPopulation(pos_1_x, pos_1_y, false);

    expect(gridPopulation[pos_1_x][pos_1_y]).toBe(false);
    expect(gridPopulation[pos_2_x][pos_2_y]).toBe(true);
  });

});