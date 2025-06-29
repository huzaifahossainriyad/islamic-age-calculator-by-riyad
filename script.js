// Chart.js instance কে গ্লোবালি রাখা হয়েছে যাতে এটি আপডেট করা যায়
let salahChart = null;

// বয়স হিসাব করার ফাংশন
function calculateAge() {
    const dobInput = document.getElementById('dob');
    const calculationType = document.getElementById('calculationType').value;
    const resultSection = document.getElementById('resultSection');
    
    // ফলাফল ক্ষেত্রগুলো পরিষ্কার করা
    document.getElementById('totalDays').innerText = '';
    document.getElementById('fajrCount').innerText = '';
    document.getElementById('dhuhrCount').innerText = '';
    document.getElementById('asrCount').innerText = '';
    document.getElementById('maghribCount').innerText = '';
    document.getElementById('ishaCount').innerText = '';
    document.getElementById('totalSalahCount').innerText = '';
    document.getElementById('kazaInfo').innerText = '';

    const dobString = dobInput.value;

    // যদি জন্ম তারিখ ইনপুট না করা হয়, তাহলে অ্যালার্ট দেখানো
    if (!dobString) {
        resultSection.innerHTML = `<p style="color: red; text-align: center;">আলহামদুলিল্লাহ! অনুগ্রহ করে আপনার জন্ম তারিখ নির্বাচন করুন।</p>`;
        resultSection.style.display = 'block'; // মেসেজটি দেখানোর জন্য
        return;
    }

    // একটি হেল্পার ফাংশন যা একটি তারিখের স্থানীয় সময় অনুযায়ী দিনের শুরু (মধ্যরাত ১২টা) সেট করে
    const getStartOfDay = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0); // সময়কে মধ্যরাতে সেট করা
        return d;
    };

    const dob = getStartOfDay(dobString); // জন্ম তারিখের মধ্যরাত
    const today = getStartOfDay(new Date()); // আজকের দিনের মধ্যরাত

    let startDate = new Date(dob); // ক্যালকুলেশনের শুরুর তারিখ (প্রাথমিকভাবে জন্ম তারিখ)
    let calculationText = "";

    // ক্যালকুলেশনের ধরন অনুযায়ী শুরু তারিখ নির্ধারণ করা
    if (calculationType === 'adultFrom10') {
        startDate.setFullYear(dob.getFullYear() + 10);
        calculationText = "১০ বছর বয়স থেকে";
    } else if (calculationType === 'adultFrom11') {
        startDate.setFullYear(dob.getFullYear() + 11);
        calculationText = "১১ বছর বয়স থেকে";
    } else if (calculationType === 'adultFrom15') {
        startDate.setFullYear(dob.getFullYear() + 15);
        calculationText = "১৫ বছর বয়স থেকে (শরীয়ত অনুযায়ী)";
    } else { // birthToNow (ডিফল্ট)
        calculationText = "জন্ম থেকে আজ পর্যন্ত";
    }

    // নিশ্চিত করা যে startDate-ও মধ্যরাতে সেট করা আছে, যদি setFullYear এর কারণে সময় পরিবর্তিত হয়
    startDate = getStartOfDay(startDate);

    // যদি শুরু তারিখ বর্তমান তারিখের পরে হয়, তাহলে এরর মেসেজ দেখানো
    if (startDate > today) {
        resultSection.innerHTML = `<p style="color: red; text-align: center;">সুবহানাল্লাহ! নির্বাচিত শুরু তারিখ বর্তমান তারিখের পরে হতে পারে না। অনুগ্রহ করে সঠিক জন্ম তারিখ এবং/অথবা ক্যালকুলেশনের ধরন নির্বাচন করুন।</p>`;
        resultSection.style.display = 'block';
        return;
    }
    
    // মোট দিনের সংখ্যা হিসাব করা
    let totalDays = 0;
    const oneDay = 1000 * 60 * 60 * 24; // একদিনের মিলিসেকেন্ড

    // তারিখগুলিকে বছরের ভিত্তিতে হিসাব করে যোগ করা হবে, যেভাবে ম্যানুয়ালি করা হয়েছে
    if (startDate.getFullYear() === today.getFullYear()) {
        totalDays = Math.round((today.getTime() - startDate.getTime()) / oneDay) + 1;
    } else {
        const startYearEnd = new Date(startDate.getFullYear(), 11, 31);
        totalDays += Math.round((startYearEnd.getTime() - startDate.getTime()) / oneDay) + 1;

        for (let year = startDate.getFullYear() + 1; year < today.getFullYear(); year++) {
            totalDays += (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
        }

        const currentYearStart = new Date(today.getFullYear(), 0, 1);
        totalDays += Math.round((today.getTime() - currentYearStart.getTime()) / oneDay) + 1;
    }


    const totalSalahCount = totalDays * 5;

    // ফলাফলগুলো HTML এলিমেন্টে প্রদর্শন করা
    document.getElementById('totalDays').innerHTML = `আপনার <strong>${calculationText}</strong> মোট পার হওয়া দিনের সংখ্যা: <strong>${totalDays}</strong> দিন।`;
    document.getElementById('fajrCount').innerHTML = `ফজরের ওয়াক্ত: <strong>${totalDays}</strong> ওয়াক্ত`;
    document.getElementById('dhuhrCount').innerHTML = `যোহরের ওয়াক্ত: <strong>${totalDays}</strong> ওয়াক্ত`;
    document.getElementById('asrCount').innerHTML = `আসরের ওয়াক্ত: <strong>${totalDays}</strong> ওয়াক্ত`;
    document.getElementById('maghribCount').innerHTML = `মাগরিবের ওয়াক্ত: <strong>${totalDays}</strong> ওয়াক্ত`;
    document.getElementById('ishaCount').innerHTML = `ইশার ওয়াক্ত: <strong>${totalDays}</strong> ওয়াক্ত`;
    document.getElementById('totalSalahCount').innerHTML = `মোট ফরয নামাজের ওয়াক্ত (আনুমানিক): <strong>${totalSalahCount}</strong> ওয়াক্ত।`;
    document.getElementById('kazaInfo').innerHTML = 'এই হিসাবটি আপনাকে আপনার কাজা নামাজের একটি আনুমানিক ধারণা দিতে সাহায্য করবে ইনশাআল্লাহ।';

    resultSection.style.display = 'block'; // ফলাফল সেকশনটি দৃশ্যমান করা

    // গ্রাফ আপডেট/তৈরি করা
    // এখানে গ্রাফকে তখনই আপডেট করা হচ্ছে যখন ক্যালকুলেশন হয়
    updateSalahChart(totalDays);
}

