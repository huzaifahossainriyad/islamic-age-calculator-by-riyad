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
        // একই বছরের মধ্যে হলে শুধু দিনের পার্থক্য
        totalDays = Math.round((today.getTime() - startDate.getTime()) / oneDay) + 1;
    } else {
        // শুরু বছরের বাকি দিন
        const startYearEnd = new Date(startDate.getFullYear(), 11, 31);
        totalDays += Math.round((startYearEnd.getTime() - startDate.getTime()) / oneDay) + 1;

        // মধ্যবর্তী পূর্ণ বছরগুলোর দিন
        for (let year = startDate.getFullYear() + 1; year < today.getFullYear(); year++) {
            totalDays += (year % 4 === 0 && (year % 100 !== 0 || year % 400 === 0)) ? 366 : 365;
        }

        // বর্তমান বছরের পার হওয়া দিন
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
}

// ক্যালকুলেটর রিসেট করার ফাংশন
function resetCalculator() {
    document.getElementById('dob').value = ''; // জন্ম তারিখ ইনপুট ফাঁকা করা
    document.getElementById('calculationType').value = 'birthToNow'; // ক্যালকুলেশন ধরন ডিফল্টে সেট করা
    document.getElementById('resultSection').style.display = 'none'; // ফলাফল সেকশন লুকানো
    document.getElementById('resultSection').innerHTML = ''; // মেসেজও পরিষ্কার করা
}

// সাইডবার টগল করার নতুন ফাংশন
function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('is-open'); // 'is-open' ক্লাস যোগ/বাদ দেওয়া
}
