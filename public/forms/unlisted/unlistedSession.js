export let listingSession = { 
    itemID: "", 
    itemType: "", 
    itemName: "", 
    listDate: "", 
    listPrice: "", 
    purchPrice: "", 
    color: "", 
    condition: "", 
    itemDescription: "", 
    specialization: {}, 
    platforms: [], 
}

export let toySpecialization = { 
    toyType: "", 
    fandom: "", 
    manufacturer: "", 
    yearProduced: "",
}

export let mediaSpecialization = { 
    mediaType: "", 
    publisher: "", 
    yearPublished: "", 
}

export let homegoodSpecialization = { 
    hgType: "", 
    brand: "", 
    yearProduced: "", 
    vintage: "", 
}

export function resetSession() { 
    listingSession = {
        itemID: "", 
        listDate: "", 
        listPrice: "", 
        itemDescription: "", 
        specialization: [], 
        platforms: [], 
    }; 

    toySpecialization.toyType = "";
    toySpecialization.fandom = "";
    toySpecialization.manufacturer = "";
    toySpecialization.yearProduced = "";

    mediaSpecialization.mediaType = "";
    mediaSpecialization.publisher = "";
    mediaSpecialization.yearPublished = "";

    homegoodSpecialization.hgType = "";
    homegoodSpecialization.brand = "";
    homegoodSpecialization.yearProduced = "";
    homegoodSpecialization.vintage = "";
}