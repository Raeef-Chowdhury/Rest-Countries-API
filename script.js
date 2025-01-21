const btn = document.querySelector(".dark__icon");
const searchBar = document.querySelector(".filter__country");
const countryList = document.querySelector(".country__list");
const filterRegions = document.querySelector(".filter__reigions");
const error = document.querySelector(".error__msg");
const allCountriesFilter = document.querySelector(".all__countries--filter");
const unitedNationFilter = document.querySelector(".united__nations--filter");
const allCountriesText = document.querySelector(".all__countries--text");

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/// DISPLAYING ENTIRE LIST OF COUNTRIES
const renderAllCountries = async () => {
  try {
    const url = `https://restcountries.com/v3.1/all`;
    const res = await fetch(url);
    const data = await res.json();
    displayCountries(data);
  } catch (err) {
    console.log(err);
  }
};
const displayCountries = (countries) => {
  const sortedData = countries.sort((a, b) =>
    a.name.common.localeCompare(b.name.common)
  );
  countryList.innerHTML = "";
  sortedData.forEach((country) => {
    const countryItem = document.createElement("li");
    countryItem.innerHTML = `
          <img
              src="${country.flags.svg}"
              alt="${country.name.common} flag"
              class="country__img"
            />
            <div class="country__item--information">
              <h1 class="country__name">${country.name.common}</h1>
              <p class="country__item--info country__item--pop">
                <span>Population:</span> ${country.population.toLocaleString()}
              </p>
              <p class="country__item--info country__item--region">
                <span>Region:</span> ${country.region}
              </p>
              <p class="country__item--info country__item--cap">
                <span>Capital:</span> ${
                  country.capital ? country.capital[0] : "N/A"
                }
              </p>
            </div>`;
    countryItem.classList.add("country__item");
    countryList.appendChild(countryItem);
  });
};

document.addEventListener("DOMContentLoaded", renderAllCountries);

//////////////////////////////////////////////////////////////////////////////////////////////////
//  FILTERING COUNTRIES
const filterCountries = async () => {
  try {
    const query = searchBar.value.toLowerCase();
    const selectedContinent = filterRegions.value.toLowerCase();
    const isUnMember = unitedNationFilter.classList.contains("none");

    const url = `https://restcountries.com/v3.1/all`;
    const res = await fetch(url);
    const data = await res.json();

    // Apply filters
    const filteredCountries = data.filter((country) => {
      const matchesSearch = country.name.common.toLowerCase().includes(query);
      const matchesRegion =
        selectedContinent === "placeholder" ||
        country.region.toLowerCase() === selectedContinent;
      const matchesUn = !isUnMember || country.unMember === true;

      return matchesSearch && matchesRegion && matchesUn;
    });

    displayCountries(filteredCountries);
    if (filteredCountries.length < 1) {
      error.classList.remove("none");
    } else {
      error.classList.add("none");
    }
  } catch (err) {
    console.log(err);
  }
};
filterRegions.addEventListener("change", filterCountries);
searchBar.addEventListener("input", filterCountries);
allCountriesFilter.addEventListener("click", function () {
  unitedNationFilter.classList.remove("none");
  allCountriesFilter.classList.add("none");
  allCountriesText.classList.add("none");
  filterCountries();
});
unitedNationFilter.addEventListener("click", function () {
  unitedNationFilter.classList.add("none");
  allCountriesFilter.classList.remove("none");
  allCountriesText.classList.remove("none");
  filterCountries();
});
