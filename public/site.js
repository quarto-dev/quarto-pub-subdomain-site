"use strict";

// Gets the subdomain.
const getSubdomain = (host) => {
  if (host === "") {
    return "softwarenerd";
  }

  if (host) {
    const parts = host.split(".");
    if (parts.length === 3) {
      return parts[0];
    }
  }

  return null;
};

// Prepares the document.
$(document).ready(async () => {
  // Get the subdomain. It must be present.
  const subdomain = getSubdomain(window.location.hostname);
  if (!subdomain) {
    return;
  }

  // Fetch the user sites for the subdomain.
  const response = await fetch(
    `https://quartopub.org/api/v1/subdomains/${subdomain}/sites`,
    {
      method: "GET",
    }
  );

  const sites = await response.json();

  $("#description").text(`This is ${subdomain}'s site.`);

  for (const site of sites) {
    $("#sites").append(`<div><a href="${site}">${site}</a></div>`);
    console.log(`We have a user site: ${site}`);
  }
});
