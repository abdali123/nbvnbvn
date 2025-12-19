// قائمة المجموعات المتاحة لديك
const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'i'];
let allCountriesData = []; 

// دالة سحرية للوصول للمفاتيح حتى لو بها مسافات (مثل " Cities" أو "Cities")
function getSafeKey(obj, keyName) {
    const keys = Object.keys(obj);
    const found = keys.find(k => k.trim().toLowerCase() === keyName.toLowerCase());
    return found ? obj[found] : null;
}

// 1. تحميل كل البيانات فور فتح الموقع لتعبئة الاقتراحات
async function preloadData() {
    const lang = document.getElementById('langSelect').value || 'ar';
    const countryDatalist = document.getElementById('countriesList');
    
    // تصفير البيانات القديمة
    allCountriesData = [];
    countryDatalist.innerHTML = "";

    for (let g of groups) {
        try {
            const response = await fetch(`${lang} group ${g}.json`);
            if (!response.ok) continue;
            const data = await response.json();
            
            data.forEach(country => {
                const name = getSafeKey(country, "Country_Name");
                if (name) {
                    allCountriesData.push(country);
                    // إضافة اسم الدولة لقائمة الاقتراحات
                    let option = document.createElement('option');
                    option.value = name;
                    countryDatalist.appendChild(option);
                }
            });
        } catch (e) {
            console.error("خطأ في تحميل الملف:", g);
        }
    }
}

// 2. تحديث قائمة المدن بناءً على الدولة التي اختارها المستخدم
document.getElementById('countryInput').addEventListener('change', function() {
    const selectedCountry = this.value;
    const cityDatalist = document.getElementById('citiesList');
    cityDatalist.innerHTML = ""; // تصفير المدن
    
    const countryObj = allCountriesData.find(c => getSafeKey(c, "Country_Name") === selectedCountry);
    
    if (countryObj) {
        const cities = getSafeKey(countryObj, "Cities");
        if (Array.isArray(cities)) {
            cities.forEach(city => {
                const cityName = getSafeKey(city, "City_Name");
                let option = document.createElement('option');
                option.value = cityName;
                cityDatalist.appendChild(option);
            });
        }
    }
});

// 3. وظيفة البحث وعرض النتائج
document.getElementById('searchBtn').addEventListener('click', () => {
    const countryName = document.getElementById('countryInput').value;
    const cityName = document.getElementById('cityInput').value;
    const resultsDiv = document.getElementById('results');

    const countryObj = allCountriesData.find(c => getSafeKey(c, "Country_Name") === countryName);
    if (countryObj) {
        const cities = getSafeKey(countryObj, "Cities");
        const cityData = cities.find(ct => getSafeKey(ct, "City_Name") === cityName);

        if (cityData) {
            document.getElementById('cityNameDisplay').innerText = getSafeKey(cityData, "City_Name");
            document.getElementById('res-landmarks').innerText = getSafeKey(cityData, "Historical_Landmarks") || "غير متوفر";
            document.getElementById('res-cuisine').innerText = getSafeKey(cityData, "Local_Cuisine") || "غير متوفر";
            document.getElementById('res-activities').innerText = getSafeKey(cityData, "Tourist_Activities") || "غير متوفر";
            document.getElementById('res-green').innerText = getSafeKey(cityData, "Green_Spaces") || "غير متوفر";
            
            resultsDiv.classList.remove('hidden');
        } else {
            alert("يرجى اختيار مدينة من القائمة");
        }
    } else {
        alert("يرجى اختيار دولة من القائمة");
    }
});

// تشغيل التحميل عند فتح الصفحة
window.onload = preloadData;
