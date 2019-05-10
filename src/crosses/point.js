import util from '../util';

/**
 * @description Test if point(s) crosses line(s).
 * @param {Points} points Points to test.
 * @param {Lines} lines Line to test.
 * @private
 * @return {Boolean} True if crosses otherwise false.
 */
const crossesLine = (points, lines) => {
  if (util.helpers.disjoint(points, lines)) {
    return false;
  }

  const within = util.point.isInLine(points, lines, false, false, true);
  if (within === false) {
    return false;
  }

  return util.point.isInLine(points, lines, true, false, false);
};

/**
 * @description Test if point(s) crosses polygon(s).
 * @param {Points} points Points to test.
 * @param {Polygons} polygons Polygon to test.
 * @private
 * @return {Boolean} True if crosses otherwise false.
 */
const crossesPolygon = (points, polygons) => {
  if (util.helpers.disjoint(points, polygons)) {
    return false;
  }

  const within = util.point.isInPolygon(points, polygons, false, false, true);
  if (within === false) {
    return false;
  }

  return util.point.isInPolygon(points, polygons, true, false, false);
};

export default {
  crossesLine,
  crossesPolygon,
};
