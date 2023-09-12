document.addEventListener("DOMContentLoaded", async function () {
  const inputsEl = document.querySelectorAll('[type="checkbox"]');
  const searchInput = document.querySelector(".search-input");
  const noCityFound = document.querySelector(".no-city-match-container");
  const form = document.getElementById("city-selection-form");

  searchInput.addEventListener("input", function () {
    const searchValue = searchInput.value.toLowerCase();
    let noMatch = true; // Initialize as true

    inputsEl.forEach(function (checkbox) {
      const parentDiv = checkbox.closest(".city");
      if (parentDiv) {
        const cityName = parentDiv
          .querySelector("label")
          .textContent.toLowerCase();
        const shouldShow = cityName.includes(searchValue);
        parentDiv.style.display = shouldShow ? "block" : "none";

        if (shouldShow) {
          noMatch = false; // Set to false if a match is found
        }
      }
    });

    // Update the "Not city match" message display
    noCityFound.style.display = noMatch ? "block" : "none";
    form.style.display = noMatch ? "none" : "block";
  });

  inputsEl.forEach(function (checkbox) {
    checkbox.addEventListener("click", function (e) {
      const parentDiv = checkbox.closest(".city");

      if (parentDiv) {
        if (e.target.checked) {
          parentDiv.style.backgroundColor = "#3d84eec2";
        } else {
          parentDiv.style.backgroundColor = "#05051fc2";
        }
      }
    });
  });
});
