import line from './line';
import point from './point';
import polygon from './polygon';
import util from '../util';

/**
 * @description Check if geojson #1 overlaps geojson #2.
 * @param {GeoJSON} geojson1 GeoJSON #1.
 * @param {GeoJSON} geojson2 GeoJSON #2.
 * @param {Boolean} [error=true] If true unsupported geometries throw an
 *                               error, otherwise they return false.
 * @return {Boolean} True if overlaps otherwise false.
 */
const overlaps = (geojson1, geojson2, error=true) => {
  const type1 = util.invariant.type(geojson1);
  const type2 = util.invariant.type(geojson2);
  const type = `${type1}-${type2}`;
  switch (type) {
    case 'LineString-LineString':
      return line.overlapsLine(geojson1, geojson2);
    case 'Point-Point':
      return point.overlapsPoint(geojson1, geojson2);
    case 'Polygon-Polygon':
      return polygon.overlapsPolygon(geojson1, geojson2);
    default:
      if (error) {
        throw new Error(`${type1} overlaps ${type2} not supported.`);
      }
      return false;
  }
};

export default overlaps;
