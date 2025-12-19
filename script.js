const translations = {
    ar: { title: "خطط لرحلة أحلامك الآن", search: "ابحث الآن", landmark: "المعالم التاريخية", cuisine: "المطبخ المحلي", activity: "أنشطة سياحية", green: "الطبيعة والمنتزهات", notFound: "نعتذر، هذه المدينة غير متوفرة حالياً وسوف تضاف قريباً.", countryP: "اكتب الدولة هنا...", cityP: "اكتب المدينة هنا...", dir: "rtl" },
    en: { title: "Plan Your Dream Trip Now", search: "Search Now", landmark: "Historical Landmarks", cuisine: "Local Cuisine", activity: "Tourist Activities", green: "Nature & Parks", notFound: "Sorry, this city is not available yet.", countryP: "Type country...", cityP: "Type city...", dir: "ltr" }
};

// دالة قوية جداً لجلب القيم حتى لو كانت المفاتيح تحتوي على مسافات أو رموز غريبة
function getDeepValue(obj, keyName) {
    if (!obj) return "غير متوفر";
    const keys = Object.keys(obj);
    // البحث عن المفتاح بعد حذف المسافات منه ومن الكلمة المستهدفة
    const actualKey = keys.find(k => k.replace(/\s+/g, '').toLowerCase() === keyName.replace(/\s+/g, '').toLowerCase());
    return actualKey ? obj[actualKey] : "غير متوفر";
}

document.getElementById('searchBtn').addEventListener('click', async () => {
    const lang = document.getElementById('langSelect').value;
    const countryInput = document.getElementById('countryInput').value.trim().toLowerCase();
    const cityInput = document.getElementById('cityInput').value.trim().toLowerCase();
    
    if(!countryInput || !cityInput) {
        alert("يرجى إدخال اسم الدولة والمدينة");
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
            // محاولة جلب الملف من المسار الحالي
            const fileName = `${lang} group ${g}.json`;
            const response = await fetch(fileName);
            
            if (!response.ok) continue;

            const data = await response.json();
            
            for (let item of data) {
                const countryName = getDeepValue(item, "Country_Name").toString().toLowerCase();
                
                if (countryName.includes(countryInput)) {
                    // البحث داخل قائمة المدن (التي قد تسمى " Cities" أو "Cities")
                    const citiesList = getDeepValue(item, "Cities");
                    if (Array.isArray(citiesList)) {
                        cityFound = citiesList.find(c => {
                            const cityName = getDeepValue(c, "City_Name").toString().toLowerCase();
                            return cityName.includes(cityInput);
                        });
                    }
                }
                if (cityFound) break;
            }
        } catch(e) { 
            console.error("فشل في تحميل المجموعة " + g, e); 
        }
        if (cityFound) break;
    }

    if (cityFound) {
        document.getElementById('cityNameDisplay').innerText = getDeepValue(cityFound, "City_Name");
        document.getElementById('res-landmarks').innerText = getDeepValue(cityFound, "Historical_Landmarks");
        document.getElementById('res-cuisine').innerText = getDeepValue(cityFound, "Local_Cuisine");
        document.getElementById('res-activities').innerText = getDeepValue(cityFound, "Tourist_Activities");
        document.getElementById('res-green').innerText = getDeepValue(cityFound, "Green_Spaces");
        resultsDiv.classList.remove('hidden');
    } else {
        notFoundDiv.classList.remove('hidden');
    }
});
