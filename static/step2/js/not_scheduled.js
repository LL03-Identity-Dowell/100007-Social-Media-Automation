// javaScript for animated navbar with underline
$(".nav-link").on("click", function () {
    console.log("I just got called");
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

function load_not_scheduled() {
    document.getElementById("scheduled_posts").style.visibility = "hidden";
    myvar = document
        .getElementById("unscheduled_posts")
        .setAttribute("hidden", "");
}

function load_scheduled() {
    document.getElementById("unscheduled_posts").style.visibility = "hidden";
    document.getElementById("scheduled_posts").removeAttribute("hidden");
}
