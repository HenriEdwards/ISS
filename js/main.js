
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
        let latString = response.data.latitude.toString();
        let latDecIndex = latString.indexOf('.');
        let latNums = latString.substring(0, latDecIndex + 4); 

        lat.textContent = parseFloat(latNums);

        let longtString = response.data.longitude.toString();
        let longDecIndex = longtString.indexOf('.');
        let longNums = longtString.substring(0, longDecIndex + 4); 

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

    // Change BG image src
    // bg.src = srcImages[currentIndex];
    // currentIndex = (currentIndex + 1) % srcImages.length;

    // Increment counter and loop back to the beginning
    counter = (counter + 1) % quotes.data.length;

    // Add class for CSS animation
    text1.classList.add('fade-in-out');
    bg.classList.add('fade-in-out');
    textAttr.classList.add('fade-in-out');
}

// Retireve quotes data & save to var
let quotes = '';

async function getQuotes() {
    try { 
        quotes = await axios.get('../js/quotes.json');

        // Call function to change text at an interval
        setInterval(changeText, 15000)
        changeText()
    } catch (error) {
        console.log('Error retrieving quotes: ', error)
    }
}

getQuotes()


// Background image selector
const bg = document.querySelector('.bg');
let srcImages = [
  './assets/bg.jpg',
  './assets/bg2.jpg',
  './assets/bg3.jpg',
  './assets/bg4.jpg'
];
let currentIndex = 0;

// Change image every 20 secs
// Ensure slow servers doesnt cause the img & animation to go out of sync
function changeImage() {
  const image = new Image();
  image.onload = () => {
    bg.src = image.src;
    bg.classList.remove('fade-out');
    bg.classList.add('fade-in');
    setTimeout(() => {
      bg.classList.remove('fade-in');
      bg.classList.add('fade-out');
    }, 18000);
  };
  image.src = srcImages[currentIndex];
  currentIndex = (currentIndex + 1) % srcImages.length;
}

changeImage();
setInterval(changeImage, 20000);