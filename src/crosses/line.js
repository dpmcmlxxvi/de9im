import point from './point';
import turf from '@turf/turf';
import util from '../util';

/**
 * @description Test if line(s) #1 crosses line(s) #2.
 * @param {Lines} lines1 Line #1.
 * @param {Lines} lines2 Line #2.
 * @private
 * @return {Boolean} True if they cross otherwise false.
 */
const crossesLine = (lines1, lines2) => {
  if (util.helpers.disjoint(lines1, lines2)) {
    return false;
  }

  // Check if some segment of line #1 is within line #2.
  const overlaps = util.line.isOverlapping(lines1, lines2, false, false, true);
  if (overlaps) {
    return false;
  }

  // Check for any non-boundary intersections.
  const intersections = util.line.isIntersecting(lines1, lines2, false);
  if (intersections) {
    return true;
  }

  return false;
};

/**
 * @description Test if line(s) crosses point(s).
 * @param {Lines} lines Line to test.
 * @param {Points} points Points to test.
 * @private
 * @return {Boolean} True if crosses otherwise false.
 */
const crossesPoint = (lines, points) => {
  return point.crossesLine(points, lines);
};

/**
 * @description Test if line(s) crosses polygon(s).
 * @param {Lines} lines Lines to test.
 * @param {Polygons} polygons Polygon to test.
 * @private
 * @return {Boolean} True if crosses otherwise false.
 */
const crossesPolygon = (lines, polygons) => {
  if (util.helpers.disjoint(lines, polygons)) {
    return false;
  }

  // Search for at least one point in the line that is interior to the polygon
  // and one point that is in the line that is exterior to polygon.
  const crosses = turf.flattenReduce(lines, (cross1, linestring) => {
    if (cross1.within && cross1.outside) {
      return cross1;
    }

    // Partition each line with polygon boundaries and test partition centroids.
    const linePartition = util.partition.boundaries(linestring, polygons);
    const centroids = util.helpers.centroids(linePartition);

    if (cross1.within === false) {
      cross1.within = util.point.isInPolygon(
          centroids, polygons, false, false, true);
    }
    if (cross1.outside === false) {
      cross1.outside = util.point.isInPolygon(
          centroids, polygons, true, false, false);
    }

    return cross1;
  }, {
    within: false,
    outside: false,
  });

  return crosses.within && crosses.outside;
};

export default {
  crossesLine,
  crossesPoint,
  crossesPolygon,
};
