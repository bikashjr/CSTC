window.onload = function () {
  document.getElementById('abc').addEventListener('input', calculateFieldsFromTotal);
  document.getElementById('xyz').addEventListener('input', calculateFieldsFromTotal);
  document.getElementById('initialTotal').addEventListener('input', calculateFieldsFromTotal);

  document.getElementById('dateFrom').addEventListener('input', updateDaysCount);
  document.getElementById('dateTo').addEventListener('input', updateDaysCount);
};

function calculateFieldsFromTotal() {
  const totalInput = parseFloat(document.getElementById('initialTotal').value) || 0;
  const abc = parseFloat(document.getElementById('abc').value) || 0;
  const xyz = parseFloat(document.getElementById('xyz').value) || 0;

  if (totalInput <= 0) {
    alert("Please enter a valid initial total amount.");
    return;
  }

  const internet = totalInput / 2.373;
  const serviceCharges = internet;
  const tsc = serviceCharges * 0.10;
  const mainVat = (internet + serviceCharges + tsc) * 0.13;

  const abcVat = abc * 0.13;
  const xyzVat = xyz * 0.13;

  const finalTotal = internet + serviceCharges + tsc + mainVat + (abc + abcVat) + (xyz + xyzVat);

  // Total Income (without VAT and TSC)
  const totalIncome = internet + serviceCharges + abc + xyz;

  document.getElementById('internet').value = internet.toFixed(2);
  document.getElementById('serviceCharges').value = serviceCharges.toFixed(2);
  document.getElementById('tsc').value = tsc.toFixed(2);
  document.getElementById('vat').value = mainVat.toFixed(2);
  document.getElementById('finalTotal').value = finalTotal.toFixed(2);
  document.getElementById('totalIncome').value = totalIncome.toFixed(2);

  // After updating income, update days and income per day if dates are set
  updateDaysCount();
}

function getDaysBetweenInclusive(start, end) {
  // Normalize dates to midnight to avoid timezone/time issues
  const startDate = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  const endDate = new Date(end.getFullYear(), end.getMonth(), end.getDate());

  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor((endDate - startDate) / oneDay) + 1;  // Inclusive count
}

function updateDaysCount() {
  const fromInput = document.getElementById('dateFrom');
  const toInput = document.getElementById('dateTo');
  const daysCountInput = document.getElementById('daysCount');
  const incomePerDayInput = document.getElementById('incomePerDay');
  const totalIncome = parseFloat(document.getElementById('totalIncome').value) || 0;

  const fromDate = new Date(fromInput.value);
  const toDate = new Date(toInput.value);

  if (isNaN(fromDate) || isNaN(toDate)) {
    daysCountInput.value = "";
    incomePerDayInput.value = "";
    return;
  }

  const diffDays = getDaysBetweenInclusive(fromDate, toDate);

  daysCountInput.value = diffDays;

  if (diffDays > 0) {
    const incomePerDay = totalIncome / diffDays;
    incomePerDayInput.value = incomePerDay.toFixed(2);
  } else {
    incomePerDayInput.value = "";
  }
  setFiscalYearCategory();
  calculateFiscalBreakdown();
}

function generateMonthlyReport() {
  console.log("Generating monthly report...");

  const dateFromStr = document.getElementById('dateFrom').value;
  const dateToStr = document.getElementById('dateTo').value;
  const incomePerDay = parseFloat(document.getElementById('incomePerDay').value) || 0;

  if (!dateFromStr || !dateToStr) {
    alert("Please select valid Date From and Date To");
    return;
  }

  const userFrom = new Date(dateFromStr);
  const userTo = new Date(dateToStr);

  const fiscalStart = new Date(2024, 6, 16); // July 16, 2024
  const fiscalEnd = new Date(2025, 6, 16);   // July 16, 2025

  const rangeStart = userFrom < fiscalStart ? fiscalStart : userFrom;
  const rangeEnd = userTo > fiscalEnd ? fiscalEnd : userTo;

  // if (rangeStart > rangeEnd) {
  //   alert("Selected range does not include any fiscal year days.");
  //   return;
  // }

  console.log("Range Start:", rangeStart);
  console.log("Range End:", rangeEnd);

  const tbody = document.getElementById('currentFYMonthlyBody');
  tbody.innerHTML = "";

  let current = new Date(rangeStart.getFullYear(), rangeStart.getMonth(), 1);

  while (current <= rangeEnd) {
    const monthStart = new Date(current.getFullYear(), current.getMonth(), 1);
    const monthEnd = new Date(current.getFullYear(), current.getMonth() + 1, 0);

    const start = (monthStart < rangeStart) ? rangeStart : monthStart;
    const end = (monthEnd > rangeEnd) ? rangeEnd : monthEnd;

    const days = getDaysBetweenInclusive(start, end);
    const income = days * incomePerDay;

    const monthName = start.toLocaleString('default', { month: 'long', year: 'numeric' });

    const row = `<tr>
      <td>${monthName}</td>
      <td>${days}</td>
      <td>${income.toFixed(2)}</td>
    </tr>`;

    tbody.innerHTML += row;

    current.setMonth(current.getMonth() + 1);
  }
}


function calculateFiscalBreakdown() {
  const fromStr = document.getElementById('dateFrom').value;
  const toStr = document.getElementById('dateTo').value;
  if (!fromStr || !toStr) return;

  const from = new Date(fromStr);
  const to = new Date(toStr);
  if (from > to) return;

  const fiscalStart = new Date(2024, 6, 16);
  const fiscalEnd = new Date(2025, 6, 16);

  let pastDays = 0, currentDays = 0, nextDays = 0;

  let curr = new Date(from);
  while (curr <= to) {
    const day = new Date(curr.getFullYear(), curr.getMonth(), curr.getDate());

    if (day < fiscalStart) {
      pastDays++;
    } else if (day > fiscalEnd) {
      nextDays++;
    } else {
      currentDays++;
    }

    curr.setDate(curr.getDate() + 1);
  }

  document.getElementById('pastYearDays').value = pastDays;
  document.getElementById('currentYearDays').value = currentDays;
  document.getElementById('nextYearDays').value = nextDays;
}

function setFiscalYearCategory() {
  const fromStr = document.getElementById('dateFrom').value;
  const toStr = document.getElementById('dateTo').value;
  const totalIncome = parseFloat(document.getElementById('totalIncome').value) || 0;

  if (!fromStr || !toStr || totalIncome === 0) return;

  const from = new Date(fromStr);
  const to = new Date(toStr);

  const fiscalStart = new Date(2024, 6, 16); // July 16, 2024
  const fiscalEnd = new Date(2025, 6, 16);   // July 16, 2025

  let category = "Current Fiscal Year";

  if (to < fiscalStart) {
    category = "Before Fiscal Year";
  } else if (from > fiscalEnd) {
    category = "After Fiscal Year";
  }

  // Calculate days and income
  const totalDays = getDaysBetweenInclusive(from, to);
  const incomePerDay = totalIncome / totalDays;
  const rangeIncome = incomePerDay * totalDays;

  // Update fields
  document.getElementById('fiscalCategory').value = category;
  document.getElementById('fiscalDays').value = totalDays;
  document.getElementById('fiscalIncome').value = rangeIncome.toFixed(2);
}
