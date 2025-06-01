function calculateFieldsFromTotal() {
    const totalInput = parseFloat(document.getElementById('totalInput').value) || 0;
    const abc = parseFloat(document.getElementById('abc').value) || 0;
    const xyz = parseFloat(document.getElementById('xyz').value) || 0;

    if (totalInput <= 0) {
      alert("Please enter a valid initial total amount.");
      return;
    }

    const internet = totalInput / 2.373;
    const serviceCharges = internet;
    const tsc = serviceCharges * 0.10;
    const vat = (internet + serviceCharges + tsc) * 0.13;

    const finalTotal = internet + serviceCharges + tsc + vat + abc + xyz;

    document.getElementById('internet').value = internet.toFixed(2);
    document.getElementById('serviceCharges').value = serviceCharges.toFixed(2);
    document.getElementById('tsc').value = tsc.toFixed(2);
    document.getElementById('vat').value = vat.toFixed(2);
    document.getElementById('finalTotal').value = finalTotal.toFixed(2);
  }