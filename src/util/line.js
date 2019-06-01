import helpers from './helpers';
import meta from './meta';
import partition from './partition';
import point from './point';
import * as turf from '@turf/turf';

/**
 * @description One or more lines.
 * @private
 * @typedef {Feature|FeatureCollection<LineString|MultiLineString>} Lines
 */

/**
 * @description Get line ending point.
 * @param {LineString} linestring Line from which to get ending point.
 * @private
 * @return {Point} Ending point.
 */
const end = (linestring) => {
  const length = linestring.geometry.coordinates.length;
  return turf.point(linestring.geometry.coordinates[length-1]);
};

/**
 * @description Test if line(s) #1 is disjoint from line(s) #2.
 * @param {Lines} lines1 Line #1 to be tested.
 * @param {Lines} lines2 Line #2 to be tested.
 * @private
 * @return {Boolean} True if they are disjoint otherwise false.
 */
const isDisjoint = (lines1, lines2) => {
  // Check for any proper sement/segment intersections.
  const intersections = isIntersecting(lines1, lines2, true);
  if (intersections) {
    return false;
  }

  // Check for segment/segment overlaps.
  const overlaps = isOverlapping(lines1, lines2, true, false, true);
  if (overlaps) {
    return false;
  }

  // Final case is boundaries touching
  const touches = isTouching(lines1, lines2);
  if (touches) {
    return false;
  }

  return true;
};

/**
 * @description Test if line(s) #1 and line(s) #2 have any intersections.
 * @param {Lines} lines1 Line #1 to be intersected.
 * @param {Lines} lines2 Line #2 to be intersected.
 * @param {Boolean} [boundary] True if line boundary should be included.
 *                  Default is true.
 * @private
 * @return {Boolean} True if they have intersections otherwise false.
 */
const isIntersecting = (lines1, lines2, boundary) => {
  boundary = boundary !== false;

  // Check for any proper sement/segment intersections.
  // Turf only finds interections where the segments are non-parallel.
  return meta.flattenSome(lines1, (line1) => {
    return meta.flattenSome(lines2, (line2) => {
      const intersects = turf.lineIntersect(line1, line2);
      if (boundary === false) {
        const lines = turf.featureCollection([line1, line2]);
        if (isOnBoundary(lines, intersects)) {
          return false;
        }
      }
      return intersects.features.length > 0;
    });
  });
};

/**
 * @description Test if point(s) is on line(s) boundary.
 * @param {Lines} lines Line to be tested.
 * @param {Points} points Points to be tested.
 * @private
 * @return {Boolean} True if on boundary otherwise false.
 */
const isOnBoundary = (lines, points) => {
  return meta.featureEvery(points, (pt) => {
    // Flatten lines and check if point is on any boundary.
    return meta.flattenSome(lines, (linestring) => {
      const lineStart = start(linestring);
      const lineEnd = end(linestring);
      if (point.isInPoint(pt, lineStart) ||
          point.isInPoint(pt, lineEnd)) {
        return true;
      }
    });
  });
};

/**
 * @description Test if line(s) #1 and line(s) #2 have overlaps.
 * @param {Lines} lines1 Line #1 to be tested.
 * @param {Lines} lines2 Line #2 to be tested.
 * @param {Boolean} [boundary] True if line boundary should be included.
 *                  Default is true.
 * @param {Boolean} [every] True if every segment should overlap line.
 *                  False if only some segments should overlap line.
 *                  Default is true.
 * @param {Boolean} [within] True if relationship is "within" otherwise
 *                           "outside". Default is true.
 * @param {Number} [tolerance] Tolerance distance to match overlapping line
 *                             segments (kilometers). Default is 0.
 * @private
 * @return {Boolean} True if they have overlaps otherwise false.
 */
const isOverlapping = (lines1, lines2, boundary, every, within, tolerance) => {
  boundary = boundary !== false;
  every = every !== false;
  tolerance = tolerance || 0;
  within = within !== false;

  const reducer = (every ? meta.segmentEvery : meta.segmentSome);
  return reducer(lines1, (line1) => {
    // Partition line #1 using line #2 as clipper.
    const partition1 = partition.line(line1, lines2);
    return reducer(partition1, (segment) => {
      // Check for segment/segment overlaps by testing centroid.
      const centroid = turf.centroid(segment);
      let inLine = point.isInLine(centroid, lines2, boundary);
      if (inLine === false && tolerance > 0) {
        const nearest = turf.nearestPointOnLine(lines2, centroid);
        inLine = nearest.properties.dist <= tolerance;
      }
      return inLine === within;
    });
  });
};

/**
 * @description Test if two line coordinates are similar. Similarity is
 *              vertex equality with array shift and direction ignored.
 * @example
 *  similar(turf.lineString([[0, 0], [1, 1], [2, 3], [3, 4]]),
 *          turf.lineString([[1, 1], [0, 0], [3, 4], [2, 3]])); // = true
 * @param {Lines} lines1 Line #1.
 * @param {Lines} lines2 Line #2.
 * @private
 * @return {Boolean} True if similar otherwise false.
 */
const isSimilar = (lines1, lines2) => {
  // Flatten all lines then search for matches.
  const findMatch = (features1, features2) => {
    return meta.flattenEvery(features1, (line1) => {
      return meta.flattenSome(features2, (line2) => {
        const coords1 = line1.geometry.coordinates;
        const coords2 = line2.geometry.coordinates;
        const length2 = coords2.length-1;
        return (helpers.similar(coords1, coords2) ||
          helpers.similar(coords1, coords2, 0, length2-1, length2, true));
      });
    });
  };

  return findMatch(lines1, lines2) && findMatch(lines2, lines1);
};

/**
 * @description Test if any line(s) #1 boundary touches line(s) #2 boundary.
 * @param {Lines} lines1 Line #1 to be tested.
 * @param {Lines} lines2 Line #2 to be tested.
 * @private
 * @return {Boolean} True if their boundaries touch otherwise false.
 */
const isTouching = (lines1, lines2) => {
  // Flatten both lines and check if end points are equal.
  return meta.flattenSome(lines1, (line1) => {
    const start1 = start(line1);
    const end1 = end(line1);

    return meta.flattenSome(lines2, (line2) => {
      const start2 = start(line2);
      if (point.isInPoint(start1, start2) ||
          point.isInPoint(end1, start2)) {
        return true;
      }

      const end2 = end(line2);
      if (point.isInPoint(start1, end2) ||
          point.isInPoint(end1, end2)) {
        return true;
      }
    });
  });
};

/**
 * @description Get line starting point.
 * @param {LineString} linestring Line from which to get starting point.
 * @private
 * @return {Point} Starting point.
 */
const start = (linestring) => {
  return turf.point(linestring.geometry.coordinates[0]);
};

export default {
  end,
  isDisjoint,
  isIntersecting,
  isOverlapping,
  isSimilar,
  isTouching,
  start,
};
