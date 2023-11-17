function showAdminMessage() {
    alert("You are not an admin!");
}


window.onload = function downdis() {
    console.log("Hellow On Load")
}


// Defualt images details
const defaultImageDetailsArr = [
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/photo-of-hand-holding-a-black-smartphone-2818118/", author: "Magnus Mueller", authorUrl: "https://www.pexels.com/@magnus-mueller-1398178/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/close-up-photography-of-smartphone-icons-267350/", author: "pixabay", authorUrl: "https://www.pexels.com/@pixabay/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/person-wearing-white-silicone-strap-black-smartwatch-267394/", author: "Pixabay", authorUrl: "https://www.pexels.com/@pixabay/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/happy-ethnic-woman-sitting-at-table-with-laptop-3769021/", author: "Andrea Piacquadio", authorUrl: "https://www.pexels.com/@olly/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/photo-of-people-near-wooden-table-3184418/", author: "fauxels", authorUrl: "https://www.pexels.com/@fauxels/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/people-discuss-about-graphs-and-rates-3184292/", author: "Fauxels", authorUrl: "https://www.pexels.com/@fauxels/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/group-of-people-gathered-around-wooden-table-3184360/", author: "Fauxels", authorUrl: "https://www.pexels.com/@fauxels/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/silver-imac-displaying-collage-photos-1779487/", author: "Designecologist", authorUrl: "https://www.pexels.com/@designecologist/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/photo-of-audi-parked-near-trees-1402787/", author: "Vlad Alexandru Popa", authorUrl: "https://www.pexels.com/@vladalex94/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/football-game-1618200/", author: "football wife", authorUrl: "https://www.pexels.com/@football-wife-577822/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/patient-in-front-of-an-autorefractor-6749745/", author: "Antoni Shkraba", authorUrl: "https://www.pexels.com/@shkrabaanthony/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/woman-in-formal-wear-using-atm-6132751/", author: "Elise", authorUrl: "https://www.pexels.com/@coincloud/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/car-with-red-interior-326259/", author: "Pixabay", authorUrl: "https://www.pexels.com/@pixabay/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/abstract-accuracy-accurate-aim-262438/", author: "Pixabay", authorUrl: "https://www.pexels.com/@pixabay/"
    },
    {
        src: "", alt: "", url: "https://www.pexels.com/photo/excited-african-american-male-student-celebrating-successful-results-of-exams-4560142/", author: "Ketut Subiyanto", authorUrl: "https://www.pexels.com/@ketut-subiyanto/"
    }
]

const defaultImageCount = 15;


// set defualt src and alt of images in default image array
document.addEventListener("DOMContentLoaded", function () {
    let alldefaultImageArray = Array(...document.querySelectorAll('.pexels-img'));
    alldefaultImageArray.forEach((image, index) => {
        defaultImageDetailsArr[index].src = image.src;
        defaultImageDetailsArr[index].alt = image.alt;
    })
});


//image array from pexels search API
let copyImgDetailsArray = [];


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




document.querySelector('#edit-post').onclick = editPost;
document.querySelector('#save-post').onclick = savePost;
document.querySelector('#delete-post').onclick = deletePost;

var postpar = document.getElementById('post-paragraph')
var postsor = document.getElementById('post-sources')


function deletePost() {

    var fields = document.getElementsByTagName('input');
    length = fields.length;
    while (length--) {
        if (fields[length].type === 'text') { fields[length].value = ''; }
    }

    $("input[type=text]").val('');

    console.log("lets Delete")
}


let CACHE_IMAGE;
let CACHE_PARAGRAPHS;
let CACHE_SOURCES;
let CACHE_TITLE;

window.onload = function () {
    var prevStrData = localStorage.getItem("previousState");

    if (prevStrData) {
        document.querySelector('.img-overlay').classList.add("show-overlay");
        var prevData = JSON.parse(prevStrData);
        CACHE_IMAGE = prevData.image;
        CACHE_PARAGRAPHS = prevData.paragraphs
        CACHE_SOURCES = prevData.sources;
        CACHE_TITLE = prevData.title;

        editPost();
        updateImage();
    }

}

//status of post editing
let editing = false;

