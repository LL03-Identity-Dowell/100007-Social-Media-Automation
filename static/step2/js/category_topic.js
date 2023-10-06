const catBtn = document.getElementById("catBtn");
const topicBtn = document.getElementById("topicBtn");
const saveBtn = document.getElementById("saveBtn");
let checkboxes;

function updateSaveButtonState() {
    const catChecked = document.querySelectorAll('input[name="cat_value"]:checked').length > 0;
    const topicChecked = document.querySelectorAll('input[name="topic_value"]:checked').length > 0;
    saveBtn.disabled = !(catChecked || topicChecked);
}

updateSaveButtonState();

catBtn.addEventListener("click", (e) => {
    e.preventDefault();

    pushData('cat_value', 'cat_input', 'cat_col');
    checkboxes = document.querySelectorAll('input[name="cat_value"], input[name="topic_value"]');
    addEvent(checkboxes); addEvent(checkboxes);
    updateSaveButtonState();
})

topicBtn.addEventListener("click", (e) => {
    e.preventDefault();
    pushData('topic_value', 'topic_input', 'topic_col');
    checkboxes = document.querySelectorAll('input[name="cat_value"], input[name="topic_value"]');
    addEvent(checkboxes);
    updateSaveButtonState();
})

function pushData(name, inputId, col) {
    let view = document.getElementById(col);
    let inputText = document.getElementById(inputId).value;

    if (!inputText) {
        return;
    }

    view.innerHTML += `<div class="form-check me-3" role="cat_topics">
                          <input class="form-check-input" type="checkbox" value="${inputText}" name="${name}" id="${name}">
                          <label class="form-check-label font-italic" for="${name}" id="topic_list" style="font-weight: 500">
                            ${inputText}
                          </label>
                          <button style="font-size: 10px;" type="button" class="btn-close btn-sm" aria-label="Close"  onclick="removeDiv(this)"></button>
                        </div>`;
    document.getElementById(inputId).value = "";

}



function submitForm() {
    // Gather data from hashtags and mentions
    const categoryList = Array.from(document.querySelectorAll('input[name="cat_value"]:checked'))
        .map(checkbox => checkbox.value);
    const topicList = Array.from(document.querySelectorAll('input[name="topic_value"]:checked'))
        .map(checkbox => checkbox.value);

    // Update the hidden input fields with the collected data
    document.getElementById('category_list').value = categoryList.join(',');
    document.getElementById('topic_list').value = topicList.join(',');

    // Submit the form to  backend
    document.getElementById('categoryTopicForm').submit();
}


function removeDiv(button) {
    const divToRemove = button.parentElement; // Get the parent div
    if (divToRemove) {
        divToRemove.remove();
    }
    checkboxes = document.querySelectorAll('input[name="cat_value"], input[name="topic_value"]');
    addEvent(checkboxes);
    updateSaveButtonState();
}

// Add event listeners to checkboxes
const addEvent = (checkboxElements) => {
    checkboxElements.forEach(checkbox => {
        checkbox.addEventListener("change", () => {
            updateSaveButtonState();
        });
    });
}