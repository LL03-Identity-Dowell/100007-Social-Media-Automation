document.addEventListener("DOMContentLoaded", () => {
  const totalPostEl = document.getElementById("total-number-posts");

  function getToken(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== "") {
      const cookies = document.cookie.split(";");
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();
        // Does this cookie string begin with the name we want?
        if (cookie.substring(0, name.length + 1) === name + "=") {
          cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
          break;
        }
      }
    }
    return cookieValue;
  }

  const article = (element) => {
    let { PK, source, Date, title, paragraph, image } = element;
    return `
    <li class="article" id=${PK}>
    <div>
        <span>${source}</span>
        <h3>${title}</h3>
        <p>${paragraph}</p>
        <div class="btns">
            <button type="button" class="open">Post Now</button>
            <button type="button" class="schedule">Schedule</button>
        </div>
    </div>
    <img src=${image} alt="image">
    </li>
`;
  };

  const dateFormat = (initialDate) => {
    const dateObj = new Date(initialDate || Date.now());
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    const year = dateObj.getFullYear();

    let hours = String(dateObj.getHours()).padStart(2, "0");
    let minutes = String(dateObj.getMinutes()).padStart(2, "0");
    const seconds = String(dateObj.getSeconds()).padStart(2, "0");

    const formattedDate = `${month}/${day}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
  };

  const sendData = async (data, options) => {
    if (options === "post") {
      const url = `http://127.0.0.1:8000/media_post/`;
      const csrftoken = getToken("csrftoken");
      const apiOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
      };

      try {
        const res = await fetch(url, apiOptions);
        let data = await res.json();

        if (data === "social_media_channels") {
          location.href = "http://127.0.0.1:8000/social_media_channels/";
        } else if (data === "most_recent") {
          location.href = "http://127.0.0.1:8000/recent/";
        }else if (data === "credit_error") {
          window.location.replace("http://127.0.0.1:8000/main");
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    } else if (options === "schedule") {
      const url = `http://127.0.0.1:8000/media_schedule/`;
      const csrftoken = getToken("csrftoken");
      const apiOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrftoken,
        },
        body: JSON.stringify(data),
      };

      try {
        const res = await fetch(url, apiOptions);
        let data = await res.json();

        if (data === "social_media_channels") {
          location.href = "http://127.0.0.1:8000/social_media_channels/";
        } else if (data === "scheduled") {
          location.href = "http://127.0.0.1:8000/scheduled/";
        }else if (data === "credit_error") {
          window.location.replace("http://127.0.0.1:8000/main");
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
  };

  const itemsPerPage = 5;
  let currentPage = 1;

  const fetchedData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/jsonpost/");
      let data = await res.json();
      data = JSON.parse(data.response);

      let totalCount = data.length;

      return { data, totalCount };
    } catch (error) {
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


// You can use like so: 
displayNotification("You do not have any article to post, create more.");
      return { data: [], totalCount: 0 };
    }
  };

  const fetchedSocials = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/linked-account/");
      let data = await res.json();
      data = data.response;
      return data;
    } catch (error) {
      alert("Error fetching data:");
      return { data: [] };
    }
  };
  // fetchedSocials()

  function displayData(showData, totalCount) {
    let container = document.getElementById("article-list");
    container.innerHTML = "";

    totalPostEl.textContent = `Total posts count: ${totalCount}`;

    let articles = showData.map((element) => article(element));
    container.innerHTML = articles;

    const dateTimeEl = document.getElementById("date-time");
    const form = document.getElementById("form");
    const submitButton = document.getElementById("done");
    const openSchedule = document.querySelectorAll(".schedule");
    const openPost = document.querySelectorAll(".open");
    const close = document.getElementById("close");
    const modal = document.getElementById("modal");
    const scheduleBtns = document.getElementById("schedule-btns");

    const selectedPlatforms = (index, options) => {
      if (options === "schedule") {
        scheduleBtns.insertBefore(dateTimeEl, submitButton); // Add the dateTimeEl element back to the form
      } else if (options === "post") {
        if (dateTimeEl.parentElement === scheduleBtns) {
          scheduleBtns.removeChild(dateTimeEl);
        }
      }
      const handleSubmit = async () => {
        const data = await fetchedSocials();
        console.log("[Linked account]", data);
        const checkboxes = form.querySelectorAll("input[type='checkbox']");
        let selectedArticle = { ...showData[index] };
        selectedArticle.social = [];
        selectedArticle.special = [];

        checkboxes.forEach((checkbox) => {
          if (checkbox.checked) {
            if (!data.includes(checkbox.value)) {
              //Custom Notification popup
              function displayNotification(message) {
                // Create a new notification element
                var notification = document.createElement("div");
                notification.classList.add("custom-notification");
                notification.innerHTML = `
                <div class="notification">
                  ${message}
                  <button class="close-button">&times;</button>
                </div>
              `;

                document.body.appendChild(notification);

                // Add an event listener to the close button
                var closeButton = notification.querySelector(".close-button");
                closeButton.addEventListener("click", function () {
                  notification.style.display = "none";
                });

                // Automatically close the notification after a set duration
                notification.classList.add("timeout");
                var contentElement =
                  notification.querySelector(".notification");
                var animationDuration = 10000; // Animation duration in milliseconds
                var animationStartTime = Date.now();

                function decreaseWidth() {
                  var currentTime = Date.now();
                  var elapsedTime = currentTime - animationStartTime;
                  var progress = elapsedTime / animationDuration;
                  var updatedWidth = 100 - progress * 100; // Decrease width linearly over time

                  contentElement.style.setProperty(
                    "--after-width",
                    updatedWidth + "%"
                  );

                  if (progress < 1) {
                    requestAnimationFrame(decreaseWidth);
                  } else {
                    notification.style.display = "none"; // Hide the notification
                  }
                }

                requestAnimationFrame(decreaseWidth);
              }

              // You can use like so:
              displayNotification(
                `${checkbox.value} account have not been linked`
              );
            } else {
              if (
                checkbox.value === "twitter" ||
                checkbox.value === "pinterest"
              ) {
                selectedArticle.special.push(checkbox.value);
              } else {
                selectedArticle.social.push(checkbox.value);
              }
            }
          }
        });

        if (options === "schedule") {
          const scheduleValue = form.querySelector(
            "input[type='datetime-local']"
          ).value;
          selectedArticle.schedule = dateFormat(scheduleValue);
        }
        sendData(selectedArticle, options);

        // Remove the dateTimeEl element from the form if it was added during the process
        if (dateTimeEl.parentElement === scheduleBtns) {
          scheduleBtns.removeChild(dateTimeEl);
        }

        // Reset checkboxes to unchecked state
        checkboxes.forEach((checkbox) => {
          checkbox.checked = false;
        });

        submitButton.removeEventListener("click", handleSubmit);
      };

      submitButton.addEventListener("click", handleSubmit);
    };

    openPost.forEach((button, index) => {
      button.addEventListener("click", () => {
        modal.showModal();
        selectedPlatforms(index, "post");
      });
    });
    openSchedule.forEach((button, index) => {
      button.addEventListener("click", () => {
        selectedPlatforms(index, "schedule");
        modal.showModal();
      });
    });

    close.addEventListener("click", () => {
      modal.close();
    });
  }

  function displayPagination(totalCount) {
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const paginationContainer = document.getElementById("paginationContainer");
    paginationContainer.innerHTML = "";

    // Previous Button
    const prevButton = document.createElement("button");
    prevButton.textContent = "Previous";
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        displayDataForCurrentPage();
        updatePaginationButtons();
      }
    });

    paginationContainer.appendChild(prevButton);

    // Display page numbers

    const startPage = Math.floor((currentPage - 1) / 5) * 5 + 1;
    const endPage = Math.min(startPage + 4, totalPages);

    //Current page number
    for (let i = startPage; i <= endPage; i++) {
      const pageLink = document.createElement("a");
      pageLink.textContent = i;
      pageLink.href = "#";
      pageLink.addEventListener("click", (event) => {
        event.preventDefault();
        currentPage = i;
        displayDataForCurrentPage();
        updatePaginationButtons();
      });
      paginationContainer.appendChild(pageLink);
    }

    // More Button
    const moreButton = document.createElement("span");
    if (totalPages <= 7) {
      moreButton.style.display = "none";
    }
    moreButton.textContent = ">>";
    moreButton.addEventListener("click", () => {
      const maxPage = Math.ceil(totalPages / 7); // Increase '5' to display more page numbers at once
      const nextGroupLastPage = currentPage + 5;
      currentPage = Math.min(nextGroupLastPage, maxPage);
      displayDataForCurrentPage();
      updatePaginationButtons();
    });
    paginationContainer.appendChild(moreButton);

    // Next Button
    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.addEventListener("click", () => {
      if (currentPage < totalPages) {
        currentPage++;
        displayDataForCurrentPage();
        updatePaginationButtons();
      }
    });

    paginationContainer.appendChild(nextButton);

    updatePaginationButtons(totalCount);
  }

  function updatePaginationButtons(totalCount) {
    const totalPages = Math.ceil(totalCount / itemsPerPage);

    const paginationLinks = document.querySelectorAll("#paginationContainer a");
    const prevButton = document.querySelector(
      "#paginationContainer button:nth-child(1)"
    );
    const nextButton = document.querySelector(
      "#paginationContainer button:nth-last-child(1)"
    );

    paginationLinks.forEach((link) => {
      link.classList.remove("active");
      if (Number(link.textContent) === currentPage) {
        link.classList.add("active");
      }
    });

    prevButton.disabled = currentPage === 1;
    nextButton.disabled = currentPage === totalPages;
  }

  async function displayDataForCurrentPage() {
    $("html, body").animate({ scrollTop: 0 });
    const { data, totalCount } = await fetchedData();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataToShow = data.slice(startIndex, endIndex);
    displayData(dataToShow, totalCount);
    displayPagination(totalCount);
  }

  displayDataForCurrentPage();
});
