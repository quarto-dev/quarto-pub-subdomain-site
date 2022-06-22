import { formatTimeAgo, getSites, subdomain } from "./utility.js";

const compileTemplate = (id) => Handlebars.compile($(`#${id}`).html());

$(document).ready(async () => {
  // Load templates.
  var gridSiteTemplate = compileTemplate("site-grid-entry-template");
  var listSiteTemplate = compileTemplate("site-list-entry-template");

  // State.
  let fade = true;
  let speed = 200;
  let gridView = true;
  let sortDescending = true;

  // Load the sites.
  const sites = await getSites();

  // Set the title.
  $("#action-bar-name").text(subdomain);

  // Add the sites.
  const addSites = (reverse = false) => {
    for (const site of reverse ? sites.slice().reverse() : sites) {
      // Append the site to the sites grid.
      $("#sites-grid").append(
        gridSiteTemplate({
          ...site,
          last_updated: formatTimeAgo(new Date(site.updated_timestamp)),
        })
      );

      // // Append the site to the sites list.
      $("#sites-list").append(
        listSiteTemplate({
          ...site,
          last_updated: formatTimeAgo(new Date(site.updated_timestamp)),
        })
      );
    }
  };

  addSites();

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
      // Update the indicator.
      $(".list-grid-control-indicator").addClass(
        "list-grid-control-indicator-right"
      );

      // Switch view.
      if (fade) {
        $("#sites-list-container").fadeOut(speed);
        $("#sites-grid-container").fadeIn(speed);
      } else {
        $("#sites-list-container").hide();
        $("#sites-grid-container").show();
      }
    } else {
      // Update the indicator.
      $(".list-grid-control-indicator").removeClass(
        "list-grid-control-indicator-right"
      );

      // Switch view.
      if (fade) {
        $("#sites-grid-container").fadeOut(speed);
        $("#sites-list-container").fadeIn(speed);
      } else {
        $("#sites-grid-container").hide();
        $("#sites-list-container").show();
      }
    }
  };

  // Toggle sorting control event handler.
  const toggleSortingControlEventHandler = (event) => {
    // Reject keyboard events that are not supported.
    if (event.originalEvent instanceof KeyboardEvent) {
      if (!(event.code == "Space" || event.code == "Enter")) {
        return;
      }
    }

    // Toggle the sorting control.
    if ((sortDescending = !sortDescending)) {
      // Update the indicator.
      $(".sorting-control-indicator").addClass(
        "sorting-control-indicator-right"
      );

      $("#sites-grid").empty();
      $("#sites-list").empty();

      addSites();
    } else {
      // Update the indicator.
      $(".sorting-control-indicator").removeClass(
        "sorting-control-indicator-right"
      );
      $("#sites-grid").empty();
      $("#sites-list").empty();

      addSites(true);
    }
  };

  // Add event handlers.
  $("#list-grid-control")
    .keydown(toggleListGridControlEventHandler)
    .click(toggleListGridControlEventHandler);
  $("#sorting-control")
    .keydown(toggleSortingControlEventHandler)
    .click(toggleSortingControlEventHandler);

  // Hide the spinner and show the application.
  $("#loading-spinner").hide();
  $("#application").show();
});
