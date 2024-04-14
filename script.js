const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password = "" ;
let passwordLength = 10 ;
let checkCount = 0 ;
setIndicator("#ccc")    // circle
handleSlide();

function handleSlide ()
{
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;

    const min = inputSlider.min ;
    const max = inputSlider.max ;

    inputSlider.style.backgroundSize = ( (passwordLength-min)*100 / (max-min)) + "% 100%";
} 

function setIndicator(color)
{
    indicator.style.backgroundColor = color ;
    indicator.style.boxShadow = `0px 0px 12px ${color}` ;

}

function getRandomInteger(min,max)
{
    return Math.floor(Math.random() * (max - min)) + min;
}

function generateRandomNumber()
{
    return getRandomInteger(0,9);
}

function generateLowerCase()
{
    return String.fromCharCode( getRandomInteger(97,123) ) ;
}

function generateUpperCase()
{
    return String.fromCharCode( getRandomInteger(65,91) ) ;
}

function generateSymbol()
{
    const randomInteger = getRandomInteger(0,symbols.length);
    return symbols.charAt(randomInteger);
}

function calcStrength()
{
    if( uppercaseCheck.checked && lowercaseCheck.checked && (numbersCheck.checked || symbolsCheck.checked) && passwordLength >= 8)
        setIndicator("#0f0");

    else if ( (uppercaseCheck.checked || lowercaseCheck.checked) && (numbersCheck.checked || symbolsCheck.checked) && passwordLength >= 6)
        setIndicator("#ff0");

    else    
       setIndicator("#f00");
}

async function copyContent()
{
    try
    {
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied" ;
    }
    catch(e)
    {
        copyMsg.innerText = "Failed" ;
    }

    copyMsg.classList.add("active");

    setTimeout( () => copyMsg.classList.remove("active") , 2000);
}


function shufflePassword(array) {
    //Fisher Yates Method

    for (let i = array.length - 1; i > 0; i--) 
    {
        const j = Math.floor(Math.random() * (i + 1));
        
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }

    let str = "" ;
    array.forEach((el) => (str += el));
    return str;
}

// Events 

inputSlider.addEventListener( "input" , (e) => {
    passwordLength = e.target.value ;
    handleSlide();
});

copyBtn.addEventListener( "click" , () => {
    if(passwordDisplay.value)
        copyContent();
});

allCheckBox.forEach( (checkBox) => {
    checkBox.addEventListener("click",() => {
        checkCount = 0 ;
        allCheckBox.forEach( (element) => {
            if(element.checked)
                checkCount++;
        });
    });

    // Special Condition

    if( passwordLength < checkCount)
    {   passwordLength = checkCount ;
        handleSlide();
    }
}); 

generateBtn.addEventListener("click", () => {

    if( checkCount == 0)
        return ;
    
    if( passwordLength < checkCount)
    {   passwordLength = checkCount ;
        handleSlide();
    }

    password = "" ;

    let funArr = [];

    if( uppercaseCheck.checked)
        funArr.push(generateUpperCase);
    
    if( lowercaseCheck.checked)
        funArr.push(generateLowerCase);

    if( numbersCheck.checked)
        funArr.push(generateRandomNumber);

    if( symbolsCheck.checked)
        funArr.push(generateSymbol);

    // compulsory addition
    for( let i = 0 ; i<funArr.length ; i++)
        password += funArr[i]();

    // remaining adddition
    for( let i = 0 ; i< passwordLength - funArr.length ; i++)
    {
        let randomIndex = getRandomInteger(0,funArr.length);
        password += funArr[randomIndex]();
    }

    // suffle the password
    password = shufflePassword(Array.from(password));
    
    // Show Password in UI
    passwordDisplay.value = password;

    // calculate strength
    calcStrength();
});