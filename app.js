const burger = document.querySelector(".burger-nav")
const navigation = document.querySelector(".navigation")
burger.addEventListener("click", ()=>{
  navigation.classList.toggle("open")
})



const appData = []
const search = document.querySelector("#appliances")

fetch("./appliance.json")
.then(response => response.json())
.then(data => appData.push(...data))

function showSuggestions(){
  const html = appData.map(match => {
    return `
      <option value="${match.power}">
        ${match.name}
      </option>
    `
  }).join("")
  search.innerHTML = html
}

window.addEventListener("load",showSuggestions)


const inputs = document.querySelectorAll("input.input-field:not(.submit)")

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

function handleCommas(e){
    this.value = numberWithCommas(this.value)
}

function handleInputClick(e){
  const html = document.createElement("label")
  html.classList.add("input-label")
  html.innerText= this.dataset.unit
  this.before(html)
}

inputs.forEach(input=>{
  input.addEventListener("input", handleInputClick,{once:true})
  input.addEventListener("blur", handleCommas)
})

const form = document.querySelector("form")
const formCard = document.querySelector(".form-card")
const formRes = document.querySelector(".form-res")
const reset  = document.querySelector(".cta-reset")

function showResult(appliancePower, elecUsage){
  console.log(appliancePower)
  const resLabel = document.createElement("div")
  resLabel.classList.add("res-label")
  reset.before(resLabel)
  
  if(!appliancePower||!elecUsage){
    let text = "Please Enter a Valid Number in the Inputs"
    resLabel.innerText = text

    formCard.classList.add("result")
    setTimeout(()=>{
      formCard.classList.add("active")
    },500)

    return
  }
  
  let text = "The following is the estimated average power for this appliance along with the electricity usage."
  resLabel.innerText = text

  const resKW = document.createElement("div")
  resKW.classList.add("res-kw")
  resKW.classList.add("res")
  resKW.innerText = `Appliance Power : ${Math.round((appliancePower + Number.EPSILON) * 100) / 100} KW`
  reset.before(resKW)
  
  const resKWH = document.createElement("div")
  resKWH.classList.add("res-kwh")
  resKWH.classList.add("res")
  resKWH.innerText = `Electricity Usage : ${Math.round((appliancePower + Number.EPSILON) * 100) / 100} KWH`
  reset.before(resKWH)

  formCard.classList.add("result")
  setTimeout(()=>{
    formCard.classList.add("active")
  },500)
}

function handleSubmit(e){
  e.preventDefault()
  const price = parseInt(this.querySelector(".input-container #price").value.replace(/,/g,""))
  const cost = parseFloat(this.querySelector(".input-container #cost").value.replace(/,/g,""))
  const hours = parseFloat(this.querySelector(".input-container #hours").value.replace(/,/g,""))

  const appliancePower = price/(cost*hours)
  const elecUsage = appliancePower*hours
  showResult(appliancePower, elecUsage)
}

form.addEventListener("submit", handleSubmit)
reset.addEventListener("click", ()=>{location.reload()})
