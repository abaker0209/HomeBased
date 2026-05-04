// initialize purchase session object to hold the form details entered during the session
let purchaseSession = {
  storeID: "",
  storeName: "",
  storeAddress: "",
  numberOfItems: 0,
  items: [],
};

export async function addItemForm(StoreID = null) {
  let existingStore = "";
  if (!StoreID) {
    console.log("No StoreID provided, loading empty form");
  } else {
    console.log("StoreID provided:", StoreID);
    let storeData = await fetch(`/api/stores/getStoreDetails/${StoreID}`);
    if (storeData.ok) {
      storeData = await storeData.json();
      console.log("Received store details:", storeData);
      purchaseSession.storeID = StoreID;
      purchaseSession.storeName = storeData[0].StoreName;
      purchaseSession.storeAddress = storeData[0].StoreAddress;
      // if a storeID was available, initialize a variable to display the chosen store details
      existingStore =
        purchaseSession.storeName + " " + purchaseSession.storeAddress;
    } else {
      console.error("Failed to load store details for StoreID:", StoreID);
    }
  }

  const content = document.getElementById("contentArea");
  // html form
  content.innerHTML = `
          <h1>Add New Item</h1><br>
          <div class="mx-auto p-2" style="width: 400px;">
          
          <form id='purchaseSetupForm' class='form'>
            <label for="quantity" class="col-form-label-lg gap-3">
                How many items would you like to add?
            </label><br>
            
            <input 
              type="number" 
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
            
            <input 
              type='text' 
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

            <input 
              type='text' 
              id='newStoreName' 
              name='newStoreName' 
              placeholder="Enter the store name..." 
              class="form-control form-control-lg gap-3" 
            ><br>

            <input 
              type='text' 
              id='newStoreAddress' 
              name='newStoreAddress' 
              placeholder="Enter the store address.." 
              class="form-control form-control-lg gap-3" 
            ><br>
            
            <button type='submit' id='submitButton' class="btn btn-primary btn-lg gap-3" data-lastPage='add'>Next</button>
            </form>
          </div>
        `;
  await loadStoreOptions();
  const storeInput = document.getElementById("storeInput");

  if (existingStore) {
    storeInput.value = existingStore;
    storeInput.dispatchEvent(new Event("input"));
  }

  document
    .getElementById("purchaseSetupForm")
    .addEventListener("submit", handlePurchaseSetup);

  storeInput.addEventListener("input", (e) => {
    const id = storeMap.get(e.target.value);
    document.getElementById("storeID").value = id || "";
  });
}

// Building store options list

let storeMap = new Map(); // key = display string, value = StoreID

async function loadStoreOptions() {
  try {
    // get all stores
    const res = await fetch("/api/stores/myStores");
    const data = await res.json();

    // existing stores datalist element
    const dataList = document.getElementById("storeOptions");

    // if that input field's name is changed, this will log the mistake
    if (!dataList) {
      console.error("storeOptions datalist not found");
    }

    dataList.innerHTML = "";
    storeMap.clear();

    data.forEach((store) => {
      const display = `${store.StoreName} ${store.StoreAddress}`;

      // Save mapping in the display string
      storeMap.set(display, store.StoreID);

      const option = document.createElement("option");
      option.value = display;

      // add each option to the datalist
      dataList.appendChild(option);
    });
  } catch (err) {
    console.error("Failed to load store options:", err);
  }
}

async function showItemForm(itemNumber, numberOfItems) {
  // form to enter item name, select the item type, enter date purchased, and purchase price
  const content = document.getElementById("contentArea");
  // specific item details added using this form.
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

        
        <button type="submit" 
          id="saveItemButton" 
          class="btn btn-primary 
          btn-lg gap-3">Save Item</button>
      </div>
    </form> 
    `;

  const itemDetailsForm = document.getElementById("itemDetailsForm");

  itemDetailsForm.addEventListener(
    "submit",
    (e) => {
      e.preventDefault();

      if (!itemDetailsForm.checkValidity()) {
        e.preventDefault();
        e.stopPropagation();

        console.log("Form validation failed");
      }
      itemDetailsForm.classList.add("was-validated");
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
        showItemForm(
          purchaseSession.items.length + 1,
          purchaseSession.numberOfItems,
        );
      } else {
        // otherwise push the bulk items to the backend
        submitAllItems();
      }
    },
    false,
  );
}

// if the form is validated and all items were added, POST the new items to the database
async function submitAllItems() {
  const content = document.getElementById("contentArea");

  try {
    console.log("Sending:", purchaseSession);

    const response = await fetch("/api/purchases", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(purchaseSession),
    });

    console.log("Status:", response.status);
    const result = await response.text();
    console.log("Response:", result);

    // if the items are posted successfully, provide user confirmation,
    // otherwise, show an error message
    if (response.ok) {
      content.innerHTML = `
      <h1>${purchaseSession.numberOfItems} Items Added Successfully!</h1>
      <p>You can find these items in the Unlisted Items Queue.</p>
    `;
    } else {
      content.innerHTML = `
      <h1>Error Adding Items</h1>
      <p>There was an error adding your items. Please try again.</p>
    `;
    }
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