// ক্যালকুলেটর রিসেট করার ফাংশন
function resetCalculator() {
    document.getElementById('dob').value = '';
    document.getElementById('calculationType').value = 'birthToNow';
    document.getElementById('resultSection').style.display = 'none';
    document.getElementById('resultSection').innerHTML = '';

    // গ্রাফ রিসেট করা
    if (salahChart) {
        salahChart.destroy();
        salahChart = null;
    }
}

// সাইডবার টগল করার ফাংশন
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('is-open');
}

// বিভিন্ন সাইডবার সেকশন দেখানোর ফাংশন
function showSection(sectionId) {
    // সব কন্টেন্ট সেকশন লুকানো
    document.querySelectorAll('.sidebar-content section').forEach(section => {
        section.style.display = 'none';
    });

    // নির্বাচিত সেকশন দেখানো
    document.getElementById(sectionId).style.display = 'block';

    // সক্রিয় মেনু আইটেম আপডেট করা
    document.querySelectorAll('.sidebar-menu-item').forEach(item => {
        item.classList.remove('active');
    });
    document.querySelector(`button[onclick="showSection('${sectionId}')"]`).classList.add('active');

    // যদি গ্রাফ সেকশন হয়, তাহলে গ্রাফ রেন্ডার করা
    if (sectionId === 'graph-content') {
        // নিশ্চিত করা যে হিসাবটি আগে করা হয়েছে এবং totalDays পাওয়া গেছে
        const totalDaysText = document.getElementById('totalDays').innerText;
        if (totalDaysText) {
            const totalDaysMatch = totalDaysText.match(/মোট পার হওয়া দিনের সংখ্যা: (\d+) দিন/);
            if (totalDaysMatch && totalDaysMatch[1]) {
                const totalDays = parseInt(totalDaysMatch[1]);
                updateSalahChart(totalDays);
            }
        } else {
            // যদি কোনো হিসাব না থাকে, ০ দিন দিয়ে গ্রাফ তৈরি করুন
            updateSalahChart(0); 
            // alert('ক্যালকুলেশন করার পর গ্রাফ দেখুন ইনশাআল্লাহ।'); // চাইলে এই মেসেজটি দেখাতে পারেন
        }
    }
}

