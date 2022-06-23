import {
  compileTemplate,
  formatTimeAgo,
  getSites,
  subdomain,
} from "./utility.js";

const SortOrder = {
  Newest: "newest",
  Oldest: "oldest",
  Title: "title",
  Type: "type",
};

const sortSitesByUpdatedTimestampAscending = (a, b) =>
  new Date(a.updated_timestamp) - new Date(b.updated_timestamp);

const sortSitesByUpdatedTimestampDescending = (a, b) =>
  new Date(b.updated_timestamp) - new Date(a.updated_timestamp);

const sortSitesByTitle = (a, b) =>
  a.title.localeCompare(b.title) || sortSitesByUpdatedTimestampDescending(a, b);

const sortSitesByType = (a, b) =>
  a.type.localeCompare(b.type) || sortSitesByUpdatedTimestampDescending(a, b);

$(document).ready(async () => {
  // Load templates.
  var siteGridEntryTemplate = compileTemplate("site-grid-entry-template");
  var siteListEntryTemplate = compileTemplate("site-list-entry-template");

  // State.
  let fade = true;
  let speed = 200;
  let gridView = true;

  // Load the sites. They come in sorted by updated order descending.
  const sites = await getSites();
  // let sites = await getSites();
  // sites = sites.slice(10);

  // Set the title.
  $("#action-bar-name").text(subdomain);

  // Add the sites.
  const addSites = (sortOrder) => {
    // Sort the sites.
    let sortedSites = sites.slice();
    switch (sortOrder) {
      case SortOrder.Newest:
        sortedSites.sort(sortSitesByUpdatedTimestampDescending);
        break;
      case SortOrder.Oldest:
        sortedSites.sort(sortSitesByUpdatedTimestampAscending);
        break;
      case SortOrder.Title:
        sortedSites.sort(sortSitesByTitle);
        break;
      case SortOrder.Type:
        sortedSites.sort(sortSitesByType);
        break;
    }

    // Empty the sites.
    $("#sites-grid").empty();
    $("#sites-list").empty();

    // Add the sites.
    for (const site of sortedSites) {
      // Append the site to the sites grid.
      $("#sites-grid").append(
        siteGridEntryTemplate({
          ...site,
          last_updated: formatTimeAgo(new Date(site.updated_timestamp)),
        })
      );

      // // Append the site to the sites list.
      $("#sites-list").append(
        siteListEntryTemplate({
          ...site,
          last_updated: formatTimeAgo(new Date(site.updated_timestamp)),
        })
      );
    }
  };

  // Add sites.
  addSites(SortOrder.Newest);

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
        $("#sites-list-header-container").fadeOut(speed);
        $("#sites-list-container").fadeOut(speed);
        $("#sites-grid-container").fadeIn(speed);
      } else {
        $("#sites-list-header-container").hide();
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
        $("#sites-list-header-container").fadeIn(speed);
        $("#sites-list-container").fadeIn(speed);
      } else {
        $("#sites-grid-container").hide();
        $("#sites-list-header-container").show();
        $("#sites-list-container").show();
      }
    }
  };

  // Add event handlers.
  $("#list-grid-control")
    .keydown(toggleListGridControlEventHandler)
    .click(toggleListGridControlEventHandler);

  $("#button-sort-newest").click(() => {
    $("#sorting-current-title").text("Newest");
    addSites(SortOrder.Newest);
  });
  $("#button-sort-oldest").click(() => {
    $("#sorting-current-title").text("Oldest");
    addSites(SortOrder.Oldest);
  });
  $("#button-sort-title").click(() => {
    $("#sorting-current-title").text("Title");
    addSites(SortOrder.Title);
  });
  $("#button-sort-type").click(() => {
    console.log("Sort Type");
    $("#sorting-current-title").text("Type");
    addSites(SortOrder.Type);
  });

  // Hide the spinner and show the application.
  $("#loading-spinner").hide();
  $("#application").show();
});
