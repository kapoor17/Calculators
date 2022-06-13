const burger = document.querySelector(".burger-nav")
const navigation = document.querySelector(".navigation")
burger.addEventListener("click", ()=>{
    navigation.classList.toggle("open")
})