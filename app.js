/* Header */

// manages the burger menu for the header
function burgerNav(){
  const burger = document.querySelector(".burger-nav")
  const navigation = document.querySelector(".navigation")
  
  burger.addEventListener("click", ()=>{
    navigation.classList.toggle("open")
  })
}

burgerNav()

/* Fetching Data and Displaying */

// fetches the data and adds the data into an array
function fetchData(){
  const appData = []
  fetch("./appliance.json")
      .then(response => response.json())
      .then(data => {
        appData.push(...data)
        // sends the data to be filled in the select tag
        showSuggestion(appData)
      })
      .catch(error => {
        console.error('Error:', error);
      });
}

// gets the data and fills the select tag with it
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

// function tha adds the single rows of appliance with all the details of it 
function handleAdd(){
    const selectedApp = select.options[select.selectedIndex]

    const newDeviceContainer = document.createElement("div")
    newDeviceContainer.dataset.power = selectedApp.dataset.power
    newDeviceContainer.classList.add("input-container")
    
    const newDevice = document.createElement("div")
    newDevice.classList.add("input-field", "input-field-app")
    const p = document.createElement("p")
    p.innerHTML = selectedApp.value
    newDevice.appendChild(p)

    const newDeviceHour  = document.createElement("input")
    newDeviceHour.placeholder = "~ Hours"
    newDeviceHour.classList.add("input-field","input-field-hour")
    
    const newDevicePower = document.createElement("input")
    newDevicePower.placeholder = "E in KW"
    newDevicePower.dataset.unit = "KW"
    newDevicePower.value = selectedApp.dataset.power
    newDevicePower.classList.add("input-field", "input-field-pow")
    // newDevicePower.addEventListener("input", handleUnitAdd,{once:true})
    
    const delBtn = document.createElement("div")
    delBtn.classList.add("cta", "cta-del")
    delBtn.innerHTML="<i class='bi bi-trash'></i>"
    
    newDeviceContainer.appendChild(newDevice)
    newDeviceContainer.appendChild(newDeviceHour)
    newDeviceContainer.appendChild(newDevicePower)
    newDeviceContainer.appendChild(delBtn)
    submitButton.before(newDeviceContainer)

    const delDevice = document.querySelectorAll(".cta-del")
    delDevice.forEach(del=>{del.addEventListener("click", handleDel,{once:true})})
  }

  function handleDel(){
    this.parentNode.remove()
  }
  
  addDevice.addEventListener("click", handleAdd)
  
  /* Input Styling */
  
  const inputs = document.querySelectorAll("input.input-field:not(.submit)")
  
  // spits out an int value with commas
  function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
  
  // add a unit label inside the input field
  function handleUnitAdd(e){
    const html = document.createElement("label")
    html.classList.add("input-label")
    html.innerText= this.dataset.unit
    this.before(html)
  }
  
  inputs.forEach(input=>{
    input.addEventListener("input", handleUnitAdd,{once:true})
    input.addEventListener("blur", function(){this.value=numberWithCommas(this.value)})
  })

 /* Form Handling */

 const form = document.querySelector("form")
 const formCard = document.querySelector(".form-card")
 const reset  = document.querySelector(".cta-reset")

 // function tha fills the tables with the hours calculated
const table = document.querySelector(".form-res-table")
function fillTable(appName, appPow, appEnergy){
  hoursNeededPerDay = appEnergy/appPow
  console.log(appName,hoursNeededPerDay,appPow,appEnergy)
  
  // surplus alert
  /*if(hoursNeededPerDay>24){
    if(!document.querySelector(".alert")){
      const alert = document.createElement("div")
      alert.classList.add("alert")
      alert.innerHTML = "You have a surplus amount of Monthly Budget, as one or more than one items can be run for more than 24Hrs in a Day"
      reset.before(alert)
    }
  }*/

  if(!document.querySelector(".res-label")){
    const resLabel = document.createElement("div")
    resLabel.classList.add("res-label")
    table.before(resLabel)

    let text = "The following is the estimated average amount of hours you should run these appliance"
    resLabel.innerHTML = text
  }

  // hoursNeededPerDay>24 ? "More than 24 Hours" :
  const hoursNeededPerDayNew =`${parseInt(hoursNeededPerDay)} Hrs ${Math.round((((hoursNeededPerDay - parseInt(hoursNeededPerDay))*60) + Number.EPSILON) * 100) / 100} Mins`

  const resRow = document.createElement("tr")
  resRow.classList.add("res-row")

  const resApp = document.createElement("td")
  resApp.classList.add("res-app")
  resApp.innerHTML = appName

  const resHr = document.createElement("td")
  resHr.classList.add("res-hr")
  resHr.dataset.power=appPow
  resHr.dataset.energy=appEnergy
  const p = document.createElement("p")
  p.innerHTML=hoursNeededPerDayNew
  resHr.appendChild(p)

  resRow.appendChild(resApp)
  resRow.appendChild(resHr)

  table.appendChild(resRow)

  formCard.classList.add("result")
  setTimeout(()=>{
    formCard.classList.add("active")
  },500)
  }

 // function that handles the errors 
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


