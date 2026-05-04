// API calls 
import {
    fetchUnlistedItems, 
    fetchItemDetails,
    fetchMyPlatforms, 
    submitListing
} from "./unlistedItemApi.js"; 

// session variables 
import {
    listingSession, 
    homegoodSpecialization, 
    mediaSpecialization, 
    toySpecialization
} from "./unlistedSession.js"; 

// router 
import { loadForm, nextStep } from "../../formRouter.js";

// handler
import { 
    handleListItemSetup, 
    handlePricingSetup,  
    handleSubmitListing 
} from "./unlistedItemHandler.js";

// specialization forms 
import { 
    loadMediaForm, 
    loadToyForm, 
    loadHomegoodsForm
} from "./itemSpecForms.js"; 
import { handlePurchaseSetup } from "../purchase/purchaseHandlers.js";

const itemMap = new Map(); 
const content = document.getElementById("contentArea"); 


//
//===========================
// Setup Form Step 1 
//=============================
//
export async function listingSetupForm(data = {}){ 
   const itemID = data.ItemID; 
   let item = await fetchItemDetails(itemID); 


   if (!item) { 
    throw new Error(`Item not located: ${item.status}`); 
   }
   console.log("Fetched item details: ", item); 

   // push item detials to session 
   listingSession.itemID = item.ItemID;
   listingSession.itemName = item.ItemName; 
   listingSession.purchPrice = item.PurchPrice;  
   listingSession.color = item.Color; 
   listingSession.condition = item.ItemCondition; 

   const itemDetails = {
    itemID: item.ItemID,
    itemName: item.ItemName,
    color: item.Color,
    condition: item.ItemCondition,
    purchDate: formatDate(item.PurchDate),
    purchPrice: formatCurrency(item.PurchPrice),
};

   await renderListForm(itemDetails); 
   const form = document.getElementById("listItemSetupForm"); 
   form.addEventListener("submit", (e) => handleListItemSetup(e, itemMap)); 

}

async function renderListForm(itemDetails) {
  console.log("Rendering listing form for item details:", itemDetails);
  content.innerHTML = `
  <h1 class="text-center mb-4">Prepare Listing</h1>
  <div class="card mx-auto w-90 shadow" id="itemCardRow"> 
    <div class="card-body p-3" id="unlisted-item-card">
        <!-- Card Title --> 
        <div class="card-title">
            <h3 class="fw-bold mb-0 text-center">${itemDetails.itemName}</h3>
        </div>
        <!-- Horizontal List --> 
        <ul class="list-group list-group-horizontal text-center mt-3 flex-wrap">  
            <li class="list-group-item flex-fill">
                <strong>Purchase Date: </strong><br>
                ${itemDetails.purchDate}
            </li>
            
            <li class="list-group-item flex-fill">
                <strong>Purchase Price: </strong><br>
                ${itemDetails.purchPrice}
            </li>
            
            <li class="list-group-item flex-fill">
                <strong>Color: </strong><br>
                ${itemDetails.color}
            </li> 
            
            <li class="list-group-item flex-fill">
                <strong>Condition: </strong><br>
                ${itemDetails.condition}
            </li>
        </ul> 
    </div>  
  </div>
<form class="row text-center" id="listItemSetupForm" data-itemid="${itemDetails.ItemID}">
    <div class="w-75 mx-auto p-4"> 
        <label for="itemType" class="form-label fs-5 fw-bold">
                Please select the Type of Item
        </label>
        <select id="itemType" class="form-select form-select-lg mb-3" required>
            <option value="" selected disabled>Expand to see the avialable item types</option>
            <option value="toy">Toy (Action Figure, Collectible, Plushy, etc.)</option>
            <option value="media">Media (DVD, VHS, Book, etc.)</option>
            <option value="homegood">Homegood (Home Decor, Blankets, Curtains, Kitchenware, etc.)</option>
        </select>
    </div>

<h4 style="padding-top:5px">Where would you like to list your item?</h4><br>
<p>Select the platform(s) you want to list your item on and we'll help you create the listing(s).</p> 
    <div class="form-check form-switch">
        <ul id="platforms" class="list-group w-50 mx-auto text-start"></ul> 
    </div> 

    <div class="d-flex align-items-center w-50 mx-auto p-2 justify-content-between"> 
    <button type="button" 
        id="backbutton" 
        class="btn btn-outline-info btn-lg" 
        data-page="goBack"
        >Back
    </button>
    
    <button type="submit" 
        id="next" 
        class="btn btn-primary 
        btn-lg float-end"
        data-page="next"
        >Next
    </button>
    </div>
</form>
`;
loadPlatformOptions(); 

}

async function loadPlatformOptions() { 


    const platforms = await fetchMyPlatforms(); 

    for (const platform of platforms) {
        renderPlatformOption(platform); 
    }
}

