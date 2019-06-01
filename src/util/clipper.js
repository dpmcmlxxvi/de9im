import triangulate from './triangulate';
import * as turf from '@turf/turf';

// Scaling factor to apply to features to attempt and recover from a known
// Turfjs dependency numerical precision bug. The features will be scaled by
// this scale factor, the clipping applied, then unscaled.
const scaleFactor = 1.0;

/**
 * @description Clip subject triangle using a triangle clipper. The result will
 *              be a collection of triangles that partition the subject triangle
 *              and preserve the clipping boundary.
 * @param {Polygon} subject Triangle to be clipped.
 * @param {Polygon} clipper Triangle with which to clip.
 * @private
 * @return {FeatureCollection<Polygon>} Triangle clipped components.
 */
const clip = (subject, clipper) => {
  const triangles = [];

  // Intersect subject with clipper and retriangulate intersection.
  let intersection = clipIntersection(subject, clipper);
  if (!intersection && scaleFactor != 1.0) {
    // Attempt to recover from turf failure by scaling features.
    intersection = clipScale(subject, clipper, scaleFactor, clipIntersection);
  }
  if (intersection) {
    Array.prototype.push.apply(triangles, intersection);
  }

  // Difference subject with clipper and retriangulate difference.
  let difference = clipDifference(subject, clipper);
  if (!difference && scaleFactor != 1.0) {
    // Attempt to recover from turf failure by scaling features.
    difference = clipScale(subject, clipper, scaleFactor, clipDifference);
  }
  if (difference) {
    Array.prototype.push.apply(triangles, difference);
  }

  // If no triangles were found then assume subject was not clipped.
  // This should only happen if Turf failed during intersection and
  // difference due to an on-going numerical precision bug.
  if (triangles.length == 0) {
    triangles.push(subject);
  }

  return turf.featureCollection(triangles);
};

/**
 * @description Clip subject triangle using a triangle clipper. The result will
 *              be a collection of triangles that are the difference of the
 *              subject triangle and the clipper.
 * @param {Polygon} subject Triangle to be clipped.
 * @param {Polygon} clipper Triangle with which to clip.
 * @private
 * @return {FeatureCollection<Polygon>} Collection of clipped intersections
 *                                      or null if intersection failed.
 */
const clipDifference = (subject, clipper) => {
  const triangles = [];

  // Difference subject with clipper and retriangulate difference.
  try {
    const difference = turf.difference(subject, clipper);
    if (difference === null) {
      return null;
    }
    if (difference && difference.geometry.type.includes('Polygon')) {
      turf.flattenEach(difference, (flattened) => {
        turf.featureEach(triangulate(flattened), (feature) => {
          triangles.push(feature);
        });
      });
    }
  } catch (e) {
    // Turf differrence can fail for edge cases due to one of their
    // dependencies not handling numerical precision well.
    // It is discussed at length in their issue tracker.
    // https://github.com/Turfjs/turf/issues
    return null;
  }

  return triangles;
};

/**
 * @description Clip subject triangle using a triangle clipper. The result will
 *              be a collection of triangles that intersect the subject triangle
 *              and the clipper.
 * @param {Polygon} subject Triangle to be clipped.
 * @param {Polygon} clipper Triangle with which to clip.
 * @private
 * @return {FeatureCollection<Polygon>} Collection of clipped intersections
 *                                      or null if intersection failed.
 */
const clipIntersection = (subject, clipper) => {
  const triangles = [];

  // Intersect subject with clipper and retriangulate intersection.
  try {
    const intersection = turf.intersect(subject, clipper);
    if (intersection === null) {
      return null;
    }
    if (intersection && intersection.geometry.type.includes('Polygon')) {
      turf.flattenEach(intersection, (flattened) => {
        turf.featureEach(triangulate(flattened), (feature) => {
          triangles.push(feature);
        });
      });
    }
  } catch (e) {
    // Turf intersect can fail for edge cases due to one of their
    // dependencies not handling numerical precision well.
    // It is discussed at length in their issue tracker.
    // https://github.com/Turfjs/turf/issues
    return null;
  }

  return triangles;
};

