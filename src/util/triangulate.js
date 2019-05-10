import earcut from 'earcut';
import turf from '@turf/turf';

/**
 * @description Perform constrained triangulation of feature.
 * @param {Polygon} polygon Polygon to triangulate.
 * @private
 * @return {FeatureCollection<Polygon>} Feature collection of triangles.
 */
const triangulate = (polygon) => {
  const data = earcut.flatten(polygon.geometry.coordinates);
  const triangles = earcut(data.vertices, data.holes, data.dimensions);

  const polygons = [];

  // Unflatten each triangle vertex data from earcut data and triangulation.
  const numTriangles = triangles.length / 3;
  for (let i = 0; i < numTriangles; ++i) {
    // Collect each triangle vertex
    const vertices = [];

    for (let j = 0; j < 3; ++j) {
      // Collect each vertex dimension
      const vertex = [];
      for (let k = 0; k < data.dimensions; ++k) {
        const index = data.dimensions * triangles[3 * i + j] + k;
        vertex.push(data.vertices[index]);
      }
      vertices.push(vertex);
    }

    // Close triangle coordinate array with initial coordinate.
    vertices.push(vertices[0]);

    polygons.push(turf.polygon([vertices]));
  }

  return turf.featureCollection(polygons);
};

/**
 * @description Perform constrained triangulation of polygon(s). Triangulation
 *              is performed on each polygon separately and then combined.
 * @param {Polygons} geojson Features to triangulate.
 * @private
 * @return {FeatureCollection<Polygon>} Feature collection of triangles.
 */
export default (geojson) => {
  const polygons = [];
  turf.flattenEach(geojson, (feature) => {
    const triangles = triangulate(feature);
    turf.featureEach(triangles, (triangle) => {
      polygons.push(triangle);
    });
  });
  return turf.featureCollection(polygons);
};
