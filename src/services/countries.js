// /src/services/countries.js - FINAL CORRECTED VERSION

// The data structure is an array of objects, which is flexible and contains all needed info.
const countryData = [
    { name: "Nigeria", code: "NG", phone: "234", states: ["Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara", "FCT"] },
    { name: "United States", code: "US", phone: "1", states: ["Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"] },
    { name: "Canada", code: "CA", phone: "1", states: ["Alberta", "British Columbia", "Manitoba", "New Brunswick", "Newfoundland and Labrador", "Nova Scotia", "Ontario", "Prince Edward Island", "Quebec", "Saskatchewan"] },
    { name: "United Kingdom", code: "GB", phone: "44", states: ["England", "Scotland", "Wales", "Northern Ireland"] },
    { name: "Ghana", code: "GH", phone: "233", states: ["Ashanti", "Brong-Ahafo", "Central", "Eastern", "Greater Accra", "Northern", "Upper East", "Upper West", "Volta", "Western"] },
    { name: "South Africa", code: "ZA", phone: "27", states: ["Eastern Cape", "Free State", "Gauteng", "KwaZulu-Natal", "Limpopo", "Mpumalanga", "North West", "Northern Cape", "Western Cape"] },
];

/**
 * Returns a sorted list of all country objects.
 * @returns {Array<object>} An array of country objects.
 */
export function getCountries() {
    return countryData.sort((a, b) => a.name.localeCompare(b.name));
}

/**
 * Returns a sorted list of states for a given country name.
 * @param {string} countryName - The name of the country.
 * @returns {Array<string>} An array of state names, or an empty array.
 */
export function getStatesByCountry(countryName) {
    const country = countryData.find(c => c.name === countryName);
    return country ? country.states.sort() : [];
}

/**
 * Finds a country by its name and returns the full country object.
 * @param {string} countryName - The name of the country.
 * @returns {object|undefined} The country object or undefined if not found.
 */
export function getCountryByName(countryName) {
    return countryData.find(c => c.name === countryName);
}