async function renderPlatformOption(platform) { 
    // capture platforms ordered list 
    const platformsList = document.getElementById("platforms"); 
    const listItem = document.createElement("li"); 
    const platformId = `platform-${platform.PlatformName.toLowerCase().replace(/\s+/g, "-")}`;
    listItem.className = "list-group-item px-3";
    listItem.innerHTML = `
        <div class="form-check form-switch d-flex align-items-center m-0">
            <input class="form-check-input me-3" 
                type="checkbox" 
                role="switch"
                id="${platformId}"
                value="${platform.PlatformName}" 
                data-platform='${platform.PlatformName}'
            >
            <label class="form-check-label fw-bold text-start w-100 mb-0"f for="${platform.PlatformName}">
                ${platform.PlatformName}
            </label>
        </div>
    `; 

    platformsList.appendChild(listItem); 

}

//
//===========================
// STEP 2
//=============================
//
export async function loadItemSpecForm(data){ 

    const itemType = data.itemType; 

    switch (itemType) { 
        case "toy": 
            loadToyForm(); 
            break; 
        case "media": 
            loadMediaForm(); 
            break; 
        case "homegoods": 
            loadHomegoodsForm(); 
            break; 
        default: 
            console.warn("Form not defined for chosen item type."); 
    }

    const itemSpecForm = document.getElementById("itemSpecForm"); 

    itemSpecForm.addEventListener("submit", (e) => handlePricingSetup(e, listingSession)); 
    
}

//
//===========================
// STEP 3
//=============================
//

export async function finalForm(session){ 

console.log("session data received: ", session); 
content.innerHTML = `
    <h1>Final Details Form</h1> 
    <div class="mx-auto w-75 p-2">
    <div class="card mx-auto w-90 shadow" id="itemCardRow"> 
    <div class="card-body p-3" id="final-item-card">
        <!-- Card Title --> 
        <div class="card-title">
            <h3 class="fw-bold mb-0 text-center">${session.itemName}</h3>
        </div>
        <!-- Horizontal List --> 
        <ul class="list-group list-group-horizontal text-center mt-3 flex-wrap">            
            <li class="list-group-item flex-fill">
                <strong>Purchase Price: </strong><br>
                $${session.purchPrice}
            </li>
            
            <li class="list-group-item flex-fill">
                <strong>Color: </strong><br>
                ${session.color}
            </li> 
            
            <li class="list-group-item flex-fill">
                <strong>Condition: </strong><br>
                ${session.condition}
            </li>
            <li class="list-group-item flex-fill">
                <strong>Item Type: </strong><br> 
                ${session.itemType}
            </li>
            <li class="list-group-item flex-fill">
                <strong>Platforms Chosen:</strong><br> 
                ${session.platforms}
            </li>
            </ul> 
            </div>  
        </div>
        <div class="card shadow-sm mb-4">
        <div class="card-body">
        <h5 class="card-title mb-3">Pricing Calculator</h5>
        <div class="mb-3">
        <label for="comp1" class="form-label">Most recent sold comp 1</label>
        <input
            type="number"
            class="form-control"
            id="comp1"
            name="comp1"
            step="0.01"
            min="0"
            placeholder="0.00"
        />
        </div>

        <div class="mb-3">
        <label for="comp2" class="form-label">Most recent sold comp 2</label>
        <input
            type="number"
            class="form-control"
            id="comp2"
            name="comp2"
            step="0.01"
            min="0"
            placeholder="0.00"
        />
        </div>

        <div class="mb-3">
        <label for="comp3" class="form-label">Most recent sold comp 3</label>
        <input
            type="number"
            class="form-control"
            id="comp3"
            name="comp3"
            step="0.01"
            min="0"
            placeholder="0.00"
        />
        </div>

        <hr class="my-4" />

        <div class="mb-3">
        <label for="soldCount" class="form-label">Items sold</label>
        <input
            type="number"
            class="form-control"
            id="numSold"
            name="soldCount"
            step="1"
            min="0"
            placeholder="0"
        />
        </div>

        <div class="mb-3">
        <label for="listedCount" class="form-label">Items listed</label>
        <input
            type="number"
            class="form-control"
            id="numListed"
            name="listedCount"
            step="1"
            min="1"
            placeholder="0"
        />
        </div>

        <div class="mb-3">
        <label for="sellThroughRatio" class="form-label">Sell-through ratio</label>
        <input
            type="text"
            class="form-control"
            id="sellThroughRate"
            name="sellThroughRatio"
            disabled
        />
        </div>

        <div class="mb-0">
        <label for="suggestedPrice" class="form-label">Suggested price</label>
        <input
            type="number"
            class="form-control"
            id="suggestedPrice"
            name="suggestedPrice"
            step="0.01"
            disabled
                />
                </div>
            </div>
            </div>
            <form id="finalListingForm" name="final" class="form"> 
            <label for="price" class="col-form-label-lg"> 
                List Price ($)
            </label> 
            <input type="number" 
                class="form-control" 
                id="price"
                name="price"
                step="0.01"
                placeholder="0.00"
            >
            <label for="description" class="col-form-label-lg"> 
                Item Description 
            </label> 
            <textarea class="form-control" 
                id="itemDescription" 
                name="itemDescription" 
                rows="5"
                placeholder="Enter a detailed description of the item..." 
            ></textarea>
            <div class="d-flex align-items-center w-50 mx-auto p-2 justify-content-between"> 
                <button type="button" 
                    id="backbutton" 
                    class="btn btn-outline-info btn-lg" 
                    data-page="goBack"
                    >Back
                </button>

                <button type="submit" 
                    id="next" 
                    class="btn btn-primary 
                    btn-lg float-end"
                    data-page="next"
                    >Submit
                </button>
            </div>
        </form> 
    
    </div> 
    `; 


    document.addEventListener("DOMContentLoaded", updatePricingCalculator()); 
    

    ["comp1", "comp2", "comp3", "numSold", "numListed"].forEach(id => {
        document.getElementById(id)?.addEventListener("input", updatePricingCalculator);
    });

    const form = document.getElementById("finalListingForm");

    form.addEventListener("submit", (e) => handleSubmitListing(e, listingSession)); 
}

