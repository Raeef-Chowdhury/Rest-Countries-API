const btn = document.querySelector(".dark__icon");
const searchBar = document.querySelector(".filter__country");
const countryList = document.querySelector(".country__list");

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
  countryList.innerHTML = ""; // Clear the list
  countries.forEach((country) => {
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
// Add Filter Search
searchBar.addEventListener("input", async function (e) {
  try {
    const query = e.target.value.toLowerCase(); // Get user input
    const url = `https://restcountries.com/v3.1/all`;
    const res = await fetch(url);
    const data = await res.json();

    // Filter countries based on the search query
    const filteredCountries = data.filter((country) =>
      country.name.common.toLowerCase().includes(query)
    );

    displayCountries(filteredCountries); // Render filtered countries
  } catch (err) {
    console.log(err);
  }
});

window.addEventListener("load", renderAllCountries);
