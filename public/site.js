"use strict";

$(document).ready(async () => {
  console.log("DOCUMENT READY!");

  console.log(window.location.href);

  const sd = await fetch(
    "https://quartopub.org/api/v1/user-sites/softwarenerd",
    {
      method: "GET",
    }
  );

  console.log(sd);

  const dd = await sd.json();

  console.log("Fetched:");
  console.log(dd);

  // $("p").click(function () {
  //   $(this).hide();
  // });
});
