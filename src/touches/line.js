import point from './point';
import * as turf from '@turf/turf';
import util from '../util';

/**
 * @description Test if line(s) #1 touches line(s) #2.
 * @param {Lines} lines1 Line #1 to be tested.
 * @param {Lines} lines2 Line #2 to be tested.
 * @private
 * @return {Boolean} True if they touch otherwise false.
 */
const touchesLine = (lines1, lines2) => {
  if (util.helpers.disjoint(lines1, lines2)) {
    return false;
  }

  const intersections = util.line.isIntersecting(lines1, lines2, false);
  if (intersections) {
    return false;
  }

  const overlaps = util.line.isOverlapping(lines1, lines2, true, false, true);
  if (overlaps) {
    return false;
  }

  const touches = util.line.isTouching(lines1, lines2);
  if (touches) {
    return true;
  }

  return false;
};

/**
 * @description Test if line(s) touches point(s).
 * @param {Lines} lines Lines to test.
 * @param {Points} points Points to test.
 * @private
 * @return {Boolean} True if touching otherwise false.
 */
const touchesPoint = (lines, points) => {
  return point.touchesLine(points, lines);
};

/**
 * @description Test if lines(s) touches polygon(s).
 * @param {Lines} lines Lines to test.
 * @param {Polygons} polygons Polygons to test.
 * @private
 * @return {Boolean} True if touching otherwise false.
 */
const touchesPolygon = (lines, polygons) => {
  if (util.helpers.disjoint(lines, polygons)) {
    return false;
  }
  const touches = turf.flattenReduce(lines, (touches1, linestring) => {
    // Exit if we've already found an interior point.
    if (touches1.within) {
      return touches1;
    }

    // Check if any line segment is within polygon.
    const linePartition = util.partition.boundaries(linestring, polygons);
    const centroids = util.helpers.centroids(linePartition);
    if (util.point.isInPolygon(centroids, polygons, false, false, true)) {
      touches1.within = true;
      return touches1;
    }

    // Check if there are any line points exterior to polygon
    if (touches1.exterior === false) {
      if (util.point.isInPolygon(centroids, polygons, true, false, false)) {
        touches1.exterior = true;
      }
    }

    // Exit if we've already found a boundary point.
    if (touches1.boundary) {
      return touches1;
    }

    // Check if any line segment overlaps polygon boundary.
    if (util.point.isInPolygon(centroids, polygons, true, false, true)) {
      touches1.boundary = true;
      return touches1;
    }

    // Check either end point falls on some flattened polygon boundary.
    const endPoints = [util.line.start(linestring), util.line.end(linestring)];
    const touchesEnd = endPoints.some((pt) => {
      return util.meta.flattenSome(polygons, (poly) => {
        const boundaries = turf.polygonToLine(poly);
        // Boundaries may be MultiLineString so we flatten again.
        return util.meta.flattenSome(boundaries, (boundary) => {
          return turf.booleanPointOnLine(pt, boundary, {
            ignoreEndVertices: false,
          });
        });
      });
    });
    if (touchesEnd) {
      touches1.boundary = true;
    }

    return touches1;
  }, {
    boundary: false,
    exterior: false,
    within: false,
  });

  return touches.within === false && touches.boundary && touches.exterior;
};

export default {
  touchesLine,
  touchesPoint,
  touchesPolygon,
};
