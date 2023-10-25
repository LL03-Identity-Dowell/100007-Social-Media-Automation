function showLoading() {
    document.getElementById('loadingmsg').style.display = 'block';
    document.getElementById('loadingover').style.display = 'block';
}

const modalBtns = [...document.getElementsByClassName('modal-button')]
const AIBtn = document.getElementById('AI')
const WikiBtn = document.getElementById('Wiki')
const WriteBtn = document.getElementById('Write')

modalBtns.forEach(modalBtn=> modalBtn.addEventListener('click', ()=>{
    const title = modalBtn.getAttribute('value')


    AIBtn.addEventListener('click', ()=>{
        document.getElementById('titleForm').action = "{% url 'generate_article:submit-title' %}";
        document.getElementById('titleForm').submit();
    })
    WikiBtn.addEventListener('click', ()=>{
        document.getElementById('titleForm').action = "{% url 'generate_article:submit-title-wiki' %}";
        document.getElementById('titleForm').submit();
    })
    WriteBtn.addEventListener('click', ()=>{
        document.getElementById('titleForm').action = "{% url 'generate_article:submit-title' %}";
        document.getElementById('titleForm').submit();
    })
    // $("#AI, #Wiki, #Write").click(function(e) {
    // e.preventDefault();

    // var form = $("#titleForm");
    // form.prop("action", $(this).data("url"));
    // form.submit();
//   });
}))

checkstatus();

function checkstatus() {
    var lav = document.getElementById("useronline-status-icons");

    // AJAX GET request
    $.ajax({
        url: "https://100014.pythonanywhere.com/en/live_status",
        type: "GET",
        success: function (data) {
            lav.style.color = "green";
            //   lav.innerHTML = JSON.stringify(data);
        },
        error: function (error) {
            //   console.error(error);
            lav.style.color = "red";
        },
    });

    // AJAX POST request
    $.ajax({
        url: "https://100014.pythonanywhere.com/en/live_status",
        type: "POST",
        // data: JSON.stringify({ session_id:{{ request.session.session_id }},product: "Social Media Automation"}),
        data: JSON.stringify({
            session_id: request.session.session_id,
            product: "Social Media Automation",
        }),
        contentType: "application/json",
        success: function (data) {
            console.log(data);
        },
        error: function (error) {
            console.error(error);
        },
    });
}

setInterval(checkstatus, 60000);













