const content = document.getElementById("contentArea");

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export async function loadUnlisted() {
  const response = await fetch("/api/items/unlisted");

  if (!response.ok) { 
    content.innerHTML = "<h1>Error loading unlisted items</h1>"; 
    console.log("Failed to load unlisted items", response.statusText); 
  }
  const data = await response.json();
  console.log("Received item data: ", data); 

  var items = data.map((item) => ({
    itemID: Number(item.ItemID),
    itemName: item.ItemName,
    color: item.Color,
    condition: item.ItemCondition,
    purchDate: new Date(item.PurchDate).toLocaleDateString("en-US"),
    purchPrice: formatCurrency(item.PurchPrice),
  }));

  renderItems(items);
}

function renderItems(items) {
  content.innerHTML = ` 
    <h1>Unlisted Items</h1><br><br>
    <div class="row" id="itemList"></div>
    `;
  for (const item of items) {
    createItemCard(item);
  }
}

function createItemCard(item) {
  // checking if item details are being passed
  console.log("Creating card for item:", item);

  // grabbing the itemID to use later
  // building the list-cards to display the ulisted item details
  const itemList = document.getElementById("itemList");
  const col = document.createElement("div");
  col.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");
  const itemCard = document.createElement("div");
  itemCard.classList.add("card", "h-100", "text-center", "shadow-sm");
  itemCard.innerHTML = `
            <h4 class="card-header">${item.itemName}</h4>
            <ul class="list-group list-group-flush"> 
                <li class="list-group-item"><strong>Purchase Date: </strong>${item.purchDate}</li>
                <li class="list-group-item"><strong>Purchase Price: </strong>${item.purchPrice}</li>
                <li class="list-group-item"><strong>Color: </strong>${item.color}</li> 
                <li class="list-group-item"><strong>Condition: </strong>${item.condition}</li>
            </ul>
            <div class="card-body"> 
             <button class="item-card-button btn btn-primary"
             data-page="list-item" 
             data-itemid="${item.itemID}">
                    Prepare Listing(s)
              </button>
            </div>
        `;
  col.appendChild(itemCard);
  itemList.appendChild(col);
}
