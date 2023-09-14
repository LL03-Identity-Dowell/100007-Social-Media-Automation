function showAdminMessage() {
    alert("You are not an admin!");
}


window.onload = function downdis() {
    console.log("Hellow On Load")
}

const defaultImageArr = [
    { src: 'https://images.pexels.com/photos/267350/pexels-photo-267350.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: 'pexels image' },
    { src: 'https://images.pexels.com/photos/267394/pexels-photo-267394.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/2818118/pexels-photo-2818118.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/3184424/pexels-photo-3184424.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/1779487/pexels-photo-1779487.jpeg', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/1402787/pexels-photo-1402787.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/1618200/pexels-photo-1618200.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/6749745/pexels-photo-6749745.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/6132751/pexels-photo-6132751.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/326259/pexels-photo-326259.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/262438/pexels-photo-262438.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" },
    { src: 'https://images.pexels.com/photos/4560142/pexels-photo-4560142.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1', alt: "pexels image" }
]

const defaultImageCount = 15;



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



    // pexelsImageContainer.innerHTML = '<div class="d-flex justify-content-center"> <div class="spinner-border text-primary style="width: 3rem; height: 3rem;" role="status"> <span class="visually-hidden">Loading...</span> </div> </div>'

    //function append images to div
    const appendImages = (ImagesDetailsArray, totalImageResults) => {
        if (totalImageResults > 0) {
            // pexelsImageContainer.innerHTML = "";

            pexelsImageContainer.parentNode.removeChild(pexelsImageContainer);
            const carousalContainer = document.getElementById("carousalContainer");

            carousalContainer.innerHTML = `<div id="myflickity" class="main-carousel pexels-image-row" data-flickity>
                                            </div>`
            // while (pexelsImageContainer.firstChild) {
            //     pexelsImageContainer.removeChild(pexelsImageContainer.firstChild);
            // }
            let newPexelsImageContainer = document.querySelector('.pexels-image-row');


            for (let imgDetails of ImagesDetailsArray) {
                console.log(imgDetails.alt);
                imageId += 1;
                newPexelsImageContainer.innerHTML += `<div class="carousel-cell">
                                                        <img class="carousel-cell-image pexels-img" id=${imageId} src=${imgDetails.src} alt='${imgDetails.alt}'>
                                                    </div>`

                // `<div class="col-md-4" style="padding-bottom: 5px;"> <img src=${imgSrc} class="img-fluid pexels-img" id=${imageId} alt="pexels image" style="height: 65px; width: 103px;"> </div>`
            }

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
        // pexelsImageContainer.innerHTML = "";
        appendImages(defaultImageArr, defaultImageCount);

    } else {

        let { imgDetailsArray, totalResults } = await searchPhoto(searchTerm);
        //console.log(srcResult);
        appendImages(imgDetailsArray, totalResults);

    }


    const allImages = document.querySelectorAll('.pexels-img')
    allImages.forEach((image) => {
        image.addEventListener("click", (e) => { handleImageSelect(e) }, false);
    })




    //event.stopPropagation();
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
const handleImageSelect = (e) => {
    const elementId = e.target.id;
    const img = document.getElementById(elementId);
    imageSrc = img.src;
    imageAlt = img.alt;
    console.log(imageAlt);
    img.classList.add("borderToggle");
    document.querySelector(".image_paragraph").textContent = imageAlt;

    const images = document.querySelectorAll('.pexels-img');
    images.forEach((image) => {
        if (image.id !== elementId) {
            image.classList.remove('borderToggle');
            image.classList.add('pexels-img');
        }
    });
};


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
            const response = await fetch('http://127.0.0.1:8000/proxy-api/');

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

        let imgDetailsArray = [];
        await getPexelApiKey();
        let res = await fetch(`${PEXEL_BASE_URL}?query=${term}&per_page=15&orientation=landscape`, {
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
                alt: image.alt
            }

            imgDetailsArray.push(imgDetails);

        })
        return { imgDetailsArray, totalResults };
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
