import coveredby from '../coveredby';
import util from '../util';

/**
 * @description Check if geojson #1 covers geojson #2.
 * @param {GeoJSON} geojson1 GeoJSON #1.
 * @param {GeoJSON} geojson2 GeoJSON #2.
 * @param {Boolean} [error=true] If true unsupported geometries throw an
 *                               error, otherwise they return false.
 * @return {Boolean} True if covers otherwise false.
 */
const covers = (geojson1, geojson2, error=true) => {
  const type1 = util.invariant.type(geojson1);
  const type2 = util.invariant.type(geojson2);
  const type = `${type1}-${type2}`;
  switch (type) {
    case 'LineString-LineString':
    case 'LineString-Point':
    case 'Point-Point':
    case 'Polygon-Point':
    case 'Polygon-LineString':
    case 'Polygon-Polygon':
      return coveredby(geojson2, geojson1);
    default:
      if (error) {
        throw new Error(`${type1} covers ${type2} not supported.`);
      }
      return false;
  }
};

export default covers;
