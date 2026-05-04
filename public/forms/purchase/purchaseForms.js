import { handlePurchaseSetup } from "./purchaseHandlers.js";
import {
  fetchStores,
  fetchStoreDetails,
  submitPurchase,
} from "./purchaseApi.js";
import { purchaseSession } from "./purchaseSession.js";
import { loadForm, nextStep } from "../../formRouter.js";

let storeMap = new Map();

//
//===========================
// ADD ITEM FORM Step 1
//=============================
//

export async function addItemForm(data = {}) {
  const content = document.getElementById("contentArea");
  const existingStoreID = data.StoreID;

  let prefillDisplay = "";
  if (existingStoreID) {
    try {
      const store = await fetchStoreDetails(existingStoreID);
      //const store = await response;

      if (!store) {
        throw new Error(`Store not located:  ${store.status}`);
      }

      console.log("Fetched store details: ", store);

      purchaseSession.storeID = store.StoreID;
      purchaseSession.storeName = store.StoreName;
      purchaseSession.storeAddress = store.StoreAddress;

      prefillDisplay = `${store.StoreName} ${store.StoreAddress}`;
      console.log("Store Chosen: ", prefillDisplay);
    } catch (err) {
      console.log("Error: ", err.message);
    }
  }

  //============
  // HTML Form
  //============
  content.innerHTML = ` 
    <h1>Add New Item</h1><br>
    <div class="mx-auto p-2" style="width: 400px;">
    <form id='purchaseSetupForm' class='form'>

    <label for="quantity" class="col-form-label-lg gap-3">
        How many items would you like to add?
    </label><br>
    
    <input type="number" 
        id="quantity" 
        name="numberOfItems" 
        class="form-control form-control-lg gap-3" 
        min="1" 
        value="1"
        required
        ><br>
    
    <p><h4>Where did you purchase these items?</h4></p>
    <label for='storeDetails'  
        class='col-form-label-lg gap-3'>
            <i>Select from Existing Stores</i>
    </label><br>
    
    <input type='text' 
        id='storeInput' 
        name='storeDisplay' 
        placeholder="Start typing the store name..."
        class="form-control form-control-lg gap-3" 
        list="storeOptions"
    ><br>
    <datalist id="storeOptions"></datalist>
    
    <input type="hidden" id="storeID" name="storeID"></input> 
    
    <label for='newStoreDetails'  
        class='col-form-label-lg gap-3'>
            <i>Add a New Store to Your List</i>
    </label><br>

    <input type='text' 
        id='newStoreName' 
        name='newStoreName' 
        placeholder="Enter the store name..." 
        class="form-control form-control-lg gap-3" 
    ><br>

    <input type='text' 
        id='newStoreAddress' 
        name='newStoreAddress' 
        placeholder="Enter the store address.." 
        class="form-control form-control-lg gap-3" 
    ><br>
    
    <button type='submit' id='submitButton' class="btn btn-primary btn-lg gap-3" >Next</button>
    </form>
    </div>
  `;

  // load the store options datalist
  await loadStoreOptions();

  const storeInput = document.getElementById("storeInput");
  const storeIDField = document.getElementById("storeID");
  const form = document.getElementById("purchaseSetupForm");

  // set value to hidden storeID field if existing store is chosen
  if (prefillDisplay) {
    storeInput.value = prefillDisplay;
    storeIDField.value = purchaseSession.storeID;
  }

  storeInput.addEventListener("input", (e) => {
    const id = storeMap.get(e.target.value);
    storeIDField.value = id || "";
  });

  // add event listener to the submit button
  form.addEventListener("submit", (e) => handlePurchaseSetup(e, storeMap));
} // close addItemForm

