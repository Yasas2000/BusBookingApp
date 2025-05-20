const capitalize = (word) =>
  word?.charAt(0).toUpperCase() + word?.slice(1).toLowerCase();

module.exports = {
  capitalize,
};
