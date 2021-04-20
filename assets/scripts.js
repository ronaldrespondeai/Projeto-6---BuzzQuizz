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

function toggleHidden(element){
    element.classList.toggle("hidden");
}

function notNullObject(element){

    let result = 1;
    const keys = Object.keys(element);
    for(let i = 0; i<keys.length; i++){
        result *= element[keys[i]].length;
    }

    return !!result;
}

function createQuizzStart(){
    toggleHidden(homePage);
    toggleHidden(screen31);
}

function createQuizz(){
    title = document.querySelector(".create-quizz-title").value;
    imgUrl = document.querySelector(".create-quizz-img").value;
    const numberQuestions = parseInt(document.querySelector(".create-quizz-questions").value);
    const numberLevels = parseInt(document.querySelector(".create-quizz-levels").value);
    let erro = 0;

    if(title.length < 20 || title.length > 65){
        alert("Título inválido, precisa possuir entre 20 e 65 caracteres");
        erro++;
    }
    if(imgUrl === ""){
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
        <input class="create-quizz-background" required type="text" placeholder="Cor de fundo da pergunta" pattern="#+.{6,}">
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

    for(let i = 0; i<questionsAll.length; i++){
        let answersArray = [];

        const answersWrong = questionsAll[i].querySelectorAll(".create-quizz-wronganswer");
        const answersWrongImg = questionsAll[i].querySelectorAll(".create-quizz-wronganswerimg");

        answersArray[0] = {
            text: questionsAll[i].querySelector(".create-quizz-answer").value, 
            image: questionsAll[i].querySelector(".create-quizz-answerimg").value, 
            isCorrectAnswer: true};
        
        for(j = 0; j<answersWrong.length; j++){
            if(answersWrong[j].value !== "" && answersWrongImg[j].value !== ""){
                answersArray.push({
                    text: answersWrong[j].value, 
                    image: answersWrongImg[j].value, 
                    isCorrectAnswer: false
                })
            }
        }

        questions[i] = { 
        title:questionsAll[i].querySelector(".create-quizz-question").value,  
        color:questionsAll[i].querySelector(".create-quizz-background").value,
        answers: answersArray
    }
    }
    toggleHidden(screen32);
    toggleHidden(screen33);

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

function createLevels(){
    const levelsAll = levelsContainer.querySelectorAll(".forms-container");
    levels = [];

    for(let i = 0; i<levelsAll.length; i++){
        levels.push({
            title: levelsAll[i].querySelector(".create-quizz-level-title").value,
            image: levelsAll[i].querySelector(".create-quizz-level-img").value,
            text: levelsAll[i].querySelector(".create-quizz-level-description").value,
            minValue: levelsAll[i].querySelector(".create-quizz-level-min").value
        })
    }

    toggleHidden(screen33);
    toggleHidden(screen34);
    sendCreatedQuizz();
}

function goHome(element){
    toggleHidden(homePage);
    toggleHidden(element.parentNode);
}

// function sendCreatedQuizz(){
//     const createdQuizz = {
//         title: title,
//         image: imgUrl,
//         questions: questions.filter(notNullObject),
//         levels: levels.filter(notNullObject)
//     }

//     console.log(createdQuizz);

//     const sendQuizz = axios.post("https://mock-api.bootcamp.respondeai.com.br/api/v2/buzzquizz/quizzes", createdQuizz);

//     sendQuizz.then(sendSucess);
//     sendQuizz.catch(sendError);
// }

function sendSucess(){
    alert("Seu quizz foi enviado com sucesso!");
}

function sendError(){
    alert("Houve um problema na criação do seu quizz :(");
}


// Quizz Loading

// Quizz Loading