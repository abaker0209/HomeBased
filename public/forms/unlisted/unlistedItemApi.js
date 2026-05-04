
export async function fetchUnlistedItems(){ 
    const response = await fetch("/api/items/unlisted"); 
    const data = await response.json(); 
    return data; 
}

export async function fetchItemDetails(ItemID) { 
    const response = await fetch(`/api/items/getUnlisted/${ItemID}`); 
    if(!response.ok) { 
        throw new Error(`HTTP error! status: ${response.status}`); 
    }
    var item = await response.json(); 
    return item; 
}

export async function fetchMyPlatforms() { 
    const response = await fetch("/api/platforms/myPlatforms"); 
    const data = await response.json(); 

    if (!response.ok) { 
        throw new Error(`HTTP error! status: ${response.status}`); 
    }
    var platforms = data.map((platform) => ({
        PlatformName: platform.PlatformName, 
        SiteAddress: platform.SiteAddress, 
    })); 
    return platforms; 

}

export async function submitListing(session){ 
    try{ 
        const response = await fetch(`/api/items`, { 
            method: "POST", 
            headers: { 
                "Content-type": "application/json", 
            }, 
            body: JSON.stringify(session), 
        })
        const data = await response.json(); 

        console.log("Status:", response.status); 
        console.log("Response:", response); 

        if(!response.ok) { 
            throw new Error(data?.message || "Failed to submit item."); 
        }
    } catch (error) { 
        console.error("Error submitting item details: ", error); 
        throw error; 
    }
}