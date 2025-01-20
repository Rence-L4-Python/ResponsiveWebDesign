import {indicators} from "./indicators.js";
import {topics} from "./topics.js";
import {countryNames} from "./countrynames.js";
import {topicIcons} from "./topic-icons.js";

let currentTopic = "overview";
let currentCountry = "PH";

// World Bank API Data Fetching Function
async function fetchIndicator(countryCode, indicatorKey){
    const indicator = indicators[indicatorKey];
    const url = `https://api.worldbank.org/v2/country/${countryCode}/indicator/${indicator.id}?format=json`;

    try{
        console.log(`Fetching data for ${indicatorKey} in ${countryCode}`);
        const response = await fetch(url);
        const data = await response.json();

        const valueElement = document.getElementById(indicatorKey);
        const yearElement = document.querySelector(`#${indicatorKey}-title span`);

        if (data && data[1] && data[1].length > 0){
            const recentData = data[1].find((entry) => entry.value !== null);

            if (recentData){
                valueElement.innerText = recentData.value.toLocaleString();
                yearElement.innerText = recentData.date;
            } 
            else{
                valueElement.innerText = "No valid data available";
                yearElement.innerText = "N/A";
            }
        } 
        else{
            valueElement.innerText = "No data available";
            yearElement.innerText = "N/A";
        }
    } 
    catch (error){
        console.error("Error fetching data:", error);

        const valueElement = document.getElementById(indicatorKey);
        const yearElement = document.querySelector(`#${indicatorKey}-title span`);

        if (valueElement)valueElement.innerText = "Error fetching data";
        if (yearElement)yearElement.innerText = "N/A";
    }
}

// Fetch stats and update display
function fetchCountryStats(){
    const countryName = countryNames[currentCountry];
    document.getElementById("header-heading").innerText = countryName;
    document.querySelectorAll("#country-name").forEach((element) => {
        element.innerText = countryName;
    });
    updateCards();
    updateIconsOnCards(currentTopic);
}

// Function to create base for generating cards
function createCard(title, key){
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <div class="icon"></div>
        <p id="${key}-title" class="colored">${title} <span>2024</span></p>
        <p id="${key}" class="card-value">Loading...</p>
    `;
    return card;
}

// Update cards for selected topic
function updateCards(){
    const topicData = topics[currentTopic];
    const container = document.querySelector(".topic-container");
    container.innerHTML = ""; 

    const keys = Object.keys(topicData);
    const middle = Math.ceil(keys.length / 2);
    const column1Keys = keys.slice(0, middle);
    const column2Keys = keys.slice(middle);

    const column1 = document.createElement("div");
    column1.classList.add("column");

    const column2 = document.createElement("div");
    column2.classList.add("column", "centered-column");

    column1Keys.forEach((key) => {
        const card = createCard(topicData[key], key);
        column1.appendChild(card);
    });

    column2Keys.forEach((key) => {
        const card = createCard(topicData[key], key);
        column2.appendChild(card);
    });

    container.appendChild(column1);
    container.appendChild(column2);

    keys.forEach((key) => {
        fetchIndicator(currentCountry, key);
    });
}

// Update card icons according to their topic
function updateIconsOnCards(topic){
    if (!topics[topic]){
        console.error(`Topic "${topic}" does not exist.`);
        return;
    }

    const cards = document.querySelectorAll(".card");
    const metrics = Object.keys(topics[topic]);

    cards.forEach((card, index) => {
        if (!metrics[index]) return;

        const iconElement = card.querySelector(".icon");
        if (!iconElement) return;

        iconElement.innerHTML = "";

        const metricKey = metrics[index];
        let iconPath = null;

        if (topic === "overview"){
            for (let category in topicIcons){
                if (topicIcons[category][metricKey]) {
                    iconPath = topicIcons[category][metricKey];
                    break;
                }
            }
        } 
        else{
            iconPath = topicIcons[topic]?.[metricKey];
        }

        if (iconPath){
            const img = document.createElement("img");
            img.src = iconPath;
            img.alt = `${metricKey} icon`;
            iconElement.appendChild(img);
        } 
        else{
            console.warn(`No icon found for "${metricKey}" in "${topic}".`);
        }
    });
}

// Update images according to the current country
function updateSectionImage(countryCode) {
    const sectionImg = document.querySelector("#section-1 img");
    if (sectionImg) {
        sectionImg.src = `Assets/img-${countryCode}.jpg`;
        sectionImg.alt = `${countryCode} placeholder image`;
    }
}

document.querySelector(".custom-select").addEventListener("change", function() {
    console.log("Selected:", this.value);
    updateSectionImage(this.value);
});

document.querySelectorAll(".menu-option").forEach(option => {
    option.addEventListener("click", function() {
        updateSectionImage(this.getAttribute("onclick").match(/'([^']+)'/)[1]);
    });
});

// Setup for custom menus
function initializeCustomMenus(){
    document.querySelector(".custom-select").addEventListener("change", function (e) {
        currentCountry = e.target.value;
        console.log("Country changed to:", currentCountry);
        fetchCountryStats();
    });
    
    document.querySelectorAll(".menu-option").forEach((option) => {
        option.addEventListener("click", function(){
            const selectedCountry = option.textContent.trim();
            currentCountry = Object.keys(countryNames).find(
                (code) => countryNames[code].toUpperCase() === selectedCountry.toUpperCase()
            );
            fetchCountryStats();
        });
    });
}

// Buttons for topic navigation in 768px+ breakpoints
function initializeTopicNavigation(){
    document.getElementById("prev-topic-btn").addEventListener("click", () => {
        const topicOrder = Object.keys(topics);
        const currentIndex = topicOrder.indexOf(currentTopic);
        const nextIndex = (currentIndex - 1 + topicOrder.length) % topicOrder.length;
        currentTopic = topicOrder[nextIndex];
        document.getElementById("topics-heading").innerText = currentTopic.toUpperCase();
        fetchCountryStats();
        updateIconsOnCards(currentTopic);
    });
    
    document.getElementById("next-topic-btn").addEventListener("click", () => {
        const topicOrder = Object.keys(topics);
        const currentIndex = topicOrder.indexOf(currentTopic);
        const nextIndex = (currentIndex + 1) % topicOrder.length;
        currentTopic = topicOrder[nextIndex];
        document.getElementById("topics-heading").innerText = currentTopic.toUpperCase();
        fetchCountryStats();
        updateIconsOnCards(currentTopic);
    });
}

fetchCountryStats("PH");
initializeTopicNavigation();
initializeCustomMenus();
updateIconsOnCards();
updateSectionImage("PH");