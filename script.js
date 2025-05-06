const apiKey = "20da423906ccf27bec8c2d81c8f4a2eb";
        const weatherDataEle = document.querySelector(".weather-data");
        const cityNameEle = document.querySelector("#city-name");
        const formEle = document.querySelector("form");
        const weatherIcon = document.querySelector("#weatherIcon");
        const skyBackground = document.querySelector("#skyBackground");

        // Weather background mapping
        const weatherBackgrounds = {
            'clear': 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'clouds': 'https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'rain': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'thunderstorm': 'https://images.unsplash.com/photo-1534088568595-a066f410bcda?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'snow': 'https://images.unsplash.com/photo-1519408299519-b7a0274f7d8f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'mist': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'haze': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'drizzle': 'https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
            'default': 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80'
        };

        formEle.addEventListener("submit", (e)=>{
            e.preventDefault();
            const cityValue = cityNameEle.value.trim();
            
            if(cityValue) {
                getWeatherData(cityValue);
            }
        });

        async function getWeatherData(cityValue){
            try{
                // Reset UI
                weatherDataEle.classList.remove("show");
                skyBackground.classList.remove("active");
                
                const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityValue}&appid=${apiKey}&units=metric`);
                
                if(!response.ok){
                    throw new Error("City not found!");
                }

                const data = await response.json();
                
                // Set appropriate background based on weather
                const weatherMain = data.weather[0].main.toLowerCase();
                const backgroundUrl = weatherBackgrounds[weatherMain] || weatherBackgrounds['default'];
                skyBackground.style.backgroundImage = `url(${backgroundUrl})`;
                
                // Show elements with delay for better UX
                setTimeout(() => {
                    weatherDataEle.classList.add("show");
                    skyBackground.classList.add("active");
                }, 300);
                
                const temperature = Math.floor(data.main.temp);
                const description = data.weather[0].description;
                const icon = data.weather[0].icon;

                const details = [
                    `Feels Like: ${Math.floor(data.main.feels_like)}°C`,
                    `Humidity: ${data.main.humidity}%`,
                    `Wind Speed: ${data.wind.speed} m/s`
                ];

                weatherDataEle.querySelector(".temp").textContent = temperature;
                weatherDataEle.querySelector(".desc").textContent = description;

                // Set weather icon with proper size and centered
                weatherIcon.src = `https://openweathermap.org/img/wn/${icon}@4x.png`;
                weatherIcon.alt = description;
                weatherIcon.style.display = 'block';

                weatherDataEle.querySelector(".details").innerHTML = details.map((detail) => {
                    return `<div>${detail}</div>`;
                }).join("");

            } catch(err) {
                skyBackground.style.backgroundImage = `url(${weatherBackgrounds['default']})`;
                skyBackground.classList.add("active");
                weatherDataEle.classList.add("show");
                
                weatherDataEle.querySelector(".temp").textContent = "";
                weatherIcon.src = "";
                weatherIcon.style.display = 'none';
                weatherDataEle.querySelector(".desc").textContent = "City Not Found!";
                weatherDataEle.querySelector(".details").innerHTML = 
                    `<div>Please enter a valid city</div>`;
            }
        }

        // Initialize with default background
        skyBackground.style.backgroundImage = `url(${weatherBackgrounds['default']})`;
        skyBackground.classList.add("active");