//
//===============================
// LOAD STORE OPTIONS (Handles the predictive text field)
//===============================
//
async function loadStoreOptions() {
  try {
    const stores = await fetchStores();
    console.log("Loading Store data: ", stores);
    const dataList = document.getElementById("storeOptions");

    if (!dataList) {
      console.error("storeOptions dataList not found");
      return "";
    }
    dataList.innerHTML = "";
    storeMap.clear();

    stores.forEach((store) => {
      const display = `${store.StoreName} ${store.StoreAddress}`;

      storeMap.set(display, store.StoreID);

      const option = document.createElement("option");
      option.value = display;
      dataList.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load stores:", err);
    return "";
  }
}
//
//===============================
// ITEM FORM (Step 2)
//===============================
//
export function showItemForm(session) {
  const itemNumber = session.currentItemIndex;
  const numberOfItems = session.numberOfItems;
  const content = document.getElementById("contentArea");

  content.innerHTML = `
    <h1>Enter Item ${itemNumber} of ${numberOfItems} Details</h1>
    <form id='itemDetailsForm' class='form'>
      <div class="mx-auto p-2" style="width: 400px;">
        <label for="itemName" class="col-form-label-lg gap-3">
        Item Name
        </label><br> 

        <input type="text" 
          id="itemName" 
          name="itemName" 
          placeholder="Item Name" 
          class="form-control form-control-lg gap-3" 
          required><br>

        <label for="color" class="col-form-label-lg gap-3">
          Item Color
        </label><br>
        
        <input type="text" 
          id="color" 
          name="color" 
          placeholder="Color" 
          class="form-control form-control-lg gap-3"><br>

        <select name='condition' id='condition' class='form-select form-select-lg gap-3' required>
          <option value="" disabled selected>Item Condition</option>
          <option value="Brand New">Brand New</option>
          <option value="Like New">Like New</option>
          <option value="Very Good">Very Good</option>
          <option value="Good">Good</option>
          <option value="Acceptable">Acceptable</option>
        </select><br>

        <label for="purchPrice" class="col-form-label-lg gap-3">Purchase Date</label><br>
        <input type="date" 
          id="purchDate" 
          name="purchDate" 
          class="form-control form-control-lg gap-3" 
          required><br>

        <label for="purchPrice" class="col-form-label-lg gap-3">Purchase Price</label><br>
        <input type="text" 
          id="purchPrice"
          name="purchPrice" 
          placeholder="$1.00" 
          class="form-control 
          form-control-lg gap-3" 
          required><br>

        <button id="backbutton" 
        class="btn btn-outline-info btn-lg gap-3" 
        type="button" 
        data-page="goBack"
        >Back
        </button>
        
        <button type="submit" 
          id="saveItemButton" 
          class="btn btn-primary 
          btn-lg gap-3 float-end">Save Item</button>
      </div>
    </form> 
    `;

  const itemDetailsForm = document.getElementById("itemDetailsForm");

  itemDetailsForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (!itemDetailsForm.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      itemDetailsForm.classList.add("was-validated");
      console.log("Form validation failed");
      return;
    }
    // valid form submitted
    console.log("Item details form submitted");

    const formData = new FormData(itemDetailsForm);

    const itemData = {
      itemName: formData.get("itemName"),
      color: formData.get("color"),
      condition: formData.get("condition"),
      purchDate: formData.get("purchDate"),
      purchPrice: formData.get("purchPrice"),
    };

    // push the individual item data to the session
    purchaseSession.items.push(itemData);

    // if more than 1 item is to be added, load the form to add the next one
    if (purchaseSession.items.length < purchaseSession.numberOfItems) {
      purchaseSession.currentItemIndex++;
      loadForm("addPurchase", "item", purchaseSession);
    } else {
      nextStep(purchaseSession);
    }
  });
}
//
// =========================
// CONFIRMATION (Step 3)
// =========================
//
export async function showConfirmation(session) {
  const content = document.getElementById("contentArea");

  try {
    const bulkPurchase = await submitPurchase(session);
      content.innerHTML = ` 
            <h1>${session.numberOfItems} Items Added Successfully!</h1>
            <p style="text-align:center">These items can be found in your unlisted items queue.</p>`;
   
  } catch (err) {
    console.error("Submit failed: ", err);
    content.innerHTML= ` 
        <h1>Network Error</h1>`;
  }
}
