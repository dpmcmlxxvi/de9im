import util from '../util';

/**
 * @description Test if polygon(s) #1 is coveredby polygon(s) #2.
 * @param {Polygons} polygons1 Polygon #1.
 * @param {Polygons} polygons2 Polygon #2.
 * @private
 * @return {Boolean} True if covered otherwise false.
 */
const coveredbyPolygon = (polygons1, polygons2) => {
  if (util.helpers.disjoint(polygons1, polygons2)) {
    return false;
  }

  // Check the polygon #1 is within polygon #2.
  return util.polygon.isInPolygon(polygons1, polygons2);
};

export default {
  coveredbyPolygon,
};
