const quizzBasicsScreen = document.querySelector(".quizz-basics-screen");
const quizzQuestionsScreen = document.querySelector(".quizz-questions-screen");
const quizzLevelsScreen = document.querySelector(".quizz-levels-screen");
const quizzFinalScreen = document.querySelector(".quizz-final-screen");
const questionsContainer = document.querySelector(".quizz-questions-screen div:first-of-type");
const levelsContainer = document.querySelector(".quizz-levels-screen div:first-of-type");
const homePage = document.querySelector(".home");
const quizzResult = document.querySelector(".quizz-result-container");
const loadingScreen = document.querySelector(".loading-screen");
const allInputs = document.querySelectorAll("input");
const title = document.querySelector(".create-quizz-title");
const imgUrl = document.querySelector(".create-quizz-img");
const numberLevels = document.querySelector(".create-quizz-levels");
let questions;
let levels;
let correctAnswers=0;
let answered=0;
const userIds = GetUserIds().split(",");
const userKeys = GetUserKeys().split(",");
let numberOfQuestions=0;
let loadedQuizz;
let editingQuizz = false;
let editId = "";
let editKey = "";
let editingElement = "";
//GetUserLocal();

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
    
    allInputs.forEach(element => element.value = "");

    if(editingQuizz === true){
        title.value += editingElement.title;
        imgUrl.value += editingElement.image;
        const numberQuestionsInput = document.querySelector(".create-quizz-questions");
        numberQuestionsInput.value += editingElement.questions.length;
        numberLevels.value += editingElement.levels.length;
    }

    toggleHidden(homePage);
    toggleHidden(quizzBasicsScreen);
}

quizzBasicsScreen.addEventListener('keydown', (e) => {if(e.key === 'Enter'){createQuizz()}});

function createQuizz(){
    const numberQuestionsInput = document.querySelector(".create-quizz-questions");
    const numberQuestions = parseInt(numberQuestionsInput.value);
    let erro = 0;

    erro += validCreateQuizz(numberQuestions);
    
    if(erro === 0){
        createQuestionsScreen(numberQuestions);
        createLevelsScreen(parseInt(numberLevels.value));
        toggleHidden(quizzBasicsScreen);
        toggleHidden(quizzQuestionsScreen);
    }
}

function validCreateQuizz(numberQuestions){
    const numberQuestionsValid = document.querySelector(".create-quizz-questions");
    const numberLevelsValid = document.querySelector(".create-quizz-levels");
    let erro = 0;
    title.nextSibling.nextSibling.classList.add("hidden");
    numberQuestionsValid.nextSibling.nextSibling.classList.add("hidden");
    numberLevelsValid.nextSibling.nextSibling.classList.add("hidden");
    imgUrl.nextSibling.nextSibling.classList.add("hidden");
    
    if(title.value.length < 20 || title.value.length > 65){
        title.nextSibling.nextSibling.classList.remove("hidden");
        erro++;
    }
    if(!validURL(imgUrl.value)){
        imgUrl.nextSibling.nextSibling.classList.remove("hidden");
        erro++;
    }

    if(numberQuestions < 3 || !!numberQuestions === !!NaN){
        numberQuestionsValid.nextSibling.nextSibling.classList.remove("hidden");
        erro++;
    }

    if(numberLevels.value < 2 || !!numberLevels.value === !!NaN){
        numberLevelsValid.nextSibling.nextSibling.classList.remove("hidden");
        erro++;
    }

    return erro
}

