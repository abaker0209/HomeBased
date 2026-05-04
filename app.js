// ----------------
// Global State
// ----------------

// import the page router
import { loadPage } from "./router.js";
import { goBack, nextStep } from "./formRouter.js"

// global constants and variables

// Set up document ready event listener to hand left-nav events
document.addEventListener("DOMContentLoaded", async () => {
  "use strict";

  // grab the nav links and toggle buttons
  const navLinks = document.querySelectorAll("#sidebar .nav-link");
  const toggleButton = document.getElementById("toggleSidebar");

  // always load the home page first
  await loadPage("home", {});

  // add event listener to toggle sidebar button
  toggleButton.addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("collapsed");
  });

  // Add click event to each navigation link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // Remove active class from all
      //navLinks.forEach((l) => l.classList.remove("active"));

      const page = link.dataset.page;
      loadPage(page, {});
    });
  });
});

//-----------------
// Event Delegation
// -----------------
// Unlisted Item - Load listing form event handler
document.addEventListener("click", (event) => {
  const button = event.target.closest("[data-page]");
  if (!button) return;

  const page = button.getAttribute("data-page")

  switch (page) {
    case "item-card-button": {
      const itemID = button.dataset.itemid;
      console.log("Item card button clicked for item ID:", itemID);
      loadPage(page, { ItemID });
      break;
    }

    case "update-store": {
      const storeID = button.dataset.storeid;
      console.log("Store card button clicked for store ID:", storeID);
      loadPage(page, { storeID });
      break;
    }

    case "add-from-store": {
      const StoreID = button.getAttribute("data-storeid");
      const page = button.getAttribute("data-page");
      console.log("Add item from store:", StoreID);
      loadPage(page, { StoreID });
      break;
    }

    case "list-item": {
      const ItemID = button.getAttribute("data-itemid"); 
      loadPage(page, { ItemID });
      break;
    }

    default: {
      console.log("button clicked but no data page provided"); 
      break; 
    }
  }
});
