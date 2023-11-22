  const addBtn1 = document.getElementById('addBtn1')
  const addBtn2 = document.getElementById('addBtn2')
  const addBtn3 = document.getElementById('addBtn3')
  const addBtn4 = document.getElementById('addBtn4')
  const saveBtn = document.getElementById("saveBtn");
  let checkboxes;


  function pushData( inputId, parentId) {
      let view = document.getElementById(parentId);
      let inputText = document.getElementById(inputId).value;

      if (!inputText) {
          return;
      }

      view.innerHTML += `<div class="form-check me-3">
              <input class="form-check-input" type="checkbox" value="${inputText}" name="${inputId}">
              <label class="form-check-label font-italic" style="font-weight: 500">
                  ${inputText}
              </label>
              <button style="font-size: 10px;" type="button" class="btn-close btn-sm" aria-label="Close" onclick="removeDiv(this)"></button>
          </div>
      `;
      document.getElementById(inputId).value = "";

  }

  function updateSaveButtonState() {
      const checkboxesLength = document.querySelectorAll("input[type='checkbox']:checked").length > 0;
      saveBtn.disabled = !checkboxesLength;
  }



  addBtn1.addEventListener("click", () => {
    pushData( 'input1', 'parent1');
    checkboxes = document.querySelectorAll("input[type='checkbox']");
    addEvent(checkboxes);
    updateSaveButtonState();
  })

  addBtn2.addEventListener("click", () => {
     pushData( 'input2', 'parent2');
    checkboxes = document.querySelectorAll("input[type='checkbox']");
    addEvent(checkboxes);
    updateSaveButtonState();
  })
  addBtn3.addEventListener("click", () => {
     pushData( 'input3', 'parent3');
    checkboxes = document.querySelectorAll("input[type='checkbox']");
    addEvent(checkboxes);
    updateSaveButtonState();
  })
  addBtn4.addEventListener("click", () => {
     pushData( 'input4', 'parent4');
    checkboxes = document.querySelectorAll("input[type='checkbox']");
    addEvent(checkboxes);
    updateSaveButtonState();
  })

  saveBtn.addEventListener("click", () => {
    const input1List = Array.from(document.querySelectorAll('input[name="input1"]:checked'))
        .map(checkbox => checkbox.value);
    const input2List = Array.from(document.querySelectorAll('input[name="input2"]:checked'))
        .map(checkbox => checkbox.value);
    const input3List = Array.from(document.querySelectorAll('input[name="input3"]:checked'))
        .map(checkbox => checkbox.value);
    const input4List = Array.from(document.querySelectorAll('input[name="input4"]:checked'))
        .map(checkbox => checkbox.value);

        console.log('Input 1 List:', input1List);
        console.log('Input 2 List:', input2List);
        console.log('Input 3 List:', input3List);
        console.log('Input 4 List:', input4List);

    document.getElementById('input1_list').value = input1List.join(',');
    document.getElementById('input2_list').value = input2List.join(',');
    document.getElementById('input3_list').value = input3List.join(',');
    document.getElementById('input4_list').value = input4List.join(',');

    console.log('Form Data:', {
      input1List,
      input2List,
      input3List,
      input4List,
  });

    document.getElementById('form').submit();
  });


  function removeDiv(button) {
      const divToRemove = button.parentElement;
      if (divToRemove) {
          divToRemove.remove();
      }
      checkboxes = document.querySelectorAll("input[type='checkbox']:checked");
      addEvent(checkboxes);
      updateSaveButtonState();
  }

  const addEvent = (checkboxElements) => {
    checkboxElements.forEach(checkbox => {
      checkbox.addEventListener("change", () => {
        updateSaveButtonState();
      });
    });
  }