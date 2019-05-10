import line from './line';
import point from './point';
import polygon from './polygon';
import util from '../util';

/**
 * @description Check if geojson #1 is coveredby geojson #2.
 * @param {GeoJSON} geojson1 GeoJSON #1.
 * @param {GeoJSON} geojson2 GeoJSON #2.
 * @return {Boolean} True if coveredby otherwise false.
 */
const coveredby = (geojson1, geojson2) => {
  const type1 = util.invariant.type(geojson1);
  const type2 = util.invariant.type(geojson2);
  const type = `${type1}-${type2}`;
  switch (type) {
    case 'LineString-LineString':
      return line.coveredbyLine(geojson1, geojson2);
    case 'LineString-Polygon':
      return line.coveredbyPolygon(geojson1, geojson2);
    case 'Point-LineString':
      return point.coveredbyLine(geojson1, geojson2);
    case 'Point-Point':
      return point.coveredbyPoint(geojson1, geojson2);
    case 'Point-Polygon':
      return point.coveredbyPolygon(geojson1, geojson2);
    case 'Polygon-Polygon':
      return polygon.coveredbyPolygon(geojson1, geojson2);
    default:
      throw new Error(`${type1} coveredby ${type2} not supported.`);
  }
};

export default coveredby;
