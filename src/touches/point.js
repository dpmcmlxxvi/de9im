import util from '../util';

/**
 * @description Test if point(s) touches line(s).
 * @param {Points} points Points to be tested.
 * @param {Lines} lines Lines to be tested.
 * @private
 * @return {Boolean} True if touching otherwise false.
 */
const touchesLine = (points, lines) => {
  if (util.helpers.disjoint(points, lines)) {
    return false;
  }

  // Check that no point in #1 is in the interior of #2
  if (util.point.isInLine(points, lines, false, false, true)) {
    return false;
  }

  // Check that some point in #1 is on the boundary of #2
  return util.point.isInLine(points, lines, true, false, true);
};

/**
 * @description Test if point(s) touches polygon(s).
 * @param {Points} points Points to be tested.
 * @param {Polygons} polygons Polygons to be tested.
 * @private
 * @return {Boolean} True if touching otherwise false.
 */
const touchesPolygon = (points, polygons) => {
  if (util.helpers.disjoint(points, polygons)) {
    return false;
  }

  // Check that no point in #1 is in the interior of #2
  if (util.point.isInPolygon(points, polygons, false, false, true)) {
    return false;
  }

  // Check that some point in #1 is on the boundary of #2
  return util.point.isInPolygon(points, polygons, true, false, true);
};

export default {
  touchesLine,
  touchesPolygon,
};
