const quizzBasicsScreen = document.querySelector(".quizz-basics-screen");
const quizzQuestionsScreen = document.querySelector(".quizz-questions-screen");
const quizzLevelsScreen = document.querySelector(".quizz-levels-screen");
const quizzFinalScreen = document.querySelector(".quizz-final-screen");
const questionsContainer = document.querySelector(".quizz-questions-screen div:first-of-type");
const levelsContainer = document.querySelector(".quizz-levels-screen div:first-of-type");
const homePage = document.querySelector(".home");
const quizzResult = document.querySelectorAll(".result");
let title;
let imgUrl;
let questions;
let levels;
let numberLevels=0;
let correctAnswers=0;
let answered=0;
const userIds = GetUserIds().split(","); //para o localStorage.(set/get)Item
let numberQuestions=0;

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
    toggleHidden(quizzBasicsScreen);
}

quizzBasicsScreen.addEventListener('keydown', (e) => {if(e.key === 'Enter'){createQuizz()}});

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

    if(numberQuestions < 3 || !!numberQuestions === !!NaN){
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
        toggleHidden(quizzBasicsScreen);
        toggleHidden(quizzQuestionsScreen);
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

quizzQuestionsScreen.addEventListener('keydown', (e) => {if(e.key === 'Enter'){createQuestions()}});
function createQuestions(){
    const questionsAll = questionsContainer.querySelectorAll(".forms-container");
    questions = [];
    let erros = 0;

    questionsAll.forEach(element => {

        const title = element.querySelector(".create-quizz-question").value;
        const color = element.querySelector(".create-quizz-background").value

        if( title.length < 20 || !validColor(color)){
            alert(`Por favor, insira um texto maior e/ou uma cor válida na pergunta ${i+1}!`);
            erros++;
        }

        let answersArray = [];

        const correctAnswer = element.querySelector(".create-quizz-answer").value;
        const correctImg = element.querySelector(".create-quizz-answerimg").value;
        const answersWrong = element.querySelectorAll(".create-quizz-wronganswer");
        const answersWrongImg = element.querySelectorAll(".create-quizz-wronganswerimg");

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

        questions.push({ 
            title: title,  
            color: color,
            answers: answersArray})
    });

    if(erros === 0){
        toggleHidden(quizzQuestionsScreen);
        toggleHidden(quizzLevelsScreen);
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
        alert(`O título do nível ${i} precisa ter ao menos 10 caracteres!`);
        erros++;
    }

    if(minValue > 100){
        alert(`O valor mínimo do nível ${i} precisa estar entre 0 e 100`);
        erros++;
    }
    
    if(!validURL(image)){
        alert(`Insira um link válido para a imagem do nível ${i}!`);
        erros++;
    }

    if(text < 30){
        alert(`O texto do nível ${i} precisa ter ao menos 30 caracteres!`);
        erros++;
    }

    return erros
}

quizzLevelsScreen.addEventListener('keydown', (e) => {if(e.key === 'Enter'){createLevels()}});
function createLevels(){
    const levelsAll = levelsContainer.querySelectorAll(".forms-container");
    levels = [];
    let erros = 0;
    let auxLevel = 1;
    let i = 1;
    levelsAll.forEach(element => {

        const title = element.querySelector(".create-quizz-level-title").value;
        const image = element.querySelector(".create-quizz-level-img").value;
        const text = element.querySelector(".create-quizz-level-description").value;
        const minValue = parseInt(element.querySelector(".create-quizz-level-min").value);

        erros += validLevel(title,minValue,image,text,i,erros);
        auxLevel *= minValue;
        i++;
        levels.push({
            title: title,
            image: image,
            text: text,
            minValue: minValue
        })
    })

    if(auxLevel !== 0){
        alert("Pelo menos um nível precisa começar em 0!");
        erros++;
    }

    if(erros === 0){
        toggleHidden(quizzLevelsScreen);
        toggleHidden(quizzFinalScreen);
        sendCreatedQuizz();
    }
}

function goHome(){
    window.location.reload();
}

function sendCreatedQuizz(){
    const createdQuizz = {
        title: title,
        image: imgUrl,
        questions: questions,
        levels: levels
    }

    const sendQuizz = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes", createdQuizz);

    sendQuizz.then(sendQuizzSucess);
    sendQuizz.catch(sendQuizzError);
}

function sendQuizzSucess(letter){ //coletando id do post para o localStorage
    RequireQuizzes(); //Recarregar lista de quizzes ao criar um quizz novo.
    alert("Seu quizz foi enviado com sucesso!");
    const id = letter.data.id

    userIds.push(id);
    localStorage.setItem('userIds', userIds.toString());

    const accessQuizz = document.querySelector('.access');
    accessQuizz.setAttribute('onclick', `RequireQuizz(${id})`); 
}

function sendQuizzError(){
    alert("Houve um problema na criação do seu quizz :(");
}


// Quizz Loading                        //localStorage.setItem('userIds', [user ids])
RequireQuizzes();

function RequireQuizzes() {
    const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes');
    promise.then(LoadQuizzes);
}

function LoadQuizzes(post) {
    const ulAllQuizzes = document.querySelector('.ul-all-quizzes');
    ulAllQuizzes.innerHTML = '';

    const ulUserQuizzes = document.querySelector('.ul-user-quizzes');
    ulUserQuizzes.innerHTML = '';

    const quizzes = post.data;
    const userQuizzes = quizzes.filter(CheckUserIds); //apenas os que tem id contido em userIds
    const allQuizzes = quizzes.filter(UnCheckUserIds); //todos que não tem id contido em userIds
    
    userQuizzes.forEach(element => {
        ulUserQuizzes.innerHTML += `
        <li class="quizz quizz${element.id}" onclick="RequireQuizz(${element.id})">
            <img src="${element.image}" alt="">
            <div class="gradient"></div>
            <p>${element.title}</p>
        </li>
        `;
    });
    allQuizzes.forEach(element => {
            ulAllQuizzes.innerHTML += `
            <li class="quizz quizz${element.id}" onclick="RequireQuizz(${element.id})">
                <img src="${element.image}" alt="">
                <div class="gradient"></div>
                <p>${element.title}</p>
            </li>
            `;
    });

    if (ulUserQuizzes.innerHTML != '') {
        const divUserQuizzes = document.querySelector('.user-quizzes');
        divUserQuizzes.classList.remove('hidden');

        const divCreateQuizz = document.querySelector('.create-quizz');
        divCreateQuizz.classList.add('hidden');
    }
}

function RequireQuizz(id) {
    const promise = axios.get(`
    https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}
    `);
    promise.then(LoadQuizz);
}

function LoadQuizz(post) {
    const quizzFinalScreen = document.querySelector('.quizz-final-screen');
    quizzFinalScreen.classList.add('hidden');

    const home = document.querySelector('.home');
    home.classList.add('hidden');

    const quizzPage = document.querySelector('.selected-quizz-page');
    quizzPage.classList.remove('hidden');

    const quizz = post.data;
    
    // Titulo do quizz
    quizzPage.innerHTML = `
    <div class="selected-quizz-title">
        <img src="${quizz.image}" alt="">
        <div class="gradient"></div>
        <span>${quizz.title}</span>
    </div>
    `;

    numberQuestions += quizz.questions.length;
    //Perguntas do quizz (para cada pergunta...)
    quizz.questions.forEach(element => {
        const answers = element.answers;
        answers.sort(Shuffle);
        //Titulo da pergunta
        quizzPage.innerHTML += `
        <div class="selected-quizz-box">
            <div class="question" style="background-color: ${element.color}; color: white;">
                <strong>${element.title}</strong>
            </div>
        </div>
        `;
        const question = document.querySelector('.selected-quizz-box:last-child');
        //Respostas
        answers.forEach(element => {
            question.innerHTML += `
                <div class="${checkColor(element)} unselected" onclick="AnswerCheck(${element.isCorrectAnswer} ,this)">
                    <img src="${element.image}" alt="">
                    <p>${element.text}</p>
                </div>
            `;
        })
    });
}

function checkColor(element){
    if(element.isCorrectAnswer){
        return "correct-answer";
    }else{
        return "incorrect-answer";
    }
}

function AnswerCheck(bool, element) {

    if(element.parentNode.classList.length === 1){
        opacityEffect(element);
        textEffect(element);
        answered++;
        if(bool){correctAnswers++;}
    }
    const actual = element.parentNode;
    actual.classList.add("answered");

    if(answered === numberQuestions){
        toggleHidden(quizzResult[0]);
        toggleHidden(quizzResult[1]);
        toggleHidden(quizzResult[2]);
        setTimeout(scrollQuizzResult,2000);
    }else{
        setTimeout(scrollNextQuestion,2000,actual);
    }
}

function scrollNextQuestion(actual){
    const nextQuestion = actual.nextSibling.nextSibling;
    nextQuestion.scrollIntoView();
}

function scrollQuizzResult(){
    quizzResult.scrollIntoView();
}

function textEffect(element){

    const childrens = element.parentNode.children;

    for(let i = 1; i<childrens.length; i++){
        childrens[i].classList.remove("unselected");
    }
}

function opacityEffect(element){
    const childrens = element.parentNode.children;

    for(let i = 1; i<childrens.length; i++){
        childrens[i].classList.add("opacity");
    }

    element.classList.remove("opacity");
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

function Shuffle() {
    return (Math.random() - 0.5);
}
// Quizz Loading

function GetUserIds() {
    let Ids = [];
    if (localStorage.getItem('userIds') !== null) {
        Ids = localStorage.getItem('userIds');
        return Ids;
    }
    return "";
}

function CheckUserIds(obj) {
    if (obj != undefined) {
        for(let i = 0; i<userIds.length; i++){
            if (obj.id == userIds[i]){
                return true;
            }
        }
    }
    return false;
}

function UnCheckUserIds(obj) {
    return !CheckUserIds(obj);
}