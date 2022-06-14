"use strict";

$(document).ready(async () => {
  console.log(window.location.href);

  const sd = await fetch(
    "https://quartopub.org/api/v1/user-sites/softwarenerd",
    {
      method: "GET",
    }
  );

  const dd = await sd.json();
  console.log("Fetched JSON:");
  console.log(dd);

  // $("p").click(function () {
  //   $(this).hide();
  // });
});
