const tagBtn = document.getElementById("tagBtn");
const mentionBtn = document.getElementById("mentionBtn");
const saveBtn = document.getElementById("saveBtn");
let checkboxes;

// function updateSaveButtonState() {
//     const hashtagsChecked = document.querySelectorAll('input[name="hashtag_value"]:checked').length > 0;
//     const mentionsChecked = document.querySelectorAll('input[name="mention_value"]:checked').length > 0;
//     saveBtn.disabled = !(hashtagsChecked || mentionsChecked);
// }

// updateSaveButtonState();

tagBtn.addEventListener("click", (e) => {
    e.preventDefault();

    pushData('hashtag_value', 'tag_input', 'tag_col');
    checkboxes = document.querySelectorAll('input[name="hashtag_value"], input[name="mention_value"]');
    addEvent(checkboxes); addEvent(checkboxes);
    // updateSaveButtonState();
})

mentionBtn.addEventListener("click", (e) => {
    e.preventDefault();
    pushData('mention_value', 'men_input', 'men_col');
    checkboxes = document.querySelectorAll('input[name="hashtag_value"], input[name="mention_value"]');
    addEvent(checkboxes);
    // updateSaveButtonState();
})

function pushData(name, inputId, col) {
    let addHash;
    let view = document.getElementById(col);
    let inputText = document.getElementById(inputId).value;

    if (!inputText) {
        return;
    }

    if (col == "tag_col") {
        addHash = `#${inputText}`;
    } else {
        addHash = inputText;
    }

    view.innerHTML += `<div class="form-check me-3" role="tags_mentions">
                          <input class="form-check-input" type="checkbox" value="${addHash}" name="${name}" id="${name}">
                          <label class="form-check-label font-italic" for="${name}" id="mention_list" style="font-weight: 500">
                            ${addHash}
                          </label>
                          <button style="font-size: 10px;" type="button" class="btn-close btn-sm" aria-label="Close"  onclick="removeDiv(this)"></button>
                        </div>`;
    document.getElementById(inputId).value = "";

}



function submitForm() {
    // Gather data from hashtags and mentions
    const hashtagsList = Array.from(document.querySelectorAll('input[name="hashtag_value"]:checked'))
        .map(checkbox => checkbox.value);
    const mentionsList = Array.from(document.querySelectorAll('input[name="mention_value"]:checked'))
        .map(checkbox => checkbox.value);

    // Update the hidden input fields with the collected data
    document.getElementById('hashtags_list').value = hashtagsList.join(',');
    document.getElementById('mentions_list').value = mentionsList.join(',');

    // Submit the form to  backend
    document.getElementById('hashMentionForm').submit();
}


function removeDiv(button) {
    const divToRemove = button.parentElement; // Get the parent div
    if (divToRemove) {
        divToRemove.remove();
    }
    checkboxes = document.querySelectorAll('input[name="hashtag_value"], input[name="mention_value"]');
    addEvent(checkboxes);
    // updateSaveButtonState();
}

// Add event listeners to checkboxes
// const addEvent = (checkboxElements) => {
//     checkboxElements.forEach(checkbox => {
//         checkbox.addEventListener("change", () => {
//             updateSaveButtonState();
//         });
//     });
// }