// গ্রাফ তৈরি বা আপডেট করার ফাংশন
function updateSalahChart(totalDays) {
    const ctx = document.getElementById('salahChart').getContext('2d');
    const data = [totalDays, totalDays, totalDays, totalDays, totalDays]; // ফজর, যোহর, আসর, মাগরিব, ইশা

    const chartConfig = {
        type: 'bar', // বার গ্রাফ
        data: {
            labels: ['ফজর', 'যোহর', 'আসর', 'মাগরিব', 'ইশা'],
            datasets: [{
                label: 'নামাজের ওয়াক্তের সংখ্যা',
                data: data,
                backgroundColor: [
                    'rgba(52, 152, 219, 0.8)',   // Primary Color - Fajar
                    'rgba(46, 204, 113, 0.8)',   // Secondary Color - Dhuhr
                    'rgba(243, 156, 18, 0.8)',   // Accent Color - Asr
                    'rgba(155, 89, 182, 0.8)',   // Purple - Maghrib
                    'rgba(52, 73, 94, 0.8)'      // Dark Blue - Isha
                ],
                borderColor: [
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(243, 156, 18, 1)',
                    'rgba(155, 89, 182, 1)',
                    'rgba(52, 73, 94, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false, // কন্টেইনারের আকারের সাথে মানিয়ে নিতে
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'ওয়াক্তের সংখ্যা',
                        color: '#333'
                    },
                    ticks: {
                        color: '#555'
                    }
                },
                x: {
                    title: {
                        display: true,
                        text: 'নামাজের ওয়াক্ত',
                        color: '#333'
                    },
                    ticks: {
                        color: '#555'
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // লেজেন্ড লুকানো হয়েছে
                },
                title: {
                    display: true,
                    text: 'প্রতি ওয়াক্তের নামাজের আনুমানিক সংখ্যা',
                    font: {
                        size: 16,
                        weight: 'bold'
                    },
                    color: '#333'
                }
            }
        }
    };

    if (salahChart) {
        salahChart.data = chartConfig.data;
        salahChart.options = chartConfig.options;
        salahChart.update(); // বিদ্যমান গ্রাফ আপডেট করা
    } else {
        salahChart = new Chart(ctx, chartConfig); // নতুন গ্রাফ তৈরি করা
    }
}

// পপআপ দেখানোর ফাংশন
function showPopup() {
    const infoPopup = document.getElementById('infoPopup');
    infoPopup.classList.add('is-open');
}

// পপআপ বন্ধ করার ফাংশন
function closePopup() {
    const infoPopup = document.getElementById('infoPopup');
    infoPopup.classList.remove('is-open');
}

// ওয়েবপেজ লোড হওয়ার পর ডিফল্ট সেকশনটি দেখানো
document.addEventListener('DOMContentLoaded', () => {
    // ডিফল্টভাবে 'বিস্তারিত তথ্য' সেকশনটি দেখানো হবে
    showSection('details-content');

    // এখানে একটি ইনফো আইকন যুক্ত করা যেতে পারে যা পপআপ দেখাবে
    // উদাহরণস্বরূপ:
    // document.getElementById('infoIconId').addEventListener('click', showPopup);
    // যদি আপনি এটি header এ যুক্ত করতে চান, তাহলে index.html এর header এ একটি আইকন যোগ করুন:
    // <i class="fas fa-info-circle info-icon" onclick="showPopup()"></i>
    // এবং css এ .info-icon এর জন্য স্টাইল দিন।
});
