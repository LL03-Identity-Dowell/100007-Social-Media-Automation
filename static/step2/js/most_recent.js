document.addEventListener("DOMContentLoaded", async function () {
  const itemsPerPage = 5;
  let currentPage = 1;

  const articleTemplate = (article) => {
    return `
      <div>
            <span class="source-link">${
              article.source ? article.source : "None"
            }</span>
            <div class="article-main">
                <div>
                    <h3>${article.title}</h3>
                    <p>${article.paragraph}</p>
                    <span><div class="icons8-clock"></div><p>${
                      article.Date
                    }</p></span>
                </div>
                <img src="${article.image}" alt="image" />
            </div>
        </div>
        `;
  };

  const calculateTimeDifference = (timestamp) => {
    const now = new Date();
    const postDate = new Date(timestamp);
    const timeDifference = now - postDate;
    const minutes = Math.floor(timeDifference / (1000 * 60));
    const month = Math.floor(minutes / 43829);
    const week = Math.floor((minutes % 43829) / 10080);
    const day = Math.floor((minutes % 10080) / 1440);
    if (month !== 0) {
      return `${
        month !== 0 ? month + ` ${month === 1 ? "month" : "months"}` : ""
      }
        ${
          week !== 0 ? ", " + week + ` ${week === 1 ? "week" : "weeks"}` : ""
        } ago
        
        `;
    }
    if (month === 0) {
      return `${week !== 0 ? week + ` ${week === 1 ? "week" : "weeks"}` : ""}
        ${day !== 0 ? ", " + day + ` ${day === 1 ? "day" : "days"}` : ""} ago
        
        `;
    }
  };

  const fetchedData = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/recent_json");
      const data = await res.json();
      return { data: data.response, totalCount: data.response.length };
    } catch (error) {
      console.log(error);
      alert(error.message);
    }
  };

  const { data, totalCount } = await fetchedData();

  function displayData(showData, totalCount) {
    const articlesContainer = document.querySelector(".articles-container");
    articlesContainer.innerHTML = "";

    document.getElementById(
      "post-count"
    ).innerHTML = `<p>Total posts count: ${totalCount}</p>`;

    if (Array.isArray(showData)) {
      let articlesHtml = ""; // Initialize an empty string to accumulate HTML

      showData.forEach((article) => {
        article.Date = calculateTimeDifference(article.Date);
        articlesHtml += articleTemplate(article); // Concatenate the rendered article HTML
      });

      articlesContainer.innerHTML = articlesHtml; // Set the accumulated HTML
    }
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

  async function displayDataForCurrentPage() {
    const { data, totalCount } = await fetchedData();

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const dataToShow = data.slice(startIndex, endIndex);
    console.log(dataToShow);
    displayData(dataToShow, totalCount);
    displayPagination(totalCount);
  }

  displayDataForCurrentPage();
});
