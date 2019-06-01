import * as turf from '@turf/turf';

/**
 * @description Get base geometry type. Defined only for homogenous geometries.
 * @param {GeoJSON} geojson GeoJSON object.
 * @private
 * @return {Point|LineString|Polygon|Mixed|Unknown} Base geometry type.
 */
const type = (geojson) => {
  // Check if we have a single geometry type.
  const geoType = turf.getType(geojson);
  const isMany = ['Collection', 'Multi'].some((many) => geoType.includes(many));
  if (isMany === false) {
    return geoType;
  }

  // For a collection or multipart geometry, flatten to find a common type.
  return turf.flattenReduce(geojson, (baseType, feature, index) => {
    if (baseType === 'Mixed') {
      return baseType;
    }
    const currentType = turf.getType(feature);
    if (baseType !== 'Unknown' && baseType !== currentType) {
      return 'Mixed';
    }
    return currentType;
  }, 'Unknown');
};

export default {
  type,
};
