// varaible from views checking if user has social profile
var userStatus = "{{user_has_social_media_profile}}";

// convert python boolean to javascript  readable boolean
function toJsBoolean() {
    let jsUserStatus;
    if (userStatus == "False") {
        jsUserStatus = false;
    } else {
        jsUserStatus = true;
    }
    return jsUserStatus;
}

let newUserStatus = toJsBoolean();
//console.log(newUserStatus);

// Show popup and delete local storage item only after reload and if local storage has item 'realoding'
window.onload = function () {
    var reloading = sessionStorage.getItem("reloading");
    //console.log(reloading);
    if (reloading) {
        sessionStorage.removeItem("reloading");
        showPopup.showLinkAcc();
    }
};

// Function object containing all functions for the popup Element
const showPopup = {
    showActivate() {
        showPopup.appendContainerAndText();
        showPopup.appendBtnContainer();
        showPopup.appendBtnActivate();
    },

    showLinkAcc() {
        showPopup.appendContainerAndText();
        showPopup.appendBtnContainer();
        showPopup.appendBtnLinkAndDone();
    },

    appendContainerAndText() {
        var popup = document.createElement("div");
        popup.className = "popup";

        var cancelIcon = document.createElement("i");
        cancelIcon.className = "fas fa-times cancel-icon";
        cancelIcon.onclick = function () {
            document.body.removeChild(popup);
        };

        var textContainer = document.createElement("div");
        textContainer.className = "text-container";
        var text = document.createElement("p");
        text.innerHTML = "Link your social media accounts";

        textContainer.appendChild(text);
        popup.appendChild(cancelIcon);
        popup.appendChild(textContainer);
        document.body.appendChild(popup);
    },

    appendBtnContainer() {
        var popup = document.querySelector(".popup");
        var buttonContainer = document.createElement("div");
        var buttonContainerActivate = document.createElement("div");
        var buttonContainerLink = document.createElement("div");
        var buttonContainerDone = document.createElement("div");
        buttonContainer.className = "button-container";
        buttonContainerActivate.className = "button-container-activate";
        buttonContainerLink.className = "button-container-link";
        buttonContainerDone.className = "button-container-done";

        buttonContainer.appendChild(buttonContainerActivate);
        buttonContainer.appendChild(buttonContainerLink);
        popup.appendChild(buttonContainer);
        popup.appendChild(buttonContainerDone);
    },

    appendBtnActivate() {
        var buttonContainerActivate = document.querySelector(
            ".button-container-activate"
        );
        var doneButton1 = document.createElement("a");
        doneButton1.href = "{% url 'generate_article:aryshare' %}";
        doneButton1.innerHTML = "activate user";
        doneButton1.className = "btn btn-primary done-button";
        doneButton1.style.width = "230px";
        doneButton1.style.height = "40px";
        doneButton1.style.borderRadius = "5px";

        buttonContainerActivate.appendChild(doneButton1);
        // set item 'reloading' : 'true' in the local storage only when activate user button is clicked
        doneButton1.addEventListener("click", function () {
            sessionStorage.setItem("reloading", "true");
            doneButton1.innerHTML = "activating <strong>....</strong>";
        });
    },

    appendBtnLinkAndDone() {
        document.querySelector(".button-container-activate").style.display = "none";
        var buttonContainerDone = document.querySelector(".button-container-done");
        var buttonContainerLink = document.querySelector(".button-container-link");
        var doneButton2 = document.createElement("a");
        doneButton2.href = "{% url 'generate_article:link_social_media' %}";
        doneButton2.innerHTML = "link socialmedia accounts";
        doneButton2.className = "btn btn-primary done-button";
        doneButton2.style.width = "230px";
        doneButton2.style.height = "40px";
        doneButton2.style.borderRadius = "5px";
        doneButton2.target = "_blank";

        var doneButton3 = document.createElement("button");
        doneButton3.innerHTML = "Done";
        doneButton3.className = "btn btn-primary done-button";
        doneButton3.style.width = "100px";
        doneButton3.style.borderRadius = "5px";
        doneButton3.onclick = function () {
            history.back();
        };

        buttonContainerLink.appendChild(doneButton2);
        buttonContainerDone.appendChild(doneButton3);
    },
};
