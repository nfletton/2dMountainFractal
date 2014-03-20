(function (exports) {
  'use strict';

  /* Draw a mountain range */

  function MountainFractal() {
    this.rangeWidth = 1000;
    this.mountainCount = 30;
    this.iterations = 4;
    this.minMountainWidth = 150;
    this.maxMountainWidth = 200;
    this.minMountainHeight = 25;
    this.maxMountainHeight = 47;
    this.hConstant = [0.1, 0.2, 0.3, 0.4, 0.5];  // 0.1 (smooth), 1.0 (jagged)
    this.variationUpper = 12;                    // upper limit for y variation
    this.variationLower = -12;                   // lower limit for y variation
    this.startPositionSegments = 30;

    return this;
  }

  exports.MountainFractal = MountainFractal;

  MountainFractal.prototype = {

    setRangeParameters: function (width) {
      this.rangeWidth = width;
      this.mountainCount = Math.round(width / 60);
      this.startPositionSegments = Math.round(this.mountainCount / 2);
    },

    randomInRange: function (lower, upper) {
      /* Return a random number between lower & upper (inclusive). */
      if (upper < lower) {
        var tmp = lower;
        lower = upper;
        upper = tmp;
      }
      return Math.floor((Math.random() * (upper - lower + 1)) + lower);
    },

    randomStartPosition: function (mountain, segments, end) {
      /* Start position for mountain is randomly selected from within
       * n segments along the range width. This attempts to prevent
       * clustering of mountains than can occur if the start position
       * is random across the whole range width.
       */
      var segmentWidth = end / segments;
      var startSegment = mountain % segments;
      var startMin = Math.round(startSegment * segmentWidth);
      var startMax = Math.round(startMin + segmentWidth - 1);

      return this.randomInRange(startMin, startMax);
    },

    midPoint: function (point1, point2, variationUpper, variationLower) {
      /* Take a straight line represented by two points and return
       * a mid-point with a random variation on the y-axis.
       */
      var xPos = Math.round((point2[0] - point1[0]) / 2 + point1[0]);
      var yPos;
      if (point2[1] > point1[1]) {
        yPos = ((point2[1] - point1[1]) / 2) + point1[1];
      } else {
        yPos = ((point1[1] - point2[1]) / 2) + point2[1];
      }
      yPos = Math.round(yPos + this.randomInRange(variationLower, variationUpper));

      return [xPos, yPos];
    },

    addMidPoints: function (points, variationUpper, variationLower) {
      /* Add mid-point to a series of straight line segments */
      var numberOfMidPoints = points.length - 1,
          newPoints = [];
      for (var i = 0; i < numberOfMidPoints; i++) {
        newPoints.push(points[i]);
        newPoints.push(this.midPoint(points[i], points[i + 1], variationUpper, variationLower));
      }
      newPoints.push(points[numberOfMidPoints]);
      return newPoints;
    },

    generateMountain: function (start, width, height) {
      var end = start + width;
      var mid = Math.round(start + width / 2);
      var points = [
        [start, 0],
        [mid, height],
        [end, 0]
      ];
      var variationLower = this.variationLower;
      var variationUpper = this.variationUpper;
      var hConstant;

      for (var i = 0; i < this.iterations; i++) {
        points = this.addMidPoints(points, variationUpper, variationLower);
        // pick a random h constant from those available
        hConstant = this.hConstant[this.randomInRange(0, this.hConstant.length - 1)]
        // change variation on each iteration
        variationUpper = variationUpper * hConstant;
        variationLower = variationLower * hConstant;
      }
      return points;
    },

    generateMountainRange: function () {
      var mountains = [];
      for (var i = 0; i < this.mountainCount; i++) {
        var height = this.randomInRange(this.minMountainHeight, this.maxMountainHeight);
        var width = this.randomInRange(this.minMountainWidth, this.maxMountainWidth);
        var start = this.randomStartPosition(i, this.startPositionSegments, this.rangeWidth + 300);

        mountains[i] = this.generateMountain(start, width, height);
      }
      return mountains;
    }
  };

  var waitForFinalEvent = (function () {
    var timers = {};
    return function (callback, ms, uniqueId) {
      if (!uniqueId) {
        uniqueId = "Don't call this twice without a uniqueId";
      }
      if (timers[uniqueId]) {
        clearTimeout(timers[uniqueId]);
      }
      timers[uniqueId] = setTimeout(callback, ms);
    };
  })();

  var displayMountains = function (mountains) {
    var svgNS = "http://www.w3.org/2000/svg";

    var length = mountains.length,
        polygons = document.createDocumentFragment();

    for (var mountain = 0; mountain < length; mountain++) {
      var polygon = document.createElementNS(svgNS, "polygon");
      polygon.setAttributeNS(null, 'points', mountains[mountain].join(' '));
      polygons.appendChild(polygon);
    }

    var svgElement = document.getElementById('mountain-range');
    while (svgElement.firstChild) {
      svgElement.removeChild(svgElement.firstChild);
    }
    svgElement.appendChild(polygons);
  };

  var refreshMountains = function () {
    fractal.setRangeParameters(document.getElementById('banner').clientWidth);
    displayMountains(fractal.generateMountainRange());
  };


  var fractal = new MountainFractal();

  window.addEventListener('resize', function () {
    waitForFinalEvent(function () {
      refreshMountains();
    }, 500, "resize complete");
  });

  refreshMountains();

})(this);
