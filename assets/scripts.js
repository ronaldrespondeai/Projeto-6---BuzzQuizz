const screen31 = document.querySelector(".screen-31");
const screen32 = document.querySelector(".screen-32");
const screen33 = document.querySelector(".screen-33");
const screen34 = document.querySelector(".screen-34");
const questionsContainer = document.querySelector(".screen-32 div:first-of-type");
const levelsContainer = document.querySelector(".screen-33 div:first-of-type");
const homePage = document.querySelector(".home");
let title;
let imgUrl;
let questions;
let levels;
let numberLevels=0;

function toggleHidden(element){
    element.classList.toggle("hidden");
}

function notNullObject(element){

    let result = 1;
    const keys = Object.keys(element);
    for(let i = 0; i<keys.length; i++){
        if(element[keys[i]] === false){
        }else{
            result *= element[keys[i]].length;
        }
    }

    return !!result;
}

function validURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }

function validColor(str) {
    var pattern = new RegExp('#+.{6}');
    return !!pattern.test(str);
}

function createQuizzStart(){
    toggleHidden(homePage);
    toggleHidden(screen31);
}

function createQuizz(){
    title = document.querySelector(".create-quizz-title").value;
    imgUrl = document.querySelector(".create-quizz-img").value;
    const numberQuestions = parseInt(document.querySelector(".create-quizz-questions").value);
    numberLevels = parseInt(document.querySelector(".create-quizz-levels").value);
    let erro = 0;

    if(title.length < 20 || title.length > 65){
        alert("Título inválido, precisa possuir entre 20 e 65 caracteres");
        erro++;
    }
    if(!validURL(imgUrl)){
        alert("Por favor, insira uma imagem para seu quizz :)");
        erro++;
    }

    if(numberQuestions < 4 || !!numberQuestions === !!NaN){
        alert("Por favor, insira um número de perguntas maior que 2");
        erro++;
    }

    if(numberLevels < 2 || !!numberLevels === !!NaN){
        alert("Por favor, insira um número de níveis maior que 1");
        erro++;
    }
    
    if(erro === 0){
        createQuestionsScreen(numberQuestions);
        createLevelsScreen(numberLevels);
        toggleHidden(screen31);
        toggleHidden(screen32);
    }
}

function createQuestionsScreen(numberQuestions){
    questionsContainer.innerHTML = "";
    for(let i = 1; i<numberQuestions+1; i++){
        questionsContainer.innerHTML += `
        <div class="forms-container">
        <strong>Pergunta ${i}</strong>
        <input class="create-quizz-question" required type="text" placeholder="Texto da pergunta" minlength="20">
        <input class="create-quizz-background" required type="text" placeholder="Cor de fundo da pergunta" pattern="#+.{6}">
        <strong>Resposta correta</strong>
        <input class="create-quizz-answer" required type="text" placeholder="Resposta correta">
        <input class="create-quizz-answerimg" required type="url" placeholder="URL da imagem">
        <strong>Respostas incorretas</strong>
        <input class="create-quizz-wronganswer" required type="text" placeholder="Resposta incorreta 1">
        <input class="create-quizz-wronganswerimg" required type="url" placeholder="URL da imagem 1">
        <input class="create-quizz-wronganswer" type="text" placeholder="Resposta incorreta 2">
        <input class="create-quizz-wronganswerimg" type="url" placeholder="URL da imagem 2">
        <input class="create-quizz-wronganswer" type="text" placeholder="Resposta incorreta 3">
        <input class="create-quizz-wronganswerimg" type="url" placeholder="URL da imagem 3">
        </div>
        `
    }
}

function createQuestions(){
    const questionsAll = questionsContainer.querySelectorAll(".forms-container");
    questions = [];
    let erros = 0;

    for(let i = 0; i<questionsAll.length; i++){

        const title = questionsAll[i].querySelector(".create-quizz-question").value;
        const color = questionsAll[i].querySelector(".create-quizz-background").value

        if( title.length < 20 || !validColor(color)){
            alert(`Por favor, insira um texto maior e/ou uma cor válida na pergunta ${i+1}!`);
            erros++;
        }

        let answersArray = [];

        const correctAnswer = questionsAll[i].querySelector(".create-quizz-answer").value;
        const correctImg = questionsAll[i].querySelector(".create-quizz-answerimg").value;
        const answersWrong = questionsAll[i].querySelectorAll(".create-quizz-wronganswer");
        const answersWrongImg = questionsAll[i].querySelectorAll(".create-quizz-wronganswerimg");

        if(correctAnswer === null || !validURL(correctImg)){
            alert(`Por favor, insira uma resposta correta (texto e URL da imagem) na pergunta ${i+1}!`);
            erros++;
        }
        
        for(j = 0; j<answersWrong.length; j++){
            answersArray.push({
                text: answersWrong[j].value, 
                image: answersWrongImg[j].value, 
                isCorrectAnswer: false})
        }

        answersArray = answersArray.filter(notNullObject);
        
        answersArray.push({
            text: correctAnswer, 
            image: correctImg, 
            isCorrectAnswer: true});

        if(answersArray.length < 2){
            alert(`Por favor, insira ao menos uma resposta errada (texto e URL da imagem) na pergunta ${i+1}!`);
            erros++;
        }

        questions[i] = { 
        title: title,  
        color: color,
        answers: answersArray}

    }

    if(erros === 0){
        toggleHidden(screen32);
        toggleHidden(screen33);
    }

}

