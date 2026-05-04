export async function fetchStores() {
  const res = await fetch("/api/stores/myStores");
  const data = await res.json();
  return data;
  //return res.json();
}

export async function fetchStoreDetails(StoreID) {
  const response = await fetch(`/api/stores/getStoreDetails/${StoreID}`);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  var store = await response.json();

  return store;
}

export async function submitPurchase(session) {

  try {
  const response = await fetch(`/api/purchases`, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(session),
  });

  const data = await response.json(); 

  console.log("Status:", response.status);  
  console.log("Response:", response); 

  if (!response.ok) { 
   throw new Error(data?.message || "Failed to submit purchase");  
  }
  return data; 

} catch (error) { 
  console.error("Error submitting purchase: ", error); 
  throw error; 
}

}
