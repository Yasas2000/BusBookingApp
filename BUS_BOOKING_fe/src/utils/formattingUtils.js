const capitalize = (word) => word?.charAt(0)?.toUpperCase() + word?.slice(1)?.toLowerCase();
const toUpperCaseLettersOnly = (str) => str?.replace(/[a-z]/g, c => c.toUpperCase());

export { capitalize, toUpperCaseLettersOnly };