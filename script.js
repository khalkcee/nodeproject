import bot from './assets/bot.svg';
import user from './assets/user.svg';



// const form = 
const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container')
 
let loadInterval;

// the loader function to show 3 dots every 300 milisceconds
function loader(element) {
    element.textContent = "";

    loadInterval = setInterval(() => {
        element.textcontent += '.';
        if (element.textContent === '....') {
            element.textContent = '';
        }
    },300)

}


// Types the text as the bot thinks
function typeText(element, text) {
    let index = 0;
    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index);
            index++
        } else {
            clearInterval(interval);
        }
    }, 20)
}

// generate unique ID
function generateID() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);
    return `id-${timestamp}-{hexadecimalString}`;

}


// differentiate chat stripes
function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}" > 
            <div class="chat">
            <div class="profile">
                <img src="${isAi ? bot : user}" alt="${isAi ? bot : 'user'}" />
            </div>
            <div class="message" id=${uniqueId}> ${value} </div>
            </div>
        
        </div>
        
        
        `
    )
}

// handles submission of button
const handleSubmit = async (e) => {
    e.preventDefault(); 
    const data = new FormData(form);


    //user's chat stripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

    form.reset();

    //bot's chatstripe
    const uniqueId = generateID();
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId);

    chatContainer.scrollTop = chatContainer.scrollHeight;
    const messageDiv = document.getElementById(uniqueId);

    loader(messageDiv);

    try {
         //fetch data 
const response = await fetch('https://chatmonki.onrender.com', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        prompt: data.get('prompt')
    })
})

clearInterval(loadInterval);
messageDiv.innerHTML = "";
if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();

    typeText(messageDiv, parsedData);
}else
{
    const err = await response.text();
    messageDiv.innerHTML = "something went wrong"
    alert(err);
}

    } 
    catch (error) {
        console.error(error);
        messageDiv.innerHTML = "something went wrong"
        alert(error.message);
        console.log(err)
    }


}




form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e);
    }
});