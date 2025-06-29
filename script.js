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

    const dob = new Date(dobString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // আজকের দিনটি সঠিক করার জন্য, সময়কে শূন্য করা হয়েছে

    let startDate = new Date(dob);
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

    // যদি শুরু তারিখ বর্তমান তারিখের পরে হয়, তাহলে এরর মেসেজ দেখানো
    if (startDate > today) {
        resultSection.innerHTML = `<p style="color: red; text-align: center;">সুবহানাল্লাহ! নির্বাচিত শুরু তারিখ বর্তমান তারিখের পরে হতে পারে না। অনুগ্রহ করে সঠিক জন্ম তারিখ এবং/অথবা ক্যালকুলেশনের ধরন নির্বাচন করুন।</p>`;
        resultSection.style.display = 'block';
        return;
    }
    
    // মোট দিনের সংখ্যা হিসাব করা
    // এখানে Math.round() ব্যবহার করা হয়েছে যাতে তারিখের একদম শুরুর সময় থেকে বর্তমান তারিখের শুরুর সময় পর্যন্ত পূর্ণ দিনের সংখ্যা আসে
    const totalDays = Math.round((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));


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

// বিস্তারিত তথ্য সেকশন টoggle করার ফাংশন
function toggleDetails() {
    const detailsSection = document.getElementById('detailsSection');
    const button = document.querySelector('.toggle-details-button');
    if (detailsSection.style.display === 'none' || detailsSection.style.display === '') {
        detailsSection.style.display = 'block'; // দেখাও
        button.innerText = 'বিস্তারিত লুকান'; // বাটনের লেখা পরিবর্তন করো
        button.style.backgroundColor = '#e74c3c'; // বাটনের রঙ লাল করো
    } else {
        detailsSection.style.display = 'none'; // লুকাও
        button.innerText = 'বিস্তারিত দেখুন'; // বাটনের লেখা পরিবর্তন করো
        button.style.backgroundColor = '#2ecc71'; // বাটনের রঙ সবুজ করো
    }
}
