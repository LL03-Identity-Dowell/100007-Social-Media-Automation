let non_zero_ranks = 0;

$(function () {
  //code to populate the selects
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

  //if ranking==0, enable option 1, do this incrementally for the rest
  function updateOptionClickableAbility() {
    //enable all options with value of plus 1
    var op = document.getElementsByTagName("option");
    for (var i = 0; i < op.length; i++) {
      console.log(`${op[i].value}##${non_zero_ranks}`);
      if (parseInt(op[i].value) - 1 === non_zero_ranks) {
        op[i].disabled = false;
        op[i - 1].disabled = false;
      } else {
        op[i].disabled = true;
      }
    }
  }
  updateOptionClickableAbility();
  $("select").on("change", function (event) {
    // This binds listeners to the change event on all the select elements
    var sId = this.id; // store off the changed element id
    var vId = this.value; // store off the changed element value
    non_zero_ranks = 0; //always initialize number of ranks which are zero
    $("select").each(function () {
      // this loops across the same set of elements
      if (this.id !== sId && this.value === vId) {
        // If it is not the triggering element and the value is the same, do something
        this.options.selectedIndex = 0; // reset the value to 'rank'
      }
      if (this.value != 0) {
        non_zero_ranks++;
      }
      updateOptionClickableAbility();
    });
  });
});

$("#rateForm").submit(function () {
  // Check the number of ranks selected...
  if (non_zero_ranks >= 3) {
    return true;
  } else {
    alert("You need to rank more than three sentences to submit.");
    return false; // return false to cancel form action
  }
});

$("#rateForm").validate({
  rules: {
    rank_1: { required: true },
    rank_2: { required: true },
    rank_3: { required: true },
    rank_4: { required: true },
    rank_5: { required: true },
    rank_6: { required: true },
    rank_7: { required: true },
    rank_8: { required: true },
    rank_9: { required: true },
    rank_10: { required: true },
    rank_11: { required: true },
    rank_12: { required: true },
  },
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
