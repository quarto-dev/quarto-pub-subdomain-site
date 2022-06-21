import { getSites, subdomain } from "./utility.js";

$(document).ready(async () => {
  // Load templates.
  var headerTemplate = Handlebars.compile($("#header-template").html());
  var displayOptionsTemplate = Handlebars.compile(
    $("#display-options-template").html()
  );
  var sitesTemplate = Handlebars.compile($("#sites-template").html());
  var siteTemplate = Handlebars.compile($("#site-template").html());

  // Load the sites.
  const sites = await getSites();
  console.log(sites);

  // Construct the site.
  $("#application").append(headerTemplate({ subdomain }));
  $("#application").append(displayOptionsTemplate());
  $("#list-grid-control").click(() => {
    $(".list-grid-control-indicator").toggleClass(
      "list-grid-control-indicator-right"
    );
  });

  $("#application").append(sitesTemplate());

  for (const site of sites) {
    console.log(site);
    const updatedDate = new Date(site.updated_timestamp);
    $("#sites").append(siteTemplate(site));
  }

  // Hide the spinner.
  $("#loading-spinner").hide();
});
