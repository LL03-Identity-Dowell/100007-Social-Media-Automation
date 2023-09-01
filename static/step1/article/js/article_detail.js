function showAdminMessage() {
  alert("You are not an admin!");
}

window.onload = function downdis() {
  console.log("Hellow On Load");
};

document.querySelector("#edit-post").onclick = editPost;
document.querySelector("#save-post").onclick = savePost;
document.querySelector("#delete-post").onclick = deletePost;
document.getElementById("edit-button").addEventListener("click", function () {
  alert("Page is under construction");
});
var postti = document.getElementById("post-title");
var postpar = document.getElementById("post-paragraph");
var postsor = document.getElementById("post-sources");

function deletePost() {
  var fields = document.getElementsByTagName("input"),
    length = fields.length;
  while (length--) {
    if (fields[length].type === "text") {
      fields[length].value = "";
    }
  }

  $("input[type=text]").val("");

  console.log("lets Delete");
}

function editPost() {
  // Add an input element to edit the title
  let titleInput = document.createElement("input");
  titleInput.setAttribute("class", "form-control");
  titleInput.setAttribute("id", "title-input");
  titleInput.value = document.querySelector("#post-title").innerHTML;
  document.querySelector("#post-title").replaceWith(titleInput);

  // Add a textarea element to edit post content
  let postText = Array(...document.querySelectorAll(".post-paragraph"))
    .map((element) => element.innerHTML)
    .join("\n\n");
  let paragraphsInput = document.createElement("textarea");
  paragraphsInput.setAttribute("class", "form-control");
  paragraphsInput.setAttribute("id", "paragraphs-input");
  paragraphsInput.setAttribute("rows", "7");
  paragraphsInput.value = postText;
  document.querySelector("#post-paragraphs").replaceWith(paragraphsInput);

  // Add a textarea element to edit post sources
  let postSources = Array(...document.querySelectorAll(".post-source"))
    .map((element) => element.innerHTML)
    .join("\n\n");
  let sourcesInput = document.createElement("textarea");
  sourcesInput.setAttribute("class", "form-control");
  sourcesInput.setAttribute("id", "sources-input");
  sourcesInput.setAttribute("rows", "4");
  sourcesInput.value = postSources;
  document.querySelector("#post-sources").replaceWith(sourcesInput);
}

function savePost() {
  console.log("Remember to save to database...");

  // Save the new title to the DOM
  let postTitle = document.createElement("div");
  postTitle.setAttribute("id", "post-title");
  postTitle.innerHTML = document.querySelector("#title-input").value;
  document.querySelector("#title-input").replaceWith(postTitle);

  // Save each new paragraph to the DOM
  let postParagraphs = document
    .querySelector("#paragraphs-input")
    .value.split("\n\n");
  postParagraphs = postParagraphs.map((paragraph) => {
    let p = document.createElement("p");
    p.innerHTML = paragraph;
    p.setAttribute("class", "post-paragraph");
    return p;
  });
  var div = document.createElement("div");
  div.setAttribute("id", "post-paragraphs");
  div.append(...postParagraphs);
  document.querySelector("#paragraphs-input").replaceWith(div);

  // Save each new source to the DOM
  let postSources = document.querySelector("#sources-input").value.split("\n");
  postSources = postSources.filter((source) => source.length);
  postSources = postSources.map((source) => {
    let a = document.createElement("a");
    a.href = source;
    a.innerHTML = source;
    a.setAttribute("class", "post-source");
    return a;
  });
  if (!postSources.length) {
    let p = document.createElement("p");
    p.innerHTML = "No sources.";
    postSources.push(p);
  }
  var div = document.createElement("div");
  div.setAttribute("id", "post-sources");
  div.append(...postSources);
  document.querySelector("#sources-input").replaceWith(div);
}
