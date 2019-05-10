import line from './line';
import point from './point';

/**
 * @description Test if polygon(s) crosses line(s).
 * @param {Polygons} polygons Polygon to test.
 * @param {Lines} lines Lines to test.
 * @private
 * @return {Boolean} True if crosses otherwise false.
 */
const crossesLine = (polygons, lines) => {
  return line.crossesPolygon(lines, polygons);
};

/**
 * @description Test if polygon(s) crosses point(s).
 * @param {Polygons} polygons Polygon to test.
 * @param {Points} points Points to test.
 * @private
 * @return {Boolean} True if crosses otherwise false.
 */
const crossesPoint = (polygons, points) => {
  return point.crossesPolygon(points, polygons);
};

export default {
  crossesLine,
  crossesPoint,
};
