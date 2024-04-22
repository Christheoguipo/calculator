
class Calculator {

  constructor(prevTextElement, currentTextElement) {
    this.prevTextElement = prevTextElement;
    this.currentTextElement = currentTextElement;
    this.allClear();
  }

  allClear() {
    this.prevOperand = '';
    this.currentOperand = '';
    this.operator = undefined;
    this.equation = '';
  }

  del() {
    // Removes the last character
    this.currentOperand = this.currentOperand.toString().slice(0, this.currentOperand.length - 1);
    this.equation = '';
  }

  appendNumber(number) {
    // Allows only one '.'
    if (number === '.' && this.currentOperand.includes('.')) return;

    this.currentOperand += number;
    this.equation = '';
  }

  chooseOperator(operator) {
    if (this.currentOperand === '') {
      // Overrides the previously chosen operator
      if (this.prevOperand !== '') {
        this.operator = operator;
      }
      return;
    }

    // Computes if the previous operand is not blank and an operator is pressed
    if (this.prevOperand !== '') {
      this.compute();
    }

    this.equation = '';
    this.operator = operator;
    this.prevOperand = this.currentOperand;
    this.currentOperand = '';
  }

  chooseEquals() {
    if (this.prevOperand === '' || this.operator == null || this.currentOperand === '') return;

    // Displays the whole equation as the prev operand if equal sign is pressed
    this.equation = `${this.formatNumber(this.prevOperand)} ${this.operator} ${this.formatNumber(this.currentOperand)} =`;

    calculator.compute();
    calculator.updateDisplay();

    this.prevOperand = this.currentOperand;

    // This is to NOT append the numbers after clicking equals
    this.currentOperand = '';

  }

  compute() {
    const prev = parseFloat(this.prevOperand);
    const curr = parseFloat(this.currentOperand);
    let total;

    if (isNaN(prev) || isNaN(curr)) return;

    switch (this.operator) {
      case '/':
        total = prev / curr;
        break;

      case '*':
        total = prev * curr;
        break;

      case '+':
        total = prev + curr;
        break;

      case '-':
        total = prev - curr;
        break;

      default:
        return;
    }

    this.currentOperand = total;
    this.operator = undefined;
  }

  formatNumber(number) {

    const numberToString = number.toString();
    const wholeNumber = parseFloat(numberToString.split('.')[0]);
    const decimalNumber = numberToString.split('.')[1];
    let formattedNumber;

    if (isNaN(wholeNumber)) {
      // Returns blank if not a number
      formattedNumber = '';
    } else {
      // Formats the number
      formattedNumber = wholeNumber.toLocaleString('en-US');
    }

    if (decimalNumber != null) {
      // Displays '.' between whole number and decimal
      return `${formattedNumber}.${decimalNumber}`;
    } else {
      return formattedNumber;
    }
  }

  updateDisplay() {
    if (this.operator != null) {
      // Displays the operator beside the previous operand if operator is not blank.
      prevOperandTextElement.innerText = this.formatNumber(this.prevOperand) + ' ' + this.operator;
    } else if (this.equation !== '') {
      // Displays the whole equation as the prev operand if equal sign is pressed
      prevOperandTextElement.innerText = this.equation;
    }
    else {
      prevOperandTextElement.innerText = this.formatNumber(this.prevOperand);
    }

    currentOperandTextElement.innerText = this.formatNumber(this.currentOperand);
  }
}

const prevOperandTextElement = document.querySelector('[data-prev-operand]');
const currentOperandTextElement = document.querySelector('[data-current-operand]');
const acButton = document.querySelector('[data-ac]');
const delButton = document.querySelector('[data-del]');
const numberButtons = document.querySelectorAll('[data-number]');
const operatorButtons = document.querySelectorAll('[data-operator]');
const equalsButton = document.querySelector('[data-equals]');

const calculator = new Calculator(prevOperandTextElement, currentOperandTextElement);

numberButtons.forEach(number => {
  number.addEventListener('click', () => {
    calculator.appendNumber(number.innerText);
    calculator.updateDisplay();

  });
});

acButton.addEventListener('click', () => {
  calculator.allClear();
  calculator.updateDisplay();

});

delButton.addEventListener('click', () => {
  calculator.del();
  calculator.updateDisplay();

});

operatorButtons.forEach(operator => {
  operator.addEventListener('click', () => {
    calculator.chooseOperator(operator.innerText);
    calculator.updateDisplay();

  });
});

equalsButton.addEventListener('click', () => {
  calculator.chooseEquals();
})

