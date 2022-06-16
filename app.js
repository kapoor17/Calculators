/* Header */
const burger = document.querySelector(".burger-nav")
const navigation = document.querySelector(".navigation")

burger.addEventListener("click", ()=>{
  navigation.classList.toggle("open")
})

/* Fetching Data and Displaying */

function fetchData(){
  const appData = []
  fetch("./appliance.json")
      .then(response => response.json())
      .then(data => {
        appData.push(...data)
        showSuggestion(appData)
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

function showSuggestion(appData){
  const search = document.querySelector("#appliances")
  if(appData.length>=0){
    const html = appData.map(match => {
      return `
      <option value="${match.power}">
      ${match.name}
      </option>
      `
    }).join("")
    search.innerHTML = html
    console.log("Data Gathered Successfully")
  }
}

window.addEventListener("load", fetchData)


 /* Input Styling */

 const inputs = document.querySelectorAll("input.input-field:not(.submit)")

 function numberWithCommas(x) {
   return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
 }

 function handleInputClick(e){
   const html = document.createElement("label")
   html.classList.add("input-label")
   html.innerText= this.dataset.unit
   this.before(html)
 }

 inputs.forEach(input=>{
   input.addEventListener("input", handleInputClick,{once:true})
   input.addEventListener("blur", function(){this.value=numberWithCommas(this.value)})
 })

 /* Form Handling */

 const form = document.querySelector("form")
 const formCard = document.querySelector(".form-card")
 const reset  = document.querySelector(".cta-reset")

 function fillCard(appliancePower, elecUsage){
   const resLabel = document.createElement("div")
   resLabel.classList.add("res-label")
   reset.before(resLabel)

   let text = "The following is the estimated average power for this appliance along with the electricity usage."
   resLabel.innerHTML = text

   const resKW = document.createElement("div")
   resKW.classList.add("res-kw")
   resKW.classList.add("res")
   resKW.innerHTML = `Appliance Power : ${Math.round((appliancePower + Number.EPSILON) * 100) / 100} KW`
   reset.before(resKW)
  
   const resKWH = document.createElement("div")
   resKWH.classList.add("res-kwh")
   resKWH.classList.add("res")
   resKWH.innerHTML = `Electricity Usage : ${Math.round((elecUsage + Number.EPSILON) * 100) / 100} KWH`
   reset.before(resKWH)

   formCard.classList.add("result")
   setTimeout(()=>{
     formCard.classList.add("active")
   },500)
 }

 function handleError(){
   const resLabel = document.createElement("div")
   resLabel.classList.add("res-label")
   reset.before(resLabel)
  
   let text = "Please Enter a Valid Number in the Inputs"
   resLabel.innerHTML = text

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

   if(!appliancePower||!elecUsage){
     handleError()
     return
   }

   fillCard(appliancePower, elecUsage)
 }

 form.addEventListener("submit", handleSubmit)

 reset.addEventListener("click",()=>{window.location.reload(true)})
