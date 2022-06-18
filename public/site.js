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
  //`http://localhost:3000/api/v1/subdomains/${subdomain}/sites`
  const response = await fetch(
    `https://quartopub.org/api/v1/subdomains/${subdomain}/sites`
  );

  const sites = await response.json();

  console.log(sites);

  $("#description").text(`This is ${subdomain}'s site.`);

  for (const site of sites) {
    const updatedDate = new Date(site.updated_timestamp);
    $("#sites").append(`
    <div>
      <div>
        ${site.title} (${site.type}) created by ${site.created_by.given_name} ${
      site.created_by.surname
    } (${site.created_by.username})
      </div>
      <div>
        Last updated: ${updatedDate.toLocaleDateString()} at ${updatedDate.toLocaleTimeString()}
      </div>
      <div class="linkie">
        <a href="${site.site_url}">${site.title}</a>
      </div>
      <img class="foo" src="${site.screenshot_url}">
    </div>
    `);

    console.log(`We have a user site: ${site}`);
  }
});
