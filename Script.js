let calculatorInput = document.getElementById("calculatorInput");
let operators = ["+", "-", "*", "/", ".", "%"];

function scrollToRight() {
  calculatorInput.scrollLeft = calculatorInput.scrollWidth;
}


function appendValue(value) {
  let calculatorValue = calculatorInput.value;
  let lastChar = calculatorValue.slice(-1);

  // ❌ Block operator at start
  if (operators.includes(value) && calculatorValue === "") return;

  // 🔁 Replace operator if last char is already an operator
  if (operators.includes(value) && operators.includes(lastChar)) {
    calculatorInput.value = calculatorValue.slice(0, -1) + value;
    adjustFontSize();
    scrollToRight();
    return;
  }

  // Get current number after last operator
  let parts = calculatorValue.split(/[+\-*/%]/);
  let currentNumber = parts[parts.length - 1];

  // ✅ Replace 0 with new number
  if (currentNumber === "0" && value !== "0" && !operators.includes(value)) {
    calculatorInput.value = calculatorValue.slice(0, -1) + value;
    scrollToRight();
    adjustFontSize();
    return;
  }

  // ❌ Prevent multiple leading zeros (000 or 2+000)
  if (value === "0" && currentNumber === "0") return;

  calculatorValue += value;

  // 🔹 Format only the last number
  let lastOpIndex = -1;
  for (let op of operators) {
    let i = calculatorValue.lastIndexOf(op);
    if (i > lastOpIndex) lastOpIndex = i;
  }

  if (lastOpIndex === -1) {
    calculatorInput.value = formatNumber(calculatorValue);
  } else {
    let before = calculatorValue.slice(0, lastOpIndex + 1);
    let number = calculatorValue.slice(lastOpIndex + 1);
    calculatorInput.value = before + formatNumber(number);
  }

  scrollToRight();
  adjustFontSize();
}

function clearDisplay() {
  calculatorInput.value = "";
}

function deleteLast() {
  calculatorInput.value = calculatorInput.value.slice(0, -1);
  
  setTimeout(() => {
    adjustFontSize(); // adjustFontSize() already handles shrinking
  }, 150);

   scrollToRight();
}

function calculate() {
  let calculatorValue = calculatorInput.value;

  if (operators.includes(calculatorValue.slice(-1))) return;

  // Remove commas before evaluating
  let expression = calculatorValue.replace(/,/g, "");
  expression = expression.replace(/%/g, "/100"); // optional: percent

  try {
    let result = eval(expression);
    if (result === undefined || isNaN(result)) return;

    // Format result with commas
    calculatorInput.value = formatNumber(result.toString());
    scrollToRight();
    adjustFontSize();
  } catch {
    calculatorInput.value = "Syntax Error";
  }
}


function adjustFontSize() {
  let length = calculatorInput.value.length;

  if (length <= 12) {
    calculatorInput.style.fontSize = "50px";
  } else if (length <= 13) {
    calculatorInput.style.fontSize = "48px";
  } else if(length <= 17){
    calculatorInput.style.fontSize = "38px";
  }else {
    calculatorInput.style.fontSize = "33px"; // for very long numbers
  }
}


function formatNumber(value) {
  // remove any previous commas
  value = value.replace(/,/g, "");

  // split decimal part
  let parts = value.split(".");
  // add comma every 3 digits from right
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

  return parts.join(".");
}
