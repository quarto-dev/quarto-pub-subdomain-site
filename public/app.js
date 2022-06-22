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

$(document).ready(async () => {
  // Load templates.
  var gridSiteTemplate = compileTemplate("site-grid-entry-template");
  var listSiteTemplate = compileTemplate("site-list-entry-template");

  // State.
  let fade = true;
  let speed = 200;
  let gridView = true;

  // Load the sites. They come in sorted by created order descending.
  const sites = await getSites();

  // Set the title.
  $("#action-bar-name").text(subdomain);

  const sortUpdatedTimestamp = (a, b) => {
    const aUpdated = new Date(a.updated_timestamp);
    const bUpdated = new Date(b.updated_timestamp);
    if (aUpdated < bUpdated) {
      return -1;
    } else if (aUpdated > bUpdated) {
      return 1;
    } else {
      return 0;
    }
  };

  const sortTitle = (a, b) => {
    if (a.title < b.title) {
      return -1;
    } else if (a.title > b.title) {
      return 1;
    } else {
      return sortUpdatedTimestamp(a, b);
    }
  };

  const sortType = (a, b) => {
    if (a.type < b.type) {
      return -1;
    } else if (a.type > b.type) {
      return 1;
    } else {
      return sortTitle(a, b);
    }
  };

  // Add the sites.
  const addSites = (sortOrder) => {
    // Sort the sites.
    let sortedSites;
    switch (sortOrder) {
      case SortOrder.Newest:
        sortedSites = sites;
        break;
      case SortOrder.Oldest:
        sortedSites = sites.slice().reverse();
        break;
      case SortOrder.Title:
        sortedSites = sites.slice().sort(sortTitle);
        break;
      case SortOrder.Type:
        sortedSites = sites.slice().sort(sortType);
        break;
    }

    // Empty the sites.
    $("#sites-grid").empty();
    $("#sites-list").empty();

    // Add the sites.
    for (const site of sortedSites) {
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
