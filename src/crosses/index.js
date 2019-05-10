import line from './line';
import point from './point';
import polygon from './polygon';
import util from '../util';

/**
 * @description Check if geojson #1 crosses geojson #2.
 * @param {GeoJSON} geojson1 GeoJSON #1.
 * @param {GeoJSON} geojson2 GeoJSON #2.
 * @return {Boolean} True if crosses otherwise false.
 */
const crosses = (geojson1, geojson2) => {
  const type1 = util.invariant.type(geojson1);
  const type2 = util.invariant.type(geojson2);
  const type = `${type1}-${type2}`;
  switch (type) {
    case 'LineString-LineString':
      return line.crossesLine(geojson1, geojson2);
    case 'LineString-Point':
      return line.crossesPoint(geojson1, geojson2);
    case 'LineString-Polygon':
      return line.crossesPolygon(geojson1, geojson2);
    case 'Point-LineString':
      return point.crossesLine(geojson1, geojson2);
    case 'Point-Polygon':
      return point.crossesPolygon(geojson1, geojson2);
    case 'Polygon-LineString':
      return polygon.crossesLine(geojson1, geojson2);
    case 'Polygon-Point':
      return polygon.crossesPoint(geojson1, geojson2);
    default:
      throw new Error(`${type1} crosses ${type2} not supported.`);
  }
};

export default crosses;
