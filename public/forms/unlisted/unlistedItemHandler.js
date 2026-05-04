import { 
    listingSession, 
    toySpecialization, 
    mediaSpecialization, 
    homegoodSpecialization 
} from "./unlistedSession.js"; 

import { nextStep, loadForm } from "../../formRouter.js"; 

export function handleListItemSetup(e, itemMap) { 
    e.preventDefault(); 

    const form = e.target; 

    if(!form.checkValidity()) { 
        e.stopPropagation(); 
        form.classList.add("was-validated"); 
        console.log("Form validation failed"); 
        return; 
    }
    // capture the selected platforms in an Array 
    const selected = form.querySelectorAll("#platforms input:checked"); 
    const platforms = Array.from(selected).map(input => input.dataset.platform); 

    // capture the itemID passed through the form 
    const itemID = form.getAttribute("data-itemid"); 
    // capture the selected item type 
    const select = document.getElementById("itemType");  
    const selectedOption = select.options[select.selectedIndex];
    const itemType = selectedOption.value; 
    console.log("Chosen item type: ", itemType);  

    // return if no platforms selected 
    if (platforms.length === 0) { 
        alert("Please select at least one platform."); 
        return; 
    }
    // return if no item type selected 
    if(!itemType || itemType === "Expand to see the available item types") { 
        alert("Please select an item type."); 
        return; 
    }
    // save provided information to session
    listingSession.platforms = platforms;
    listingSession.itemType = itemType;  

    // start the specialization 
    switch (itemType) { 
        case "toy":
            listingSession.specialization = {...toySpecialization };
            break;
        case "media":
            listingSession.specialization = {...mediaSpecialization}; 
            break;
        case "homegood":
            listingSession.specialization = {...homegoodSpecialization}; 
            break;
        default: 
            console.warn("unkown item type chosen.");
            break; 
    }
    
    console.log(listingSession); 

    nextStep(listingSession); 
}

export function handlePricingSetup(e, listingSession) { 
    e.preventDefault(); 

    const form = e.currentTarget; 

    if(!form.checkValidity()) { 
        e.stopPropagation(); 
        form.classList.add("was-validated"); 
        console.log("Form validation failed."); 
        return; 
    }

    const formData = new FormData(form); 
    const itemType = listingSession.itemType; 

     switch (itemType) { 
        case "media":
                listingSession.specialization = {
                    mediaType: formData.get("type"), 
                    publisher: formData.get("publisher"), 
                    yearPublished: formData.get("year"), 
                };                
            break; 
        case "toy":
                listingSession.specialization = {
                    toyType: formData.get("type"), 
                    fandom: formData.get("fandom"), 
                    manufacturer: formData.get("manufacturer"), 
                    yearProduced: formData.get("year"), 
                }; 
            break; 
        case "homegood": 
                listingSession.specialization = {
                    hgType: formData.get("type"), 
                    brand: formData.get("brand"), 
                    yearProduced: formData.get("year"), 
                    vintage: formData.get("vintage"), 
                }; 
            break; 
        default: 
            console.warn("unkown form completed. unlistedItemForms line 204")
    }
    console.log([...formData.entries()]); 

    nextStep(listingSession); 

}

export function handleSubmitListing(e, listingSession) { 
    
    e.preventDefault(); 

    const form = e.currentTarget;  


        if(!form.checkValidity()) { 
            e.preventDefault(); 
            e.stopPropagation(); 
            form.classList.add("was-validated"); 
            console.log("Form validation failed"); 
        }

        console.log("Listing details submitted."); 

        const formData = new FormData(form); 
        listingSession.listPrice = formData.get("price"); 
        listingSession.itemDescription = formData.get("itemDescription"); 

        nextStep(listingSession); 
}