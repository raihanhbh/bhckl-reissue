import axios from "axios";
const api = "https://appointment.bdhckl.gov.bd/get-slip?slip";
const localStotageName = "bhckl-delivery-slip-list"
// grab the form
const form = document.querySelector(".form-data");
// grab the Passport renew delivery slip no
const deliverySlipNo = document.querySelector(".delivery-slip-no");
var deliverySlipList = []



const populateTableWithSlipData = () => {
  var tableRows = document.querySelector("#data-table-rows")
  
  tableRows.innerHTML = ''
  const slipList = localStorageData()

  for(const [index, val] of slipList.entries()) {
    // Create an empty <tr> element and add it to the 1st position of the table:
    var row = tableRows.insertRow()

    // Insert new cells (<td> elements) at the 1st and 2nd position of the "new" <tr> element:
    var cell1 = row.insertCell(0)
    var cell2 = row.insertCell(1)
    var cell3 = row.insertCell(2)
    cell3.addEventListener("click", removeDeliverySlip, false)
    cell3.index = index

    cell1.innerHTML = val
    cell2.innerHTML = " - "
    cell3.innerHTML = "Remove"
  }
}

const localStorageData = () => {
  var slips = window.localStorage.getItem(localStotageName)
  return (slips)? slips.split(",") : []
}

const addDeliverySlip = (deliverySlip) => {
  deliverySlipList = localStorageData()
  if(!deliverySlipList[deliverySlip]) {
    deliverySlipList.push(deliverySlip)
    window.localStorage.setItem(localStotageName, deliverySlipList.toString())
  }
}


const removeDeliverySlip = (evt) => {
  let index = evt.currentTarget.index

  deliverySlipList = localStorageData()

  if(deliverySlipList[index]) {
    deliverySlipList.splice(index, 1)
    window.localStorage.setItem(localStotageName, deliverySlipList.toString())
  }
  var tableRows = document.querySelector("#data-table-rows")
  
  tableRows.deleteRow(index)

  for(let i=0; i<tableRows.rows.length; i++) {
    let cell3 = tableRows.rows[i].cells[2]
    cell3.innerHTML = "Remove"
    cell3.removeEventListener("click", removeDeliverySlip, false)
    cell3.addEventListener("click", removeDeliverySlip, false)
    cell3.index = i
  }
}

document.querySelector("#check-status").addEventListener("click", async function() {
  const slipList = localStorageData()
  var tableRows = document.querySelector("#data-table-rows")
  
  try {
    for(const [index, deliverySlip] of slipList.entries()) {
      const response = axios.get(`${api}=${deliverySlip}`).then(function(res,error){
        if (res.data.name) {
          tableRows.rows[index].cells[1].innerHTML = res.data.name
        } else {
          tableRows.rows[index].cells[1].innerHTML = "invalid"
        }
      });

      tableRows.rows[index].cells[1].innerHTML = '<div class="loader"></div>'
      
    }
    
  } catch (error) { 
    console.log(error)
  }
})

// declare a function to handle form submission
const handleSubmit = async e => {
  e.preventDefault();
  // searchForPassportStatus(deliverySlipNo.value);
  addDeliverySlip(deliverySlipNo.value);
  populateTableWithSlipData();
};

// declare a function to handle page load
const handleLoad = async e => {
  e.preventDefault();
  populateTableWithSlipData();
};


form.addEventListener("submit", e => handleSubmit(e));
document.addEventListener("DOMContentLoaded", e => handleLoad(e));
