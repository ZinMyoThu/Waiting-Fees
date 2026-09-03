let timerInterval;
let isTracking = false;
let virtualStartTime;

window.onload = () => {
    // အစမှာ End Time ကို လက်ရှိအချိန်ပြထားမယ်
    const now = new Date();
    document.getElementById('manualEndTime').value = formatToHHMM(now);
};

function formatToHHMM(date) {
    return date.getHours().toString().padStart(2, '0') + ":" +
        date.getMinutes().toString().padStart(2, '0');
}

function toggleTracker() {
    const startInput = document.getElementById('manualStartTime');
    const now = new Date();
    
    if (!isTracking) {
        // Start Tracking Logic
        if (!startInput.value) {
            // အချိန်မရိုက်ထားရင် အခုအချိန်ကနေ စမယ် (စက္ကန့်ကို ၀ ညှိမယ်)
            const sDate = new Date();
            sDate.setSeconds(0, 0);
            startInput.value = formatToHHMM(sDate);
            virtualStartTime = sDate;
        } else {
            // Manual ရိုက်ထားရင် အဲ့ဒီအချိန်ကိုယူမယ်
            const [h, m] = startInput.value.split(':');
            virtualStartTime = new Date();
            virtualStartTime.setHours(h, m, 0, 0);
            if (virtualStartTime > now) virtualStartTime.setDate(virtualStartTime.getDate() - 1);
        }
        
        isTracking = true;
        document.getElementById('mainBtn').innerText = "Stop & Calculate";
        document.getElementById('mainBtn').className = "btn-stop";
        document.getElementById('resultCard').style.display = 'none';
        
        timerInterval = setInterval(updateDisplay, 1000);
        updateDisplay();
    } else {
        stopTracker();
    }
}

// Manual အချိန်ပြင်လိုက်ရင် Timer ကို ချက်ချင်း Update လုပ်ပေးဖို့
function manualUpdate() {
    if (isTracking) {
        const startInput = document.getElementById('manualStartTime');
        const [h, m] = startInput.value.split(':');
        virtualStartTime = new Date();
        virtualStartTime.setHours(h, m, 0, 0);
        if (virtualStartTime > new Date()) virtualStartTime.setDate(virtualStartTime.getDate() - 1);
        updateDisplay();
    }
}

function updateDisplay() {
    const now = new Date();
    const diffMs = now - virtualStartTime;
    
    if (diffMs < 0) {
        document.getElementById('display').innerText = "00:00:00";
    } else {
        const h = String(Math.floor(diffMs / 3600000)).padStart(2, '0');
        const m = String(Math.floor((diffMs % 3600000) / 60000)).padStart(2, '0');
        const s = String(Math.floor((diffMs % 60000) / 1000)).padStart(2, '0');
        document.getElementById('display').innerText = `${h}:${m}:${s}`;
    }
    
    // Timer ပြေးနေတုန်း End Time ကို auto လိုက်ပြင်ပေးမယ်
    document.getElementById('manualEndTime').value = formatToHHMM(now);
}

function stopTracker() {
    clearInterval(timerInterval);
    isTracking = false;
    
    // တွက်ချက်မှုအတွက် Input ထဲက နာရီ/မိနစ် အတိအကျကိုပဲ ယူမယ်
    const startVal = document.getElementById('manualStartTime').value;
    const endVal = document.getElementById('manualEndTime').value;
    
    const [sh, sm] = startVal.split(':');
    const [eh, em] = endVal.split(':');
    
    let finalStart = new Date();
    finalStart.setHours(sh, sm, 0, 0);
    
    let finalEnd = new Date();
    finalEnd.setHours(eh, em, 0, 0);
    
    if (finalEnd < finalStart) finalEnd.setDate(finalEnd.getDate() + 1);
    
    const diffMs = finalEnd - finalStart;
    const totalMins = diffMs / 60000;
    
    let cost = 0;
    let chargedUnits = 0;
    if (totalMins > 5) {
        chargedUnits = Math.ceil((totalMins - 5) / 5);
        cost = chargedUnits * 500;
    }
    
    // UI Update
    document.getElementById('totalCost').innerText = cost.toLocaleString() + " ကျပ်";
    document.getElementById('fullDuration').innerText = `${Math.floor(totalMins)} မိနစ်`;
    
    const fEnd = new Date(finalStart.getTime() + 5 * 60000);
    const fmt = (d) => d.toTimeString().split(' ')[0].substring(0, 5);
    document.getElementById('freeRange').innerText = `${fmt(finalStart)} - ${fmt(fEnd)}`;
    
    if (totalMins > 5) {
        document.getElementById('paidRange').innerText = `${fmt(fEnd)} - ${fmt(finalEnd)}`;
        document.getElementById('chargedMins').innerText = (chargedUnits * 5) + " မိနစ်စာ";
    } else {
        document.getElementById('paidRange').innerText = "မရှိပါ";
        document.getElementById('chargedMins').innerText = "၀ မိနစ်";
    }
    
    document.getElementById('resultCard').style.display = 'block';
    document.getElementById('mainBtn').innerText = "Restart Tracking";
    document.getElementById('mainBtn').className = "btn-start";
}

function toggleDetail() {
    const box = document.getElementById('detailBox');
    const isHidden = box.style.display === "none" || box.style.display === "";
    box.style.display = isHidden ? "block" : "none";
    document.getElementById('toggleBtn').innerText = isHidden ? "Hide Detail" : "See Detail";
}

function resetAll() { location.reload(); }