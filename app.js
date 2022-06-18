/* Header */
function burgerNav(){
  const burger = document.querySelector(".burger-nav")
  const navigation = document.querySelector(".navigation")
  
  burger.addEventListener("click", ()=>{
    navigation.classList.toggle("open")
  })
}

burgerNav()

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
    // newDevicePower.addEventListener("input", handleInputClick,{once:true})
    
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

 const table = document.querySelector(".form-res-table")
 function fillCard(appPow, appName, appEnergy){
    const hoursNeededPerDay = appEnergy/appPow
    console.log(appName,hoursNeededPerDay, appPow, appEnergy)
    
    if(hoursNeededPerDay>24){
      if(!document.querySelector(".alert")){
        const alert = document.createElement("div")
        alert.classList.add("alert")
        alert.innerHTML = "You have a surplus amount of Monthly Budget, as one or more than one items can be run for more than 24Hrs in a Day"
        reset.before(alert)
      }
    }
  
    if(!document.querySelector(".res-label")){
      const resLabel = document.createElement("div")
      resLabel.classList.add("res-label")
      table.before(resLabel)
  
      let text = "The following is the estimated average amount of hours you should run these appliance"
      resLabel.innerHTML = text
    }

    // hoursNeededPerDay>24 ? "More than 24 Hours" :
    const hoursNeededPerDayNew = hoursNeededPerDay>24 ? "More than 24 Hours" : `${parseInt(hoursNeededPerDay)} Hrs ${Math.round((((hoursNeededPerDay - parseInt(hoursNeededPerDay))*60) + Number.EPSILON) * 100) / 100} Mins`

    const resRow = document.createElement("tr")
    resRow.classList.add("res-row")

    const resApp = document.createElement("td")
    resApp.classList.add("res-app")
    resApp.innerHTML = appName

    const resHr = document.createElement("td")
    resHr.classList.add("res-hr")
    resHr.dataset.power=appPow
    resHr.dataset.energy=appEnergy
    resHr.innerHTML = hoursNeededPerDayNew

    resRow.appendChild(resApp)
    resRow.appendChild(resHr)

    table.appendChild(resRow)

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
   const totalEnergy = price/cost
   const appliances = Array.from(this.querySelectorAll(".input-container[data-power]"))
   
   let totalHrs=0
   appliances.forEach(app=>{
     const appHour = parseInt(app.querySelector(".input-field-hour").value)
     totalHrs+=appHour
    })
    
    appliances.forEach(app=>{
      const appName = app.querySelector(".input-field-app").innerText
      const appHour = parseInt(app.querySelector(".input-field-hour").value)
      const appPow = app.querySelector(".input-field-pow").value
      
      const timeRatio = (appHour*appPow)/totalHrs
      const appEnergy = totalEnergy*timeRatio
      
      if(!parseFloat(appEnergy)){
        handleError()
        return
      }

      fillCard(appPow, appName, appEnergy)
   })

   if(!price&&!cost){
     handleError()
     return
   }
 }

 form.addEventListener("submit", handleSubmit)
 
// let clickedApp = []

//  function addArrows(elem){
//   if(!elem.querySelector(".up") && !elem.querySelector(".down")){
//     const up = document.createElement("div")
//     up.classList.add("up")
//     up.innerHTML=`<i class="fa-solid fa-angle-up"></i>`
//     elem.appendChild(up)
  
//     const down = document.createElement("div")
//     down.classList.add("down")
//     down.innerHTML=`<i class="fa-solid fa-angle-down"></i>`
//     elem.appendChild(down)
//   }
//  }

//  function removeArrows(elem){
//   const up=elem.querySelector(".up")
//   const down=elem.querySelector(".down")
//   if(up && down){
//     up.remove()
//     down.remove()
//   }
//  }

//  function handleValueExchange(){
//   const appTbHours = table.querySelectorAll(".res-hr")
//   appTbHours.forEach(app=>{
//     app.addEventListener("click", function(){
//       if(document.querySelectorAll(".clicked").length===2){
//         if(this.classList.contains("clicked")){
//           removeArrows(this)
//           this.classList.remove("clicked")
//           clickedApp.splice(clickedApp.findIndex(e => e === this),1);
//           exchangeValues()
//         }
//         return
//       }
      
//       if(this.classList.contains("clicked")){
//         this.classList.remove("clicked")
//         removeArrows(this)
//         clickedApp.pop()
//         exchangeValues()
//       }
//       else{
//         this.classList.add("clicked")
//         addArrows(this)
//         clickedApp.push(this)
//         exchangeValues()
//       }
//     })
//   })

// }

// function exchangeValues(){
//   console.log(clickedApp)
//   if(clickedApp.length==2){
//     clickedApp.forEach(app=>{
//       const up = app.querySelector(".up")
//       const down = app.querySelector(".down")
//       up.addEventListener("click", handleExchangeUp)
//       down.addEventListener("click", handleExchangeDown)
//     })
//   }

//   function handleExchangeUp(){
//     console.log(this)
//   }

//   function handleExchangeDown(){
//     console.log(this)
//   }
// }

// form.addEventListener("submit", handleValueExchange)

 reset.addEventListener("click",()=>{window.location.reload(true)})

/* Appliance Energy Exchange */

