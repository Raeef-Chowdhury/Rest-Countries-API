const btn = document.querySelector(".dark__icon");
const searchBar = document.querySelector(".filter__country");
const countryList = document.querySelector(".country__list");
const filterRegions = document.querySelector(".filter__reigions");
const error = document.querySelector(".error__msg");
const allCountriesFilter = document.querySelector(".all__countries--filter");
const unitedNationFilter = document.querySelector(".united__nations--filter");
const allCountriesText = document.querySelector(".all__countries--text");
const filterContainer = document.querySelector(".filter__container");
const backBtn = document.querySelector(".back__btn");
const darkModeBtn = document.querySelector(".dark__icon");
const lightModeBtn = document.querySelector(".light__icon");
const lightText = document.querySelector(".theme__text--light");
const darkText = document.querySelector(".theme__text--dark");
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// theme switcher
darkModeBtn.addEventListener("click", function () {
  darkModeEnable();
  darkModeBtn.classList.add("none");
  lightModeBtn.classList.remove("none");
  lightText.classList.remove("none");
  darkText.classList.add("none");
});
lightModeBtn.addEventListener("click", function () {
  lightModeEnable();
  darkModeBtn.classList.remove("none");
  lightModeBtn.classList.add("none");
  lightText.classList.add("none");
  darkText.classList.remove("none");
});
function darkModeEnable() {
  const root = document.documentElement;

  root.style.setProperty("--main-color", "white");
  root.style.setProperty("--secondary-color", "#333");
  root.style.setProperty("--text-color", "black");
  root.style.setProperty("--shadow-color", "rgba(0, 0, 0, 0.2)");
}
function lightModeEnable() {
  const root = document.documentElement;

  root.style.setProperty("--main-color", "black");
  root.style.setProperty("--secondary-color", "#ccc");
  root.style.setProperty("--text-color", "white");
  root.style.setProperty("--shadow-color", "rgba(255, 255, 255, 0.2)");
}
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
    countryItem.addEventListener("click", () =>
      renderCountryExtraInfo(country.name.common)
    );

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
//////////////////////////////////////////////
// Implementing further details country page
const countries = document.querySelector(".countries");
const renderCountryExtraInfo = async (index) => {
  const url = `https://restcountries.com/v3.1/name/${index}`;
  const res = await fetch(url);
  const data = await res.json();
  const country = data[0];
  filterContainer.classList.add("none");
  countryList.classList.add("none");
  countries.classList.add("responsive__height--none");
  const coutnryExtra = document.querySelector(".country__extra");
  coutnryExtra.classList.remove("none");
  const currencies = Object.values(country.currencies || {})
    .map((c) => c.name)
    .join(", ");
  coutnryExtra.innerHTML = `
        <img
          class="country__extra--img"
          src="${country.flags.svg}"
        />
        <div class="country__extra--information--box">
          <h1 class="country__extra--heading">${data[0].name.common}</h1>
          <div class="country__extra--information">
            <p class="country__extra--info">
              <span class="country__extra--span">Native Name:</span>
           ${Object.values(data[0].name.nativeName)[0].common || N / A}
            </p>
            <p class="country__extra--info">
              <span class="country__extra--span"> Population:</span>
              ${country.population.toLocaleString()}
            </p>
            <p class="country__extra--info">
              <span class="country__extra--span">Region:</span>
              ${country.region}
            </p>
            <p class="country__extra--info">
              <span class="country__extra--span">Sub Region:</span>
                  ${country.subregion}
            </p>
            <p class="country__extra--info">
              <span class="country__extra--span">Capital:</span>
                  ${country.capital}
            </p>
            <p class="country__extra--info">
              <span class="country__extra--span">Top Level Domain:</span>
             
              ${country.tld[0]}
            </p>
            <p class="country__extra--info">
              <span class="country__extra--span">Currency:</span>
        ${currencies}
            </p>
            <p class="country__extra--info">
              <span class="country__extra--span">Languages:</span>
              ${Object.values(data[0].languages)[0]}
            </p>
          </div>
          <div class="country__extra--borders">
            <p class="border__text">Border Countries:</p>
            <ul class="border__country--list">
            <p class="border__err">No Bordering Countries!</p>
            </ul>
          </div>
        </div>`;
  backBtn.classList.remove("none");
  const countryBorderBox = document.querySelector(".border__country--list");
  const borders = data[0].borders;
  const borderingText = document.querySelector(".border__err");
  if (borders && borders.length > 0) {
    const allCountriesRes = await fetch("https://restcountries.com/v3.1/all");
    const allCountries = await allCountriesRes.json();

    const borderCountries = borders.map((borderCode) => {
      const borderCountry = allCountries.find(
        (country) => country.cca3 === borderCode
      );
      return borderCountry ? borderCountry.name.common : borderCode;
    });
    borderCountries.forEach((border) => {
      const borderItem = document.createElement("li");
      const text = border;
      console.log(text);

      borderItem.classList.add("border__country");
      borderItem.innerHTML = `${border}`;
      countryBorderBox.appendChild(borderItem);
      borderItem.addEventListener("click", () => renderCountryExtraInfo(text));
      borderingText.classList.add("none");
    });
  } else {
    borderingText.classList.remove("none");
  }
  coutnryExtra.style.transform = "translateX(0rem)";
};
backBtn.addEventListener("click", function () {
  filterContainer.classList.remove("none");
  countryList.classList.remove("none");
  backBtn.classList.add("none");
  const coutnryExtra = document.querySelector(".country__extra");
  coutnryExtra.classList.add("none");
  countries.classList.remove("responsive__height--none");
  renderAllCountries;
});