function editPost() {
    editing = true
    document.querySelector('.img-overlay').classList.add("show-overlay");
    // Add an input element to edit the title
    let titleInput = document.createElement('input');
    titleInput.setAttribute('class', 'form-control');
    titleInput.setAttribute('id', 'title-input');
    titleInput.value = document.querySelector('#post-title').innerHTML;
    document.querySelector('#post-title').replaceWith(titleInput);



    // Add a textarea element to edit post content
    let postText;
    if (CACHE_PARAGRAPHS) {
        postText = CACHE_PARAGRAPHS.join('\n');
    } else {
        postText = Array(...document.querySelectorAll('.post-paragraph'))
            .map(element => element.innerHTML)
            .join('\n');
    }
    let paragraphsInput = document.createElement('textarea');
    paragraphsInput.setAttribute('class', 'form-control');
    paragraphsInput.setAttribute('id', 'paragraphs-input');
    paragraphsInput.setAttribute('rows', '7');
    paragraphsInput.value = postText;
    document.querySelector('#post-paragraphs').replaceWith(paragraphsInput);

    // Add a textarea element to edit post sources
    let postSources;
    if (CACHE_SOURCES) {
        postSources = CACHE_SOURCES.join('\n');
    } else {
        postSources = Array(...document.querySelectorAll('.post-source'))
            .map(element => element.innerHTML)
            .join('\n');
    }

    let sourcesInput = document.createElement('textarea');
    sourcesInput.setAttribute('class', 'form-control');
    sourcesInput.setAttribute('id', 'sources-input');
    sourcesInput.setAttribute('rows', '4');
    sourcesInput.value = postSources;
    document.querySelector('#post-sources').replaceWith(sourcesInput);
}


function savePost() {
    editing = false;

    document.querySelector('.img-overlay').classList.remove("show-overlay")
    console.log("Remember to save to database...");

    // Save the new title to the DOM and update hidden input value
    let postTitle = document.createElement('div');
    postTitle.setAttribute('id', 'post-title');
    let newTitle = document.querySelector('#title-input').value;
    postTitle.innerHTML = newTitle;

    // update hidden input value
    document.querySelector('#title').value = newTitle;
    document.querySelector('#title-input').replaceWith(postTitle);

    // Save each new paragraph to the DOM and update hidden input value
    let postParagraphs = document.querySelector('#paragraphs-input').value.split('\n');
    let pDiv = document.createElement('div');
    pDiv.setAttribute('id', 'post-paragraphs');

    postParagraphs.forEach(paragraph => {
        let p = document.createElement('p');
        let pInput = document.createElement('input');

        p.innerHTML = paragraph;
        p.setAttribute('class', 'post-paragraph');

        // update hidden input value
        pInput.setAttribute("class", "text");
        pInput.setAttribute("type", "hidden");
        pInput.setAttribute("name", "paragraphs[]");
        pInput.setAttribute("value", `${paragraph}`);

        pDiv.appendChild(p);
        pDiv.appendChild(pInput);
    });

    document.querySelector('#paragraphs-input').replaceWith(pDiv);

    // Save each new source to the DOM and update hidden input value
    let postSources = document.querySelector('#sources-input').value.split('\n');
    var sDiv = document.createElement('div');
    sDiv.setAttribute('id', 'post-sources');

    postSources = postSources.filter(source => source.length);
    if (!postSources.length) {
        let p = document.createElement('p');
        p.innerHTML = 'No sources.';
        sDiv.appendChild(p);
    } else {

        postSources.map(source => {
            let a = document.createElement('a');
            let sInput = document.createElement('input');

            a.href = source;
            a.innerHTML = source;
            a.setAttribute('class', 'post-source');

            sInput.setAttribute("class", "source");
            sInput.setAttribute("type", "hidden");
            sInput.setAttribute("name", "source");
            sInput.setAttribute("value", `${source}`);

            sDiv.appendChild(a);
            sDiv.appendChild(sInput);
        });
        console.log(postSources);
    }

    document.querySelector('#sources-input').replaceWith(sDiv);

    //Call character count function
    updCharacWrdCnt();


    // Save state to localStorage/ implementing some caching
    let currImageSrc = document.querySelector(".post-img").src;
    let postData = {
        title: newTitle,
        paragraphs: postParagraphs,
        sources: postSources,
        image: currImageSrc
    }
    localStorage.setItem('previousState', JSON.stringify(postData));
}


// Intercept form submission
document.getElementById('post-forn').addEventListener('submit', (event) => {
    // console.log(editting)
    if (editing) {

        displayNotification("You have unsaved changes, please save");

        // Prevent form submission
        event.preventDefault();

    }
});


document.addEventListener("DOMContentLoaded", () => {
    updCharacWrdCnt();
})

// Word count, Character count, Hashtag count
let wordCount = 0;
let characCount = 0;
let hashTagCount = 0;

