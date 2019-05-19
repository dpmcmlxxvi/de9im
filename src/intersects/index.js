import line from './line';
import point from './point';
import polygon from './polygon';
import util from '../util';

/**
 * @description Check if geojson #1 intersects geojson #2.
 * @param {GeoJSON} geojson1 GeoJSON #1.
 * @param {GeoJSON} geojson2 GeoJSON #2.
 * @param {Boolean} [error=true] If true unsupported geometries throw an
 *                               error, otherwise they return false.
 * @return {Boolean} True if intersects otherwise false.
 */
const intersects = (geojson1, geojson2, error=true) => {
  const type1 = util.invariant.type(geojson1);
  const type2 = util.invariant.type(geojson2);
  const type = `${type1}-${type2}`;
  switch (type) {
    case 'LineString-LineString':
      return line.intersectsLine(geojson1, geojson2);
    case 'LineString-Point':
      return line.intersectsPoint(geojson1, geojson2);
    case 'LineString-Polygon':
      return line.intersectsPolygon(geojson1, geojson2);
    case 'Point-LineString':
      return point.intersectsLine(geojson1, geojson2);
    case 'Point-Point':
      return point.intersectsPoint(geojson1, geojson2);
    case 'Point-Polygon':
      return point.intersectsPolygon(geojson1, geojson2);
    case 'Polygon-LineString':
      return polygon.intersectsLine(geojson1, geojson2);
    case 'Polygon-Point':
      return polygon.intersectsPoint(geojson1, geojson2);
    case 'Polygon-Polygon':
      return polygon.intersectsPolygon(geojson1, geojson2);
    default:
      if (error) {
        throw new Error(`${type1} intersects ${type2} not supported.`);
      }
      return false;
  }
};

export default intersects;
