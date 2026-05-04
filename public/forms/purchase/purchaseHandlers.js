import { purchaseSession } from "./purchaseSession.js";
import { nextStep, loadForm } from "../../formRouter.js";

export function handlePurchaseSetup(e, storeMap) {
  e.preventDefault();

  const form = e.target;

  if (!form.checkValidity()) {
    e.stopPropagation();
    form.classList.add("was-validated");
    console.log("Form validation failed");
    return;
  }

  const formData = new FormData(form);

  const displayValue = formData.get("storeDisplay");
  const newStoreName = formData.get("newStoreName");
  const newStoreAddress = formData.get("newStoreAddress");

  const storeID = storeMap.get(displayValue);
  const usingExisting = !!storeID;
  const usingNew = newStoreName && newStoreAddress;

  // if empty form was submitted, alert and return
  if (!usingExisting && !usingNew) {
    alert("PLease select or create a store.");
    return;
  }

  purchaseSession.numberOfItems = Number(formData.get("numberOfItems"));
  purchaseSession.currentItemIndex = 1;
  purchaseSession.items = [];

  if (usingExisting) {
    // If an existing store was chosen, record only the StoreID
    purchaseSession.storeID = storeID;
    console.log("Using existing store: ", storeID);
  } else {
    // If new store details entered, record the new store details
    purchaseSession.storeName = newStoreName;
    purchaseSession.storeAddress = newStoreAddress;

    console.log("Creating new store:", newStoreName, newStoreAddress);
  }

  nextStep(purchaseSession);
}
