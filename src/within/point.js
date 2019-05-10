import util from '../util';

/**
 * @description Test if point(s) are within line(s).
 * @param {Points} points Point to test.
 * @param {Lines} lines Lines to test.
 * @private
 * @return {Boolean} True if within otherwise false.
 */
const withinLine = (points, lines) => {
  if (util.helpers.disjoint(points, lines)) {
    return false;
  }

  // Check that no point is in the exterior of all polygons
  // and there is at least one interior point.
  const notExterior = util.point.isInLine(points, lines, true, true);
  if (notExterior === false) {
    return false;
  }

  // Check that atleast one point is in the interior.
  return util.point.isInLine(points, lines, false, false);
};

/**
 * @description Test if point(s) #1 are within point(s) #2.
 * @param {Points} points1 Point #1 to test.
 * @param {Points} points2 Point #2 to test.
 * @private
 * @return {Boolean} True if within otherwise false.
 */
const withinPoint = (points1, points2) => {
  if (util.helpers.disjoint(points1, points2)) {
    return false;
  }

  // Test that every point in #1 equals some in #2.
  return util.point.isInPoint(points1, points2, true);
};

/**
 * @description Test if point(s) are within polygon(s).
 * @param {Points} points Point to test.
 * @param {Polygons} polygons Polygons to test.
 * @private
 * @return {Boolean} True if within otherwise false.
 */
const withinPolygon = (points, polygons) => {
  if (util.helpers.disjoint(points, polygons)) {
    return false;
  }

  // Check that no point is in the exterior of all polygons
  // and there is at least one interior point.
  const notExterior = util.point.isInPolygon(points, polygons, true, true);
  if (notExterior === false) {
    return false;
  }

  // Check that atleast one point is in the interior.
  return util.point.isInPolygon(points, polygons, false, false);
};

export default {
  withinLine,
  withinPoint,
  withinPolygon,
};
