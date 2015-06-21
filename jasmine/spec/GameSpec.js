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
    GAME.step();
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
    GAME.cellStatus(1, 1, 4);
    GAME.cellStatus(2, 1, 4);

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
    GAME.cellStatus(0, 0, 4);
    GAME.resetActiveCells();
    var activeCells = GAME.getActiveCells();

    expect(activeCells).not.toEqual(jasmine.arrayContaining[0]);
  })

  describe("when populated", function () {
    beforeEach(function () {
      /*
      	Before Step
    			X X - - X
    			X X - - -
    			X - - - -
    			- - - X -
    			X - - - -

    		After Step
    			- - - - X
    			- - - - -
    			X X - - X
    			- - - - X
    			X X - - -
    	*/

      GAME.cellStatus(0, 0, 4);
      GAME.cellStatus(0, 1, 4);
      GAME.cellStatus(0, 2, 4);
      GAME.cellStatus(0, 4, 4);

      GAME.cellStatus(1, 0, 4);
      GAME.cellStatus(1, 1, 4);

      GAME.cellStatus(3, 3, 4);

      GAME.cellStatus(4, 0, 4);
    });

    it("should be able to return the amount of neighbours around a cell", function () {
      expect(GAME.livingNeighbours(0, 0)).toBe(5);
      expect(GAME.livingNeighbours(0, 2)).toBe(2);
      expect(GAME.livingNeighbours(3, 3)).toBe(0);

      expect(GAME.livingNeighbours(1, 1)).toBe(4);
    });

    it("should let underpopulated cells die", function () {
      GAME.step();
      expect(GAME.cellStatus(3, 3)).toEqual(3);
    });

    it("should let overpopulated cells die", function () {
      GAME.step();
      expect(GAME.cellStatus(0, 0)).toEqual(3);
      expect(GAME.cellStatus(0, 1)).toEqual(3);

      expect(GAME.cellStatus(1, 0)).toEqual(3);
      expect(GAME.cellStatus(1, 1)).toEqual(3);
    });

    it("should keep cells with 2 or 3 neighbours alive", function () {
      GAME.step();
      expect(GAME.cellStatus(0, 2)).toEqual(4);
      expect(GAME.cellStatus(0, 4)).toEqual(4);

      expect(GAME.cellStatus(4, 0)).toEqual(4);
    });

    it("should revive dead cells with exactly 3 neighbours", function () {
      GAME.step();
      expect(GAME.cellStatus(1, 2)).toEqual(4);
      expect(GAME.cellStatus(1, 4)).toEqual(4);

      expect(GAME.cellStatus(4, 2)).toEqual(4);
      expect(GAME.cellStatus(4, 3)).toEqual(4);
    });

    it("should leave dead cells dead in all other cases", function () {
      GAME.step();
      expect(GAME.cellStatus(0, 3)).toEqual(0);

      expect(GAME.cellStatus(1, 3)).toEqual(0);

      expect(GAME.cellStatus(2, 0)).toEqual(0);
      expect(GAME.cellStatus(2, 1)).toEqual(0);
      expect(GAME.cellStatus(2, 2)).toEqual(0);
      expect(GAME.cellStatus(2, 3)).toEqual(0);
      expect(GAME.cellStatus(2, 4)).toEqual(0);

      expect(GAME.cellStatus(3, 0)).toEqual(0);
      expect(GAME.cellStatus(3, 1)).toEqual(0);
      expect(GAME.cellStatus(3, 2)).toEqual(0);
      expect(GAME.cellStatus(3, 4)).toEqual(0);

      expect(GAME.cellStatus(4, 1)).toEqual(0);
      expect(GAME.cellStatus(4, 4)).toEqual(0);
    });

  });




});