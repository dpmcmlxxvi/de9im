import util from '../util';

/**
 * @description Test if point(s) #1 overlaps point(s) #2.
 * @param {Points} points1 Point #1 to be tested.
 * @param {Points} points2 Point #2 to be tested.
 * @private
 * @return {Boolean} True if they overlap otherwise false.
 */
const overlapsPoint = (points1, points2) => {
  if (util.helpers.disjoint(points1, points2)) {
    return false;
  }

  // Find point #1 in points #2
  const oneInTwo = util.point.isInPoint(points1, points2, false, true);
  if (oneInTwo === false) {
    return false;
  }

  // Find point #1 not in points #2
  const oneNotInTwo = util.point.isInPoint(points1, points2, false, false);
  if (oneNotInTwo === false) {
    return false;
  }

  // Find point #2 not in points #1
  return util.point.isInPoint(points2, points1, false, false);
};

export default {
  overlapsPoint,
};
