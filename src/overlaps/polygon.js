import * as turf from '@turf/turf';
import util from '../util';

/**
 * @description Test if polygon(s) #1 overlaps polygon(s) #2.
 * @param {Polygons} polygons1 Polygon #1.
 * @param {Polygons} polygons2 Polygon #2.
 * @private
 * @return {Boolean} True if overlapping otherwise false.
 */
const overlapsPolygon = (polygons1, polygons2) => {
  if (util.helpers.disjoint(polygons1, polygons2)) {
    return false;
  }

  // Compute the partition of polygon #1 relative to #2 so that each partition.
  // triangle is either entirely within or outside polygon #2.
  const triangulation1 = util.triangulate(polygons1);
  const triangulation2 = util.triangulate(polygons2);
  const partition1 = util.partition.polygon(triangulation1, triangulation2);

  // Search for at least one point in polygon #1 that is interior to polygon #2
  // and one point that is in polygon #1 that is exterior to polygon #2.
  const overlap1 = turf.featureReduce(partition1, (overlap, triangle) => {
    if (overlap.within && overlap.outside) {
      return overlap;
    }

    const centroid = turf.centroid(triangle);
    if (overlap.within === false &&
        util.point.isInPolygon(centroid, polygons2, false)) {
      overlap.within = true;
    } else if (overlap.outside === false &&
               util.point.isInPolygon(centroid, polygons2, true) === false) {
      overlap.outside = true;
    }

    return overlap;
  }, {
    within: false,
    outside: false,
  });

  // Stop if not found. No need to check polygon #2
  if ((overlap1.within && overlap1.outside) === false) {
    return false;
  }

  // Search for at least one point in polygon #2 that is exterior to polygon #1.
  const partition2 = util.partition.polygon(triangulation2, triangulation1);
  return util.meta.featureSome(partition2, (triangle) => {
    const centroid = turf.centroid(triangle);
    return util.point.isInPolygon(centroid, polygons1, true) === false;
  });
};

export default {
  overlapsPolygon,
};
