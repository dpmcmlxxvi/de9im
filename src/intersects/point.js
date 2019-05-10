import util from '../util';

/**
 * @description Test if point(s) intersects line(s).
 * @param {Points} points Point to be intersected.
 * @param {Lines} lines Line to be intersected.
 * @private
 * @return {Boolean} True if they intersect otherwise false.
 */
const intersectsLine = (points, lines) => {
  if (util.helpers.disjoint(points, lines)) {
    return false;
  }

  // Test that any point is in some line.
  return util.point.isInLine(points, lines, true, false);
};

/**
 * @description Test if point(s) intersect point(s).
 * @param {Points} points1 Point #1 to test.
 * @param {Points} points2 Point #2 to test.
 * @private
 * @return {Boolean} True if they intersect otherwise false.
 */
const intersectsPoint = (points1, points2) => {
  if (util.helpers.disjoint(points1, points2)) {
    return false;
  }

  // Check if some point #1 equals point #2.
  return util.point.isInPoint(points1, points2, false);
};

/**
 * @description Test if point(s) intersects polygon(s).
 * @param {Points} points Points to be tested.
 * @param {Polygons} polygons Polygons to be tested.
 * @private
 * @return {Boolean} True if intersecting otherwise false.
 */
const intersectsPolygon = (points, polygons) => {
  if (util.helpers.disjoint(points, polygons)) {
    return false;
  }

  // Search for at least one point in lines that is in a polygon.
  return util.point.isInPolygon(points, polygons, true, false);
};

export default {
  intersectsLine,
  intersectsPoint,
  intersectsPolygon,
};
