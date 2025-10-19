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
    const url = `https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital`;
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
    const showOnlyUnMembers = !unitedNationFilter.classList.contains("none"); // true when UN filter active

    // Fetch all countries with UN membership info
    const url = `https://restcountries.com/v3.1/all?fields=name,flags,population,region,capital,unMember`;
    const res = await fetch(url);
    const data = await res.json();

    const filteredCountries = data.filter((country) => {
      const matchesSearch = country.name.common.toLowerCase().includes(query);
      const matchesRegion =
        selectedContinent === "placeholder" ||
        country.region.toLowerCase() === selectedContinent;
      const matchesUn = !showOnlyUnMembers || country.unMember === true;

      return matchesSearch && matchesRegion && matchesUn;
    });

    displayCountries(filteredCountries);

    // Show/hide error message
    if (filteredCountries.length < 1) {
      error.classList.remove("none");
      error.textContent = "No countries found.";
    } else {
      error.classList.add("none");
    }
  } catch (err) {
    console.error(err);
  }
};

// Event listeners
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
const renderCountryExtraInfo = async (countryName) => {
  try {
    const url = `https://restcountries.com/v3.1/name/${countryName}?fullText=true`;
    const res = await fetch(url);
    const data = await res.json();
    const country = data[0];

    filterContainer.classList.add("none");
    countryList.classList.add("none");
    countries.classList.add("responsive__height--none");

    const countryExtra = document.querySelector(".country__extra");
    countryExtra.classList.remove("none");

    // Currencies and languages
    const currencies =
      Object.values(country.currencies || {})
        .map((c) => c.name)
        .join(", ") || "N/A";

    const languages =
      Object.values(country.languages || {}).join(", ") || "N/A";

    const nativeName =
      Object.values(country.name.nativeName || {})[0]?.common || "N/A";

    // Render main country info
    countryExtra.innerHTML = `
      <img class="country__extra--img" src="${country.flags.svg}" alt="${
      country.name.common
    } flag"/>
      <div class="country__extra--information--box">
        <h1 class="country__extra--heading">${country.name.common}</h1>
        <div class="country__extra--information">
          <p><span>Native Name:</span> ${nativeName}</p>
          <p><span>Population:</span> ${country.population.toLocaleString()}</p>
          <p><span>Region:</span> ${country.region}</p>
          <p><span>Sub Region:</span> ${country.subregion || "N/A"}</p>
          <p><span>Capital:</span> ${country.capital?.[0] || "N/A"}</p>
          <p><span>Top Level Domain:</span> ${country.tld?.[0] || "N/A"}</p>
          <p><span>Currency:</span> ${currencies}</p>
          <p><span>Languages:</span> ${languages}</p>
        </div>
        <div class="country__extra--borders">
          <p class="border__text">Border Countries:</p>
          <ul class="border__country--list"></ul>
          <p class="border__err">No Bordering Countries!</p>
        </div>
      </div>
    `;

    backBtn.classList.remove("none");

    // Render borders
    const countryBorderBox = document.querySelector(".border__country--list");
    const borderingText = document.querySelector(".border__err");
    countryBorderBox.innerHTML = ""; // clear previous borders

    const borders = country.borders;
    if (borders && borders.length > 0) {
      const allCountriesRes = await fetch(
        "https://restcountries.com/v3.1/all?fields=cca3,name"
      );
      const allCountries = await allCountriesRes.json();

      borders.forEach((borderCode) => {
        const borderCountry = allCountries.find((c) => c.cca3 === borderCode);
        const borderName = borderCountry
          ? borderCountry.name.common
          : borderCode;

        const borderItem = document.createElement("li");
        borderItem.classList.add("border__country");
        borderItem.textContent = borderName;

        borderItem.addEventListener("click", () =>
          renderCountryExtraInfo(borderName)
        );

        countryBorderBox.appendChild(borderItem);
      });

      borderingText.classList.add("none"); // hide "No borders" text
    } else {
      borderingText.classList.remove("none"); // show if no borders
    }

    // Slide in effect
    countryExtra.style.transform = "translateX(0rem)";
  } catch (err) {
    console.error("Failed to render country details:", err);
  }
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
//////////////////////////////////////////////////////////////////////////
// LAZY IMG LOADING
const imgTargets = document.querySelectorAll("img[data-src]");
const loadImg = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.src = entry.target.dataset.src;

      observer.unobserve(entry.target);
    }
  });
};
const imgObserver = new IntersectionObserver(loadImg, {
  root: null,
  threshold: 0,
  rootMargin: "0px 0px -200px 0px",
});

imgTargets.forEach((img) => {
  imgObserver.observe(img);
});
