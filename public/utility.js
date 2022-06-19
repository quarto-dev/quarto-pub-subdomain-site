// Gets the subdomain.
const getSubdomain = () => {
  if (window.location.hostname) {
    const parts = window.location.hostname.split(".");
    if (parts.length === 3) {
      return parts[0];
    }
  }
  const params = new URLSearchParams(window.location.search);
  return params.get("subdomain");
};

// The subdomain.
const subdomain = getSubdomain();

// The base URL.
const baseURL =
  window.location.protocol === "https:"
    ? `https://quartopub.org/api/v1/subdomains/${subdomain}`
    : `http://127.0.0.1:3000/api/v1/subdomains/${subdomain}`;

// Create a URL.
const createURL = (path) => `${baseURL}/${path}`;

// Gets sites.
const getSites = async () => {
  try {
    const response = await fetch(createURL("sites"));
    return await response.json();
  } catch (error) {
    return [];
  }
};

// Exports.
export { subdomain, createURL, getSites };