const content = document.getElementById("contentArea");

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);

export async function loadListed() {
  const response = await fetch("/api/items/listed");

  if (!response.ok) {
    content.innerHTML = "<h1>Error loading listed items</h1>";
    console.log("Failed to load listed items", response.statusText);
    return;
  }

  const data = await response.json();
  console.log("Received listed item data:", data);

  const items = await Promise.all(
    data.map(async (item) => {
      const platforms =
          typeof item.Platforms === "string"
          ? JSON.parse(item.Platforms)
          : item.Platforms ?? [];

      return {
        itemID: Number(item.ItemID),
        itemName: item.ItemName,
        color: item.Color,
        condition: item.ItemCondition,
        purchDate: item.PurchDate
          ? new Date(item.PurchDate).toLocaleDateString("en-US")
          : "",
        purchPrice: item.PurchPrice != null ? formatCurrency(item.PurchPrice) : "",
        listDate: item.ListDate
          ? new Date(item.ListDate).toLocaleDateString("en-US")
          : "",
        listPrice:
          item.Current_ListPrice != null
            ? formatCurrency(item.Current_ListPrice)
            : "",
        platforms,
      };
    }),
  );

  renderItems(items);
}

function renderItems(items) {
  content.innerHTML = `
    <h1>Listed Items</h1><br><br>
    <div class="row" id="itemList"></div>
  `;

  for (const item of items) {
    createItemCard(item);
  }
}

function createItemCard(item) {
  console.log("Creating listed item card for item:", item);

  const itemList = document.getElementById("itemList");
  const col = document.createElement("div");
  col.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");

  const itemCard = document.createElement("div");
  itemCard.classList.add("card", "h-100", "text-center", "shadow-sm");

  const platformRow = item.platforms.length
    ? item.platforms
        .map(
          (platform) => `
            <span class="badge text-bg-primary me-1 mb-1">${platform}</span>
          `
        )
        .join("")
    : "<span class='text-muted'>No platforms</span>";

  itemCard.innerHTML = `
    <h4 class="card-header">${item.itemName}</h4>
    <ul class="list-group list-group-flush">
      <li class="list-group-item"><strong>Purchase Date: </strong>${item.purchDate}</li>
      <li class="list-group-item"><strong>Purchase Price: </strong>${item.purchPrice}</li>
      <li class="list-group-item"><strong>List Date: </strong>${item.listDate}</li>
      <li class="list-group-item"><strong>Listing Price: </strong>${item.listPrice}</li>
      <li class="list-group-item"><strong>Color: </strong>${item.color}</li>
      <li class="list-group-item"><strong>Condition: </strong>${item.condition}</li>
      <li class="list-group-item">
        <strong>Platforms: </strong>
        <div class="d-flex flex-wrap justify-content-center mt-2">
          ${platformRow}
        </div>
      </li>
    </ul>
    <div class="card-body">
      <button class="item-card-button btn btn-primary"
        data-page="item-details"
        data-itemid="${item.itemID}">
        View Details
      </button>
    </div>
  `;

  col.appendChild(itemCard);
  itemList.appendChild(col);
}

