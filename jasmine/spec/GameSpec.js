describe("Game", function () {
  var speed;

  beforeEach(function () {
    $("#canvas").remove();
    $("body").prepend($("<canvas></canvas>")
      .prop({
        id: "canvas",
        width: 200,
        height: 100
      })
    );

    GRID.init(5, 5, 10);
    GAME.init();
  });

  afterEach(function () {
    $("#canvas").remove();
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
    GAME.isAlive(1, 1, true);
    GAME.isAlive(2, 1, true);

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
    GAME.isAlive(0, 0, true);
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

      GAME.isAlive(0, 0, true);
      GAME.isAlive(0, 1, true);
      GAME.isAlive(0, 2, true);
      GAME.isAlive(0, 4, true);

      GAME.isAlive(1, 0, true);
      GAME.isAlive(1, 1, true);

      GAME.isAlive(3, 3, true);

      GAME.isAlive(4, 0, true);
    });

    it("should be able to return the amount of neighbours around a cell", function () {
      expect(GAME.livingNeighbours(0, 0)).toBe(5);
      expect(GAME.livingNeighbours(0, 2)).toBe(2);
      expect(GAME.livingNeighbours(3, 3)).toBe(0);

      expect(GAME.livingNeighbours(1, 1)).toBe(4);
    });

    it("should let underpopulated cells die", function () {
      GAME.step();
      expect(GAME.isAlive(3, 3)).toEqual(false);
    });

    it("should let overpopulated cells die", function () {
      GAME.step();
      expect(GAME.isAlive(0, 0)).toEqual(false);
      expect(GAME.isAlive(0, 1)).toEqual(false);

      expect(GAME.isAlive(1, 0)).toEqual(false);
      expect(GAME.isAlive(1, 1)).toEqual(false);
    });

    it("should keep cells with 2 or 3 neighbours alive", function () {
      GAME.step();
      expect(GAME.isAlive(0, 2)).toEqual(true);
      expect(GAME.isAlive(0, 4)).toEqual(true);

      expect(GAME.isAlive(4, 0)).toEqual(true);
    });

    it("should revive dead cells with exactly 3 neighbours", function () {
      GAME.step();
      expect(GAME.isAlive(1, 2)).toEqual(true);
      expect(GAME.isAlive(1, 4)).toEqual(true);

      expect(GAME.isAlive(4, 2)).toEqual(true);
      expect(GAME.isAlive(4, 3)).toEqual(true);
    });

    it("should leave dead cells dead in all other cases", function () {
      GAME.step();
      expect(GAME.isAlive(0, 3)).toEqual(false);

      expect(GAME.isAlive(1, 3)).toEqual(false);

      expect(GAME.isAlive(2, 0)).toEqual(false);
      expect(GAME.isAlive(2, 1)).toEqual(false);
      expect(GAME.isAlive(2, 2)).toEqual(false);
      expect(GAME.isAlive(2, 3)).toEqual(false);
      expect(GAME.isAlive(2, 4)).toEqual(false);

      expect(GAME.isAlive(3, 0)).toEqual(false);
      expect(GAME.isAlive(3, 1)).toEqual(false);
      expect(GAME.isAlive(3, 2)).toEqual(false);
      expect(GAME.isAlive(3, 4)).toEqual(false);

      expect(GAME.isAlive(4, 1)).toEqual(false);
      expect(GAME.isAlive(4, 4)).toEqual(false);
    });

  });




});