function createQuestionsScreen(numberQuestions){
    questionsContainer.innerHTML = "";
    for(let i = 1; i<numberQuestions+1; i++){
        questionsContainer.innerHTML += `
        <div class="forms-container">
            <div class="collapsible-menu" onclick="collapsibleMenu(this)">
                <strong>Pergunta ${i}</strong>
                <ion-icon name="create-outline"></ion-icon>
            </div>
            <div class="collapsible-content hidden">
                <input class="create-quizz-question" required type="text" placeholder="Texto da pergunta" minlength="20">
                <span class="hidden">Por favor, insira um texto maior!</span>
                <input class="create-quizz-background" required type="text" placeholder="Cor de fundo da pergunta" pattern="#+.{6}">
                <span class="hidden">Por favor, insira uma cor válida! Formato: #XXXXXX</span>
                <strong>Resposta correta</strong>
                <input class="create-quizz-answer" required type="text" placeholder="Resposta correta">
                <span class="hidden">Por favor, insira uma resposta correta!</span>
                <input class="create-quizz-answerimg" required type="url" placeholder="URL da imagem">
                <span class="hidden">Por favor, insira link válido!</span>
                <strong>Respostas incorretas</strong>
                <input class="create-quizz-wronganswer" required type="text" placeholder="Resposta incorreta 1">
                <input class="create-quizz-wronganswerimg" required type="url" placeholder="URL da imagem 1">
                <input class="create-quizz-wronganswer" type="text" placeholder="Resposta incorreta 2">
                <input class="create-quizz-wronganswerimg" type="url" placeholder="URL da imagem 2">
                <input class="create-quizz-wronganswer" type="text" placeholder="Resposta incorreta 3">
                <input class="create-quizz-wronganswerimg" type="url" placeholder="URL da imagem 3">
            </div>
        </div>
        `
    }
}

function collapsibleMenu(element){

    const allCollapsibleContent = document.querySelectorAll(".collapsible-content");
    allCollapsibleContent.forEach(element => element.classList.add("hidden"));
    // fechar os outros menus

    let content = element.nextElementSibling;
    content.classList.toggle("hidden");
    if(content.style.maxHeight){
        content.style.maxHeight = null;
    }else{
        content.style.maxHeight = content.scrollHeight + "px";
    }
}

quizzQuestionsScreen.addEventListener('keydown', (e) => {if(e.key === 'Enter'){createQuestions()}});
function createQuestions(){
    const questionsAll = questionsContainer.querySelectorAll(".forms-container");
    questions = [];
    let erros = 0;

    questionsAll.forEach(element => {

        const title = element.querySelector(".create-quizz-question");
        const color = element.querySelector(".create-quizz-background");

        let answersArray = [];

        const correctAnswer = element.querySelector(".create-quizz-answer");
        const correctImg = element.querySelector(".create-quizz-answerimg");
        const answersWrong = element.querySelectorAll(".create-quizz-wronganswer");
        const answersWrongImg = element.querySelectorAll(".create-quizz-wronganswerimg");

        correctAnswer.nextSibling.nextSibling.classList.add("hidden");
        correctImg.nextSibling.nextSibling.classList.add("hidden");
        
        for(j = 0; j<answersWrong.length; j++){
            answersArray.push({
                text: answersWrong[j].value, 
                image: answersWrongImg[j].value, 
                isCorrectAnswer: false})
        }

        answersArray = answersArray.filter(notNullObject);
        
        answersArray.push({
            text: correctAnswer.value, 
            image: correctImg.value, 
            isCorrectAnswer: true});

        erros += questionsValidation(title, color, correctAnswer, correctImg, answersArray);

        questions.push({ 
            title: title.value,  
            color: color.value,
            answers: answersArray})
    });

    if(erros === 0){
        toggleHidden(quizzQuestionsScreen);
        toggleHidden(quizzLevelsScreen);
    }

}

function questionsValidation(title, color, correctAnswer, correctImg, answersArray){

    let erros = 0;

    title.nextSibling.nextSibling.classList.add("hidden");
    color.nextSibling.nextSibling.classList.add("hidden");

    if(title.value.length < 20){
        title.nextSibling.nextSibling.classList.remove("hidden");
        erros++;
    }

    if(!validColor(color.value)){
        color.nextSibling.nextSibling.classList.remove("hidden");
        erros++;
    }

    if(correctAnswer.value === ""){
        correctAnswer.nextSibling.nextSibling.classList.remove("hidden");
        erros++;
    }

    if(!validURL(correctImg.value)){
        correctImg.nextSibling.nextSibling.classList.remove("hidden");
        erros++;
    }

    if(answersArray.length < 2){
        alert(`Por favor, insira ao menos uma resposta errada (texto e URL da imagem) por pergunta!`);
        erros++;
    }

    return erros
}

