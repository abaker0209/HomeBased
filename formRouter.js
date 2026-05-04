import {
  addItemForm,
  showItemForm,
  showConfirmation,
} from "./forms/purchase/purchaseForms.js";

import { 
  listingSetupForm, 
  loadItemSpecForm, 
  finalForm,
  listingConfirmation, 
} from "./forms/unlisted/unlistedItemForms.js"; 
import { 
  loadUnlisted, 
} from "./pages/unlistedItems.js"; 

let historyStack = [];
let currentFlow = null;

// define routes as flows
const flows = {
  addPurchase: {
    steps: {
      setup: (data) => addItemForm(data),
      item: (data) => showItemForm(data),
      confirmation: (data) => showConfirmation(data),
    },

    order: ["setup", "item", "confirmation"],
  },

  //unlisted item form
  listItem: { 
    steps: {
      setup: (data) => listingSetupForm(data), // form to select type and platforms 
      specialization: (data) => loadItemSpecForm(data), 
      final: (data) => finalForm(data), 
      confirmation: (data) => listingConfirmation(data),
    },
    order: ["setup", "specialization", "final", "confirmation"]
  },

  //update item form

  // sell item form

  // add platform form & edit platform form

  // edit store form

  //
};

export function loadForm(flow, step, data = {}) {
  const flowObj = flows[flow];

  if (!flowObj || !flowObj.steps[step]) {
    console.error("Invalid flow/step: ", flow, step);
    return;
  }

  historyStack.push({ flow, step, data });
  currentFlow = flow;

  flowObj.steps[step](data);
}

export function nextStep(data = {}) {
  const current = historyStack[historyStack.length - 1];
  if (!current) return;

  const flowObj = flows[current.flow];
  const order = flowObj.order;

  const index = order.indexOf(current.step);
  const next = order[index + 1];

  if (next) {
    loadForm(current.flow, next, data);
  }
}

export function goBack() {
  historyStack.pop(); // remove the current page
  const prev = historyStack.pop(); // get the previous page

  if (prev) {
    loadForm(prev.flow, prev.step, prev.data);
  }
}
