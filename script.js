const inputSlider= document.querySelector("[data-lengthSlider]");
const lengthDisplay= document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
            // querySelectorAll for all checkboxes
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

let password="";
let passwordLength = 10;
let checkCount = 0;
handleslider();
//set strength circle color to grey
setIndicator("#ccc");


// set passwordLength
//work- pw length is reflected in ui 
function handleslider() { //pwlength from listener func is given to lhs
    inputSlider.value = passwordLength;
    lengthDisplay.innerText=passwordLength;

    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%"
}

//handleslider() is called everytime passwordlength is changed 

function setIndicator(color){
    indicator.style.backgroundColor=color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

    //overall randum function for diff usecases
    function getRndInteger(min, max){
        return Math.floor(Math.random()*(max-min))+min;
    }   

    function generateRandomNumber(){
        //0-9 to get single digit nums. Iterate later to generate pw
        return getRndInteger(0,9);
    }

    function generateLowerCase(){
        //random lowercase letter between a to z
        return String.fromCharCode(getRndInteger(97,123));
    }

    function generateUpperCase() {  
        //random uppercase letter between A to Z
        return String.fromCharCode(getRndInteger(65,91))
    }
    
    function generateSymbol() {
        //from declared symbol string line 19
        const randNum = getRndInteger(0, symbols.length);
        return symbols.charAt(randNum);
    }

    function calcStrength() {
        let hasUpper = false;
        let hasLower = false;
        let hasNum = false;
        let hasSym = false;
        if (uppercaseCheck.checked) hasUpper = true;
        if (lowercaseCheck.checked) hasLower = true;
        if (numbersCheck.checked) hasNum = true;
        if (symbolsCheck.checked) hasSym = true;
      
        if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
          setIndicator("#0f0");
        } else if (
          (hasLower || hasUpper) &&
          (hasNum || hasSym) &&
          passwordLength >= 6
        ) {
          setIndicator("#ff0");
        } else {
          setIndicator("#f00");
        }
    }

    async function copyContent(){
        
        try { 
            //this is an async function hence need to use await with it and async w func name
           await navigator.clipboard.writeText(passwordDisplay.value);
           copyMsg.innerText="Copied"; 
    //copied msg needs to disappear after 2 secs so need to use 
    //classlist active and hidden 
        } 

        catch (error)   {
            // console.log(error);
            copyMsg.innerText="Error";
        }


        copyMsg.classList.add("active"); //visible now
        //to remove it after 2 secs use settimeout

        setTimeout(() => {
            copyMsg.classList.remove("active");
        }, 2000); //add css to see effect 
    }

        function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
    }


    function handleCheckboxChange(){
    checkCount=0;
    allCheckBox.forEach((checkbox) =>{
            if(checkbox.checked)
                checkCount++;
        });

    //corner case for if slider is 1 but all are ticked so 4 unit pw created
            if (passwordLength < checkCount)
              {  passwordLength= checkCount;
                handleslider();
             }
    }


    allCheckBox.forEach((checkbox) =>{
    checkbox.addEventListener('change', handleCheckboxChange);
    })


        //slider listener
    inputSlider.addEventListener('input',(e)=>
        {
            passwordLength=e.target.value;
            handleslider();
        })


        //copy button listener
        copyBtn.addEventListener('click',()=>{
            //if there exists any pw then only copy 
            //if(passwordDisplay.value!=0){

                if(passwordDisplay.value)
                    copyContent();
                

        } )


    generateBtn.addEventListener('click', ()=>{
        //to add listener on checkboxes to have a count on how many are ticked
        //to accordingly generate pw 
        // loop function- through allcheckboxes by putting in nodelist(array)

        if(checkCount == 0) 
            return;

        if (passwordLength < checkCount)
           { passwordLength= checkCount;
            handleslider();
           }
        //new password generation
        //remove old pw
        password="";


        //lets put the stuffs by checkboxes first then random of all types


            // if(uppercaseCheck.checked) {
            //     password += generateUpperCase();
            // }

            // if(lowercaseCheck.checked) {
            //     password += generateLowerCase();
            // }

            // if(numbersCheck.checked) {
            //     password += generateRandomNumber();
            // }

            // if(symbolsCheck.checked) {
            //     password += generateSymbol();
            // }

//making a func array for above part to make random pw using num,upper,lower,symbols

            let funcArr=[];
            if(uppercaseCheck.checked)
                funcArr.push(generateUpperCase);
            
            if(lowercaseCheck.checked)
                funcArr.push(generateLowerCase);

            if(numbersCheck.checked)
                funcArr.push(generateRandomNumber);
        
            if(symbolsCheck.checked)
                funcArr.push(generateSymbol);

                    // 0        ,     1            ,        2            ,      3
//Now funcArr=[generateUpperCase, generateLowerCase, generateRandomNumber, generateSymbol]
// Iteration is done for remaining pw length on these to generate random
// PWLENGTH=10, Password=Ab3! ,Remaining =10-4=6 iterations
        //Iteration-1-
        // randIndex = getRndInteger(0, 4) generates a random index, let's say 2.
        // funcArr[2]() is generateRandomNumber(), which generates '7'.
        // password += '7', so password is now Ab3!7.

        // Iteration 2-
        // randIndex = getRndInteger(0, 4) generates a random index, let's say 1.
        // funcArr[1]() is generateLowerCase(), which generates 'c'.
        // password += 'c', so password is now Ab3!7c        
                //Goes on


            //compulsory addition for checked part
            for(let i=0;i<funcArr.length;i++){
                password+= funcArr[i]();
            }
            console.log("Compulsory adddition done");

            //remaining addition
            for(let i=0;i<passwordLength-funcArr.length;i++)
            {
                let randIndex=getRndInteger(0, funcArr.length);
                password+=funcArr[randIndex]();
            }
            console.log("Remaining adddition done");

            //shuffle password as first 4 comes in order 
            password=shufflePassword(Array.from(password));
            console.log("Shuffling done");

            //show in UI
            passwordDisplay.value=password;
            console.log("UI adddition done");
        
            //calculate strength
            calcStrength();
    })

