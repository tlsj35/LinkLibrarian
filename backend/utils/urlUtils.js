function formatUrl(input) {
  const trimmed = input.trim();

  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }

  return `https://${trimmed}`;
}

function isValidUrl(input) {
  try {
    new URL(formatUrl(input));
    return true;
  } catch {
    return false;
  }
}

module.exports = {
  formatUrl,
  isValidUrl,
};