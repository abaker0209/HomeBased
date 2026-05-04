const content = document.getElementById("contentArea"); 

export function loadMediaForm(){ 
    content.innerHTML = `
        <h1>New Media Listing Form</h1> 
        <form id='itemSpecForm' name='newMediaForm' class='form'>
            <div class="mx-auto p-2" style="width:400px;">
                <label for="mediaType" class="form-label fs-5 fw-normal"> 
                Media Type
                </label> 
                <select id="mediaType" name="type" class="form-select form-select-lg mb-3" required>
                    <option value="" selected disabled>Expand to select</option> 
                    <option value="DVD-movie">DVD Movie</option> 
                    <option value="DVD-TV">DVD Television Series</option> 
                    <option value="VHS-movie">VHS Movie</option> 
                    <option value="VHS-TV">VHS Television Series</option> 
                    <option value="book">Book or Novel</option>
                    <option value="comic">Comic book or Manga</option> 
                    <option value="game">Board or tabletop game</option>  
                </select> 

                <label for="publisher" class="col-form-label-lg gap-3">
                    Publisher
                </label><br>

                <input type="text"
                    id="publisher"
                    name="publisher"
                    placeHolder="Published by..."
                    class="form-control form-control-lg gap-3">
                <br>

                <label for="yr-published" class="col-form-label-lg gap-3">
                    Year Published
                </label><br>

                <input
                    id="yearInput"
                    name="year"
                    type="text"
                    class="form-control"
                    inputmode="numeric"
                    autocomplete="off"
                    placeholder="YYYY"
                    maxlength="4"
                />
            </div> 
            <button type="button" 
                id="backbutton" 
                class="btn btn-outline-info btn-lg" 
                data-page="goBack"
                >Back
            </button>
            
            <button type="submit" 
                id="next" 
                class="btn btn-primary 
                btn-lg float-end"
                data-page="next"
                >Next
            </button>
        </form> 
    `; 
}

export function loadToyForm() { 
content.innerHTML = `
    <h1>New Toy Listing Form</h1> 
    <form id='itemSpecForm' name='newToyForm' class='form'>
        <div class="mx-auto p-2" style="width:400px;">
            <label for="toyType" class="form-label fs-5 fw-normal"> 
            Toy Type
            </label> 
            <select id="toyType" name="type" class="form-select form-select-lg mb-3" required>
                <option value="" selected disabled>Expand to select</option> 
                <option value="action-figure">Action Figure</option> 
                <option value="plushie">Plushie</option> 
                <option value="doll">Doll (Barbie, Bratz, Monster High, etc.)</option> 
                <option value="VHS-TV">VHS Television Series</option> 
                <option value="book">Book or Novel</option>
                <option value="comic">Comic book or Manga</option>  
            </select> 

            <label for="fandom" class="col-form-label-lg gap-3">
                Fandom/Franchise
            </label><br>

            <input type="text"
                id="fandom"
                name="fandom"
                placeHolder="Fandom/Franchise..."
                class="form-control form-control-lg gap-3">
            <br>

            <label for="manufacturer" class="col-form-label-lg gap-3">
                Manufacturer
            </label><br>

            <input type="text"
                id="manufacturer"
                name="manufacturer"
                placeHolder="manufacturer..."
                class="form-control form-control-lg gap-3">
            <br>       

            <label for="yr-made" class="col-form-label-lg gap-3">
                Year Produced
            </label><br>
            
            <input
                id="yearInput"
                type="text"
                name="year"
                class="form-control"
                inputmode="numeric"
                autocomplete="off"
                placeholder="YYYY"
                maxlength="4"
            />

        </div> 
        <button type="button" 
            id="backbutton" 
            class="btn btn-outline-info btn-lg" 
            data-page="goBack"
            >Back
        </button>
        
        <button type="submit" 
            id="next" 
            class="btn btn-primary 
            btn-lg float-end"
            data-page="next"
            >Next
        </button>
    </form> 
`;

}

export function loadHomegoodsForm() { 
content.innerHTML = `
    <h1>New HomeGood Listing Form</h1> 
    <form id='itemSpecForm' name='newHomegoodForm' class='form'>
        <div class="mx-auto p-2" style="width:400px;">
        <label for="hgType" class="form-label fs-5 fw-normal"> 
            Homegood Type
        </label> 
        <select id="hgType" name="type" class="form-select form-select-lg mb-3" required>
            <option value="" selected disabled>Expand to select</option> 
            <option value="decor">Home Decor</option> 
            <option value="kitchen">Kitchenware</option> 
            <option value="bedding">Bedding</option> 
            <option value="bathroom">Bathroom</option>
        </select> 
        <input class="form-check-input me-3"
            type="checkbox"
            id="vintage"
            name="vintage"> 
        <label class="form-check-label fw-bold text-start w-100 mb-0" for="vintageCheck">
            Vintage?
        </label>
        <label for="brand" class="col-form-label-lg gap-3">
                Brand
            </label><br>

            <input type="text"
                id="brand"
                name="brand"
                placeHolder="Brand..."
                class="form-control form-control-lg gap-3">
            <br>    
            <label for="year" class="col-form-label-lg gap-3">
                Year Produced
            </label><br>

            <input
                name="year"
                id="yearInput"
                type="text"
                class="form-control"
                inputmode="numeric"
                autocomplete="off"
                placeholder="YYYY"
                maxlength="4"
            />   
        </div>
        <button type="button" 
            id="backbutton" 
            class="btn btn-outline-info btn-lg" 
            data-page="goBack"
            >Back
        </button>
        
        <button type="submit" 
            id="next" 
            class="btn btn-primary 
            btn-lg float-end"
            data-page="next"
            >Next
        </button>
    </form>

`;

}