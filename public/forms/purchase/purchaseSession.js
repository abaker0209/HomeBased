export let purchaseSession = {
  storeID: "",
  storeName: "",
  storeAddress: "",
  numberOfItems: 0,
  currentItemIndex: 1,
  items: [],
};

export function resetSession() {
  purchaseSession = {
    storeID: "",
    storeName: "",
    storeAddress: "",
    numberOfItems: 0,
    currentItemIndex: 1,
    items: [],
  };
}
