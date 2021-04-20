const screen31 = document.querySelector(".screen-31");
const screen32 = document.querySelector(".screen-32");
const screen33 = document.querySelector(".screen-33");
const screen34 = document.querySelector(".screen-34");
const questionsContainer = document.querySelector(".screen-32 div:first-of-type");
let title;
let imgUrl;

function toggleHidden(element){
    element.classList.toggle("hidden");
}

function notNull(element){
    return element.text !== null
}

function createQuizz(){
    title = document.querySelector(".create-quizz-title").value;
    imgUrl = document.querySelector(".create-quizz-img").value;
    const numberQuestions = parseInt(document.querySelector(".create-quizz-questions").value);
    const numberLevels = parseInt(document.querySelector(".create-quizz-levels").value);

    createQuestionsScreen(numberQuestions);
    toggleHidden(screen31);
    toggleHidden(screen32);
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
    console.log(questionsAll);
    let questions = [];

    for(let i = 0; i<questionsAll.length; i++){
        let answersArray = [];

        const answersWrong = questionsAll[i].querySelectorAll(".create-quizz-wronganswer");
        const answersWrongImg = questionsAll[i].querySelectorAll(".create-quizz-wronganswerimg");
        console.log(questionsAll[i].querySelectorAll(".create-quizz-wronganswer"));

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

    console.log(questions);
}