// Time divisions.
const TIME_DIVISIONS = [
  { amount: 60, name: "seconds" },
  { amount: 60, name: "minutes" },
  { amount: 24, name: "hours" },
  { amount: 7, name: "days" },
  { amount: 4.34524, name: "weeks" },
  { amount: 12, name: "months" },
  { amount: Number.POSITIVE_INFINITY, name: "years" },
];

// The relative time formatter.
const relativeTimeFormat = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

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

// Formats time ago.
function formatTimeAgo(date) {
  let seconds = (date - new Date()) / 1000;
  for (let i = 0; i <= TIME_DIVISIONS.length; i++) {
    const division = TIME_DIVISIONS[i];
    if (Math.abs(seconds) < division.amount) {
      return relativeTimeFormat.format(Math.round(seconds), division.name);
    }
    seconds /= division.amount;
  }
}

// Exports.
export { subdomain, createURL, formatTimeAgo, getSites };
