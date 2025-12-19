const translations = {
    ar: { title: "خطط لرحلة أحلامك الآن", search: "ابحث الآن", landmark: "المعالم التاريخية", cuisine: "المطبخ المحلي", activity: "أنشطة سياحية", green: "الطبيعة والمنتزهات", notFound: "نعتذر، هذه المدينة غير متوفرة حالياً وسوف تضاف قريباً.", countryP: "اكتب الدولة...", cityP: "اكتب المدينة...", dir: "rtl" },
    en: { title: "Plan Your Dream Trip Now", search: "Search Now", landmark: "Historical Landmarks", cuisine: "Local Cuisine", activity: "Tourist Activities", green: "Nature & Parks", notFound: "Sorry, this city is not available yet.", countryP: "Type country...", cityP: "Type city...", dir: "ltr" },
    fr: { title: "Planifiez votre voyage", search: "Rechercher", landmark: "Monuments", cuisine: "Cuisine", activity: "Activités", green: "Espaces Verts", notFound: "Désolé, ville non disponible.", countryP: "Pays...", cityP: "Ville...", dir: "ltr" }
};

const langSelect = document.getElementById('langSelect');

// دالة البحث الذكي عن المفاتيح داخل الكائن
function getValueByKey(obj, keyName) {
    const keys = Object.keys(obj);
    const foundKey = keys.find(k => k.trim().toLowerCase() === keyName.toLowerCase());
    return foundKey ? obj[foundKey] : null;
}

document.getElementById('searchBtn').addEventListener('click', async () => {
    const lang = langSelect.value;
    const countryQ = document.getElementById('countryInput').value.trim().toLowerCase();
    const cityQ = document.getElementById('cityInput').value.trim().toLowerCase();
    
    if(!countryQ || !cityQ) {
        alert("يرجى إدخال الدولة والمدينة");
        return;
    }

    const resultsDiv = document.getElementById('results');
    const notFoundDiv = document.getElementById('not-found');
    
    resultsDiv.classList.add('hidden');
    notFoundDiv.classList.add('hidden');

    let cityFound = null;
    const groups = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'i'];

    for (let g of groups) {
        try {
            // المسار يجب أن يطابق تماماً أسماء ملفاتك على GitHub
            const fileName = `data/${lang}/${lang} group ${g}.json`;
            const res = await fetch(fileName);
            if (!res.ok) continue;

            const data = await res.json();
            
            for (let item of data) {
                const countryName = getValueByKey(item, "Country_Name");
                if (countryName && countryName.toLowerCase().includes(countryQ)) {
                    // البحث عن قائمة المدن سواء كان اسمها "Cities" أو " Cities"
                    const citiesList = getValueByKey(item, "Cities");
                    if (citiesList && Array.isArray(citiesList)) {
                        cityFound = citiesList.find(c => 
                            getValueByKey(c, "City_Name").toLowerCase().includes(cityQ)
                        );
                    }
                }
                if (cityFound) break;
            }
        } catch(e) { 
            console.error("خطأ في قراءة المجموعة " + g, e); 
        }
        if (cityFound) break;
    }

    if (cityFound) {
        document.getElementById('cityNameDisplay').innerText = getValueByKey(cityFound, "City_Name");
        document.getElementById('res-landmarks').innerText = getValueByKey(cityFound, "Historical_Landmarks") || "---";
        document.getElementById('res-cuisine').innerText = getValueByKey(cityFound, "Local_Cuisine") || "---";
        document.getElementById('res-activities').innerText = getValueByKey(cityFound, "Tourist_Activities") || "---";
        document.getElementById('res-green').innerText = getValueByKey(cityFound, "Green_Spaces") || "---";
        resultsDiv.classList.remove('hidden');
    } else {
        notFoundDiv.classList.remove('hidden');
    }
});
