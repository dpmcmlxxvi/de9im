import line from './line';
import point from './point';
import polygon from './polygon';
import util from '../util';

/**
 * @description Check if geojson #1 is within geojson #2.
 * @param {GeoJSON} geojson1 GeoJSON #1.
 * @param {GeoJSON} geojson2 GeoJSON #2.
 * @param {Boolean} [error=true] If true unsupported geometries throw an
 *                               error, otherwise they return false.
 * @return {Boolean} True if within otherwise false.
 */
const within = (geojson1, geojson2, error=true) => {
  const type1 = util.invariant.type(geojson1);
  const type2 = util.invariant.type(geojson2);
  const type = `${type1}-${type2}`;
  switch (type) {
    case 'LineString-LineString':
      return line.withinLine(geojson1, geojson2);
    case 'LineString-Polygon':
      return line.withinPolygon(geojson1, geojson2);
    case 'Point-LineString':
      return point.withinLine(geojson1, geojson2);
    case 'Point-Point':
      return point.withinPoint(geojson1, geojson2);
    case 'Point-Polygon':
      return point.withinPolygon(geojson1, geojson2);
    case 'Polygon-Polygon':
      return polygon.withinPolygon(geojson1, geojson2);
    default:
      if (error) {
        throw new Error(`${type1} within ${type2} not supported.`);
      }
      return false;
  }
};

export default within;
