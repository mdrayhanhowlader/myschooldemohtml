// helpers
const uid = (() => {
  // small unique id for tx and apps
  return 'id' + Math.random().toString(36).slice(2, 9);
})();

// get logged user
const logged = JSON.parse(localStorage.getItem("loggedInUser") || "null");
if (!logged) {
  window.location.href = "index.html";
}
const storageKey = `student_data_${logged.id}`;

// default structure
const defaultData = {
  profile: {
    name: logged.name || '',
    phone: '',
    photo: '' // dataURL
  },
  attendance: { // month-wise percent sample
    // e.g. "2025-01": {present:20, total:22}
  },
  results: [ // each item: {year:2025, semester:1, subjects: [{name, marks, grade}], gpa}
    { year: new Date().getFullYear(), semester: 1, subjects: [{name: 'Math', marks:85, grade:'A'}, {name:'English', marks:78, grade:'B+'}], gpa: 3.8 }
  ],
  payments: [ /* {id, type:'year'|'month', months:[], extras:[], amount, trx, status:'Pending'|'Approved' } */ ],
  leaves: [ /* {id, type, from, to, reason, status:'Pending'|'Approved'|'Rejected', appliedAt } */ ]
};

// load or create
let data = JSON.parse(localStorage.getItem(storageKey) || "null");
if (!data) {
  data = JSON.parse(JSON.stringify(defaultData));
  // add sample attendance months (for current year)
  const now = new Date();
  const year = now.getFullYear();
  const sampleMonths = ['01','02','03','04','05','06','07','08','09','10','11','12'];
  sampleMonths.forEach((m, i) => {
    // random sample present/total for demo
    const total = 22;
    const present = Math.max(12, Math.min(total, 18 + (i%3)));
    data.attendance[`${year}-${m}`] = { present, total };
  });
  // sample payments: none initially
  localStorage.setItem(storageKey, JSON.stringify(data));
}

// utilities to persist
function saveData() {
  localStorage.setItem(storageKey, JSON.stringify(data));
}

// UI references
const studentNameTitle = document.getElementById("studentNameTitle");
const studentIdTitle = document.getElementById("studentIdTitle");
const phoneDisplay = document.getElementById("phoneDisplay");
const profilePhoto = document.getElementById("profilePhoto");
const profilePhotoBig = document.getElementById("profilePhotoBig");
const profileName = document.getElementById("profileName");
const profilePhone = document.getElementById("profilePhone");
const photoUpload = document.getElementById("photoUpload");

const overviewAttendance = document.getElementById("overviewAttendance");
const attendanceWarn = document.getElementById("attendanceWarn");
const overviewResult = document.getElementById("overviewResult");
const overviewFees = document.getElementById("overviewFees");

// init
function initProfileUI() {
  studentNameTitle.innerText = data.profile.name || logged.name || '';
  studentIdTitle.innerText = logged.id;
  profileName.value = data.profile.name || logged.name || '';
  profilePhone.value = data.profile.phone || '';
  phoneDisplay.innerText = profilePhone.value || '-';
  const photo = data.profile.photo || '';
  if (photo) {
    profilePhoto.src = photo;
    profilePhotoBig.src = photo;
  } else {
    // keep default
  }
}
initProfileUI();

// menu handler
document.querySelectorAll('.menu-bar a').forEach(a=>{
  a.addEventListener('click', function(ev){
    ev.preventDefault();
    const sec = a.getAttribute('data-section');
    document.querySelectorAll('.content-section').forEach(s=> s.classList.remove('active'));
    document.getElementById(sec).classList.add('active');
    // make sure to refresh content when switched
    if (sec === 'overview') renderOverview();
    if (sec === 'fees') renderPayments();
    if (sec === 'attendance') renderAttendance();
    if (sec === 'results') renderResultsFilters();
    if (sec === 'leave') renderLeaveList();
    if (sec === 'profile') initProfileUI();
  });
});

// logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("loggedInUser");
  window.location.href = "index.html";
});

