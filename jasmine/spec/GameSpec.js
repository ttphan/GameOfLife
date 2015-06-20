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

    GRID.init(5, 5, 5);
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

  describe("when populated", function () {
    beforeEach(function () {
      /*
      	Before Step
    			X X - - -
    			X X - - -
    			X - - - -
    			- - - - X
    			- - - - X

    		After Step
    			X X - - -
    			- - - - -
    			X X - - -
    			- - - - -
    			- - - - -
    	*/

      GRID.cellPopulation(0, 0, true);
      GRID.cellPopulation(0, 1, true);
      GRID.cellPopulation(0, 2, true);
      GRID.cellPopulation(1, 0, true);
      GRID.cellPopulation(1, 1, true);
      GRID.cellPopulation(3, 4, true);
      GRID.cellPopulation(4, 4, true);
    });

    it("should be able to return the amount of neighbours around a cell", function () {
      // Boundary check
      expect(GAME.livingNeighbours(0, 0)).toBe(3);
      expect(GAME.livingNeighbours(0, 2)).toBe(2);
      expect(GAME.livingNeighbours(4, 4)).toBe(1);

      expect(GAME.livingNeighbours(1, 1)).toBe(4);
    });

    it("should let underpopulated cells die", function () {
      GAME.step();
      expect(GRID.cellPopulation(3, 4)).toEqual(false);
      expect(GRID.cellPopulation(4, 4)).toEqual(false);
    });

    it("should let overpopulated cells die", function () {
      GAME.step();
      expect(GRID.cellPopulation(1, 1)).toEqual(false);
    });

    it("should keep cells with 2 or 3 neighbours alive", function () {
      GAME.step();
      expect(GRID.cellPopulation(1, 2)).toEqual(true);
    });
  });




});