
// Vars for ISS data
const lat = document.querySelector('.lat');
const long = document.querySelector('.long');
const country = document.querySelector('.country');
const capital = document.querySelector('.capital');

// Vars for quotes
const text1 = document.querySelector('.text-carousel-1');
const textAttr = document.querySelector('.attr');

// lat/long for calculations
let issLat = 0;
let issLong = 0;

async function getISS () {
    // Get ISS location
    try {
        const response = await axios.get('https://api.wheretheiss.at/v1/satellites/25544')

        // Set ISS locations via DOM
        let numString = response.data.latitude.toString();
        let indexOfDecimal = numString.indexOf('.');
        let latNums = numString.substring(0, indexOfDecimal + 4); 

        lat.textContent = parseFloat(latNums);

        numString = response.data.latitude.toString();
        indexOfDecimal = numString.indexOf('.');
        let longNums = numString.substring(0, indexOfDecimal + 4); 

        long.textContent = parseFloat(longNums);

        // Save ISS lat/long to variables
        issLat = parseFloat(latNums);
        issLong =  parseFloat(longNums);
        
    } catch(error) {
        console.log('Error retrieving ISS data: ',error);
    };
}

// Vars to hold current closest country/capital
let currCountry = '';
let currCapital = '';

// Var to hold distance between ISS and closest country
let distance = Infinity;


async function getCountry () {
    // Retrieve & compare countries lat/long with the ISS location
    try {
        const response = await axios.get('../js/countries.json')
        const countries = response.data;

        // Loop through countries data and find closes country to ISS
        for (let i = 0; i < countries.length; i++) {

            // Vars to hold current country's lat/long
            let countryLat = parseFloat(countries[i].Latitude);
            let countryLong = parseFloat(countries[i].Longitude);

            // Call calucalteDistance function and get current country's distance from the ISS
            let tempDistance = calculateDistance(issLat, issLong, countryLat, countryLong);

            // Check if the current country's distance from the ISS is smaller
            if (tempDistance < distance) {
                // Update distance
                distance = tempDistance;

                // Update values via DOM
                country.textContent =  countries[i].Country;
                capital.textContent = countries[i].CapitalCity;
            }
        }
    } catch(error) {
        console.log('Error retrieving countries data: ',error);
    };
}

// Invoke getCountry to caluclate/update the closest country every 2 secs
setInterval(getCountry, 5000);

// Invoke getISS to get ISS location every 1 secs
setInterval(getISS, 1000);

// Converts degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Uses haversine formula to calculate the distance between the ISS & the country
function calculateDistance(issLat, issLong, countryLat, countryLong) {
    // Radius of the Earth in km
    const earthRadius = 6371;
  
    // Convert latitude and longitude from degrees to radians
    const φ1 = toRadians(issLat);
    const φ2 = toRadians(countryLat);
    const Δφ = toRadians(countryLat - issLat);
    const Δλ = toRadians(countryLong - issLong);
  
    // Haversine formula
    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c;
  
    return distance;
  }

while (lat.textContent == '' & long.textContent == '' & country.textContent == '' & capital.textContent =='') {
    lat.textContent = 'Loading...';
    long.textContent = 'Loading...';
    country.textContent = 'Loading...';
    capital.textContent = 'Loading...';
}


// QUOTES

// Change quotes
let counter = 0;
function changeText() {

    // Add a quote to the paragraph & increment counter
    text1.textContent = quotes.data[counter].text;
    textAttr.textContent =  '-' + quotes.data[counter].attribute;

    // Increment counter and loop back to the beginning if necessary
    counter = (counter + 1) % quotes.data.length;

    // Add class for CSS animation
    text1.classList.add('fade-in-out');
    textAttr.classList.add('fade-in-out');
}

// Retireve quotes data
let quotes = '';

async function getQuotes() {
    try { 
        quotes = await axios.get('../js/quotes.json');

        // Call function to change text at an interval
        changeText()

    } catch (error) {
        console.log('Error retrieving quotes: ', error)
    }
}

getQuotes()
setInterval(changeText, 15000)