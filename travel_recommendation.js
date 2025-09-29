const searchinput = document.getElementById('searchinput');
const searchbtn = document.getElementById('searchbtn');
const searchicon = document.getElementById('searchicon');
const clearbtn = document.getElementById('clearbtn');
const resultdiv = document.getElementById('Result');

const apiUrl = 'travel_recommendation_api.json';

// Function to fetch and display travel recommendations
async function fetchRecommendations() {
    const query = searchinput.value.trim().toLowerCase();
    resultdiv.innerHTML = ''; // Clear previous results

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        let recommendations = [];

        // Search in countries and their cities
        if (query.includes('country') || query.includes('countries')) {
            data.countries.forEach(country => {
                country.cities.forEach(city => {
                    recommendations.push({
                        name: city.name,
                        imageUrl: city.imageUrl,
                        description: city.description
                    });
                });
            });
        }
        // Search in temples
        else if (query.includes('temple') || query.includes('temples')) {
            recommendations = data.temples;
        }
        // Search in beaches
        else if (query.includes('beach') || query.includes('beaches')) {
            recommendations = data.beaches;
        }
        // Search by specific destination names
        else {
            // Search in countries
            data.countries.forEach(country => {
                if (country.name.toLowerCase().includes(query)) {
                    country.cities.forEach(city => {
                        recommendations.push({
                            name: city.name,
                            imageUrl: city.imageUrl,
                            description: city.description
                        });
                    });
                }
                // Search in individual cities
                country.cities.forEach(city => {
                    if (city.name.toLowerCase().includes(query)) {
                        recommendations.push({
                            name: city.name,
                            imageUrl: city.imageUrl,
                            description: city.description
                        });
                    }
                });
            });
            
            // Search in temples
            data.temples.forEach(temple => {
                if (temple.name.toLowerCase().includes(query)) {
                    recommendations.push(temple);
                }
            });
            
            // Search in beaches
            data.beaches.forEach(beach => {
                if (beach.name.toLowerCase().includes(query)) {
                    recommendations.push(beach);
                }
            });
        }

        if (recommendations.length > 0) {
            resultdiv.style.display = 'block';
            recommendations.forEach(item => {
                const resultItem = document.createElement('div');
                resultItem.classList.add('resultvalues');
                resultItem.innerHTML = `
                    <p class="resulttittle">${item.name}</p>
                    <img class="resultimg" src="${item.imageUrl}" alt="${item.name}">
                    <p class="resultdescription">${item.description}</p>
                `;
                resultdiv.appendChild(resultItem);
            });
        } else {
            resultdiv.style.display = 'block';
            resultdiv.innerHTML = '<div class="resultvalues"><p class="resultdescription">No results found.</p></div>';
        }
    } catch (error) {
        console.error('Error fetching recommendations:', error);
        resultdiv.style.display = 'block';
        resultdiv.innerHTML = '<div class="resultvalues"><p class="resultdescription">Error fetching recommendations.</p></div>';
    }
}
// Event listeners
searchbtn.addEventListener('click', fetchRecommendations);
searchicon.addEventListener('click', fetchRecommendations);
clearbtn.addEventListener('click', () => {
    searchinput.value = '';
    resultdiv.innerHTML = '';
    resultdiv.style.display = 'none';
});
searchinput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        fetchRecommendations();
    }
});
searchinput.addEventListener('input', () => {
    if (searchinput.value.trim() === '') {
        resultdiv.innerHTML = '';
        resultdiv.style.display = 'none';
    }
});

// Initially hide the result div
resultdiv.style.display = 'none';