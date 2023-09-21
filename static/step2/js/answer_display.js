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

$("#rateForm").submit(function () {
  if (non_zero_ranks >= 3) {
    // AmagiLoader.show();

    // Wait for the loader to finish loading
    setTimeout(() => {
      $(".s-alert").addClass("show timeout");

      // After the alert is shown, hide it after 20 seconds
      setTimeout(() => {
        $(".s-alert").addClass("hide");
      }, 20000);
    });

    return true;
  } else {
    $("#alertPopup").addClass("show");
    return false;
  }
});

function closeAlert() {
  var alert = document.querySelector(".s-alert");
  alert.style.display = "none";
}
function closeAlert1() {
  var alert = document.querySelector("#alertPopup");
  alert.style.display = "none";
}