//
//===========================
// STEP 4
//=============================
//
export async function listingConfirmation(listingSession) {
  try {
    const result = await submitListing(listingSession);

    content.innerHTML = `
      <div class="card shadow-sm">
        <div class="card-body">
          <h1 class="card-title mb-3">Listing Confirmed</h1>
          <p class="mb-4">Your item has been submitted successfully.</p>

          <div class="mb-3">
            <strong>Item ID:</strong> ${listingSession.itemID ?? ""}
          </div>

          <div class="mb-3">
            <strong>Name:</strong> ${listingSession.itemName ?? ""}
          </div>

          <div class="mb-3">
            <strong>Type:</strong> ${listingSession.itemType ?? ""}
          </div>

          <div class="mb-3">
            <strong>Condition:</strong> ${listingSession.condition ?? ""}
          </div>

          <div class="mb-3">
            <strong>Color:</strong> ${listingSession.color ?? ""}
          </div>

          <div class="mb-3">
            <strong>Purchase Price:</strong> ${listingSession.purchPrice ?? ""}
          </div>

          <div class="mb-3">
            <strong>Listing Price:</strong> ${listingSession.listPrice ?? ""}
          </div>

          <div class="mb-3">
            <strong>Platforms:</strong> ${(listingSession.platforms ?? []).join(", ")}
          </div>

          <div class="mb-3">
            <strong>Item Description:</strong>
            <div class="border rounded p-3 mt-2 bg-light">
              ${listingSession.itemDescription ?? ""}
            </div>
          </div>

          <div class="mb-3">
            <strong>Specialization:</strong>
            <pre class="bg-light p-3 rounded mt-2 mb-0">${JSON.stringify(listingSession.specialization ?? {}, null, 2)}</pre>
          </div>

          ${
            result?.id
              ? `<div class="mt-3"><strong>Server Listing ID:</strong> ${result.id}</div>`
              : ""
          }
        </div>
      </div>
    `;
  } catch (error) {
    console.error("Error submitting listing:", error);

    content.innerHTML = `
      <div class="alert alert-danger">
        There was a problem submitting your listing.
      </div>
    `;
  }
}

//======================
// CALCULATE SELL-THROUGH RATIO AND SUGGESTED PRICE 
//=======================
function updatePricingCalculator() {
  const comp1 = parseFloat(document.getElementById("comp1")?.value) || 0;
  const comp2 = parseFloat(document.getElementById("comp2")?.value) || 0;
  const comp3 = parseFloat(document.getElementById("comp3")?.value) || 0;

  const soldCount = parseFloat(document.getElementById("numSold")?.value) || 0;
  const listedCount = parseFloat(document.getElementById("numListed")?.value) || 0;

  const comps = [comp1, comp2, comp3].filter(value => value > 0);
  const avgComp = comps.length
    ? comps.reduce((sum, value) => sum + value, 0) / comps.length
    : 0;

  const sellThroughRatio = listedCount > 0 ? soldCount / listedCount : 0;
  const suggestedPrice = avgComp;

  const ratioField = document.getElementById("sellThroughRate");
  const priceField = document.getElementById("suggestedPrice");

  if (ratioField) {
    ratioField.value = listedCount > 0
      ? `${(sellThroughRatio * 100).toFixed(1)}%`
      : "";
  }

  if (priceField) {
    priceField.value = suggestedPrice > 0 ? suggestedPrice.toFixed(2) : "";
  }
}

//======================
// FORMAT CURRENCY FUNCTION 
//=======================
const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

//======================
// FORMAT DATE FUNCTION 
//=======================
const formatDate = (date) => 
    new Date(date).toLocaleDateString("en-US"); 
