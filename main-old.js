
const baseURL = "https://139.162.156.85:8000/"




const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const registerPageButton = document.querySelector("#registerPage")
const loginPageButton = document.querySelector("#loginPage")

let token = null



registerPageButton.addEventListener("click", displayRegisterPage)
loginPageButton.addEventListener("click", displayLoginPage)
messagesPageButton.addEventListener("click", displayMessagesPage)




function clearMainContainer(){
    mainContainer.innerHTML= ""
}


function display(content){
    //vider la div principale
    clearMainContainer()
    //et y ajouter le contenu qu'elle recoit

    mainContainer.innerHTML=content
}

function getMessageTemplate(message){

    let template = `
                            <div class="row border border-dark">
                                <p>Author : ${message.author.username}</p>
                                <p><strong>${message.content}</strong></p>
                            </div>
                        `

    return template

}

function getMessagesTemplate(messages){

    let messagesTemplate = ""

    messages.forEach(message=>{

        messagesTemplate+=  getMessageTemplate(message)
    })

    return messagesTemplate

}

function getMessageFieldTemplate(){
    let template = `
          <div class="row messageForm">
                <input type="text" name="" id="messageField" placeholder="input message">
                <button class="btn btn-success" id="sendMessage">Send</button>
        </div>`

    return template
}

<div className="modal" tabIndex="-1">
    <div className="modal-dialog">
        <div className="modal-content">
            <div className="modal-header">
                <h5 className="modal-title">Modal title</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body">
                <p>Modal body text goes here.</p>
            </div>
            <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
            </div>
        </div>
    </div>
</div>

function getRegisterTemplate(){
    let template = `
                  <div class="contain">
                <div class="register container d-flex row  contain-register">
                            <div class="mb-4">
                        <h1>Register </h1>
                        
                            </div>
                        <input type="text" id="regUsername " class="form-control mb-3" placeholder="Username">
                        <input type="password" id="regPassword" class="form-control mb-3" placeholder="Password">
                        <button class="btn btn-primary mb-3 " id="register">Register</button>
            
                 </div>
                 </div>
    `
    return template
}

function getLoginTemplate(){
    let template = `     <div class="contain">
                <div class="register container d-flex row  contain-register">
                            <div class="mb-4">
                        <h1>Login </h1>
                        
                            </div>
                        <input type="text" id="usernameLogin" class="form-control mb-3" placeholder="Username">
                        <input type="password" id="passwordLogin" class="form-control mb-3" placeholder="Password">
                        <button class="btn btn-primary mb-3 " id="loginButton">Log In</button>
            
                 </div>
                 </div>`

    return template
}

async function getMessagesFromApi(){

    let url = `${baseURL}api/messages/`

    let fetchParams = {
        method : 'GET',
        headers : {
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${token}`
        }
    }

    return await fetch(url, fetchParams)
        .then(response=>response.json())
        .then(messages=>{

            return messages

        })
}

async function displayMessagesPage(){
    //consiste a afficher les messages + le champ d'entrée d'un nouveau message

    if(!token){
        displayLoginPage()
        alert("log in to see messages")
    }else{



        let messagesAndMessageField = ""

        getMessagesFromApi().then(messages=>{


            messagesAndMessageField+=getMessagesTemplate(messages)
            messagesAndMessageField+=getMessageFieldTemplate()

            display(messagesAndMessageField)

            const messageField = document.querySelector("#messageField")

            const sendButton = document.querySelector("#sendMessage")
            sendButton.addEventListener("click", sendMessage)


        })
    }
}

function displayLoginPage(){
    display(getLoginTemplate())
    //buttons conts & event listeners
    const usernameLogin = document.querySelector('#usernameLogin')
    const passwordLogin = document.querySelector('#passwordLogin')
    const loginButton = document.querySelector('#loginButton')
    loginButton.addEventListener("click", login)
}

function displayRegisterPage(){

    display(getRegisterTemplate())

    const regUsername = document.querySelector("#regUsername")
    const regPassword = document.querySelector("#regPassword")
    const regButton = document.querySelector("#register")
    regButton.addEventListener("click", ()=>{
        register(regUsername.value, regPassword.value)
    })

}

function sendMessage(){
    let url = `${baseURL}api/messages/new`
    let body = {
        content : messageField.value
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
        headers:{"Content-Type":"application/json",
            "Authorization": `Bearer ${token}`
        },
        body: bodySerialise

    }


    fetch(url, fetchParams)

    displayMessagesPage()
}

function register(){
    let url = `${baseURL}register`
    let body = {
        username : regUsername.value,
        password : regPassword.value
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        method : "POST",
        body: bodySerialise

    }


    fetch(url, fetchParams)
        .then(response=>response.json())
        .then(data=>console.log(data))




}

function login(){
    let url = `${baseURL}login`
    let body = {
        username : usernameLogin.value,
        password : passwordLogin.value
    }


    let bodySerialise = JSON.stringify(body)

    let fetchParams = {
        headers:{"Content-Type":"application/json"},
        method : "POST",
        body: bodySerialise

    }


    fetch(url, fetchParams)
        .then(response=>response.json())
        .then(data=> {

            if(data.token){
                token = data.token
                displayMessagesPage()
            }else{
                displayLoginPage()
                alert("log in first to see messages")
            }

        })



}