function createLevelsScreen(numberLevels){
    levelsContainer.innerHTML = "";
    for(let i = 1; i<numberLevels+1; i++){
        levelsContainer.innerHTML += `
        <div class="forms-container">
        <strong>Nível ${i}</strong>
        <input class="create-quizz-level-title" required type="text" placeholder="Título do nível" minlength="10">
        <input class="create-quizz-level-min" required type="number" placeholder="% de acerto mínima" min="0" max="100">
        <input class="create-quizz-level-img" required type="url" placeholder="URL da imagem do nível">
        <input class="create-quizz-level-description" required type="text" placeholder="Descrição do nível" minlength="30">
    </div>
        `
    }
}

function validLevel(title,minValue,image,text,i,erros){
    if(title.length < 10){
        alert(`O título do nível ${i+1} precisa ter ao menos 10 caracteres!`);
        erros++;
    }

    if(minValue > 100){
        alert(`O valor mínimo do nível ${i+1} precisa estar entre 0 e 100`);
        erros++;
    }
    
    if(!validURL(image)){
        alert(`Insira um link válido para a imagem do nível ${i+1}!`);
        erros++;
    }

    if(text < 30){
        alert(`O texto do nível ${i+1} precisa ter ao menos 30 caracteres!`);
        erros++;
    }

    return erros
}

function createLevels(){
    const levelsAll = levelsContainer.querySelectorAll(".forms-container");
    levels = [];
    let erros = 0;
    let auxLevel = 1;
    for(let i = 0; i<levelsAll.length; i++){

        const title = levelsAll[i].querySelector(".create-quizz-level-title").value;
        const image = levelsAll[i].querySelector(".create-quizz-level-img").value;
        const text = levelsAll[i].querySelector(".create-quizz-level-description").value;
        const minValue = parseInt(levelsAll[i].querySelector(".create-quizz-level-min").value);

        erros += validLevel(title,minValue,image,text,i,erros);
        auxLevel *= minValue;

        levels.push({
            title: title,
            image: image,
            text: text,
            minValue: minValue
        })
    }

    if(auxLevel !== 0){
        alert("Pelo menos um nível precisa começar em 0!");
        erros++;
    }

    if(erros === 0){
        toggleHidden(screen33);
        toggleHidden(screen34);
        sendCreatedQuizz();
    }
}

function goHome(element){
    toggleHidden(homePage);
    toggleHidden(element.parentNode);
}

function sendCreatedQuizz(){
    const createdQuizz = {
        title: title,
        image: imgUrl,
        questions: questions,
        levels: levels
    }

    const sendQuizz = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes", createdQuizz);

    sendQuizz.then(sendSucess);
    sendQuizz.catch(sendError);
}

function sendSucess(){
    alert("Seu quizz foi enviado com sucesso!");
}

function sendError(){
    alert("Houve um problema na criação do seu quizz :(");
}


// Quizz Loading
RequireQuizzes();

function RequireQuizzes() {
    const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes');
    promise.then(LoadQuizzes);
}

function LoadQuizzes(post) {
    const quizzes = document.querySelector('.quizzes-box');
    quizzes.innerHTML = '';
    post.data.forEach(element => {
        quizzes.innerHTML += `
        <li class="quizz quizz${element.id}" onclick="RequireQuizz(${element.id})">
            <img src="${element.image}" alt="">
            <div class="gradient"></div>
            <p>${element.title}</p>
        </li>
        `;
    });
}

function RequireQuizz(id) {
    const promise = axios.get(`
    https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}
    `);
    promise.then(LoadQuizz);
}

function LoadQuizz(post) {
    const home = document.querySelector('.home');
    home.classList.add('hidden');

    const quizzPage = document.querySelector('.selected-quizz-page');
    quizzPage.classList.remove('hidden');

    const quizz = post.data;
    
    quizzPage.innerHTML = `
    <div class="selected-quizz-title">
        <img src="${quizz.image}" alt="">
        <div class="gradient"></div>
        <span>${quizz.title}</span>
    </div>
    `;

    quizz.questions.forEach(element => {
        quizzPage.innerHTML += `
        <div class="selected-quizz-box">
            <div class="question" style="background-color: ${element.color};"><strong>${element.title}</strong></div>
            <div onclick="ChecarResposta(${element.answers[0].isCorrectAnswer})">
                <img src="${element.answers[0].image}" alt="">
                <p>${element.answers[0].text}</p>
            </div>
            <div onclick="ChecarResposta(${element.answers[1].isCorrectAnswer})">
                <img src="${element.answers[1].image}" alt="">
                <p>${element.answers[1].text}</p>
            </div>
            <div onclick="ChecarResposta(${element.answers[2].isCorrectAnswer})">
                <img src="${element.answers[2].image}" alt="">
                <p>${element.answers[2].text}</p>
            </div>
            <div onclick="ChecarResposta(${element.answers[3].isCorrectAnswer})">
                <img src="${element.answers[3].image}" alt="">
                <p>${element.answers[3].text}</p>
            </div>
        </div>
        `;
    });
}
/*
*******************formato loadquizz const quizz :
id: 1,
title: "Título do quizz",
image: "https://http.cat/411.jpg",
questions: [
    {
        title: "Título da pergunta 1",
        color: "#123456",
        answers: [
            {
                text: "Texto da resposta 1",
                image: "https://http.cat/411.jpg",
                isCorrectAnswer: true
            },
            {
                text: "Texto da resposta 2",
                image: "https://http.cat/412.jpg",
                isCorrectAnswer: false
            }
        ]
    },
*/
// Quizz Loading