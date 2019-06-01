import clipper from './clipper';
import rbush from 'geojson-rbush';
import * as turf from '@turf/turf';

/**
 * @description Compute partition of line relative to boundaries of polygons.
 * @param {LineString} linestring Line to be partitioned.
 * @param {Polgons} polygons Polygon with which to partition.
 * @private
 * @return {LineString} Partitioned line.
 */
const boundaries = (linestring, polygons) => {
  let linePartition = linestring;
  turf.flattenEach(polygons, (poly) => {
    const boundary = turf.polygonToLine(poly);
    linePartition = line(linePartition, boundary);
  });
  return linePartition;
};

/**
 * @description Compute partition of line #1 relative to line(s) #2.
 *              The partition is itself a line that ensures that
 *              each line segment intersects only one line #2 segment.
 * @param {LineString} line1 Line #1.
 * @param {Lines} lines2 Line #2.
 * @private
 * @return {LineString} Line partition of line #1.
 */
const line = (line1, lines2) => {
  const coordinates = [];

  // Load line #2 segments into R-Tree for quick searching.
  const segments2 = turf.lineSegment(lines2);
  const tree = rbush();
  tree.load(segments2);

  // Clip each line #1 segment with nearby line #2 segments.
  turf.segmentEach(line1, (segment1) => {
    const clippers = tree.search(segment1);
    const vertices = clipper.segment(segment1, clippers);
    const coords = turf.getCoords(vertices);
    Array.prototype.push.apply(coordinates, coords);
  });

  // Remove sequential duplicate coordinates.
  const lines = coordinates.filter((current, i) => {
    if (i === 0) {
      return true;
    }
    return current.some((dimension, j) => {
      return (dimension !== coordinates[i-1][j]);
    });
  });

  return turf.lineString(lines);
};

/**
 * @description Compute partition of polygon #1 relative to polygon #2.
 *              The partition is itself a triangulation that ensures that
 *              each partition triangle is either in polygon #1 or #2.
 * @param {FeatureCollection<Polygon>} triangulation1 Polygon #1 triangulation.
 * @param {FeatureCollection<Polygon>} triangulation2 Polygon #2 triangulation.
 * @private
 * @return {FeatureCollection<Polygon>} Triangle partition of polygon #1.
 */
const polygon = (triangulation1, triangulation2) => {
  const triangles = [];

  // Load triangulation #2 into R-Tree for quick searching.
  const tree = rbush();
  tree.load(triangulation2);

  turf.featureEach(triangulation1, (triangle1) => {
    const clippers = tree.search(triangle1);
    const clips = clipper.triangle(triangle1, clippers);
    Array.prototype.push.apply(triangles, clips.features);
  });

  return turf.featureCollection(triangles);
};

export default {
  boundaries,
  line,
  polygon,
};
