// 1. نصوص الواجهة بجميع اللغات
const translations = {
    ar: { title: "أين تود الذهاب؟", search: "بحث", landmark: "المعالم التاريخية", cuisine: "المطبخ المحلي", activity: "الأنشطة", green: "مساحات خضراء", notFound: "نحن نتأسف، هذه المدينة ستتوفر معلوماتها قريباً.", dir: "rtl" },
    en: { title: "Where do you want to go?", search: "Search", landmark: "Historical Landmarks", cuisine: "Local Cuisine", activity: "Activities", green: "Green Spaces", notFound: "Sorry, info for this city will be available soon.", dir: "ltr" },
    fr: { title: "Où voulez-vous aller?", search: "Chercher", landmark: "Monuments", cuisine: "Cuisine Locale", activity: "Activités", green: "Espaces Verts", notFound: "Désolé, cette ville sera bientôt disponible.", dir: "ltr" }
    // يمكنك إضافة باقي الـ 8 لغات هنا بنفس النمط
};

// 2. المتغيرات الأساسية
const langSelect = document.getElementById('langSelect');
const searchBtn = document.getElementById('searchBtn');

// 3. دالة تغيير اللغة
langSelect.addEventListener('change', (e) => {
    const lang = e.target.value;
    const t = translations[lang] || translations['en'];
    
    document.body.dir = t.dir;
    document.getElementById('ui-title').innerText = t.title;
    document.getElementById('ui-search-text').innerText = t.search;
    document.getElementById('ui-landmarks').innerText = t.landmark;
    document.getElementById('ui-cuisine').innerText = t.cuisine;
    document.getElementById('ui-activities').innerText = t.activity;
    document.getElementById('ui-green').innerText = t.green;
    document.getElementById('ui-not-found').innerText = t.notFound;
});

// 4. دالة البحث في ملفات الـ JSON
searchBtn.addEventListener('click', async () => {
    const lang = langSelect.value;
    const countryQuery = document.getElementById('countryInput').value.trim();
    const cityQuery = document.getElementById('cityInput').value.trim();
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'i'];
    
    let cityFound = null;

    // إخفاء النتائج السابقة
    document.getElementById('results').classList.add('hidden');
    document.getElementById('not-found').classList.add('hidden');

    // البحث عبر المجموعات
    for (let group of groups) {
        try {
            // ملاحظة: تأكد من أن مسار الملفات صحيح على الـ GitHub الخاص بك
            const response = await fetch(`data/${lang}/group ${group}.json`);
            const data = await response.json();

            for (let country of data) {
                // التحقق من اسم الدولة (تجاهل حالة الأحرف)
                if (country.Country_Name.toLowerCase().includes(countryQuery.toLowerCase())) {
                    // التحقق من اسم المدينة
                    // استعملنا " Cities" أو "Cities" لأنك ذكرت وجود مسافات أحياناً
                    const citiesList = country[" Cities"] || country["Cities"];
                    cityFound = citiesList.find(c => c.City_Name.toLowerCase().includes(cityQuery.toLowerCase()));
                    if (cityFound) break;
                }
            }
        } catch (err) { console.error("Error loading file:", group); }
        if (cityFound) break;
    }

    if (cityFound) {
        displayResults(cityFound);
    } else {
        document.getElementById('not-found').classList.remove('hidden');
    }
});

function displayResults(city) {
    document.getElementById('results').classList.remove('hidden');
    document.getElementById('cityNameDisplay').innerText = city.City_Name;
    document.getElementById('res-landmarks').innerText = city.Historical_Landmarks;
    document.getElementById('res-cuisine').innerText = city.Local_Cuisine;
    document.getElementById('res-activities').innerText = city.Tourist_Activities || city[" Tourist_Activities"] || "---";
    document.getElementById('res-green').innerText = city.Green_Spaces;
}