// --- Attendance overview calculation + warn if <80% ---
function calcAttendancePercent() {
  // average across months of current year
  const now = new Date();
  const year = now.getFullYear();
  const keys = Object.keys(data.attendance).filter(k => k.startsWith(String(year)));
  if (!keys.length) return null;
  let totalPresent = 0, totalDays = 0;
  keys.forEach(k => { totalPresent += data.attendance[k].present; totalDays += data.attendance[k].total; });
  const percent = totalDays ? Math.round((totalPresent/totalDays)*100) : 0;
  return percent;
}
function renderOverview() {
  const percent = calcAttendancePercent();
  overviewAttendance.innerText = percent !== null ? `${percent}%` : '--';
  if (percent !== null && percent < 80) {
    attendanceWarn.style.display = 'block';
  } else attendanceWarn.style.display = 'none';

  // latest result (most recent year-sem)
  if (data.results && data.results.length) {
    const latest = data.results[0];
    overviewResult.innerText = `GPA: ${latest.gpa ?? '--'}`;
  } else {
    overviewResult.innerText = 'GPA: --';
  }

  // fees status (if any pending payments)
  const anyPending = data.payments.some(p => p.status === 'Pending');
  overviewFees.innerHTML = anyPending ? 'Status: <span style="color:#ff9800">Pending Payment</span>' : 'Status: <span style="color:green">All Clear</span>';
}

// --- Fees: months populate + render payments list ---
const months = ['January','February','March','April','May','June','July','August','September','October','November','December'];

function populateMonthsGrid(){
  const monthsGrid = document.getElementById('monthsGrid');
  monthsGrid.innerHTML = '';
  months.forEach(m => {
    const lbl = document.createElement('label');
    lbl.innerHTML = `<input type="checkbox" value="${m}"> ${m}`;
    monthsGrid.appendChild(lbl);
  });
}
populateMonthsGrid();

// toggle month chooser
document.getElementById('paymentType').addEventListener('change', (e)=>{
  const v = e.target.value;
  document.getElementById('monthChooser').classList.toggle('hidden', v !== 'month');
});

// submit payment
document.getElementById('submitPayment').addEventListener('click', ()=>{
  const type = document.getElementById('paymentType').value;
  const trx = document.getElementById('trxInput').value.trim();
  const amount = parseFloat(document.getElementById('amountInput').value) || 0;
  if (!trx) {
    setPaymentMessage('❌ Enter bKash Transaction ID', 'red');
    return;
  }
  if (amount <= 0) {
    setPaymentMessage('❌ Enter valid amount', 'red');
    return;
  }
  const extras = [];
  if (document.getElementById('feeExam').checked) extras.push('Exam');
  if (document.getElementById('feeBooks').checked) extras.push('Books');
  if (document.getElementById('feeOther').checked) extras.push('Other');

  let monthsSel = [];
  if (type === 'month') {
    document.querySelectorAll('#monthsGrid input[type="checkbox"]:checked').forEach(ch=> monthsSel.push(ch.value));
    if (!monthsSel.length) { setPaymentMessage('❌ Select at least one month', 'red'); return; }
  }

  // create payment object
  const payObj = {
    id: 'P' + Math.random().toString(36).slice(2,9),
    type,
    months: monthsSel,
    extras,
    amount,
    trx,
    status: 'Pending',
    appliedAt: (new Date()).toISOString()
  };
  data.payments.unshift(payObj);
  saveData();
  setPaymentMessage('✅ Payment submitted (Pending approval)', 'green');
  document.getElementById('trxInput').value = '';
  document.getElementById('amountInput').value = '';
  // uncheck extras and months
  document.getElementById('feeExam').checked=false;
  document.getElementById('feeBooks').checked=false;
  document.getElementById('feeOther').checked=false;
  document.querySelectorAll('#monthsGrid input[type="checkbox"]').forEach(ch=> ch.checked=false);
  renderPayments();
});

function setPaymentMessage(msg, color){
  const el = document.getElementById('paymentMessage');
  el.innerText = msg;
  el.style.color = color;
  setTimeout(()=> { el.innerText=''; }, 6000);
}

