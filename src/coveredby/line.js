import line from '../within/line';
import util from '../util';

/**
 * @description Test if line(s) #1 covered by line(s) #2.
 * @param {Lines} lines1 Line #1 to be tested.
 * @param {Lines} lines2 Line #2 to be tested.
 * @private
 * @return {Boolean} True if line is covered by otherwise false.
 */
const coveredbyLine = (lines1, lines2) => {
  return line.withinLine(lines1, lines2);
};

/**
 * @description Test if line(s) coveredby polygon(s).
 * @param {Lines} lines Lines to test.
 * @param {Polygons} polygons Polygon to test.
 * @private
 * @return {Boolean} True if covers otherwise false.
 */
const coveredbyPolygon = (lines, polygons) => {
  if (util.helpers.disjoint(lines, polygons)) {
    return false;
  }

  // Test that all line segments are within or on the boundary of the polygons.
  return util.meta.flattenEvery(lines, (linestring) => {
    // Partition each line with polygon boundaries and test partition centroids.
    const linePartition = util.partition.boundaries(linestring, polygons);
    const centroids = util.helpers.centroids(linePartition);
    return util.point.isInPolygon(centroids, polygons, true, true, true);
  });
};

export default {
  coveredbyLine,
  coveredbyPolygon,
};
