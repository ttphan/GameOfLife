describe("Game", function () {
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

    GRID.init(5, 5, 10);
    GAME.init();
  });

  afterEach(function () {
    $("#mainCanvas").remove();
    $("#gridOverlay").remove();
  })

  it("should be able to return its current generation count", function () {
    expect(GAME.currentGeneration()).toEqual(0);
  });

  it("should be able to progress to the next generation", function () {
    GAME.nextGeneration();
    expect(GAME.currentGeneration()).toEqual(1);
  });

  it("should be able to return its current speed", function () {
    expect(GAME.currentSpeed()).toEqual(1);
  });

  it("should be able to change its speed", function () {
    GAME.setSpeed(2);
    expect(GAME.currentSpeed()).toEqual(2);

    GAME.setSpeed(-1);
    expect(GAME.currentSpeed()).toEqual(1);

    GAME.setSpeed(77);
    expect(GAME.currentSpeed()).toEqual(1);
  });


  it("should be able to keep a list of active cells", function () {
    GAME.setCellStatus(1, 1, ALIVE);
    GAME.setCellStatus(2, 1, ALIVE);

    var actualActiveCells = GAME.getActiveCells();

    var activeCells =
      [
       0, 1, 2, 3,
       5, 6, 7, 8,
       10, 11, 12, 13
      ];

    expect(actualActiveCells).toEqual(jasmine.arrayContaining(activeCells));
    expect(actualActiveCells).not.toEqual(jasmine.arrayContaining([4]));
  });

  it("should be able to reset the list of active cells", function () {
    GAME.setCellStatus(0, 0, ALIVE);
    GAME.resetActiveCells();
    var activeCells = GAME.getActiveCells();

    expect(activeCells).not.toEqual(jasmine.arrayContaining[0]);
  });

  it("should be able to create a glider in the center", function () {
    /*
      - - - - -
      - - X - -
      - - - X -
      - X X X -
      - - - - -
    */

    glider();

    expect(GAME.getCellStatus(2, 1)).toBe(ALIVE);
    expect(GAME.getCellStatus(3, 2)).toBe(ALIVE);
    expect(GAME.getCellStatus(1, 3)).toBe(ALIVE);
    expect(GAME.getCellStatus(2, 3)).toBe(ALIVE);
    expect(GAME.getCellStatus(3, 3)).toBe(ALIVE);
  });

  it("should be able to create an acorn in the center", function () {
    /*
      - - - - - - - - - -
      - - - X - - - - - -
      - - - - - X - - - -
      - - X X - - X X X -
      - - - - - - - - - -
    */

    GRID.init(10, 5, 10);
    GAME.init();

    acorn();

    expect(GAME.getCellStatus(3, 1)).toBe(ALIVE);
    expect(GAME.getCellStatus(5, 2)).toBe(ALIVE);
    expect(GAME.getCellStatus(2, 3)).toBe(ALIVE);
    expect(GAME.getCellStatus(3, 3)).toBe(ALIVE);
    expect(GAME.getCellStatus(6, 3)).toBe(ALIVE);
    expect(GAME.getCellStatus(7, 3)).toBe(ALIVE);
    expect(GAME.getCellStatus(8, 3)).toBe(ALIVE);
  });

  describe("when populated", function () {
    beforeEach(function () {
      /*
      Before step
    			X X - - X
    			X X - - -
    			X - - - -
    			- - - X -
    			X - - - -

    		After step
    			- - - - X
    			- - - - -
    			X X - - X
    			- - - - X
    			X X - - -
    	*/

      GAME.setCellStatus(0, 0, ALIVE);
      GAME.setCellStatus(0, 1, ALIVE);
      GAME.setCellStatus(0, 2, ALIVE);
      GAME.setCellStatus(0, 4, ALIVE);

      GAME.setCellStatus(1, 0, ALIVE);
      GAME.setCellStatus(1, 1, ALIVE);

      GAME.setCellStatus(3, 3, ALIVE);

      GAME.setCellStatus(4, 0, ALIVE);
    });

    it("should be able to return the amount of neighbours around a cell", function () {
      // Outcome is the same for more than 4 living neighbours, so is returned prematurely.
      expect(GAME.livingNeighbours(0, 0)).toBe(4);
      expect(GAME.livingNeighbours(0, 2)).toBe(2);
      expect(GAME.livingNeighbours(3, 3)).toBe(0);

      expect(GAME.livingNeighbours(1, 1)).toBe(4);
    });

    it("should let underpopulated cells die", function () {
      GAME.nextGeneration();
      expect(GAME.getCellStatus(3, 3)).toEqual(3);
    });

    it("should let overpopulated cells die", function () {
      GAME.nextGeneration();
      expect(GAME.getCellStatus(0, 0)).toEqual(3);
      expect(GAME.getCellStatus(0, 1)).toEqual(3);

      expect(GAME.getCellStatus(1, 0)).toEqual(3);
      expect(GAME.getCellStatus(1, 1)).toEqual(3);
    });

    it("should keep cells with 2 or 3 neighbours alive", function () {
      GAME.nextGeneration();
      expect(GAME.getCellStatus(0, 2)).toEqual(ALIVE);
      expect(GAME.getCellStatus(0, 4)).toEqual(ALIVE);

      expect(GAME.getCellStatus(4, 0)).toEqual(ALIVE);
    });

    it("should revive dead cells with exactly 3 neighbours", function () {
      GAME.nextGeneration();
      expect(GAME.getCellStatus(1, 2)).toEqual(ALIVE);
      expect(GAME.getCellStatus(1, 4)).toEqual(ALIVE);

      expect(GAME.getCellStatus(4, 2)).toEqual(ALIVE);
      expect(GAME.getCellStatus(4, 3)).toEqual(ALIVE);
    });

    it("should leave dead cells dead in all other cases", function () {
      GAME.nextGeneration();
      expect(GAME.getCellStatus(0, 3)).toEqual(DEAD);

      expect(GAME.getCellStatus(1, 3)).toEqual(DEAD);

      expect(GAME.getCellStatus(2, 0)).toEqual(DEAD);
      expect(GAME.getCellStatus(2, 1)).toEqual(DEAD);
      expect(GAME.getCellStatus(2, 2)).toEqual(DEAD);
      expect(GAME.getCellStatus(2, 3)).toEqual(DEAD);
      expect(GAME.getCellStatus(2, 4)).toEqual(DEAD);

      expect(GAME.getCellStatus(3, 0)).toEqual(DEAD);
      expect(GAME.getCellStatus(3, 1)).toEqual(DEAD);
      expect(GAME.getCellStatus(3, 2)).toEqual(DEAD);
      expect(GAME.getCellStatus(3, 4)).toEqual(DEAD);

      expect(GAME.getCellStatus(4, 1)).toEqual(DEAD);
      expect(GAME.getCellStatus(4, 4)).toEqual(DEAD);
    });

  });




});