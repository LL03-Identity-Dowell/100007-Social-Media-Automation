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

