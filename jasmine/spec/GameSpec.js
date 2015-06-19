describe("Game", function () {
  var speed;

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
});