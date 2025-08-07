
const API_KEY = 'b67779d657a34e1b9bd24746250708';
const API_BASE_URL = 'https://api.weatherapi.com/v1/current.json';

const cityInput = document.getElementById('cityInput');
const searchBtn = document.getElementById('searchBtn');
const weatherCard = document.getElementById('weatherCard');
const loading = document.getElementById('loading');
const weatherInfo = document.getElementById('weatherInfo');
const error = document.getElementById('error');

// DOM 요소들
const cityName = document.getElementById('cityName');
const country = document.getElementById('country');
const temp = document.getElementById('temp');
const weatherIcon = document.getElementById('weatherIcon');
const condition = document.getElementById('condition');
const feelsLike = document.getElementById('feelsLike');
const humidity = document.getElementById('humidity');
const windSpeed = document.getElementById('windSpeed');
const visibility = document.getElementById('visibility');

// 초기 로딩 상태 숨기기
loading.style.display = 'none';

// 이벤트 리스너
searchBtn.addEventListener('click', searchWeather);
cityInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// 페이지 로드 시 서울 날씨 표시
window.addEventListener('load', () => {
    getWeather('Seoul');
});

async function searchWeather() {
    const city = cityInput.value.trim();
    if (!city) {
        alert('도시 이름을 입력해주세요.');
        return;
    }
    
    await getWeather(city);
}

async function getWeather(city) {
    showLoading();
    
    try {
        const url = `${API_BASE_URL}?key=${API_KEY}&q=${encodeURIComponent(city)}&aqi=no&lang=ko`;
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayWeather(data);
        
    } catch (err) {
        console.error('날씨 정보를 가져오는 중 오류 발생:', err);
        showError();
    }
}

function displayWeather(data) {
    const { location, current } = data;
    
    // 위치 정보
    cityName.textContent = location.name;
    country.textContent = `${location.region}, ${location.country}`;
    
    // 현재 날씨
    temp.textContent = Math.round(current.temp_c);
    weatherIcon.src = `https:${current.condition.icon}`;
    weatherIcon.alt = current.condition.text;
    condition.textContent = current.condition.text;
    
    // 상세 정보
    feelsLike.textContent = Math.round(current.feelslike_c);
    humidity.textContent = current.humidity;
    windSpeed.textContent = Math.round(current.wind_kph);
    visibility.textContent = current.vis_km;
    
    showWeatherInfo();
}

function showLoading() {
    loading.style.display = 'block';
    weatherInfo.style.display = 'none';
    error.style.display = 'none';
}

function showWeatherInfo() {
    loading.style.display = 'none';
    weatherInfo.style.display = 'block';
    error.style.display = 'none';
}

function showError() {
    loading.style.display = 'none';
    weatherInfo.style.display = 'none';
    error.style.display = 'block';
}

// 위치 기반 날씨 정보 가져오기 (선택사항)
function getCurrentLocationWeather() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async (position) => {
                const { latitude, longitude } = position.coords;
                await getWeather(`${latitude},${longitude}`);
            },
            (error) => {
                console.error('위치 정보를 가져올 수 없습니다:', error);
                // 기본값으로 서울 날씨 표시
                getWeather('Seoul');
            }
        );
    } else {
        console.error('이 브라우저는 위치 서비스를 지원하지 않습니다.');
        getWeather('Seoul');
    }
}
