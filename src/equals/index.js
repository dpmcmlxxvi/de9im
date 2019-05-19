import contains from '../contains';
import util from '../util';
import within from '../within';

/**
 * @description Check if geojson #1 equals geojson #2.
 * @param {GeoJSON} geojson1 GeoJSON #1.
 * @param {GeoJSON} geojson2 GeoJSON #2.
 * @param {Boolean} [error=true] If true unsupported geometries throw an
 *                               error, otherwise they return false.
 * @return {Boolean} True if equals otherwise false.
 */
const equals = (geojson1, geojson2, error=true) => {
  const type1 = util.invariant.type(geojson1);
  const type2 = util.invariant.type(geojson2);
  const type = `${type1}-${type2}`;
  switch (type) {
    case 'LineString-LineString':
    case 'Point-Point':
    case 'Polygon-Polygon':
      return within(geojson1, geojson2) && contains(geojson1, geojson2);
    default:
      if (error) {
        throw new Error(`${type1} equals ${type2} not supported.`);
      }
      return false;
  }
};

export default equals;