/**
 * @description Apply operation to scaled subject & clipper then unscale result.
 * @param {Polygon} subject Triangle to be clipped.
 * @param {Polygon} clipper Triangle with which to clip.
 * @param {Number} scale Scaling factor.
 * @param {Function} operation CLipping operation to apply.
 * @private
 * @return {FeatureCollection<Polygon>} Collection of operation results
 *                                      or null if operation failed.
 */
const clipScale = (subject, clipper, scale, operation) => {
  const subjectScaled = turf.clone(subject);
  const clipperScaled = turf.clone(clipper);
  coordScale(subjectScaled, scale);
  coordScale(clipperScaled, scale);

  // Apply clipping operation and unscale results
  let result = operation(subjectScaled, clipperScaled);
  if (!result) {
    return null;
  }
  result = turf.featureCollection(result);
  coordScale(result, 1.0 / scale);

  return result.features;
};

/**
 * @description Scale each GeoJSON coordinate.
 * @param {GeoJSON} geojson GeoJSON to scale.
 * @param {Number} scale Scaling factor.
 * @private
 */
const coordScale = (geojson, scale) => {
  turf.coordEach(geojson, (coordinate) => {
    for (let i = 0; i < coordinate.length; ++i) {
      coordinate[i] *= scale;
    }
  });
};

/**
 * @description Clip subject segment using a collection of segment clippers.
 *              The result will be a collection of segments that partition the
 *              subject segment and preserve the clipping boundaries.
 * @param {LineString} subject Segment to be clipped.
 * @param {FeatureCollection<LineString>} clippers Segments with which to clip.
 * @private
 * @return {LineString} Segment clipped partitioning. Note line may contain
 *                      duplicate points if partitioned but multiple clippers.
 */
const segment = (subject, clippers) => {
  const vertices = subject.geometry.coordinates.concat();

  // Split subject at intersection points and collect coordinates.
  // Turf only finds interections where the segments are non-parallel.
  const intersections = turf.lineIntersect(subject, clippers);
  turf.coordEach(intersections, (coordinate) => {
    vertices.push(coordinate);
  });

  // Split subject at overlap points if no intersections found.
  // If turf found no intersections between two segments then
  // the only case left is an overlap in which case one or both
  // end points of the clipper will be on the subject.
  turf.coordEach(clippers, (coordinate) => {
    if (turf.booleanPointOnLine(coordinate, subject, {
      ignoreEndVertices: true,
    })) {
      vertices.push(coordinate);
    }
  });

  // Sort all coordinates in order from first vertex.
  if (vertices.length >= 2) {
    vertices.sort((a, b) => {
      const start = subject.geometry.coordinates[0];
      return turf.distance(a, start) - turf.distance(b, start);
    });
  }

  return turf.lineString(vertices);
};

/**
 * @description Clip subject triangle using a collection of triangle clippers.
 *              The result will be a collection of triangles that partition the
 *              subject triangle and preserve the clipping boundaries.
 * @param {Polygon} subject Triangle to be clipped.
 * @param {FeatureCollection<Polygon>} clippers Triangles with which to clip.
 * @private
 * @return {FeatureCollection<Polygon>} Triangle clipped partitioning.
 */
const triangle = (subject, clippers) => {
  let subjects = [subject];

  turf.featureEach(clippers, (clipper, i) => {
    // Clip all subjects with the current clipper and then put the resulting
    // triangle partition back in the queue to be clipped by the next clipper.
    const parts = [];
    for (let i = 0; i < subjects.length; i++) {
      const triangles = clip(subjects[i], clipper);
      turf.featureEach(triangles, (facet) => {
        parts.push(facet);
      });
    }
    subjects = parts;
  });

  return turf.featureCollection(subjects);
};

export default {
  segment,
  triangle,
};
