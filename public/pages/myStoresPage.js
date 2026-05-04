const content = document.getElementById("contentArea");

export async function loadMyStores() {
  const response = await fetch("/api/stores/myStores");

  if (!response.ok) {
    content.innerHTML = "<h1>Error loading stores</h1>";
    console.log("Failed to Load Stores: ", response.statusText);
    return;
  }

  const data = await response.json();
  console.log("Received store data: ", data);

  var stores = data.map((store) => ({
    StoreID: Number(store.StoreID),
    StoreName: store.StoreName,
    StoreAddress: store.StoreAddress,
  }));

  renderStores(stores);
}

function renderStores(stores) {
  content.innerHTML = ` 
    <h1> My Stores</h1><br>
    <div class="row" id="storeList"></div> 
    `;
  for (const store of stores) {
    createStoreCard(store);
  }
}

function createStoreCard(store) {
  console.log("Creating card for store:", store);
  const storeList = document.getElementById("storeList");
  const col = document.createElement("div");
  col.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");
  const storeCard = document.createElement("div");
  storeCard.dataset.storeid = store.StoreID;
  storeCard.style.margin = "0px";
  storeCard.style.padding = "0px";
  storeCard.classList.add("card", "h-100", "text-center", "shadow-sm");
  storeCard.innerHTML = `  
        <h4 class="card-header">${store.StoreName}</h4>
        <ul class="list-group list-group-flush"> 
            <li class="list-group-item"><strong>Address: </strong>${store.StoreAddress}</li>
        </ul>
        <div class="card-body">
          <button class="store-card-button btn btn-primary"
            data-page="update-store"
            data-storeid="${store.StoreID}">
            Edit
          </button>
          <button class="store-card-button btn btn-success"
            data-page="add-from-store"
            data-storeid="${store.StoreID}"
            data-storename="${store.StoreName}"
            data-storeaddress="${store.StoreAddress}">
            Add Listing
          </button>
        </div>
    `;
  col.appendChild(storeCard);
  storeList.appendChild(col);
}
