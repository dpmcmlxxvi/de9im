import util from '../util';

/**
 * @description Test if line(s) #1 overlaps line(s) #2.
 * @param {Lines} lines1 Line #1 to be tested.
 * @param {Lines} lines2 Line #2 to be tested.
 * @private
 * @return {Boolean} True if they overlap otherwise false.
 */
const overlapsLine = (lines1, lines2) => {
  if (util.helpers.disjoint(lines1, lines2)) {
    return false;
  }

  // Rule out case where line coordinates are identical which can cause
  // trouble for the clipping tools used during partitioning if the
  // line strings are identical and vertices are high precision.
  if (util.line.isSimilar(lines1, lines2)) {
    return false;
  }

  // Check there is line #1 segment interior to line #2
  const interior = util.line.isOverlapping(
      lines1, lines2, false, false, true, 0.02);
  if (interior === false) {
    return false;
  }

  // Check there is line #1 segment exterior to line #2
  const exterior = util.line.isOverlapping(
      lines1, lines2, true, false, false, 0.02);
  if (exterior === false) {
    return false;
  }

  // Check there is line #2 segment exterior to line #1
  return util.line.isOverlapping(lines2, lines1, true, false, false, 0.02);
};

export default {
  overlapsLine,
};
