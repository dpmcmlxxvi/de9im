import util from '../util';

/**
 * @description Test if line(s) #1 is within line(s) #2.
 * @param {Lines} lines1 Line #1.
 * @param {Lines} lines2 Line #2.
 * @private
 * @return {Boolean} True if within otherwise false.
 */
const withinLine = (lines1, lines2) => {
  if (util.helpers.disjoint(lines1, lines2)) {
    return false;
  }

  // Rule out case where line coordinates are identical which can cause
  // trouble for the clipping tools used during partitioning if the
  // line strings are identical and vertices are high precision.
  if (util.line.isSimilar(lines1, lines2)) {
    return true;
  }

  // Check that all vertex in #1 are in the interior of #2
  if (util.point.isInLine(lines1, lines2, true, true) === false) {
    return false;
  }

  // Check if the centroid of each partition segment is within lines #2.
  const overlaps = util.line.isOverlapping(lines1, lines2, false, true, true);
  if (overlaps) {
    return true;
  }

  return false;
};

/**
 * @description Test if line(s) is within polygon(s).
 * @param {Lines} lines Line to be tested.
 * @param {Polgons} polygons Polygon to be tested.
 * @private
 * @return {Boolean} True if within otherwise false.
 */
const withinPolygon = (lines, polygons) => {
  if (util.helpers.disjoint(lines, polygons)) {
    return false;
  }

  // Partition each line using polygon boundaries so that each partition
  // segment is either within or outside the polygons.
  return util.meta.flattenEvery(lines, (linestring) => {
    // Check that no centroid is in the exterior of all polygons
    const linePartition = util.partition.boundaries(linestring, polygons);
    const centroids = util.helpers.centroids(linePartition);
    const notExterior = util.point.isInPolygon(centroids, polygons, true, true);
    if (notExterior === false) {
      return false;
    }

    // Check that atleast one point is in the interior.
    return util.point.isInPolygon(centroids, polygons, false, false);
  });
};

export default {
  withinLine,
  withinPolygon,
};
