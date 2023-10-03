function notAdmin() {
  $("div.warning").fadeIn(300).delay(1500).fadeOut(500);
}

var currentTab = 0; // Current tab is set to be the first tab (0)
showTab(currentTab); // Display the current tab

function showTab(n) {
  // This function will display the specified tab of the form...
  var x = document.getElementsByClassName("tab");
  x[n].style.display = "block";
  //... and fix the Previous/Next buttons:
  if (n == 0) {
    document.getElementById("prevBtn").style.display = "none";
  } else {
    document.getElementById("prevBtn").style.display = "inline";
  }
  if (n == x.length - 1) {
    document.getElementById("nextBtn").innerHTML = "Submit";
  } else {
    document.getElementById("nextBtn").innerHTML = "Next";
  }
  //... and run a function that will display the correct step indicator:
  fixStepIndicator(n);
}

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (n == 1 && !validateForm()) return false;
  // Hide the current tab:
  x[currentTab].style.display = "none";
  // Increase or decrease the current tab by 1:
  currentTab = currentTab + n;
  // if you have reached the end of the form...
  if (currentTab >= x.length) {
    // ... the form gets submitted:
    document.getElementById("regForm").submit();
    showPopup("Generating topics...");
    AmagiLoader.show();
    const popup = document.querySelector(".popup");
    popup.classList.add("timeout");
    setTimeout(() => {
      popup.remove();
    }, 10000);
    setTimeout(() => {
      AmagiLoader.hide();
    }, 30000);
    return false;
  }
  // Otherwise, display the correct tab:
  showTab(currentTab);
}

function showPopup(message) {
  const popup = document.createElement("div");
  popup.className = "popup";
  popup.innerHTML = `
    <span class="cancel-icon">&times;</span>
    <p>${message}</p>
  `;

  const cancelIcon = popup.querySelector(".cancel-icon");
  cancelIcon.addEventListener("click", () => {
    popup.remove();
  });

  document.body.appendChild(popup);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x,
    y,
    i,
    valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class on the current step:
  x[n].className += " active";
}
const AmagiLoader = {
  __loader: null,
  __progressText: null,
  show: function () {
    if (this.__loader == null) {
      var divContainer = document.createElement("div");
      divContainer.style.position = "fixed";
      divContainer.style.left = "0";
      divContainer.style.top = "0";
      divContainer.style.width = "100%";
      divContainer.style.height = "100%";
      divContainer.style.zIndex = "9998";
      divContainer.style.backgroundColor = "rgba(250, 250, 250, 0.80)";

      var div = document.createElement("div");
      div.style.position = "absolute";
      div.style.left = "50%";
      div.style.top = "50%";
      div.style.zIndex = "9999";
      div.style.height = "100px";
      div.style.width = "100px";
      div.style.margin = "-76px 0 0 -76px";
      div.style.border = "8px solid #e1e1e1";
      div.style.borderRadius = "50%";
      div.style.borderTop = "8px solid #F36E21";
      div.animate(
        [{ transform: "rotate(0deg)" }, { transform: "rotate(360deg)" }],
        {
          duration: 2000,
          iterations: Infinity,
        }
      );
      divContainer.appendChild(div);
      this.__loader = divContainer;

      var progressText = document.createElement("div");
      progressText.style.position = "absolute";
      progressText.style.left = "48%";
      progressText.style.top = "47%";
      progressText.style.transform = "translate(-50%, -50%)";
      progressText.style.fontSize = "14px";
      progressText.style.fontWeight = "bold";
      progressText.style.color = "#333";
      progressText.style.textAlign = "center";
      divContainer.appendChild(progressText);
      this.__progressText = progressText;

      document.body.appendChild(this.__loader);
    }
    this.__loader.style.display = "";

    var loadTime = 20000; // Adjust the load time duration in milliseconds
    var increment = 20; // Increment in percentage for each interval

    var currentProgress = 0;
    var interval = setInterval(() => {
      currentProgress += increment;
      if (currentProgress > 100) {
        clearInterval(interval);
        this.hide();
      } else {
        this.updateProgress(currentProgress);
      }
    }, loadTime / (100 / increment));
  },
  hide: function () {
    if (this.__loader != null) {
      this.__loader.style.display = "none";
    }
  },
  updateProgress: function (percentage) {
    if (this.__progressText) {
      this.__progressText.textContent = `${percentage}%`;
    }
  },
};
