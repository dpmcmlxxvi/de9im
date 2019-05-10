import line from './line';
import point from './point';
import util from '../util';

/**
 * @description Test if polygon(s) intersects line(s).
 * @param {Polygons} polygons Polygons to be tested.
 * @param {Lines} lines Line to be tested.
 * @private
 * @return {Boolean} True if intersecting otherwise false.
 */
const intersectsLine = (polygons, lines) => {
  return line.intersectsPolygon(lines, polygons);
};

/**
 * @description Test if polygon(s) intersects point(s).
 * @param {Polygons} polygons Polygons to be tested.
 * @param {Points} points Points to be tested.
 * @private
 * @return {Boolean} True if intersecting otherwise false.
 */
const intersectsPoint = (polygons, points) => {
  return point.intersectsPolygon(points, polygons);
};

/**
 * @description Test if polygon(s) #1 intersects polygon(s) #2.
 * @param {Polygons} polygons1 Polygons #1.
 * @param {Polygons} polygons2 Polygons #2.
 * @private
 * @return {Boolean} True if intersecting otherwise false.
 */
const intersectsPolygon = (polygons1, polygons2) => {
  if (util.helpers.disjoint(polygons1, polygons2)) {
    return false;
  }

  // Test if polygon boundaries intersect.
  const intersections = util.polygon.isBoundaryIntersecting(
      polygons1, polygons2);
  if (intersections) {
    return true;
  }

  // Search for at least one point in polygon #1 that is interior to polygon #2.
  return util.polygon.relate(polygons1, polygons2, true, false, true);
};

export default {
  intersectsLine,
  intersectsPoint,
  intersectsPolygon,
};
