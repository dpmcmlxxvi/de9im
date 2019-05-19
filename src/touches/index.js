import line from './line';
import point from './point';
import polygon from './polygon';
import util from '../util';

/**
 * @description Check if geojson #1 touches geojson #2.
 * @param {GeoJSON} geojson1 GeoJSON #1.
 * @param {GeoJSON} geojson2 GeoJSON #2.
 * @param {Boolean} [error=true] If true unsupported geometries throw an
 *                               error, otherwise they return false.
 * @return {Boolean} True if touches otherwise false.
 */
const touches = (geojson1, geojson2, error=true) => {
  const type1 = util.invariant.type(geojson1);
  const type2 = util.invariant.type(geojson2);
  const type = `${type1}-${type2}`;
  switch (type) {
    case 'LineString-LineString':
      return line.touchesLine(geojson1, geojson2);
    case 'LineString-Point':
      return line.touchesPoint(geojson1, geojson2);
    case 'LineString-Polygon':
      return line.touchesPolygon(geojson1, geojson2);
    case 'Point-LineString':
      return point.touchesLine(geojson1, geojson2);
    case 'Point-Polygon':
      return point.touchesPolygon(geojson1, geojson2);
    case 'Polygon-LineString':
      return polygon.touchesLine(geojson1, geojson2);
    case 'Polygon-Point':
      return polygon.touchesPoint(geojson1, geojson2);
    case 'Polygon-Polygon':
      return polygon.touchesPolygon(geojson1, geojson2);
    default:
      if (error) {
        throw new Error(`${type1} touches ${type2} not supported.`);
      }
      return false;
  }
};

export default touches;
