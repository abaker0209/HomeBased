import { loadHomePage } from "./pages/home.js";
import { loadAddItemPage } from "./pages/addItemPage.js";
import { loadListed } from "./pages/listedItems.js";
import { loadUnlisted } from "./pages/unlistedItems.js";
import { loadListingPage } from "./pages/listItempage.js";
import { loadMyStores } from "./pages/myStoresPage.js";
import { loadMyPlatforms } from "./pages/myPlatformsPage.js";
import { resetSession } from "./forms/unlisted/unlistedSession.js";

// Page loader function
export async function loadPage(page, { ItemID, StoreID }) {
  switch (page) {
    case "home":
      loadHomePage();
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
          `;
      loadUnlisted();
      break;
    // add items form (Creates item, purchase, and store records)
    case "add":
      loadAddItemPage({ reset: true });
      break;
    case "add-from-store":
      console.log("router add-from-store received StoreID: ", StoreID);
      loadAddItemPage({ StoreID }, { reset: false });
      break;
    case "list-item":
      console.log("Routing to listing page for item ID:", ItemID);
      loadListingPage({ ItemID }, { reset : true });
      break;
    case "sell":
      contentArea.innerHTML = `
          <h1>Sell Item</h1>
          <p>Form to sell items goes here.</p>
        `;
      break;
    case "platforms":
      loadMyPlatforms();
      break;
    case "stores":
      loadMyStores();
      break;
    case "update-store":
      contentArea.innerHTML = `
        <h1>Update Store</h1>
        <p>Form to update store information goes here.</p>
      `;
      break;
    default:
      contentArea.innerHTML = "<h1>Page not found</h1>";
      break;
  }
}

export default loadPage;
