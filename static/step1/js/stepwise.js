// console.log({{ sentencesForm.adjective }})  
// <select name="subject_determinant" class="form-select" id="id_subject_determinant">
//   <option value="-"></option>

//   <option value="the" selected>the</option>

//   <option value="a">a</option>

//   <option value="an">an</option>

// </select> 

// ======================== 

//  <select name="subject" class="form-select" id="id_subject">
//   <option value="Livinglab">Livinglab</option>

//   <option value="Innovation">Innovation</option>

//   <option value="User experience">User experience</option>

//   <option value="Storytelling">Storytelling</option>

//   <option value="Consumer Behaviour">Consumer Behaviour</option>

//   <option value="Behavioral economics">Behavioral economics</option>

//   <option value="Consumer Insights">Consumer Insights</option>

//   <option value="Statistics" selected>Statistics</option>

// </select> 

//========================
//<select name="object_determinant" class="form-select" id="id_object_determinant">
// <option value="-"></option>

//  <option value="the">the</option>

//  <option value="a">a</option>

//  <option value="an" selected>an</option>

//</select

//========================
//<input type="text" name="verb" value="skills learning" class="form-control" maxlength="100" required id="id_verb"> {%

// ========================

//<input type="text" name="adjective" value="training" class="form-control" maxlength="100" required id="id_adjective">

//========================
// <input type="text" name="object" value="to educate" class="form-control" maxlength="100" required id="id_object">

let specifyTopic;
let yourTopic;
//has/had
let activites;
let specifyPurpose;
let specifyActivity;
let purposeOfArticle;

const idValues = ["id_subject_determinant", "id_subject", "id_verb", "id_object_determinant", "id_adjective", "id_object"]
const display = document.getElementById("sentencePreview");

function capitalizeFirstLetter(word) {
  if (word.length === 0) {
    return word; // Return the word as-is if it's empty
  }

  const firstLetter = word.charAt(0).toUpperCase();
  const restOfWord = word.slice(1);

  return firstLetter + restOfWord;
}

function updateDisplay() {
  specifyTopic = document.getElementById("id_subject_determinant").value;
  let capitalizedSpecifyTopic = capitalizeFirstLetter(specifyTopic);
  yourTopic = document.getElementById("id_subject").value;
  //has/had
  activites = document.getElementById("id_verb").value;
  specifyPurpose = document.getElementById("id_object_determinant").value;
  specifyActivity = document.getElementById("id_adjective").value;
  purposeOfArticle = document.getElementById("id_object").value;
  let sentencePreview = `${capitalizedSpecifyTopic} ${yourTopic} (was/had/is)  ${activites} (-ing/-ed) ${specifyPurpose} ${specifyActivity} ${purposeOfArticle}`;
  display.innerHTML = sentencePreview;
}

idValues.forEach(id => {
  const element = document.getElementById(id);
  if (element) {
    element.addEventListener("change", updateDisplay);
  }
})

updateDisplay();




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
    displayNotification("Generating topics...");
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
