const translations = {
    ar: { title: "خطط لرحلة أحلامك الآن", search: "ابحث الآن", landmark: "المعالم التاريخية", cuisine: "المطبخ المحلي", activity: "أنشطة سياحية", green: "الطبيعة والمنتزهات", notFound: "نعتذر، هذه المدينة غير متوفرة حالياً وسوف تضاف قريباً.", countryP: "اكتب الدولة...", cityP: "اكتب المدينة...", dir: "rtl" },
    en: { title: "Plan Your Dream Trip Now", search: "Search Now", landmark: "Historical Landmarks", cuisine: "Local Cuisine", activity: "Tourist Activities", green: "Nature & Parks", notFound: "Sorry, this city is not available yet and will be added soon.", countryP: "Type country...", cityP: "Type city...", dir: "ltr" },
    fr: { title: "Planifiez votre voyage de rêve", search: "Rechercher", landmark: "Monuments Historiques", cuisine: "Cuisine Locale", activity: "Activités", green: "Espaces Verts", notFound: "Désolé, cette ville sera bientôt disponible.", countryP: "Pays...", cityP: "Ville...", dir: "ltr" }
    // أضف باقي اللغات بنفس الطريقة...
};

const langSelect = document.getElementById('langSelect');

langSelect.addEventListener('change', () => {
    const lang = langSelect.value;
    const t = translations[lang] || translations['en'];
    
    document.documentElement.lang = lang;
    document.documentElement.dir = t.dir;
    
    document.getElementById('ui-title').innerText = t.title;
    document.getElementById('ui-search-text').innerText = t.search;
    document.getElementById('ui-landmarks').innerText = t.landmark;
    document.getElementById('ui-cuisine').innerText = t.cuisine;
    document.getElementById('ui-activities').innerText = t.activity;
    document.getElementById('ui-green').innerText = t.green;
    document.getElementById('ui-not-found').innerText = t.notFound;
    document.getElementById('countryInput').placeholder = t.countryP;
    document.getElementById('cityInput').placeholder = t.cityP;
});

document.getElementById('searchBtn').addEventListener('click', async () => {
    const lang = langSelect.value;
    const countryQ = document.getElementById('countryInput').value.trim().toLowerCase();
    const cityQ = document.getElementById('cityInput').value.trim().toLowerCase();
    
    if(!countryQ || !cityQ) return;

    const resultsDiv = document.getElementById('results');
    const notFoundDiv = document.getElementById('not-found');
    
    resultsDiv.classList.add('hidden');
    notFoundDiv.classList.add('hidden');

    let cityData = null;
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'i'];

    for (let g of groups) {
        try {
            const res = await fetch(`data/${lang}/fr group ${g}.json`); // تأكد من مسميات المجلدات لديك
            const data = await res.json();
            
            for (let item of data) {
                if (item.Country_Name.toLowerCase().includes(countryQ)) {
                    const cities = item.Cities || item[" Cities"];
                    cityData = cities.find(c => c.City_Name.toLowerCase().includes(cityQ));
                    if (cityData) break;
                }
            }
        } catch(e) { console.log("File not found or error in group " + g); }
        if (cityData) break;
    }

    if (cityData) {
        document.getElementById('cityNameDisplay').innerText = cityData.City_Name;
        document.getElementById('res-landmarks').innerText = cityData.Historical_Landmarks;
        document.getElementById('res-cuisine').innerText = cityData.Local_Cuisine;
        document.getElementById('res-activities').innerText = cityData.Tourist_Activities || cityData[" Tourist_Activities"] || "---";
        document.getElementById('res-green').innerText = cityData.Green_Spaces;
        resultsDiv.classList.remove('hidden');
    } else {
        notFoundDiv.classList.remove('hidden');
    }
});