// function that handles the submit event and then calculates all the data and fills the table
function handleSubmit(e){
  e.preventDefault()   

  const price = parseInt(this.querySelector(".input-container #price").value.replace(/,/g,""))
  const cost = parseFloat(this.querySelector(".input-container #cost").value.replace(/,/g,""))
  const totalEnergy = price/cost
  const appliances = Array.from(this.querySelectorAll(".input-container[data-power]"))
  
  //calculate the total hours the electricity is used by adding the hours used of each appliance
  let totalHrs=0
  appliances.forEach(app=>{
    const appHour = parseInt(app.querySelector(".input-field-hour").value)
    totalHrs+=appHour
  })

  // calculates the time and then fills the calculated hours in a table  
  appliances.forEach(app=>{
    const appName = app.querySelector(".input-field-app").innerText
    const appHour = parseInt(app.querySelector(".input-field-hour").value)
    const appPow = app.querySelector(".input-field-pow").value
    
    const timeRatio = (appHour)/totalHrs
    const appEnergy = totalEnergy*timeRatio
    
    // error handle for non integer value for app energy
    if(!parseFloat(appEnergy)){
      handleError()
      return
    }

    // sends the calculated time for each appliance and then sends it to be filled in a table
    fillTable(appName, appPow, appEnergy)
  })

  // error handle for non integer value for price and cost
  if(!price&&!cost){
    handleError()
    return
  }
}

 form.addEventListener("submit", handleSubmit)
 
// the array that is going to hold the 2 selected appliances
let clickedApp = []

//add the arrows to the selection
function addArrows(elem){
  if(!elem.querySelector(".up") && !elem.querySelector(".down")){
    const up = document.createElement("div")
    up.classList.add("up")
    up.innerHTML=`<i class="fa-solid fa-angle-up"></i>`
    elem.appendChild(up)
  
    const down = document.createElement("div")
    down.classList.add("down")
    down.innerHTML=`<i class="fa-solid fa-angle-down"></i>`
    elem.appendChild(down)
  }
}

//removes the arrows from the selection
function removeArrows(elem){
  const up=elem.querySelector(".up")
  const down=elem.querySelector(".down")
  if(up && down){
    up.remove()
    down.remove()
  }
}

//selectes the 2 appliances through which the energy will be exchanges
function handleValueExchange(){
  const appTbHours = table.querySelectorAll(".res-hr")
  
  appTbHours.forEach(app=>{
    app.addEventListener("click", function(){
      if(document.querySelectorAll(".clicked").length===2){
        //for removing the arrows from the last selection
        if(this.classList.contains("clicked")){
          removeArrows(this)
          this.classList.remove("clicked")
          clickedApp.splice(clickedApp.findIndex(e => e === this),1);
          exchangeValues()
        }
        //this is return so that no more than 2 values can be added
        return
      }
      
      //for removing the arrows from the forst selection
      if(this.classList.contains("clicked")){
        this.classList.remove("clicked")
        removeArrows(this)
        clickedApp.pop()
        exchangeValues()
      }//for adding the arrows to the first and the second selection...this is the condition that is going to take both the values to exchangeValue()
      else{
        this.classList.add("clicked")
        addArrows(this)
        clickedApp.push(this)
        exchangeValues()
      }
    })
  })

}

function exchangeValues(){
  console.log(clickedApp)
  if(clickedApp.length==2){
    clickedApp.forEach(app=>{
      const appFrom = app
      const appTo = clickedApp.filter(el=> el!==appFrom)[0]
      const up = app.querySelector(".up")
      const down = app.querySelector(".down")
      up.addEventListener("click", function(e){
        e.stopPropagation()
        handleExchangeUp(appFrom,appTo)
      })
      down.addEventListener("click", function(e){
        e.stopPropagation()
        handleExchangeDown(appFrom,appTo)
      })
    })
  }

  function handleExchangeUp(appFrom, appTo){
    appFrom.dataset.energy = parseFloat(appFrom.dataset.energy) + 5
    appTo.dataset.energy = parseFloat(appTo.dataset.energy) - 5
    fillTableNew(appFrom, appTo)
  }
  
  function handleExchangeDown(appFrom, appTo){
    appFrom.dataset.energy = parseFloat(appFrom.dataset.energy) - 5
    appTo.dataset.energy = parseFloat(appTo.dataset.energy) + 5
    fillTableNew(appFrom, appTo)
  }
}

function fillTableNew(appFrom, appTo){
  console.log(appFrom)
  const hoursNeededPerDayFrom = appFrom.dataset.energy/appFrom.dataset.power
  const hoursNeededPerDayTo = appTo.dataset.energy/appTo.dataset.power
  
  appFrom.querySelector("p").innerHTML = `${parseInt(hoursNeededPerDayFrom)} Hrs ${Math.round((((hoursNeededPerDayFrom - parseInt(hoursNeededPerDayFrom))*60) + Number.EPSILON) * 100) / 100} Mins`
  appTo.querySelector("p").innerHTML = `${parseInt(hoursNeededPerDayTo)} Hrs ${Math.round((((hoursNeededPerDayTo - parseInt(hoursNeededPerDayTo))*60) + Number.EPSILON) * 100) / 100} Mins`
}

form.addEventListener("submit", handleValueExchange)

reset.addEventListener("click",()=>{window.location.reload(true)})

/* Appliance Energy Exchange */

