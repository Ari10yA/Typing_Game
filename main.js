const quoteDisplayElement = document.getElementsByClassName('text-section_quote');
const quoteInputElement = document.getElementById('input-text');
const quoteTimerElement = document.getElementsByClassName('timer-counter');
const ctaButton = document.getElementsByClassName('button-control_cta');
const timerCount = document.getElementsByClassName('timer-count');
const backDrop = document.getElementsByClassName('area-backdrop');
const backDropTimer = document.getElementsByClassName('action-btn');
const inputTextArea = document.getElementById('input-text');
const wpmResult = document.getElementsByClassName('wpm-result');
const result = document.getElementsByClassName('result');
const resultStatus = document.getElementsByClassName('result-status');





async function fetchRandomQuote() {
    const response = await fetch("https://api.quotable.io/random");
    const data = await response.json();
    
    return data.content;
}

var quoteData = null;
var currIndex = 0;
var arraySize = 0;

function removeUnderlineText(){
    if(currIndex>=0){
        const underlineElement = document.getElementsByClassName(currIndex);
        underlineElement[0].className = '';
    }
}

function addUnderlineText() {
    if(currIndex>=0){
        const underlineElement = document.getElementsByClassName(currIndex);
        underlineElement[0].classList.add('underline');
    }
}

function updateTimer ( ) {
    let currentTime = Number(quoteTimerElement[0].innerText);
    let updatedTime = currentTime + 1;

    quoteTimerElement[0].innerText = updatedTime;
}


async function fetchData() {
    quoteData = await fetchRandomQuote();
    quoteInputElement.value=null;
    var charArray = quoteData.split(' ');
    arraySize = charArray.length;

    charArray.forEach((value, index, array) => {
        const spanElement = document.createElement('span');
        spanElement.classList.add(index);

        quoteDisplayElement[0].appendChild(spanElement);
        

        value.split('').forEach((value, index, array) => {
            const insideSpanElement = document.createElement('span');
            insideSpanElement.innerText = value;
            spanElement.appendChild(insideSpanElement);
        })

        const spanElementSpace = document.createElement('span');
        spanElementSpace.innerText = " ";
        quoteDisplayElement[0].appendChild(spanElementSpace);
    });

    addUnderlineText();

}




quoteInputElement.addEventListener('input', function() {
    var inputValue = quoteInputElement.value;

    const underlineElement = document.getElementsByClassName(currIndex);
    const innerSpanElements = underlineElement[0].querySelectorAll('span');
    const nextSpaceElement = underlineElement[0].nextElementSibling;
    nextSpaceElement.className = '';


    var inputIndex = 0;
    var charIndex = 0;
    var innerSpanElementsSize = innerSpanElements.length;
    var inputValueLength = inputValue.length;
    let flag = true;

    for(charIndex = 0; charIndex<innerSpanElementsSize; charIndex++){
        if(inputIndex>=inputValueLength) {
            innerSpanElements[charIndex].className = '';
            innerSpanElements[charIndex].classList.add('not-selected');
        }

        while(inputIndex<inputValueLength){
            if(inputValue[inputIndex]==innerSpanElements[charIndex].innerText && flag){
                innerSpanElements[charIndex].className = '';
                innerSpanElements[charIndex].classList.add('green');
                inputIndex++;
                break;
            } 
            else{
                flag = false;
                innerSpanElements[charIndex].className = '';
                innerSpanElements[charIndex].classList.add('red');
                inputIndex++;
                break;
            }
        }       
    }

    if(inputValueLength==innerSpanElementsSize && currIndex==arraySize-1 && flag){
        removeUnderlineText();
        let requiredTime = Number(quoteTimerElement[0].innerText);

        let timeInMinutes = requiredTime/60;
        let wpm = Math.round(arraySize/timeInMinutes);

        backDrop[0].style.display = "flex";
        wpmResult[0].style.display = "flex";
        result[0].innerText = wpm;

        let status = ''
        if(wpm < 45) status = 'You are Sloth';
        else if(wpm < 65) status = 'You are just better than Sloth';
        else if(wpm < 85) status = 'You are Turtle';
        else status = 'Better than Turtle';

        resultStatus[0].innerText = status;
        utilityClear();
        isAlternate = !isAlternate;
        ctaButton[0].classList.toggle('active');
    }
    else if(currIndex!=arraySize-1 && flag){
        //case for already the word is correct and later we are checking for the space 
        if(inputValueLength==innerSpanElementsSize+1 && inputValue[inputValueLength-1]==' '){
            removeUnderlineText();
            currIndex++;
            quoteInputElement.value=null;
            addUnderlineText();
        }
        //case for word is correct but later we are typing other string instead of ' '
        else if(inputValueLength>=innerSpanElementsSize+1){
            nextSpaceElement.classList.toggle('error');
        }


    }
    
});

let isAlternate = true;
let intervalId;
let intervalId1;

function decreaseTimer() {
    let time = Number(backDropTimer[0].innerText);
    time--;
    backDropTimer[0].innerText = time;

    if(time==0){
        setTimeout(() => {
            backDrop[0].style.display="none";
            backDropTimer[0].style.display="none";
            intervalId1 = setInterval(updateTimer, 1000);
            clearInterval(intervalId);
            inputTextArea.innerText = null;
            inputTextArea.disabled = false;
            inputTextArea.focus();
        }, 500);
    }
}

function utilityClear() {
    clearInterval(intervalId1);
    quoteTimerElement[0].innerText = 0;
    backDropTimer[0].innerText = 3;
    quoteDisplayElement[0].innerText='';
    currIndex = 0;
    arraySize = 0;
    quoteData = null;
    ctaButton[0].textContent = "Start";
    inputTextArea.disabled = true;
    inputTextArea.focus();
    fetchData();
}

ctaButton[0].addEventListener('click', () => {
    ctaButton[0].classList.toggle('active');
    isAlternate = !isAlternate;
    if (isAlternate) {
        utilityClear();

    } else {
        ctaButton[0].textContent = "Stop & Re-Start";
        backDrop[0].style.display = "flex";
        backDropTimer[0].style.display = "block";
        inputTextArea.focus();
        intervalId = setInterval(decreaseTimer, 1000);
    }
});


wpmResult[0].addEventListener('click', () => {
    wpmResult[0].style.display = "none";
    backDrop[0].style.display = "none";
})






fetchData();
inputTextArea.disabled = true;




