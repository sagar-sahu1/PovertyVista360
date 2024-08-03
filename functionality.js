const map = L.map('map', {
  maxBounds: L.latLngBounds([-90, -180], [90, 180]), // Set maximum and minimum latitude/longitude
  minZoom: 2.9, // Set minimum zoom level
  maxZoom: 6 // Set maximum zoom level (shows only one tile)
}).setView([21.7679, 78.8718], 5);

const tileurl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const attribution = '&copy;<a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> Contributors: Designed and Coded By Swati Suman, Sagar Sahu and Sk Shahil Akhtar';
const tileLayer = L.tileLayer(tileurl, { attribution });
tileLayer.addTo(map);

// Function to generate the list dynamically
function generateList(countries) {
  const ul = document.querySelector('.list');
  ul.innerHTML = ''; // Clear the existing list
  
  if (countries.length === 0) {
    const li = document.createElement('li');
    li.innerText = "No results found. Please try again...";
    ul.appendChild(li);
    return;
  }

  countries.forEach((country) => {
    const li = document.createElement('li');
    const div = document.createElement('div');
    const a = document.createElement('a');
    a.addEventListener('click', () => {
      flyToCountry(country);
    });
    // Assigning a class for div created above to apply styles for all the div that will be dynamically created.
    div.classList.add('country-item');
    a.innerText = country.properties.COUNTRY;
    a.href = '#';
    div.appendChild(a);
    li.appendChild(div);
    ul.appendChild(li);
  });
}

// Function to filter and reorder the list based on the search query
function filterList(query) {
  const filteredCountries = countryList.filter((country) =>
    country.properties.COUNTRY.toLowerCase().includes(query.toLowerCase())
  );

  if (query.trim() === '' || filteredCountries.length === 0) {
    generateList(filteredCountries);
    return;
  }

  const exactMatch = filteredCountries.filter((country) =>
    country.properties.COUNTRY.toLowerCase() === query.toLowerCase()
  );

  const partialMatches = filteredCountries.filter((country) =>
    country.properties.COUNTRY.toLowerCase() !== query.toLowerCase()
  );

  generateList([...exactMatch, ...partialMatches]);
}

// Event listener for the search bar
document.getElementById('search-bar').addEventListener('input', (e) => {
  filterList(e.target.value);
});

// Initial call to generate the full list
generateList(countryList);

function makePopupContent(country) {
  return `
  <div>
  <h4>${country.properties.COUNTRY}</h4>
  <label for="samp">Poverty Index:</label>
  <p id="samp">${country.properties.poverty_index}</p>
  </div>
  `;
}

// Function to handle each feature on the map
function onEachFeature(feature, layer) {
  layer.bindPopup(makePopupContent(feature), { closeButton: false, offset: L.point(0, -8) });
}

// Function to fly to the selected country
function flyToCountry(country) {
  const lat = country.geometry.coordinates[1];
  const lng = country.geometry.coordinates[0];
  map.flyTo([lat, lng], 6, {
    duration: 2.8
  });

  setTimeout(() => {
    const marker = L.marker([lat, lng]); // Create the marker here
    marker.addTo(map); // Add the marker to the map
    marker.bindPopup(makePopupContent(country), { closeButton: false, offset: L.point(0, -8) }).openPopup(); // Open the popup
  }, 3200);
}
