import * as turf from '@turf/turf';

/**
 * @description Check if callback is true for every coordinate.
 * @param {GeoJSON} geojson Any GeoJSON.
 * @param {function} callback Callback for each coordinate of GeoJSON.
 * @private
 * @return {Boolean} True if every coordinate returns true otherwise false.
 */
const coordEvery = (geojson, callback) => {
  return reduceEvery(geojson, callback, turf.coordReduce);
};

/**
 * @description Check if callback is true for some coordinate.
 * @param {GeoJSON} geojson Any GeoJSON.
 * @param {function} callback Callback for each coordinate of GeoJSON.
 * @private
 * @return {Boolean} True if some coordinate returns true otherwise false.
 */
const coordSome = (geojson, callback) => {
  return reduceSome(geojson, callback, turf.coordReduce);
};

/**
 * @description Check if callback is true for every feature.
 * @param {GeoJSON} geojson Any GeoJSON.
 * @param {function} callback Callback for each feature of GeoJSON.
 * @private
 * @return {Boolean} True if every feature returns true otherwise false.
 */
const featureEvery = (geojson, callback) => {
  return reduceEvery(geojson, callback, turf.featureReduce);
};

/**
 * @description Check if callback is true for some feature.
 * @param {GeoJSON} geojson Any GeoJSON.
 * @param {function} callback Callback for each feature of GeoJSON.
 * @private
 * @return {Boolean} True if some feature returns true otherwise false.
 */
const featureSome = (geojson, callback) => {
  return reduceSome(geojson, callback, turf.featureReduce);
};

/**
 * @description Check if callback is true for every flattened feature.
 * @param {GeoJSON} geojson Any GeoJSON.
 * @param {function} callback Callback for each feature of GeoJSON.
 * @private
 * @return {Boolean} True if some feature returns true otherwise false.
 */
const flattenEvery = (geojson, callback) => {
  return reduceEvery(geojson, callback, turf.flattenReduce);
};

/**
 * @description Check if callback is true for some flattened feature.
 * @param {GeoJSON} geojson Any GeoJSON.
 * @param {function} callback Callback for each feature of GeoJSON.
 * @private
 * @return {Boolean} True if some feature returns true otherwise false.
 */
const flattenSome = (geojson, callback) => {
  return reduceSome(geojson, callback, turf.flattenReduce);
};

/**
 * @description Check if callback is true for every reduce item.
 * @param {GeoJSON} geojson Any GeoJSON.
 * @param {function} callback Callback for each GeoJSON reduction item.
 * @param {function} reducer Turf reduction function.
 * @private
 * @return {Boolean} True if every item returns true otherwise false.
 */
const reduceEvery = (geojson, callback, reducer) => {
  return reducer(geojson, (value, feature) => {
    return value && callback(feature);
  }, true);
};

/**
 * @description Check if callback is true for some reduce item.
 * @param {GeoJSON} geojson Any GeoJSON.
 * @param {function} callback Callback for each GeoJSON reduction item.
 * @param {function} reducer Turf reduction function.
 * @private
 * @return {Boolean} True if some item returns true otherwise false.
 */
const reduceSome = (geojson, callback, reducer) => {
  return reducer(geojson, (value, feature) => {
    return value || callback(feature);
  }, false);
};

/**
 * @description Check if callback is true for every segment.
 * @param {GeoJSON} geojson Any GeoJSON.
 * @param {function} callback Callback for each segment of GeoJSON.
 * @private
 * @return {Boolean} True if every segment returns true otherwise false.
 */
const segmentEvery = (geojson, callback) => {
  return reduceEvery(geojson, callback, turf.segmentReduce);
};

/**
 * @description Check if callback is true for some segment.
 * @param {GeoJSON} geojson Any GeoJSON.
 * @param {function} callback Callback for each segment of GeoJSON.
 * @private
 * @return {Boolean} True if some segment returns true otherwise false.
 */
const segmentSome = (geojson, callback) => {
  return reduceSome(geojson, callback, turf.segmentReduce);
};

export default {
  coordEvery,
  coordSome,
  featureEvery,
  featureSome,
  flattenEvery,
  flattenSome,
  segmentEvery,
  segmentSome,
};
