const openSignup = document.querySelector("#signup");
const cloeSignup = document.querySelector(".close");
const signup =  document.getElementById('signupModal');


openSignup.addEventListener("click", ()=>{
   signup.style.display ="block";
});

cloeSignup.addEventListener("click", ()=>{
    signup.style.display = "none";
})