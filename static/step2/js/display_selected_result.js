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
    data: JSON.stringify({
      session_id: "f5u2udocbu8e3mg12hw9tb1h0h5wzcbe",
      product: "Living Lab Admin",
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
