import util from '../util';

/**
 * @description Test if point(s) coveredby line(s).
 * @param {Points} points Point to test.
 * @param {Lines} lines Line to test.
 * @private
 * @return {Boolean} True if coveredby otherwise false.
 */
const coveredbyLine = (points, lines) => {
  if (util.helpers.disjoint(points, lines)) {
    return false;
  }

  // Test that all points are within or on the boundary of the polygons.
  return util.point.isInLine(points, lines, true, true, true);
};

/**
 * @description Test if point(s) #1 coveredby point(s) #2.
 * @param {Points} points1 Point #1 to test.
 * @param {Points} points2 Point #2 to test.
 * @private
 * @return {Boolean} True if coveredby otherwise false.
 */
const coveredbyPoint = (points1, points2) => {
  if (util.helpers.disjoint(points1, points2)) {
    return false;
  }

  // Test that every point in #1 covers points in #2.
  return util.point.isInPoint(points1, points2, true);
};

/**
 * @description Test if point(s) coveredby polygon(s).
 * @param {Points} points Point to test.
 * @param {Polygons} polygons Polygon to test.
 * @private
 * @return {Boolean} True if coveredby otherwise false.
 */
const coveredbyPolygon = (points, polygons) => {
  if (util.helpers.disjoint(points, polygons)) {
    return false;
  }

  // Test that all points are within or on the boundary of the polygons.
  return util.point.isInPolygon(points, polygons, true, true, true);
};

export default {
  coveredbyLine,
  coveredbyPoint,
  coveredbyPolygon,
};