function createLevelsScreen(numberLevels){
    levelsContainer.innerHTML = "";

    for(let i = 0; i<numberLevels; i++){
        levelsContainer.innerHTML += `
    <div class="forms-container">
        <div class="collapsible-menu" onclick="collapsibleMenu(this)">   
            <strong>Nível ${i+1}</strong>
            <ion-icon name="create-outline"></ion-icon>
        </div>
        <div class="collapsible-content hidden">
            <input class="create-quizz-level-title" required type="text" placeholder="Título do nível" minlength="10">
            <span class="hidden">O título do nível precisa ter ao menos 10 caracteres!</span>
            <input class="create-quizz-level-min" required type="number" placeholder="% de acerto mínima" min="0" max="100">
            <span class="hidden">O valor mínimo do nível precisa estar entre 0 e 100</span>
            <input class="create-quizz-level-img" required type="url" placeholder="URL da imagem do nível">
            <span class="hidden">Insira um link válido para a imagem do nível!</span>
            <input class="create-quizz-level-description" required type="text" placeholder="Descrição do nível" minlength="30">
            <span class="hidden">O texto do nível precisa ter ao menos 30 caracteres!</span>
        </div>
    </div>
        `
    }
    if(editingQuizz === true){
        const titleLevel = document.querySelectorAll(".create-quizz-level-title");
        const minValueLevel = document.querySelectorAll(".create-quizz-level-min");
        const imgLevel = document.querySelectorAll(".create-quizz-level-img");
        const descriptionLevel = document.querySelectorAll(".create-quizz-level-description");
    
        let i = 0;
        while(i<2){
            titleLevel[i].value += editingElement.levels[i].title;
            descriptionLevel[i].value += editingElement.levels[i].text;
            minValueLevel[i].value += editingElement.levels[i].minValue;
            imgLevel[i].value += editingElement.levels[i].image;
            i++;
        } // for não funcionava de jeito nenhum?
    }
}

