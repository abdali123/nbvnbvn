const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'i'];
let allData = []; // سنخزن البيانات هنا لسرعة البحث

// دالة لتنظيف المفاتيح من المسافات الزائدة (مثل " Cities")
function cleanKey(obj, target) {
    const key = Object.keys(obj).find(k => k.trim().toLowerCase() === target.toLowerCase());
    return key ? obj[key] : null;
}

// 1. تحميل كل البيانات فور فتح الصفحة وتعبئة الاقتراحات
async function loadSuggestions() {
    const lang = document.getElementById('langSelect').value;
    const countryListEl = document.getElementById('countriesList');
    countryListEl.innerHTML = ""; // تفريغ القائمة

    for (let g of groups) {
        try {
            const response = await fetch(`${lang} group ${g}.json`);
            if (!response.ok) continue;
            const data = await response.json();
            
            data.forEach(item => {
                const cName = cleanKey(item, "Country_Name");
                if (cName) {
                    // إضافة الدولة للاقتراحات
                    let option = document.createElement('option');
                    option.value = cName;
                    countryListEl.appendChild(option);
                    
                    // تخزين البيانات في الذاكرة للبحث السريع لاحقاً
                    allData.push(item);
                }
            });
        } catch (e) { console.log("Error loading group " + g); }
    }
}

// تنفيذ التحميل عند تشغيل الصفحة أو تغيير اللغة
window.onload = loadSuggestions;
document.getElementById('langSelect').onchange = () => {
    allData = [];
    loadSuggestions();
};

// 2. تحديث قائمة المدن بناءً على الدولة المختارة
document.getElementById('countryInput').addEventListener('input', function() {
    const selectedCountry = this.value;
    const cityListEl = document.getElementById('citiesList');
    cityListEl.innerHTML = "";

    const countryObj = allData.find(item => cleanKey(item, "Country_Name") === selectedCountry);
    if (countryObj) {
        const cities = cleanKey(countryObj, "Cities");
        if (Array.isArray(cities)) {
            cities.forEach(city => {
                let option = document.createElement('option');
                option.value = cleanKey(city, "City_Name");
                cityListEl.appendChild(option);
            });
        }
    }
});

// 3. دالة البحث النهائية
document.getElementById('searchBtn').addEventListener('click', () => {
    const countryVal = document.getElementById('countryInput').value;
    const cityVal = document.getElementById('cityInput').value;
    const resultsDiv = document.getElementById('results');
    const notFound = document.getElementById('not-found');

    let foundCity = null;

    // البحث في البيانات المحملة مسبقاً
    const countryObj = allData.find(item => cleanKey(item, "Country_Name") === countryVal);
    if (countryObj) {
        const cities = cleanKey(countryObj, "Cities");
        foundCity = cities.find(c => cleanKey(c, "City_Name") === cityVal);
    }

    if (foundCity) {
        document.getElementById('cityNameDisplay').innerText = cleanKey(foundCity, "City_Name");
        document.getElementById('res-landmarks').innerText = cleanKey(foundCity, "Historical_Landmarks") || "---";
        document.getElementById('res-cuisine').innerText = cleanKey(foundCity, "Local_Cuisine") || "---";
        document.getElementById('res-activities').innerText = cleanKey(foundCity, "Tourist_Activities") || "---";
        document.getElementById('res-green').innerText = cleanKey(foundCity, "Green_Spaces") || "---";
        
        resultsDiv.classList.remove('hidden');
        notFound.classList.add('hidden');
    } else {
        resultsDiv.classList.add('hidden');
        notFound.classList.remove('hidden');
    }
});
