import intersects from '../intersects';
import util from '../util';

/**
 * @description Check if geojson #1 is disjoint geojson #2.
 * @param {GeoJSON} geojson1 GeoJSON #1.
 * @param {GeoJSON} geojson2 GeoJSON #2.
 * @param {Boolean} [error=true] If true unsupported geometries throw an
 *                               error, otherwise they return false.
 * @return {Boolean} True if disjoint otherwise false.
 */
const disjoint = (geojson1, geojson2, error=true) => {
  const type1 = util.invariant.type(geojson1);
  const type2 = util.invariant.type(geojson2);
  const type = `${type1}-${type2}`;
  switch (type) {
    case 'LineString-LineString':
    case 'LineString-Point':
    case 'LineString-Polygon':
    case 'Point-LineString':
    case 'Point-Point':
    case 'Point-Polygon':
    case 'Polygon-LineString':
    case 'Polygon-Point':
    case 'Polygon-Polygon':
      return intersects(geojson1, geojson2) === false;
    default:
      if (error) {
        throw new Error(`${type1} disjoint ${type2} not supported.`);
      }
      return false;
  }
};

export default disjoint;
