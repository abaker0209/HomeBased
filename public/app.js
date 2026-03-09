// ----------------
// Global State
// ----------------

// global constants and variables
const navLinks = document.querySelectorAll("#sidebar .nav-link");
const toggleButton = document.getElementById("toggleSidebar");
const contentArea = document.getElementById("contentArea");
const setUpForm = document.getElementById("purchaseSetupForm");

let purchaseSession = {
  storeName: "",
  storeAddress: "",
  numberOfItems: 0,
  items: [],
};

// Set up document ready event listener to load the various pages
document.addEventListener("DOMContentLoaded", () => {
  // look for the setupForm on load
  loadPage("home");

  // add event listener to toggle sidebar button
  toggleButton.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("collapsed");
  });

  // Add click event to each navigation link
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      // Remove active class from all
      navLinks.forEach((l) => l.classList.remove("active"));

      // Add active to clicked
      event.target.classList.add("active");

      const page = event.target.getAttribute("data-page");
      loadPage(page);
    });
  });
  ("use strict");
});
// Page loader function
function loadPage(page) {
  switch (page) {
    case "home":
      contentArea.innerHTML = `
          <h1>Welcome Home</h1>
          <p>This is the home page.</p>
        `;
      break;

    case "listed":
      contentArea.innerHTML = `
          <h1>Listed Items</h1>
          <p>Loading listed items from backend...</p>
        `;
      loadListed();
      break;

    case "unlisted":
      contentArea.innerHTML = `
          <h1>Unlisted Items</h1>
          <p>Unlisted items content goes here.</p>
        `;
      break;
    // purchaseSetupForm
    case "add":
      addItemForm();
      break;
    case "itemDetailsForm":
      contentArea.innerHTML = `
          <h1>Enter details for item</h1>
          <p>Form to enter item details goes here.</p>
        `;
      break;
    case "sell":
      contentArea.innerHTML = `
          <h1>Sell Item</h1>
          <p>Form to sell items goes here.</p>
        `;
      break;
    case "itemDetailsForm":
      break;
    default:
      contentArea.innerHTML = "<h1>Page not found</h1>";
  }
}

async function loadListed() {
  const response = await fetch("/api/items/listed");
  const data = await response.json();
  renderItems(data);
}

// function to handle the show item form & iterate through until all items have been added

async function addItemForm() {
  const content = document.getElementById("contentArea");
  content.innerHTML = `
          <h1>Add New Item</h1><br>
          <div class="mx-auto p-2" style="width: 400px;">
          <form id='purchaseSetupForm' class='form' event='submit'>
            <label for="quantity" class="col-form-label-lg gap-3">How many items would you like to add?</label><br>
            <input type="number" id="quantity" name="numberOfItems" class="form-control form-control-lg gap-3" min="1" value="1"><br>
            <label for='storeName' class='col-form-label-lg gap-3'>Where did you purchase these items?</label><br>
            <input type='text' id='storeName' name='storeName' placeholder="Store Name" class="form-control form-control-lg gap-3"><br>
            <input type='text' id='storeAddress' name='storeAddress' placeholder="Store Address" class="form-control form-control-lg gap-3"><br>
            <button type='submit' id='submitButton' class="btn btn-primary btn-lg gap-3" event='submit'>Next</button>
            </form>
          </div>
        `;

  const purchaseSetupForm = document.getElementById("purchaseSetupForm");
  purchaseSetupForm.addEventListener(
    "submit",
    (event) => {
      if (!purchaseSetupForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
        console.log("Form validation failed");
      }
      purchaseSetupForm.classList.add("was-validated");
      console.log("Purchase setup form submitted");
      handlePurchaseSetup(event);
    },
    false,
  );
}

function handlePurchaseSetup(e) {
  e.preventDefault();

  const formData = new FormData(e.target);

  const purchData = {
    numberOfItems: formData.get("numberOfItems"),
    storeName: formData.get("storeName"),
    storeAddress: formData.get("storeAddress"),
  };
  purchaseSession = { ...purchaseSession, ...purchData };

  showItemForm(1);
}

async function showItemForm(itemNumber) {
  // form to enter item name, select the item type, enter date purchased, and purchase price
  const content = document.getElementById("contentArea");
  // specific item details added using this form.
  content.innerHTML = `
    <h1>Enter Item Details</h1>
    <form id='itemDetailsForm' class='form' event='submit'>
      <div class="mx-auto p-2" style="width: 400px;">
        <label for="itemName" class="col-form-label-lg gap-3">Item Name</label><br> 
        <input type="text" id="itemName" name="itemName" placeholder="Item Name" class="form-control form-control-lg gap-3" required><br>
        <label for="color" class="col-form-label-lg gap-3">Item Color</label><br>
        <input type="text" id="color" name="color" placeholder="Color" class="form-control form-control-lg gap-3"><br>
        <select name='condition' id='condition' class='form-select form-select-lg gap-3' required>
          <option value="" disabled selected>Item Condition</option>
          <option value="Brand New">Brand New</option>
          <option value="Like New">Like New</option>
          <option value="Very Good">Very Good</option>
          <option value="Good">Good</option>
          <option value="Acceptable">Acceptable</option>
        </select><br>
        <label for="purchPrice" class="col-form-label-lg gap-3">Purchase Date</label><br>
        <input type="date" id="purchDate" name="purchDate" class="form-control form-control-lg gap-3" required><br>
        <label for="purchPrice" class="col-form-label-lg gap-3">Purchase Price</label><br>
        <input type="text" id="purchPrice" name="purchPrice" placeholder="$1.00" class="form-control form-control-lg gap-3" required><br>
        <button type="submit" id="saveItemButton" class="btn btn-primary btn-lg gap-3">Save Item</button>
      </div>
    </form> 
    `;

  const itemDetailsForm = document.getElementById("itemDetailsForm");
  itemDetailsForm.addEventListener(
    "submit",
    (event) => {
      event.preventDefault();
      if (!itemDetailsForm.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
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
        showItemForm(purchaseSession.items.length + 1);
      } else {
        // otherwise push the bulk items to the backend
        submitAllItems();
      }
    },
    false,
  );
}

async function submitAllItems() {
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
  } catch (err) {
    console.error("Fetch failed:", err);
  }
}
