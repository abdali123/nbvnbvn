const translations = {
    ar: { title: "خطط لرحلة أحلامك الآن", search: "ابحث الآن", landmark: "المعالم التاريخية", cuisine: "المطبخ المحلي", activity: "أنشطة سياحية", green: "الطبيعة والمنتزهات", notFound: "نعتذر، هذه المدينة غير متوفرة حالياً وسوف تضاف قريباً.", countryP: "اكتب الدولة هنا...", cityP: "اكتب المدينة هنا...", dir: "rtl" },
    en: { title: "Plan Your Dream Trip Now", search: "Search Now", landmark: "Historical Landmarks", cuisine: "Local Cuisine", activity: "Tourist Activities", green: "Nature & Parks", notFound: "Sorry, this city is not available yet.", countryP: "Type country...", cityP: "Type city...", dir: "ltr" }
};

// دالة ذكية للبحث عن المفاتيح التي قد تحتوي على مسافات زائدة في ملفات الـ JSON
function getValue(obj, keyName) {
    if (!obj) return "---";
    const keys = Object.keys(obj);
    const foundKey = keys.find(k => k.trim().toLowerCase() === keyName.toLowerCase());
    return foundKey ? obj[foundKey] : "---";
}

document.getElementById('searchBtn').addEventListener('click', async () => {
    const lang = document.getElementById('langSelect').value;
    const countryInput = document.getElementById('countryInput').value.trim().toLowerCase();
    const cityInput = document.getElementById('cityInput').value.trim().toLowerCase();
    
    if(!countryInput || !cityInput) return;

    const resultsDiv = document.getElementById('results');
    const notFoundDiv = document.getElementById('not-found');
    resultsDiv.classList.add('hidden');
    notFoundDiv.classList.add('hidden');

    let cityFound = null;
    // أسماء المجموعات كما هي في ملفاتك
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'i'];

    for (let g of groups) {
        try {
            // ملاحظة: تم تعديل المسار ليقرأ الملف مباشرة من الجوهر (Root)
            const fileName = `${lang} group ${g}.json`; 
            const res = await fetch(fileName);
            if (!res.ok) continue;

            const data = await res.json();
            
            for (let item of data) {
                const countryName = getValue(item, "Country_Name");
                if (countryName.toLowerCase().includes(countryInput)) {
                    const citiesList = getValue(item, "Cities");
                    if (Array.isArray(citiesList)) {
                        cityFound = citiesList.find(c => 
                            getValue(c, "City_Name").toLowerCase().includes(cityInput)
                        );
                    }
                }
                if (cityFound) break;
            }
        } catch(e) { console.error("Error loading " + g, e); }
        if (cityFound) break;
    }

    if (cityFound) {
        document.getElementById('cityNameDisplay').innerText = getValue(cityFound, "City_Name");
        document.getElementById('res-landmarks').innerText = getValue(cityFound, "Historical_Landmarks");
        document.getElementById('res-cuisine').innerText = getValue(cityFound, "Local_Cuisine");
        document.getElementById('res-activities').innerText = getValue(cityFound, "Tourist_Activities");
        document.getElementById('res-green').innerText = getValue(cityFound, "Green_Spaces");
        resultsDiv.classList.remove('hidden');
    } else {
        notFoundDiv.classList.remove('hidden');
    }
});
