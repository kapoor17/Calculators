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
      <option data-power="${match.power}">
      ${match.name}
      </option>
      `
    }).join("")
    search.innerHTML = html
    console.log("Data Gathered Successfully")
  }
}

window.addEventListener("load", fetchData)



/* Adding Devices */

 const addDevice = document.querySelector(".cta-add")
 const select = document.querySelector("#appliances")
 const submitButton = document.querySelector(".input-submit")

 function handleAdd(){
    const selectedApp = select.options[select.selectedIndex]
    const newDeviceContainer = document.createElement("div")
    newDeviceContainer.dataset.power = selectedApp.dataset.power
    newDeviceContainer.classList.add("input-container")
    
    const newDevice = document.createElement("div")
    newDevice.classList.add("input-field", "input-field-app")
    newDevice.innerText = selectedApp.value
    
    const newDevicePower = document.createElement("input")
    newDevicePower.placeholder = "Energy in KW"
    newDevicePower.dataset.unit = "W"
    // newDevicePower.value = selectedApp.dataset.power
    newDevicePower.classList.add("input-field", "input-field-pow")
    
    const delBtn = document.createElement("div")
    delBtn.classList.add("cta", "cta-del")
    delBtn.innerHTML="<i class='bi bi-trash'></i>"
    
    newDeviceContainer.appendChild(newDevice)
    newDeviceContainer.appendChild(newDevicePower)
    newDeviceContainer.appendChild(delBtn)
    submitButton.before(newDeviceContainer)

    const delDevice = document.querySelectorAll(".cta-del")
    delDevice.forEach(del=>{del.addEventListener("click", handleDel)})
  }

  function handleDel(){
    this.parentNode.remove()
  }
  
  addDevice.addEventListener("click", handleAdd)
  
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

 /*function fillCard(appliancePower, elecUsage){
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
 }*/

 const table = document.querySelector(".form-res-table")
 function fillCard(appName, hoursNeededPerDay){
    if(!document.querySelector(".res-label")){
      const resLabel = document.createElement("div")
      resLabel.classList.add("res-label")
      table.before(resLabel)
  
      let text = "The following is the estimated average amount of hours you should run these appliance"
      resLabel.innerHTML = text
    }

    const hoursNeededPerDayNew = `${parseInt(hoursNeededPerDay)} Hrs ${Math.round((((hoursNeededPerDay - parseInt(hoursNeededPerDay))*60) + Number.EPSILON) * 100) / 100} Mins`

    console.log(hoursNeededPerDayNew)

    const resRow = document.createElement("tr")
    resRow.classList.add("res-row")

    const resApp = document.createElement("td")
    resApp.classList.add("res-app")
    resApp.innerHTML = appName

    const resHr = document.createElement("td")
    resHr.classList.add("res-hr")
    resHr.innerHTML = hoursNeededPerDayNew

    resRow.appendChild(resApp)
    resRow.appendChild(resHr)

    table.appendChild(resRow)

    // resHrs.classList.add("res")
    // resHrs.innerHTML = `${appName} should be used ${Math.round((hoursNeededPerDay + Number.EPSILON) * 100) / 100} Hrs/Day`
    // reset.before(resHrs)

    formCard.classList.add("result")
    setTimeout(()=>{
      formCard.classList.add("active")
    },500)
  }

 function handleError(){
  console.log("Hello")
  if(!document.querySelector(".res-error")){
    const resLabel = document.createElement("div")
    resLabel.classList.add("res-label", "res-error")
    reset.before(resLabel)
   
    let text = "Please Enter a Valid Number in the Inputs"
    resLabel.innerHTML = text
 
    formCard.classList.add("result")
    setTimeout(()=>{
      formCard.classList.add("active")
    },500)  
  }
 }

 function handleSubmit(e){
   e.preventDefault()   
   const price = parseInt(this.querySelector(".input-container #price").value.replace(/,/g,""))
   const cost = parseFloat(this.querySelector(".input-container #cost").value.replace(/,/g,""))
   const totalPow = price/cost
   const appliances = Array.from(this.querySelectorAll(".input-container[data-power]"))

   appliances.forEach(app=>{
     const appName = app.querySelector(".input-field-app").innerText
     const appPow = app.querySelector(".input-field-pow").value
     const hoursNeededPerDay = ((totalPow/appliances.length)/appPow)/30.4
      if(!parseFloat(hoursNeededPerDay)){
        handleError()
        return
      }
      fillCard(appName, hoursNeededPerDay)
   })

   if(!price&&!cost){
     handleError()
     return
   }
 }

 form.addEventListener("submit", handleSubmit)

 reset.addEventListener("click",()=>{window.location.reload(true)})
