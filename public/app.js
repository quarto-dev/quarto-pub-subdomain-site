import { formatTimeAgo, getSites, subdomain } from "./utility.js";

$(document).ready(async () => {
  var headerTemplate = Handlebars.compile($("#header-template").html());
  var optionsTemplate = Handlebars.compile($("#options-template").html());
  var gridSitesTemplate = Handlebars.compile($("#grid-sites-template").html());
  var gridSiteTemplate = Handlebars.compile($("#grid-site-template").html());

  // State.
  let gridView = true;

  // Load the sites.
  const sites = await getSites();

  // Construct the site.
  $("#application").append(headerTemplate({ subdomain }));
  $("#application").append(optionsTemplate());
  $("#application").append(gridSitesTemplate());

  // Add the sites.
  for (const site of sites) {
    $("#grid-sites").append(
      gridSiteTemplate({
        ...site,
        last_updated: formatTimeAgo(new Date(site.updated_timestamp)),
      })
    );
  }

  // Toggle list / grid control event handler.
  const toggleListGridControlEventHandler = (event) => {
    // Reject keyboard events that are not supported.
    if (event.originalEvent instanceof KeyboardEvent) {
      if (!(event.code == "Space" || event.code == "Enter")) {
        return;
      }
    }

    // Toggle the list / grid control.
    if ((gridView = !gridView)) {
      $(".list-grid-control-indicator").addClass(
        "list-grid-control-indicator-right"
      );
      $("#list-grid-control").attr("aria-pressed", true);
      $("#grid-sites-container").show();
    } else {
      $(".list-grid-control-indicator").removeClass(
        "list-grid-control-indicator-right"
      );
      $("#list-grid-control").attr("aria-pressed", false);
      $("#grid-sites-container").hide();
    }
  };

  // Add event handlers.
  $("#list-grid-control")
    .keydown(toggleListGridControlEventHandler)
    .click(toggleListGridControlEventHandler);

  // Hide the spinner.
  $("#loading-spinner").hide();
});
