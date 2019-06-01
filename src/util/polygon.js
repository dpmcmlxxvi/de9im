import helpers from './helpers';
import line from './line';
import meta from './meta';
import partition from './partition';
import point from './point';
import triangulate from './triangulate';
import * as turf from '@turf/turf';

/**
 * @description One or more polygons.
 * @private
 * @typedef {Feature|FeatureCollection<Polygon|MultiPolygon>} Polygons
 */

/**
 * @description Test if polygon boundaries intersect.
 * @param {Polygons} polygons1 Polygons #1.
 * @param {Polygons} polygons2 Polygons #2.
 * @private
 * @return {Boolean} True if boundary's intersect otherwise false.
 */
const isBoundaryIntersecting = (polygons1, polygons2) => {
  // Flatten both polygons then intersect their boundaries.
  return meta.flattenSome(polygons1, (polygon1) => {
    const boundary1 = turf.polygonToLine(polygon1);
    return meta.flattenSome(polygons2, (polygon2) => {
      const boundary2 = turf.polygonToLine(polygon2);
      return line.isDisjoint(boundary1, boundary2) === false;
    });
  });
};

/**
 * @description Test if two coordinate arrays are similar. Similarity is
 *              equality where shift and direction changes are ignored.
 *              Arrays must be of same length.
 * @param {Array} coordinates1 Coordinates #1 array.
 * @param {Array} coordinates2 Coordinates #2 array.
 * @private
 * @return {Boolean} True if coordinates are similar otherwise false.
 */
const isCoordinateSimilar = (coordinates1, coordinates2) => {
  // First find a pair of coordinates that are equal then check rest of array
  const length = coordinates1.length - 1;
  for (let i = 0; i < length; ++i) {
    // Search for similarity in forward direction
    if (helpers.similar(coordinates1, coordinates2, 0, i, 1, true)) {
      if (helpers.similar(coordinates1, coordinates2, 0, i, length, true)) {
        return true;
      }
    }

    // Search for similarity in reverse direction
    if (helpers.similar(coordinates1, coordinates2, 0, i, 1, false)) {
      if (helpers.similar(coordinates1, coordinates2, 0, i, length, false)) {
        return true;
      }
    }
  }
  return false;
};

/**
 * @description Test if polygon(s) #1 is within polygon(s) #2.
 * @param {Polygons} polygons1 Polygon #1.
 * @param {Polygons} polygons2 Polygon #2.
 * @private
 * @return {Boolean} True if within otherwise false.
 */
const isInPolygon = (polygons1, polygons2) => {
  // Check that all vertices in #1 are in the interior of #2
  if (point.isInPolygon(polygons1, polygons2, true, true) === false) {
    return false;
  }

  // Check the centroid of each partition triangle is within polygon #2.
  return relate(polygons1, polygons2, false, true, true);
};

/**
 * @description Test if two polygon coordinates are similar. Similarity is
 *              vertex equality with array shift and direction ignored.
 * @example
 *  similar(turf.polygon([[[0, 0], [1, 1], [2, 3], [3, 4]]]),
 *          turf.polygon([[[1, 1], [0, 0], [3, 4], [2, 3]]])); // = true
 * @param {Polygons} polygons1 Polygon #1.
 * @param {Polygons} polygons2 Polygon #2.
 * @private
 * @return {Boolean} True if similar otherwise false.
 */
const isPolygonSimilar = (polygons1, polygons2) => {
  // Flatten all polygon rings into lines then search for matches.
  const findMatch = (features1, features2) => {
    return meta.flattenEvery(features1, (feature1) => {
      return feature1.geometry.coordinates.every((line1) => {
        return meta.flattenSome(features2, (feature2) => {
          return feature2.geometry.coordinates.some((line2) => {
            return isCoordinateSimilar(line1, line2);
          });
        });
      });
    });
  };

  return findMatch(polygons1, polygons2) && findMatch(polygons2, polygons1);
};

/**
 * @description Relate polygon(s) #1 to polygon(s) #2.
 * @param {Polygons} polygons1 Polygon #1 to relate.
 * @param {Polygons} polygons2 Polygon #2 to relate.
 * @param {Boolean} [boundary] True if boundary should be included.
 *                  Default is true.
 * @param {Boolean} [every] True if every polygon(s) #1 meets relationship.
 *                  False if only some of polygon(s) #1 meets relationship.
 *                  Default is true.
 * @param {Boolean} [within] True if relationship is "within" otherwise
 *                           "outside". Default is true.
 * @private
 * @return {Boolean} True if relationship met otherwise false.
 */
const relate = (polygons1, polygons2, boundary, every, within) => {
  boundary = boundary !== false;
  every = every !== false;
  within = within !== false;

  // Rule out case where polygon coordinates are identical which can cause
  // trouble for the clipping tools used during partitioning if the
  // triangulations are identical and vertices are high precision.
  if (isPolygonSimilar(polygons1, polygons2)) {
    return within === true;
  }

  // Compute the partition of polygon #1 relative to #2 so that each partition
  // triangle is either entirely within or outside polygon #2. Then, we have
  // to check if the centroid of each partition triangle satisfies relation.
  const triangulation1 = triangulate(polygons1);
  const triangulation2 = triangulate(polygons2);
  const partition1 = partition.polygon(triangulation1, triangulation2);

  const reducer = (every ? meta.featureEvery : meta.featureSome);
  return reducer(partition1, (triangle) => {
    const centroid = turf.centroid(triangle);
    return point.isInPolygon(centroid, polygons2, boundary) === within;
  });
};

export default {
  isBoundaryIntersecting,
  isInPolygon,
  relate,
};