function renderPayments(){
  const tbody = document.querySelector('#paymentsTable tbody');
  tbody.innerHTML = '';
  if (!data.payments.length) {
    tbody.innerHTML = '<tr><td colspan="5">No payments yet</td></tr>';
    return;
  }
  data.payments.forEach(p=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${p.trx}</td>
      <td>${p.type}</td>
      <td>${p.months.length? p.months.join(', '): '-'}</td>
      <td>${p.amount}</td>
      <td>${p.status}</td>`;
    tbody.appendChild(tr);
  });
}

// --- Attendance section render (show monthly cards and percent) ---
function renderAttendance(){
  const grid = document.getElementById('attendanceGrid');
  grid.innerHTML = '';
  const now = new Date();
  const year = now.getFullYear();

  const keys = Object.keys(data.attendance).filter(k=> k.startsWith(String(year)));
  if (!keys.length) {
    grid.innerHTML = '<div>No attendance data</div>';
    return;
  }
  keys.forEach(k=>{
    const monthLabel = k.split('-')[1];
    const index = parseInt(monthLabel,10)-1;
    const label = months[index] || k;
    const obj = data.attendance[k];
    const percent = obj.total ? Math.round((obj.present/obj.total)*100) : 0;
    const div = document.createElement('div');
    div.className = 'att-month';
    div.innerHTML = `<strong>${label}</strong><div style="font-size:22px;margin-top:8px">${percent}%</div><div style="color:#777;margin-top:6px">${obj.present}/${obj.total} days</div>`;
    if (percent < 80) {
      div.style.border = '2px solid #D32F2F';
      div.style.boxShadow = '0 6px 18px rgba(211,47,47,0.08)';
    }
    grid.appendChild(div);
  });

  const avg = calcAttendancePercent();
  document.getElementById('attendanceNote').innerText = avg !== null ? `Average attendance this year: ${avg}%` : '';
}

// --- Results: populate year selector and show data by year+semester ---
function renderResultsFilters(){
  const selYear = document.getElementById('resultYear');
  selYear.innerHTML = '';
  // collect years from data.results
  const years = [...new Set(data.results.map(r=>r.year))];
  years.forEach(y=>{
    const opt = document.createElement('option'); opt.value = y; opt.innerText = y;
    selYear.appendChild(opt);
  });
  if (!years.length) {
    selYear.innerHTML = '<option value="">No results</option>';
    document.getElementById('resultsArea').innerHTML = '<p>No result records.</p>';
    return;
  }
  document.getElementById('loadResult').addEventListener('click', ()=>{
    const year = +document.getElementById('resultYear').value;
    const sem = +document.getElementById('resultSemester').value;
    const rec = data.results.find(r=> r.year===year && r.semester===sem);
    if (!rec) {
      document.getElementById('resultsArea').innerHTML = '<p>No record for selected year/semester.</p>';
      return;
    }
    let html = `<table class="simple-table"><thead><tr><th>Subject</th><th>Marks</th><th>Grade</th></tr></thead><tbody>`;
    rec.subjects.forEach(s=>{
      html += `<tr><td>${s.name}</td><td>${s.marks}</td><td>${s.grade}</td></tr>`;
    });
    html += `</tbody></table><p style="margin-top:10px">GPA: <strong>${rec.gpa}</strong></p>`;
    document.getElementById('resultsArea').innerHTML = html;
  });
  // auto load first option
  if (years.length) {
    document.getElementById('resultYear').value = years[0];
    document.getElementById('loadResult').click();
  }
}

// --- Leave application: submit and list ---
document.getElementById('leaveForm').addEventListener('submit', (e)=>{
  e.preventDefault();
  const type = document.getElementById('leaveType').value;
  const from = document.getElementById('leaveFrom').value;
  const to = document.getElementById('leaveTo').value;
  const reason = document.getElementById('leaveReason').value.trim();
  if (!from || !to || !reason) {
    alert('Please complete all fields');
    return;
  }
  const app = { id: 'L'+Math.random().toString(36).slice(2,8), type, from, to, reason, status: 'Pending', appliedAt: (new Date()).toISOString() };
  data.leaves.unshift(app);
  saveData();
  document.getElementById('leaveForm').reset();
  renderLeaveList();
});

// render leave list (most recent first)
function renderLeaveList(){
  const tbody = document.querySelector('#leaveTable tbody');
  tbody.innerHTML = '';
  if (!data.leaves.length) {
    tbody.innerHTML = '<tr><td colspan="5">No applications</td></tr>';
    return;
  }
  data.leaves.forEach(l=>{
    const tr = document.createElement('tr');
    tr.innerHTML = `<td>${l.type}</td><td>${l.from}</td><td>${l.to}</td><td>${l.reason}</td><td>${l.status}</td>`;
    tbody.appendChild(tr);
  });
}

// --- Profile: photo upload + phone save (name readonly) ---
photoUpload && photoUpload.addEventListener('change', (e)=>{
  const file = e.target.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = function(evt){
    const dataUrl = evt.target.result;
    profilePhoto.src = dataUrl;
    profilePhotoBig.src = dataUrl;
    data.profile.photo = dataUrl;
    saveData();
  };
  reader.readAsDataURL(file);
});

document.getElementById('saveProfile').addEventListener('click', ()=>{
  const phone = document.getElementById('profilePhone').value.trim();
  data.profile.phone = phone;
  saveData();
  phoneDisplay.innerText = phone || '-';
  document.getElementById('profileMsg').innerText = '✅ Profile updated';
  setTimeout(()=> document.getElementById('profileMsg').innerText='', 3000);
});

// initial render calls
renderOverview();
renderPayments();
renderAttendance();
renderResultsFilters();
renderLeaveList();
