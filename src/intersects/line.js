import point from './point';
import * as turf from '@turf/turf';
import util from '../util';

/**
 * @description Test if line(s) #1 intersects line(s) #2.
 * @param {Lines} lines1 Line #1 to be intersected.
 * @param {Lines} lines2 Line #2 to be intersected.
 * @private
 * @return {Boolean} True if they intersect otherwise false.
 */
const intersectsLine = (lines1, lines2) => {
  if (util.helpers.disjoint(lines1, lines2)) {
    return false;
  }

  return util.line.isDisjoint(lines1, lines2) === false;
};

/**
 * @description Test if line(s) intersects line(s).
 * @param {Lines} lines Line to be intersected.
 * @param {Points} points Point to be intersected.
 * @private
 * @return {Boolean} True if they intersect otherwise false.
 */
const intersectsPoint = (lines, points) => {
  return point.intersectsLine(points, lines);
};

/**
 * @description Test if line(s) intersects polygon(s).
 * @param {Lines} lines Line to be tested.
 * @param {Polygons} polygons Polygons to be tested.
 * @private
 * @return {Boolean} True if intersecting otherwise false.
 */
const intersectsPolygon = (lines, polygons) => {
  if (util.helpers.disjoint(lines, polygons)) {
    return false;
  }

  // Test if polygon boundaries intersect lines.
  const intersections = util.meta.flattenSome(polygons, (poly) => {
    const boundary = turf.polygonToLine(poly);
    return intersectsLine(boundary, lines);
  });
  if (intersections) {
    return true;
  }

  // Search for at least one point in lines that is interior to a polygon.
  return util.point.isInPolygon(lines, polygons, true, false);
};

export default {
  intersectsLine,
  intersectsPoint,
  intersectsPolygon,
};
