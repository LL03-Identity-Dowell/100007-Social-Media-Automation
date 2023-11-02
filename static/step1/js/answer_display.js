function goBack() {
  history.back();
}
let non_zero_ranks = 0;

function preview() {
  console.log(document.form1.rank_1.value);
  console.log(document.form1.rank_2.value);
  console.log(document.form1.rank_3.value);
  console.log(document.form1.rank_4.value);
}

$(function () {
  // code to populate the selects
  let data = [];
  let selected_counter = 0;
  for (var count = 1; count <= 12; count++) {
    data[count - 1] = { code: count, name: count };
  }

  function populate(data) {
    data.forEach(function (e, i) {
      $("select").append($("<option></option>").val(e.code).text(e.name));
    });
  }

  populate(data);

  function updateOptionClickableAbility() {
    // Keep an array of all used ranks.
    var used_ranks = [];
    // Get all select elements.
    var selects = document.getElementsByTagName("select");

    Array(...selects).forEach((select) => {
      // Add the selected value to the used ranks.
      if (select.value !== "0") {
        used_ranks.push(select.value);
      }
      // Go over all options for that select element
      Array(...select.getElementsByTagName("option")).forEach((option) => {
        // If the option is not an integer, skip
        if (!parseInt(option.value)) {
          return;
        }
        // If that option's value is not selected and the value has been used, disable the option.
        if (
          option.value !== select.value &&
          used_ranks.includes(option.value)
        ) {
          option.disabled = true;
        } else {
          option.disabled = false;
        }
      });
    });
  }

  updateOptionClickableAbility();

  $("select").on("change", function (event) {
    var sId = this.id;
    var vId = this.value;
    non_zero_ranks = 0;
    $("select").each(function () {
      if (this.id !== sId && this.value === vId) {
        this.options.selectedIndex = 0;
      }
      if (this.value != 0) {
        non_zero_ranks++;
      }
      updateOptionClickableAbility();
    });
  });
});

// $("#rateForm").submit(function () {
//   if (non_zero_ranks >= 3) {
//     // AmagiLoader.show();

//     // Wait for the loader to finish loading
//     setTimeout(() => {
//       $(".s-alert").addClass("show timeout");

//       // After the alert is shown, hide it after 20 seconds
//       setTimeout(() => {
//         $(".s-alert").addClass("hide");
//       }, 20000);
//     });

//     return true;
//   } else {
//     $("#alertPopup").addClass("show");
//     return false;
//   }
// });

$("#rateForm").submit(function () {
  if (non_zero_ranks < 3) {
    displayNotification("You need to rank three or more sentences to submit.");
    return false;
  } else {
    displayNotification("Submitting your ranked topics...");
    return true;
  }
});

// function closeAlert() {
//   var alert = document.querySelector("#alertSuccess");
//   alert.style.display = "none";
// }
// function closeAlert1() {
//   var alert = document.querySelector("#alertPopup");
//   alert.style.display = "none";
// }


// displayNotification("Testing notification");

//Custom Notification popup
function displayNotification(message) {
  // Create a new notification element
  var notification = document.createElement('div');
  notification.classList.add('custom-notification');
  notification.innerHTML = `
    <div class="notification">
      ${message}
      <button class="close-button">&times;</button>
    </div>
  `;

  document.body.appendChild(notification);

  // Add an event listener to the close button
  var closeButton = notification.querySelector('.close-button');
  closeButton.addEventListener('click', function () {
    notification.style.display = 'none';
  });

  // Automatically close the notification after a set duration
  notification.classList.add('timeout');
  var contentElement = notification.querySelector('.notification');
  var animationDuration = 10000; // Animation duration in milliseconds
  var animationStartTime = Date.now();

  function decreaseWidth() {
    var currentTime = Date.now();
    var elapsedTime = currentTime - animationStartTime;
    var progress = elapsedTime / animationDuration;
    var updatedWidth = 100 - (progress * 100); // Decrease width linearly over time

    contentElement.style.setProperty('--after-width', updatedWidth + '%');

    if (progress < 1) {
      requestAnimationFrame(decreaseWidth);
    } else {
      notification.style.display = 'none'; // Hide the notification
    }
  }

  requestAnimationFrame(decreaseWidth);
}
