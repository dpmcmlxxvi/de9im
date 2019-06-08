import * as turf from '@turf/turf';

/**
 * @description Compute centroid of each segment in GeoJSON.
 * @param {GeoJSON} geojson GeoJSON of ilne features to process.
 * @private
 * @return {FeatureCollection<Point>} Collection of segment centroids.
 */
const centroids = (geojson) => {
  // Compute centroid of each feature.
  const centers = [];
  turf.segmentEach(geojson, (feature) => {
    centers.push(turf.centroid(feature));
  });
  return turf.featureCollection(centers);
};

/**
 * @description Test if two GeoJSON bounding boxes are disjoint.
 * @param {GeoJSON} geojson1 GeoJSON #1 to test.
 * @param {GeoJSON} geojson2 GeoJSON #2 to test.
 * @private
 * @return {Boolean} True if bounding boxes are disjoint otherwise false.
 */
const disjoint = (geojson1, geojson2) => {
  const bbox1 = (geojson1.bbox ? geojson1.bbox : turf.bbox(geojson1));
  const bbox2 = (geojson2.bbox ? geojson2.bbox : turf.bbox(geojson2));
  const ndim1 = bbox1.length / 2;
  const ndim2 = bbox2.length / 2;
  if ((bbox1[0] > bbox2[ndim2]) || (bbox1[ndim1] < bbox2[0])) {
    return true;
  }
  if ((bbox1[1] > bbox2[ndim2+1]) || (bbox1[ndim1+1] < bbox2[1])) {
    return true;
  }
  return false;
};

/**
 * @description Test if two arrays are similar. Similarity is equality where
 *              offset and direction are ignored. When array ends are reached
 *              the comparison wraps around to the other end and continues.
 * @param {Array} array1 Array #1.
 * @param {Array} array2 Array #2.
 * @param {Number} [start1=0] Starting index of array #1.
 * @param {Number} [start2=0] Starting index of array #2.
 * @param {Number} [count=-1] Number of elements to check for equality from
 *                            starting index. If -1 then all checked.
 * @param {Boolean} [reverse=false] True if coordinates #2 should be checked
 *                                  in reverse order from #1 otherwise false.
 * @private
 * @return {Boolean} True if are equal otherwise false.
 */
const similar = (array1, array2, start1 = 0, start2 = 0, count =-1,
    reverse = false) => {
  if (array1.length !== array2.length) {
    return false;
  }

  // Determine how many elements to check for equality.
  const length = array1.length;
  if (count < 0) {
    count = length;
  }
  count = Math.min(length, Math.max(count, 0));

  for (let i = 0; i < count; i = i + 1) {
    // Choose direction to traverse array #2
    const delta = (reverse ? -i : i);

    // Wrapped around starting index of each array
    const index1 = ((start1 + i) + length) % length;
    const index2 = ((start2 + delta) + length) % length;

    // Check if all coordinate dimensions are equal.
    const isEqual = array1[index1].every((dimension, j) => {
      return dimension === array2[index2][j];
    });
    if (isEqual === false) {
      return false;
    }
  }

  return true;
};

export default {
  centroids,
  disjoint,
  similar,
};
