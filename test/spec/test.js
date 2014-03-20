/* Test mountain fractal generation code */

(function (imports) {
  'use strict';

  describe('Random range', function () {
    describe('randomInRange(): generate random number in a range', function () {
      it('within range - negative, negative', function () {
        var fractal = new MountainFractal();
        var lower = -300;
        var upper = -200;
        var result;
        for (var i = 0; i < 100000; i++) {
          result = fractal.randomInRange(lower, upper);
          result.should.be.within(-300, -200);
        }
      });
      it('within range - negative, positive', function () {
        var fractal = new MountainFractal();
        var lower = -100;
        var upper = 200;
        var result;
        for (var i = 0; i < 100000; i++) {
          result = fractal.randomInRange(lower, upper);
          result.should.be.within(-100, 200);
        }
      });
      it('within range - zero, positive', function () {
        var fractal = new MountainFractal();
        var lower = 0;
        var upper = 200;
        var result;
        for (var i = 0; i < 100000; i++) {
          result = fractal.randomInRange(lower, upper);
          result.should.be.within(lower, upper);
        }
      });
      it('within range - positive, positive', function () {
        var fractal = new MountainFractal();
        var lower = 100;
        var upper = 200;
        var result;
        for (var i = 0; i < 100000; i++) {
          result = fractal.randomInRange(lower, upper);
          result.should.be.within(lower, upper);
        }
      });
    });
  });

  describe('Random start position', function () {
    describe('randomStartPosition(): start position within correct segment', function () {
      it('random within first segment', function () {
        var fractal = new MountainFractal();
        var result;
        for (var i = 0; i < 100000; i++) {
          result = fractal.randomStartPosition(0, 3, 900);
          result.should.be.within(0, 299);
        }
      });
      it('random within second segment', function () {
        var fractal = new MountainFractal();
        var result;
        for (var i = 0; i < 100000; i++) {
          result = fractal.randomStartPosition(1, 3, 900);
          result.should.be.within(300, 599);
        }
      });
      it('random within third segment', function () {
        var fractal = new MountainFractal();
        var result;
        for (var i = 0; i < 100000; i++) {
          result = fractal.randomStartPosition(2, 3, 900);
          result.should.be.within(600, 899);
        }
      });
    });
  });

  describe('Split a segment', function () {
    describe('midPoint(): take two points representing a line and generate a mid-point', function () {
      it('mid-point on x-axis', function () {
        var fractal = new MountainFractal();
        var result = fractal.midPoint([20, 0], [300, 0]);
        result[0].should.equal(160);
      });
    });
  });

  describe('Add mid-points', function () {
    describe('addMidPoints(): add mid points to each segement', function () {
      it('5 points becomes 9 points', function () {
        var fractal = new MountainFractal();
        var series = [
          [0, 0],
          [100, 40],
          [200, 50],
          [300, 35],
          [400, 0]
        ];
        var result = fractal.addMidPoints(series);
        result.length.should.equal(9);
      });
      it('5 points becomes 65 points (add midpoints 4 times)', function () {
        var fractal = new MountainFractal();
        var series = [
          [0, 0],
          [100, 40],
          [200, 50],
          [300, 35],
          [400, 0]
        ];
        for (var i = 0; i < 4; i++) {
          series = fractal.addMidPoints(series);
        }
        series.length.should.equal(65);
      });
    });
  });

  describe('Generate Mountain', function () {
    describe('generateMountain(): generate a mountain', function () {
      it('3 iterations', function () {
        var fractal = new MountainFractal();
        fractal.iterations = 3;
        var result = fractal.generateMountain();
        result.length.should.equal(17);
      });
    });
  });
})(this);
