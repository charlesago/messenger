const baseURL = "https://b1messenger.tk/"




const mainContainer = document.querySelector("#main")
const messagesPageButton = document.querySelector("#messagesPage")
const registerPageButton = document.querySelector("#registerPage")
const loginPageButton = document.querySelector("#loginPage")
const mymodal = document.querySelector("#myModal")
const closeModal = document.querySelector(".close")
const element = document.querySelector('#deletebutton')
let token

let currentuser



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

function closeModalRegister() {

    closeModal.addEventListener("click", ()=>{

        mymodal.style.display = "none"
        mymodal.close()
    })
}

function getMessageTemplate(message){

    let template
                  if(message.author.username == currentuser){
                      template = `  <div class="  mt-3 text-aligns">

                            <div class="row d-flex">
                                <p>Author : ${message.author.username}</p> 
                              
                                <p class=" rounded-pill text-bg-primary"><strong>${message.content}</strong> <button type="button" id="${message.id}" class="btn btn-secondary"></button> <button type="button" id="${message.id}" class=" delbutton  btn btn-secondary"><i class="bi bi-trash"></i>
</button>
                                        </p>
                            
                       </div>
                            </div>
                        `

                  }else {
                      template = `  <div class="  mt-3 text-aligns">

                            <div class="row d-flex">
                                <p>Author : ${message.author.username}</p> 
                              <div>
                                <p class=" rounded-pill text-bg-primary"><strong>${message.content}</strong> <div class="  btn-group">
                                  <button type="button" class="btn btn-secondary btn-sm dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                    Reaction 
                                  </button>
                                  <ul class="dropdown-menu">
                                    <li><a class="dropdown-item" href="#">Happy</a></li>
                                    <li><a class="dropdown-item" href="#">Lol</a></li>
                                    <li><a class="dropdown-item" href="#">Something else here</a></li>
                                    <li><hr class="dropdown-divider"></li>
                                    <li><a class="dropdown-item" href="#">Separated link</a></li>
                                  </ul>
                                </div>
                                        </p>
                            </div>
                       </div>
                            </div>
                        `
                  }

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
<div class="row messageForm container contain-register ">
                <input type="text"  class="form-control mb-3 ms-5" name="" id="messageField" placeholder="input message">
                <button class="btn btn-success" id="sendMessage"><i class="bi bi-send-fill"></i>Send</button>
        </div>`


    return template
}

function getRegisterTemplate(){
    let template = `
  <div class="contain contain-register ">
                <div class="register container d-flex row   ">
                            <div class="mb-4">
                        <h1>Register</h1>
                        
                            </div>
                        <input type="text" id="regUsername" class="form-control mb-3" placeholder="username">
                        <input type="password" id="regPassword" class="form-control mb-3" placeholder="password">
                        <button class="btn btn-primary mb-3 " id="register">Register</button>
            
                 </div>
                 </div>
                 </div>
    `
    return template
}

function getLoginTemplate(){
    let template = `   
    <div class="contain contain-register ">
                <div class="register container d-flex row  ">
                            <div class="mb-4">
                        <h1>Login </h1>
                        
                            </div>
                        <input type="text" id="usernameLogin" class="form-control mb-3" placeholder="Username">
                        <input type="password" id="passwordLogin" class="form-control mb-3" placeholder="Password">
                        <button class="btn btn-primary mb-3 " id="loginButton">Log In</button>
                        <span id="errorpassword" class="text-warning"></span>
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


            const delbutton = document.querySelectorAll(".delbutton")
            delbutton.forEach( btn=>{

                btn.addEventListener("click" ,()=> {
                    let currentmessageid = btn.id
                    let url = `${baseURL}api/messages/delete/${currentmessageid}`

                    let fetchParams = {
                        method : "DELETE",
                        headers:{"Content-Type":"application/json",
                            "Authorization": `Bearer ${token}`
                        },

                    }


                    fetch(url, fetchParams)

                    displayMessagesPage()

                })
            })


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
        .then(data=>{

            if(data == "username already taken"){

                mymodal.style.display = "block"
                closeModalRegister()
            }else{
                displayLoginPage()
            }
        })




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
                currentuser = usernameLogin.value
                document.querySelector(".btnRegisterSignup").innerHTML = `
                <p class="text-light ms-5">${usernameLogin.value}</p> 
                   <button class="btn text-light ms-4 " id="logout"> <i class="bi bi-box-arrow-in-right"></i>Log out</button>
               
                `
                displayMessagesPage()
            }else{
                displayLoginPage()
                errorpassword.innerHTML="ERROR username or password"

            }

        })
        .then(()=>{
            document.querySelector("#logout").addEventListener("click",()=>{
                token = null
                displayLoginPage()
                document.querySelector(".btnRegisterSignup").innerHTML =
                    `
                    <button class="btn text-light ms-4" id="registerPage"> <i class="bi bi-person-circle"></i>
                    Register</button>
                <button class="btn text-light ms-4 " id="loginPage"> <i class="bi bi-box-arrow-in-right"></i>
                    Log in</button>
                    
                    `
            })
        })




}

displayLoginPage()