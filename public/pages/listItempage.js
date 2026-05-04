
import { loadForm } from "../formRouter.js";
import { listingSession, resetSession } from "../forms/unlisted/unlistedSession.js";

export async function loadListingPage(data = {}, { reset = false } = {}) {

  if (reset) { 
    await resetSession(); 
  }

    console.log("Loading listing page for item ID:", data);
    loadForm("listItem", "setup", data); 

}
