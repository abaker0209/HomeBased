import { loadForm } from "../formRouter.js";
import {
  resetSession,
  purchaseSession,
} from "../forms/purchase/purchaseSession.js";

export function loadAddItemPage(data = {}, { reset = false } = {}) {
  if (reset) {
    // reset session to void any prior session data
    resetSession();
  }

  // start the loadforms flow
  console.log("loading addItemForm", data);
  loadForm("addPurchase", "setup", data);
}
