const tbody = document.querySelector('tbody');
const secondsInterval = 30;
const lastChangeBidIndex = 5;
let midPrices = [];

// TABLE CREATION
module.exports = function getTableRows(currencyData) {
  const midPrice = (currencyData.bestBid + currencyData.bestAsk) / 2;
  const currentTimeStamp = new Date().getTime();
  const midPriceObj = {
    value: midPrice,
    timeStamp: currentTimeStamp
  }
  midPrices.push(midPriceObj);
  const filteredMidPrices = midPrices.filter((midPrice) => Math.abs(midPrice.timeStamp - currentTimeStamp) / 1000 <= secondsInterval)
  const midPriceValues = filteredMidPrices.map((midPrice) => midPrice.value)
  const updatedCurrencyData = Object.assign({}, currencyData, { midPriceData: midPriceValues })
  const currencyValues = Object.values(updatedCurrencyData);
  let row = tbody.insertRow(-1);
  row.className = 'currency-value';
  for (i = 0; i < currencyValues.length; i++) {
    let cell = row.insertCell();
    if (i == currencyValues.length - 1) {
      Sparkline.draw(cell, currencyValues[i])
    } else {
      cell.innerHTML = currencyValues[i];
    }
  }
  midPrices = filteredMidPrices;
  sortTableData(lastChangeBidIndex);
}

// SORT TABLE
function sortTableData(idx) {
  let sortDirection = true;
  const rowsArrFromNodeList = Array.from(document.getElementsByClassName('currency-value'));
  const filteredRows = rowsArrFromNodeList.filter(item => item.style.display != 'none');

  filteredRows.sort((a, b) => {
    return parseInt(a.childNodes[idx].innerHTML) - parseInt(b.childNodes[idx].innerHTML);
  }).forEach((row) => {
    sortDirection ? tbody.insertBefore(row, tbody.childNodes[tbody.length]) : tbody.insertBefore(row, tbody.childNodes[0]);
  });
}