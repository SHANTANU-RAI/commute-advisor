function midpoint(lat1, lon1, lat2, lon2) {
  return { lat: (Number(lat1) + Number(lat2)) / 2, lon: (Number(lon1) + Number(lon2)) / 2 };
}

module.exports = { midpoint };
