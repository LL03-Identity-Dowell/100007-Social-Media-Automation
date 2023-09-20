// javaScript for animated navbar with underline
$(".nav-link").on("click", function () {
  $(".active-link").removeClass("active-link");
  $(this).addClass("active-link");
});
var status = "less";

function toggleText() {
  var text =
    "pointing to the id of the content container. In theory, this allows assistive technology users to jump directly from the toggler to the container it controls–but support for this is currently quite patchy.";

  if (status == "less") {
    document.getElementById("textArea").innerHTML = text;
    document.getElementById("toggleButton").innerText = "See Less";
    status = "more";
  } else if (status == "more") {
    document.getElementById("textArea").innerHTML = "";
    document.getElementById("toggleButton").innerText = "See More";
    status = "less";
  }
}

function toggleHeaderAndButtons() {
  //unhide style header, unhide saver article btn, hide edit&next buttons, set current_status to ok
  document.getElementById("styling-companion-header").removeAttribute("hidden");
  document.getElementById("editAndNext").style.visibility = "hidden";
  document.getElementById("styling-companion-btn").removeAttribute("hidden");
}

function overlay_on() {
  document.getElementById("overlay").removeAttribute("hidden");
  document.getElementById("overlay").style.display = "block";
  document.getElementById("underlay").style.display = "none";
}

function overlay_off() {
  document.getElementById("overlay").style.display = "none";
  document.getElementById("underlay").style.display = "block";
}
