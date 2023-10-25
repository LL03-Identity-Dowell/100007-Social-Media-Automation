document.addEventListener("DOMContentLoaded", function () {
    var closeButtons = document.querySelectorAll(".close-button");
    closeButtons.forEach(function (button) {
        button.addEventListener("click", function () {
            var notification = this.parentNode.parentNode;
            notification.style.display = "none";
        });
    });

    var notification = document.querySelector(".custom-notification");
    notification.classList.add("timeout");

    var contentElement = notification.querySelector(".notification");
    var pseudoElement = getComputedStyle(contentElement, "after");
    var animationDuration = 10000; // Animation duration in milliseconds
    var animationStartTime = Date.now();

    function decreaseWidth() {
        var currentTime = Date.now();
        var elapsedTime = currentTime - animationStartTime;
        var progress = elapsedTime / animationDuration;
        var updatedWidth = 100 - progress * 100; // Decrease width linearly over time

        contentElement.style.setProperty("--after-width", updatedWidth + "%");

        if (progress < 1) {
            requestAnimationFrame(decreaseWidth);
        } else {
            notification.style.display = "none"; // Hide the notification
        }
    }

    requestAnimationFrame(decreaseWidth);
});

checkstatus();

function checkstatus() {
    var lav = document.getElementById("useronline-status-icons");

    // AJAX GET request
    $.ajax({
        url: "https://100014.pythonanywhere.com/en/live_status",
        type: "GET",
        success: function (data) {
            lav.style.color = "green";
            //   lav.innerHTML = JSON.stringify(data);
        },
        error: function (error) {
            //   console.error(error);
            lav.style.color = "red";
        },
    });

    // AJAX POST request
    $.ajax({
        url: "https://100014.pythonanywhere.com/en/live_status",
        type: "POST",
        // data: JSON.stringify({ session_id:{{ request.session.session_id }},product: "Social Media Automation"}),
        data: JSON.stringify({
            session_id: request.session.session_id,
            product: "Social Media Automation",
        }),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.error(error);
        },
    });
}

setInterval(checkstatus, 60000);

