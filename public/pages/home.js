export function loadHomePage() {
  const content = document.getElementById("contentArea");
  content.innerHTML = ` 
        <h1>Welcome Home</h1>
        <p> Use the left-side navigation menu to view your listed and unlisted items, add new items, or sell items.</p>
        `;

  // will add links and a small dashboard later.
}

export default loadHomePage;
