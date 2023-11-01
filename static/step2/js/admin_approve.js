function approveSelected() {
    const checkboxes = document.querySelectorAll('.request-checkbox');
    const selectedRequests = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedRequests.push(`${checkbox.value}`);
            checkbox.parentNode.parentNode.remove(); // Remove the checkbox's parent element (the entire request item)
        }
    });

    if (selectedRequests.length > 0) {
        document.getElementById('approval-status').innerHTML = `<strong>Approved:</strong> ${selectedRequests.join(', ')}`;
        document.getElementById('approval-status').style.color = "green";
    } else {
        document.getElementById('approval-status').innerHTML = 'No requests selected.';
    }
}

function rejectSelected() {
    const checkboxes = document.querySelectorAll('.request-checkbox');
    const selectedRequests = [];

    checkboxes.forEach((checkbox, index) => {
        if (checkbox.checked) {
            selectedRequests.push(`${checkbox.value}`);
            checkbox.parentNode.parentNode.remove(); // Remove the checkbox's parent element (the entire request item)
        }
    });

    if (selectedRequests.length > 0) {
        document.getElementById('approval-status').innerHTML = `Rejected: ${selectedRequests.join(', ')}`;
        document.getElementById('approval-status').style.color = "red"
    } else {
        document.getElementById('approval-status').innerHTML = 'No requests selected.';
    }
}

function approveAll() {
    const checkboxes = document.querySelectorAll('.request-checkbox');
    const allRequests = [];

    checkboxes.forEach((checkbox, index) => {
        allRequests.push(`${checkbox.value}`);
        checkbox.parentNode.parentNode.remove(); // Remove the checkbox's parent element (the entire request item)
    });

    if (allRequests.length > 0) {
        document.getElementById('approval-status').innerHTML = `Approved all: ${allRequests.join(', ')}`;
        document.getElementById("approval-status").style.color = "green"
    } else {
        document.getElementById('approval-status').innerHTML = 'No requests to approve.';
    }
}