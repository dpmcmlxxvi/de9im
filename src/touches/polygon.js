import line from './line';
import point from './point';
import util from '../util';

/**
 * @description Test if polygon(s) touches lines(s).
 * @param {Polygons} polygons Polygons to test.
 * @param {Lines} lines Lines to test.
 * @private
 * @return {Boolean} True if touching otherwise false.
 */
const touchesLine = (polygons, lines) => {
  return line.touchesPolygon(lines, polygons);
};

/**
 * @description Test if polygon(s) touches point(s).
 * @param {Polygons} polygons Polygons to test.
 * @param {Points} points Points to test.
 * @private
 * @return {Boolean} True if touching otherwise false.
 */
const touchesPoint = (polygons, points) => {
  return point.touchesPolygon(points, polygons);
};

/**
 * @description Test if polygon(s) #1 touches polygon(s) #2.
 * @param {Polygons} polygons1 Polygons #1.
 * @param {Polygons} polygons2 Polygons #2.
 * @private
 * @return {Boolean} True if touching otherwise false.
 */
const touchesPolygon = (polygons1, polygons2) => {
  if (util.helpers.disjoint(polygons1, polygons2)) {
    return false;
  }

  // Check that no vertex in #1 is in the interior of #2
  if (util.point.isInPolygon(polygons1, polygons2, false, false)) {
    return false;
  }

  // Check that no vertex in #2 is in the interior of #1
  if (util.point.isInPolygon(polygons2, polygons1, false, false)) {
    return false;
  }

  // Test if polygon boundaries intersect.
  const intersections = util.polygon.isBoundaryIntersecting(
      polygons1, polygons2);
  if (intersections === false) {
    return false;
  }

  // Check that no interior point of polygon #1 is interior to polygon #2.
  return util.polygon.relate(polygons1, polygons2, true, true, false);
};

export default {
  touchesLine,
  touchesPoint,
  touchesPolygon,
};