quizzLevelsScreen.addEventListener('keydown', (e) => {if(e.key === 'Enter'){createLevels()}});
function createLevels(){
    const levelsAll = levelsContainer.querySelectorAll(".forms-container");
    levels = [];
    let erros = 0;
    let auxLevel = 1;
    levelsAll.forEach(element => {

        const title = element.querySelector(".create-quizz-level-title");
        const image = element.querySelector(".create-quizz-level-img");
        const text = element.querySelector(".create-quizz-level-description");
        const minValue = element.querySelector(".create-quizz-level-min");

        erros += validLevel(title,minValue,image,text,erros);
        auxLevel *= minValue.value;
        levels.push({
            title: title.value,
            image: image.value,
            text: text.value,
            minValue: parseInt(minValue.value)
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

function validLevel(title,minValue,image,text,erros){

    const textValid = text.nextElementSibling;
    const minValueValid = minValue.nextElementSibling;
    const imageValid = image.nextElementSibling;
    const titleValid = title.nextElementSibling;
    
    textValid.classList.add("hidden");
    minValueValid.classList.add("hidden");
    imageValid.classList.add("hidden");
    titleValid.classList.add("hidden");

    if(title.value.length < 10){
        titleValid.classList.remove("hidden");
        erros++;
    }

    if(minValue.value > 100 || minValue.value === ""){
        minValueValid.classList.remove("hidden");
        erros++;
    }
    
    if(!validURL(image.value)){
        imageValid.classList.remove("hidden");
        erros++;
    }

    if(text.value < 30){
        textValid.classList.remove("hidden");
        erros++;
    }
    return erros
}

function goHome(){
    window.location.reload();
}

function sendCreatedQuizz(){
    const createdQuizz = {
        title: title.value,
        image: imgUrl.value,
        questions: questions,
        levels: levels
    }

    toggleHidden(loadingScreen);

    if(editingQuizz === false){
        const sendQuizz = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes", createdQuizz);
        sendQuizz.then(sendQuizzSucess);
        sendQuizz.catch(sendQuizzError);

    }else{
        const header = {headers: {'Secret-Key': editKey}};
        const editQuizz = axios.put(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${editId}`, createdQuizz, header);
        editQuizz.then(editQuizzSucess);
        editQuizz.catch(editQuizzError);
    }
}

function editQuizzSucess(letter){
    toggleHidden(loadingScreen);
    alert("Seu quizz foi editado com sucesso!");
    const id = letter.data.id;
    const accessQuizz = document.querySelector('.access');
    accessQuizz.setAttribute('onclick', `RequireQuizz(${id})`); 
}

function editQuizz(id){
    const index = userIds.indexOf(id.toString()); //findIndex(element => element == id), se der ruim, esse funciona kkk
    const key = userKeys[index];
    editId = id;
    editKey = key;
    editingQuizz = true;
    const promise = axios.get(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}`);
    promise.then(getEditingElement)
}

function getEditingElement(letter){
    editingElement = letter.data;
    console.log(editingElement);
    createQuizzStart();
}

function sendQuizzSucess(letter){ //coletando id do post para o localStorage
    toggleHidden(loadingScreen);
    RequireQuizzes(); //Recarregar lista de quizzes ao criar um quizz novo.
    alert("Seu quizz foi enviado com sucesso!");
    const id = letter.data.id;
    const key = letter.data.key;

    userIds.push(id);
    localStorage.setItem('userIds', userIds.toString());
    userKeys.push(key);
    localStorage.setItem('userKeys', userKeys.toString());

    const accessQuizz = document.querySelector('.access');
    accessQuizz.setAttribute('onclick', `RequireQuizz(${id})`); 
}

function deleteQuizz(id){
    if(window.confirm("Realmente deseja apagar esse seu quizz?")){
        const index = userIds.indexOf(id); //findIndex(element => element == id), se der ruim, esse funciona kkk
        const key = userKeys[index];

        const secretKey = {headers: {'Secret-Key': key}};
        const require = axios.delete(`https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}`, secretKey);
        
        //remover o id deletado do localStorage
        userIds.splice(index, 1);
        localStorage.setItem('userIds', userIds.toString());
        //remover a key deletada do localStorage
        userKeys.splice(index, 1);
        localStorage.setItem('userKeys', userKeys.toString());

        window.location.reload();
    }
}

function sendQuizzError(){
    alert("Houve um problema na criação do seu quizz :(");
}

function editQuizzError(letter){
    console.log(letter)
    alert("Houve um problema na edição do seu quizz :(");
}


// Quizz Loading
RequireQuizzes();

function RequireQuizzes() {
    const promise = axios.get('https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes');
    //toggleHidden(loadingScreen);
    promise.then(LoadQuizzes);
}

function LoadQuizzes(post) {
    //toggleHidden(loadingScreen);
    const ulAllQuizzes = document.querySelector('.ul-all-quizzes');
    ulAllQuizzes.innerHTML = '';

    const ulUserQuizzes = document.querySelector('.ul-user-quizzes');
    ulUserQuizzes.innerHTML = '';

    const quizzes = post.data;
    const userQuizzes = quizzes.filter(CheckUserIds); //apenas os que tem id contido em userIds
    const allQuizzes = quizzes.filter(UnCheckUserIds); //todos que não tem id contido em userIds
    
    userQuizzes.forEach(element => {
        ulUserQuizzes.innerHTML += `
        <li class="quizz quizz${element.id}">
            <div class="user-quizz-options">
                <ion-icon onclick="editQuizz(${element.id})" name="create-outline"></ion-icon>
                <ion-icon onclick="deleteQuizz(${element.id})" name="trash-outline"></ion-icon>
            </div>
            <img src="${element.image}" alt="">
            <div onclick="RequireQuizz(${element.id})" class="gradient"></div>
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
    window.scrollTo(0,0);
}

function RequireQuizz(id) {
    toggleHidden(loadingScreen);
    quizzResult.classList.add("hidden");
    correctAnswers=0;
    answered=0;
    const promise = axios.get(`
    https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes/${id}
    `);
    promise.then(LoadQuizz);
}

function LoadQuizz(post) {
    toggleHidden(loadingScreen);
    loadedQuizz = post;
    const quizzFinalScreen = document.querySelector('.quizz-final-screen');
    quizzFinalScreen.classList.add('hidden');

    const home = document.querySelector('.home');
    home.classList.add('hidden');

    const quizzPage = document.querySelector('.selected-quizz-page');
    quizzPage.classList.remove('hidden');

    const quizz = post.data;
    numberOfQuestions = quizz.questions.length;
    answered = 0;
    correctAnswers = 0;
    
    // Titulo do quizz
    quizzPage.innerHTML = `
    <div class="selected-quizz-title">
        <img src="${quizz.image}" alt="">
        <div class="gradient"></div>
        <span>${quizz.title}</span>
    </div>
    `;

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
        });
    });
    window.scrollTo(0,0);
}

function checkColor(element){
    if(element.isCorrectAnswer){
        return "correct-answer";
    }else{
        return "incorrect-answer";
    }
}

function AnswerCheck(bool, element) {

    //if(element.parentNode.classList.length === 1){
        opacityEffect(element);
        textEffect(element);
        answered++;
        if(bool){correctAnswers++;}
    //}
    const father = element.parentNode;
    for (let i = 0; i<father.children.length; i++) {
        father.children[i].setAttribute('onclick', '');
    }
    
    const actual = element.parentNode;
    actual.classList.add("answered");

    if(answered === numberOfQuestions){
        loadResult();
        setTimeout(scrollQuizzResult,2000);
    }else{
        setTimeout(scrollNextQuestion,2000,actual);
    }
}

function loadResult(){ /*Função para popular o resultado!*/
    const hits = hitsCalculator();
    let levelText = '';
    let levelTitle = '';
    let levelImage = '';
    let actualLevel = 0;
    const levels = loadedQuizz.data.levels;
    levels.forEach(element => {
        if (hits >= element.minValue && element.minValue > actualLevel) {
            levelText = element.text;
            levelTitle = element.title;
            levelImage = element.image;
            actualLevel = element.minValue;
        };
    });
    const quizzResultContainer = document.querySelector(".quizz-result-container");
    quizzResultContainer.innerHTML = `
        <div class="quizz-result">
            <div class="quizz-result-title"><strong>${hits}% de acerto: ${levelTitle}</strong></div>
            <div class="quizz-result-content">
                <img src="${levelImage}" alt="">
                <div><strong>${levelText}</strong></div>
            </div>
        </div>
        <button type="submit" class="reset-quizz-button result" onclick="RequireQuizz(${loadedQuizz.data.id})">Reiniciar Quizz</button>
        <button class="button-home result" type="submit" onclick="goHome()">Voltar pra home</button>
    `
}

function hitsCalculator(){
    return Math.floor(100*correctAnswers/answered)
}

function scrollNextQuestion(actual){
    const nextQuestion = actual.nextSibling.nextSibling;
    nextQuestion.scrollIntoView();
}

function scrollQuizzResult(){
    toggleHidden(quizzResult);
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

function Shuffle() {
    return (Math.random() - 0.5);
}
// Quizz Loading

function GetUserIds() {
    if (localStorage.getItem('userIds') !== null) {
        const ids = localStorage.getItem('userIds');
        return ids;
    }
    return '';
}

function GetUserKeys() {
    if (localStorage.getItem('userKeys') !== null) {
        const keys = localStorage.getItem('userKeys');
        return keys;
    }
    return '';
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