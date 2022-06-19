import { getSites, subdomain } from "./utility.js";

$(document).ready(async () => {
  const sites = await getSites();
  console.log(sites);

  const source = $("#rocks-template").html();
  var template = Handlebars.compile(source);

  $(".name").text(subdomain);

  $("#description").append(`<div>This is ${subdomain}'s site.</div>`);
  $("#description").append(template({ doesWhat: "rocks!" }));

  for (const site of sites) {
    const updatedDate = new Date(site.updated_timestamp);
    $("#sites").append(`
    <div class="mt-10">
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
  }

  $("body").show();
});