const updCharacWrdCnt = () => {
    let paragraphContent;
    let paragraphCharacCount;
    let paragraphWordArray;
    let paragraphWordCount;
    let hashTagMatches;
    hashTagCount = 0;

    let titleContent = document.getElementById("post-title").textContent;

    let titleCharacCount = titleContent.length;
    characCount = titleCharacCount;

    let titleWordArray = titleContent.split(" ").filter(word => word !== "");
    let titleWordCount = titleWordArray.length;
    wordCount = titleWordCount;

    Array(...document.querySelectorAll('.post-paragraph'))
        .map((element) => {
            paragraphContent = element.textContent;

            paragraphCharacCount = paragraphContent.length;
            characCount += paragraphCharacCount;

            paragraphWordArray = paragraphContent.split(" ").filter(word => word !== "");
            paragraphWordCount = paragraphWordArray.length;
            wordCount += paragraphWordCount;

            hashTagMatches = paragraphContent.match(/#/g);
            hashTagCount += hashTagMatches ? hashTagMatches.length : 0;
        })

    document.getElementById("word-count").textContent = `${wordCount} Word(s)`;
    document.getElementById("charac-count").textContent = `${characCount} Character(s)`;
    document.getElementById("hashtag-count").textContent = `${hashTagCount} Hashtag(s)`;
}


//handle search
$('#search_input').on("input", async function () {

    let imageId = 0;
    let pexelsImageContainer = document.querySelector('.pexels-image-row');
    let searchTerm = document.getElementById('search_input').value;


    //function append carousel images to div
    const appendImages = (ImagesDetailsArray, totalImageResults) => {
        if (totalImageResults > 0) {

            const carousalContainer = document.getElementById("carousalContainer");
            carousalContainer.innerHTML = "";

            carousalContainer.innerHTML = `<div id="myflickity" class="main-carousel pexels-image-row" data-flickity>
                                            </div>`

            let newPexelsImageContainer = document.querySelector('.pexels-image-row');


            for (let imgDetails of ImagesDetailsArray) {
                // console.log(imgDetails.alt);
                imageId += 1;
                newPexelsImageContainer.innerHTML += `<div class="carousel-cell">
                                                        <img class="carousel-cell-image pexels-img" id=${imageId} src=${imgDetails.src} alt='${imgDetails.alt}'>
                                                    </div>`
            }

            // initialize Flickity carousel
            var myFlickity = new Flickity(newPexelsImageContainer, {
                contain: true,
                wrapAround: true,
                cellAlign: 'left',
                "groupCells": true,
                "draggable": false,
                "pageDots": false,
                "initialIndex": 1
            });

            myFlickity.resize()

        } else {
            pexelsImageContainer.innerHTML = '<div class="d-flex justify-content-center"> <p> Sorry, no image found, try another term </p> </div>'
        }
    }

    if (searchTerm == "") {
        copyImgDetailsArray = [];
        appendImages(defaultImageDetailsArr, defaultImageCount);

    } else {

        let totalResults = await searchPhoto(searchTerm);
        //console.log(srcResult);
        appendImages(copyImgDetailsArray, totalResults);

    }


    const allImages = document.querySelectorAll('.pexels-img')
    allImages.forEach((image) => {
        image.addEventListener("click", (e) => { handleImageSelect(e) }, false);
    })

});


//handle Enter Key press
searchInputField = document.getElementById('search_input');
searchInputField.addEventListener("keypress", (event) => {
    if (event.key === "Enter") {
        event.preventDefault();
    }
})


//handle search button click
searchBtn = document.getElementById('search_btn');
searchBtn.addEventListener("click", (event) => {
    event.preventDefault();
})


// handle image select
let imageSrc = "";
let imageAlt = "";
let imgUrl = document.getElementById("imageURL");
let imgAuthor = document.getElementById("imageAuthor");
let authUrl = document.getElementById("authorURL");

const handleImageSelect = (e) => {
    const elementId = e.target.id;
    const img = document.getElementById(elementId);
    imageSrc = img.src;
    imageAlt = img.alt;
    // console.log(imageAlt);
    img.classList.add("borderToggle");
    document.querySelector(".image_paragraph").textContent = imageAlt;

    // console.log(copyImgDetailsArray.length);
    if (copyImgDetailsArray.length === 0) {
        imageDetailsDisplay(defaultImageDetailsArr, img);
    } else {
        imageDetailsDisplay(copyImgDetailsArray, img);
    }

    const images = document.querySelectorAll('.pexels-img');
    images.forEach((image) => {
        if (image.id !== elementId) {
            image.classList.remove('borderToggle');
            image.classList.add('pexels-img');
        }
    });
};


//handle image details display
const imageDetailsDisplay = (detailsArray, imgElemnt) => {
    detailsArray.forEach((imageDetail) => {
        if (imgElemnt.src == imageDetail.src) {
            imgUrl.innerHTML = `<strong>URL: </strong>${imageDetail.url}`;
            imgAuthor.innerHTML = `<strong>Author: </strong>${imageDetail.author}`;
            authUrl.innerHTML = `<strong>Author URL: </strong>${imageDetail.authorUrl}`;
        }
    })
}


const removeSelect = () => {
    const images = document.querySelectorAll('.pexels-img');
    images.forEach((image) => {
        image.classList.remove('borderToggle');
    });
}


// get pexels API key or use sessionStorage (cache)
let PEXEL_API_KEY;
async function getPexelApiKey() {
    try {
        const apiKey = sessionStorage.getItem('api_key');
        // console.log("local", apiKey);
        if (apiKey) {
            PEXEL_API_KEY = apiKey;
            // console.log("from cache:", apiKey);
        } else {
            const response = await fetch('https://www.socialmediaautomation.uxlivinglab.online/proxy-api/');

            // Check if the response status is OK
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.status}`);
            }

            const data = await response.json();
            const { api_key } = data;
            sessionStorage.setItem('api_key', api_key);
            PEXEL_API_KEY = api_key;
            // console.log("from Api Call", PEXEL_API_KEY);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}
getPexelApiKey();


// Pexels API fetch function

const PEXEL_BASE_URL = 'https://api.pexels.com/v1/search';
const searchPhoto = async (term) => {
    try {
        let imgDetailsArray = []

        await getPexelApiKey();
        let res = await fetch(`${PEXEL_BASE_URL}?query=${term}&per_page=15&orientation=square`, {
            headers: {
                Authorization: PEXEL_API_KEY
            }
        });

        let jsonData = await res.json();
        let totalResults = jsonData.total_results
        // console.log(totalResults);
        jsonData.photos.map(image => {
            // console.log(image.src.medium);
            // console.log(image.alt);
            let imgDetails = {
                src: image.src.medium,
                alt: image.alt,
                url: image.url,
                author: image.photographer,
                authorUrl: image.photographer_url
            }

            imgDetailsArray.push(imgDetails);
        })
        copyImgDetailsArray = imgDetailsArray;
        return totalResults;
    } catch (err) {
        console.error(`Error fecthing images: ${err}`)
    }
}


const updateImage = () => {

    sideImage = document.querySelector(".post-img");
    hiddenImageInput = document.querySelector("#images");

    if (imageSrc) {

        // update hidden input value
        hiddenImageInput.value = imageSrc;
        sideImage.src = imageSrc;

    } else if (imageSrc == "" && CACHE_IMAGE) {

        // update hidden input value
        hiddenImageInput.value = CACHE_IMAGE;
        sideImage.src = CACHE_IMAGE;
    }

}


// Initialize Flickity carousel
var myModal = document.getElementById('largeModal');
var myFlickity = new Flickity(document.getElementById('myflickity'), {
    contain: true,
    wrapAround: true,
    cellAlign: 'left',
    "groupCells": true,
    "draggable": false,
    "pageDots": false,
    "initialIndex": 1
});

myModal.addEventListener('shown.bs.modal', function () {

    // Resize the existing Flickity carousel
    myFlickity.resize();

});

const allImages = document.querySelectorAll('.pexels-img')
allImages.forEach((image) => {
    image.addEventListener("click", (e) => { handleImageSelect(e) }, false);
})




// Function to create a button-like option dynamically
function addButtonLikeOption(selectId, redirectUrl) {
    var buttonOption = document.createElement("option");
    buttonOption.value = "buttonOption";
    buttonOption.text = "Add more";
    buttonOption.classList.add("button-like-option");

    var select = document.getElementById(selectId);
    select.appendChild(buttonOption);

    // Add the onchange event dynamically
    select.onchange = function () {
        handleDropdownChange(selectId, redirectUrl);
    };
}

// Function to handle dropdown change .
function handleDropdownChange(selectId, redirectUrl) {
    var select = document.getElementById(selectId);
    var selectedIndex = select.selectedIndex;
    var selectedValue = select.options[selectedIndex].value;

    // Check if the button-like option is selected
    if (selectedValue === "buttonOption") {

        window.location.href = redirectUrl;
    }
}


addButtonLikeOption("qualitative_categorization", "http://127.0.0.1:8000/post_detail_addition/");
addButtonLikeOption("brand", "http://127.0.0.1:8000/post_detail_addition/");
addButtonLikeOption("channel", "http://127.0.0.1:8000/post_detail_addition/");
addButtonLikeOption("channelbrand", "http://127.0.0.1:8000/post_detail_addition/");
