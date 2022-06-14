let appData = []

fetch("./appliance.json")
    .then(res=>res.json())
    .then(data=>appData.push(...data))

    
    console.log(appData)
    // appData.forEach((data)=>{
    //     console.log(data)
    //     console.log("hello")
    // })
 
    for(item of appData){
        console.log(item)
    }
    
    
    // const optGroup = document.querySelectorAll("optgroup")
// function getSuggestion(label, appData){
//     const filter = appData.filter(data=>{
//         console.log(data)
//         const regexp = new RegExp(label, "gi")
//         return data.name.match(regexp)
//     })
//     console.log(filter)
// }

// optGroup.forEach(group=>{
//     getSuggestion(group.label, appData)
// })