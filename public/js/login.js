const openLogin = document.querySelector("#login");
const closeLogin = document.querySelector(".closeLogin");
const Login =  document.getElementById('loginpModal');


openLogin.addEventListener("click", ()=>{
   Login.style.display ="block";
});

closeLogin.addEventListener("click", ()=>{
    Login.style.display = "none";
})