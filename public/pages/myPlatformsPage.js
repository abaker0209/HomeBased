const content = document.getElementById("contentArea");

export async function loadMyPlatforms() {
  const response = await fetch("/api/platforms/myPlatforms");

  if (!response.ok) {
    content.innerHTML = "<h1>Error loading platforms</h1>";
    console.log("Failed to Load Platforms: ", response.statusText);
    return;
  }

  const data = await response.json();
  console.log("Received platform data; ", data);

  var platforms = data.map((platform) => ({
    PlatformName: platform.PlatformName,
    SiteAddress: platform.SiteAddress,
  }));

  await renderPlatforms(platforms);
}

function renderPlatforms(platforms) {
  content.innerHTML = `
        <div id="formContainer"></div>
        <h2>My Platforms</h2><br>
        <div class="row" id="platformList"></div>
    `;

  newPlatformForm();
  for (const platform of platforms) {
    createPlatformCard(platform);
  }
}

function createPlatformCard(platform) {
  console.log("Creating card for platform: ", platform);
  const platformList = document.getElementById("platformList");
  const col = document.createElement("div");
  col.classList.add("col-12", "col-md-6", "col-lg-4", "mb-4");
  const platformCard = document.createElement("div");
  platformCard.dataset.PlatformName = platform.PlatformName;
  platformCard.style.margin = "0px";
  platformCard.style.padding = "0px";
  platformCard.classList.add("card", "h-100", "text-center", "shadow-sm");
  platformCard.innerHTML = ` 
    <h4 class="card-header">${platform.PlatformName}</h4>
    <ul class="list-group list-group-flush">
        <li class="list-group-item"><strong>Site Address: </strong>${platform.SiteAddress}</li>
    </ul>
    <div class="card-body">
        <button class="platform-card-button btn btn-primary"
            data-page="update-platform"
            data-platformName="${platform.PlatformName}">
            Edit
        </button>
    </div>
    `;
  col.appendChild(platformCard);
  platformList.appendChild(col);
}

function newPlatformForm() {
  const formContainer = document.getElementById("formContainer");
  formContainer.innerHTML = ` 
        <h1>Add a New PLatform</h1><br> 
        <div class="mx-auto p-2" style="width:400px;">

        <form id='newPlatformForm' class='form'> 
            <label for="newPlatformName" class="col-form-label-lg gap-3">
                Enter the New Platform Name
            </label><br>

            <input type='text'
                id='platformname'
                name='platformname'
                placeholder="Enter the platform name..." 
                class="form-control form-control-lg gap-3"
                required
            ><br>

            <label for="newPlatformAddress" class="col-form-label-lg gap-3">
                Enter the Site Address
            </label><br>

            <input type='text'
                id='siteaddress'
                name='siteaddress'
                placeholder="Enter the site address..." 
                class="form-control form-control-lg gap-3"
                required
            ><br>

            <button type='submit' 
                id='submitNewPlatform' 
                class="btn btn-primary btn-lg gap-3"
                >Submit        
            </button>
        </form>
    </div>
    `;

  const form = document.getElementById("newPlatformForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const platformName = document.getElementById("platformname").value;
    const siteAddress = document.getElementById("siteaddress").value;

    try {
      const response = await fetch("/api/platforms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ platformName, siteAddress }),
      });

      if (!response.ok) {
        console.error(err.message);
        throw new Error("Failed to add platform");
      }
      console.log("Platform added");
      alert("New Platform added.");
      loadMyPlatforms();
    } catch (err) {
      console.error(err);
    }
  });
}
