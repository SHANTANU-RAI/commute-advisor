/**
 * Calculates the geographic midpoint (centroid) between two sets of coordinates.
 * * This utility is used to estimate weather conditions at the center-point of 
 * a commute, providing a more balanced risk assessment than checking 
 * the origin or destination alone.
 * * @param {number|string} lat1 - Latitude of the first point (e.g., Home).
 * @param {number|string} lon1 - Longitude of the first point (e.g., Home).
 * @param {number|string} lat2 - Latitude of the second point (e.g., Office).
 * @param {number|string} lon2 - Longitude of the second point (e.g., Office).
 * * @returns {{lat: number, lon: number}} An object containing the averaged latitude and longitude.
 * * @example
 * const center = midpoint(28.5847, 77.3520, 28.6139, 77.2090);
 * // returns { lat: 28.5993, lon: 77.2805 }
 */
function midpoint(lat1, lon1, lat2, lon2) {
  return { lat: (Number(lat1) + Number(lat2)) / 2, lon: (Number(lon1) + Number(lon2)) / 2 };
}

module.exports = { midpoint };
