import util from '../util';
import within from '../within';

/**
 * @description Check if geojson #1 contains geojson #2.
 * @param {GeoJSON} geojson1 GeoJSON #1.
 * @param {GeoJSON} geojson2 GeoJSON #2.
 * @return {Boolean} True if contained otherwise false.
 */
const contains = (geojson1, geojson2) => {
  const type1 = util.invariant.type(geojson1);
  const type2 = util.invariant.type(geojson2);
  const type = `${type1}-${type2}`;
  switch (type) {
    case 'LineString-LineString':
    case 'LineString-Point':
    case 'Point-Point':
    case 'Polygon-LineString':
    case 'Polygon-Point':
    case 'Polygon-Polygon':
      return within(geojson2, geojson1);
    default:
      throw new Error(`${type1} contains ${type2} not supported.`);
  }
};

export default contains;
