import helpers from './helpers';
import meta from './meta';
import turf from '@turf/turf';

/**
 * @description One or more points.
 * @private
 * @typedef {Feature|FeatureCollection<Point|MultiPoint>} Points
 */

/**
 * @description Test if point(s) in GeoJSON is in line.
 * @param {GeoJSON} geojson GeoJSON points to test.
 * @param {Lines} lines Line(s) to contain points.
 * @param {Boolean} [boundary] True if line boundary should be included.
 *                  Default is true.
 * @param {Boolean} [every] True if every point should be in line.
 *                  False if only some points should be in line.
 *                  Default is true.
 * @param {Boolean} [within] True if relationship is "within" otherwise
 *                           "outside". Default is true.
 * @private
 * @return {Boolean} True if point(s) is in line otherwise false.
 */
const isInLine = (geojson, lines, boundary, every, within) => {
  boundary = boundary !== false;
  every = every !== false;
  within = within !== false;

  if (helpers.disjoint(geojson, lines)) {
    return within === false;
  }

  const reducerGeo = (every ? meta.coordEvery : meta.coordSome);
  const reducerLines = (within ? meta.flattenSome : meta.flattenEvery);

  return reducerGeo(geojson, (coordinate) => {
    return reducerLines(lines, (linestring) => {
      return turf.booleanPointOnLine(coordinate, linestring, {
        ignoreEndVertices: boundary === false,
      }) === within;
    });
  });
};

/**
 * @description Test if every point in GeoJSON is in points.
 * @param {GeoJSON} geojson GeoJSON points to test.
 * @param {Points} points Points(s) to contain points.
 * @param {Boolean} [every] True if every point should be in points.
 *                  False if only some points should be in points.
 *                  Default is true.
 * @param {Boolean} [within] True if relationship is "within" otherwise
 *                           "outside". Default is true.
 * @private
 * @return {Boolean} True if point(s) is in point otherwise false.
 */
const isInPoint = (geojson, points, every, within) => {
  every = every !== false;
  within = within !== false;

  if (helpers.disjoint(geojson, points)) {
    return within === false;
  }

  const reducerGeo = (every ? meta.coordEvery : meta.coordSome);
  const reducerPts = (within ? meta.flattenSome : meta.flattenEvery);

  return reducerGeo(geojson, (coordinate) => {
    const point1 = turf.point(coordinate);
    return reducerPts(points, (point2) => {
      return point1.geometry.coordinates.every((dimension, index) => {
        return dimension === point2.geometry.coordinates[index];
      }) === within;
    });
  });
};

/**
 * @description Test if point(s) in GeoJSON is in polygon.
 * @param {GeoJSON} geojson GeoJSON points to test.
 * @param {Polygons} polygons Polygon(s) to contain point.
 * @param {Boolean} [boundary] True if polygon boundary should be included.
 *                  Default is true.
 * @param {Boolean} [every] True if every point should be in polygon.
 *                  False if only some points should be in polygon.
 *                  Default is true.
 * @param {Boolean} [within] True if relationship is "within" otherwise
 *                           "outside". Default is true.
 * @private
 * @return {Boolean} True if point(s) is in polygon otherwise false.
 */
const isInPolygon = (geojson, polygons, boundary, every, within) => {
  boundary = boundary !== false;
  every = every !== false;
  within = within !== false;

  if (helpers.disjoint(geojson, polygons)) {
    return within === false;
  }

  const reducerGeo = (every ? meta.coordEvery : meta.coordSome);
  const reducerPoly = (within ? meta.flattenSome : meta.flattenEvery);

  return reducerGeo(geojson, (coordinate) => {
    return reducerPoly(polygons, (polygon) => {
      return turf.booleanPointInPolygon(coordinate, polygon, {
        ignoreBoundary: boundary === false,
      }) === within;
    });
  });
};

export default {
  isInLine,
  isInPoint,
  isInPolygon,
};
