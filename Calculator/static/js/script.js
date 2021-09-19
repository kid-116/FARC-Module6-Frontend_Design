console.log(`loading script...`);

const inputBox = document.getElementById('input-area');

function append(token) {
    inputBox.textContent = inputBox.textContent + token;
}

function getLastToken(token) {
    const curInput = inputBox.textContent;
    return curInput.length
        ? curInput[curInput.length - 1]
        : '\0';
}

const delButton = document.getElementById('delete');
delButton.onclick = function() {
    console.log(`removing last token`);
    const curInput = inputBox.textContent;
    if(curInput.length) {
        inputBox.textContent = curInput.substring(0, curInput.length - 1);
    }
}

const nonZeroDigitButtonIds = [
    'one',
    'two',
    'three',
    'four',
    'five',
    'six',
    'seven',
    'eight',
    'nine'
];

for(let i = 0; i < 9; i++) {
    const nonZeroDigitButton = document.getElementById(nonZeroDigitButtonIds[i]);
    console.log(nonZeroDigitButton);
    nonZeroDigitButton.onclick = function() {
        console.log(`${i + 1} clicked`);
        append(i + 1);
    }
}

function isDigit(token) {
    return token >= '0' && token <= '9';
}

const add = document.getElementById('add');
const subtract = document.getElementById('subtract');
const multiply = document.getElementById('multiply');
const divide = document.getElementById('divide');

function addOperator(op) {
    console.log(`${op} clicked`);
    if(isDigit(getLastToken())) {
        append(op);
    }
}

add.onclick = function() {
    addOperator('+')
}
subtract.onclick = function() {
    addOperator('-')
}
multiply.onclick = function() {
    addOperator('*')
}
divide.onclick = function() {
    addOperator('/')
}

const clrButton = document.getElementById('clear');
clrButton.onclick = function() {
    console.log(`clearing input`);
    inputBox.textContent = "";
}

function isOperator(token) {
    return token == '+' || token == '-' || token == '*' || token == '/';
}

const decimalButton = document.getElementById('decimal');
decimalButton.onclick = function() {
    console.log(`. clicked`);
    const curInput = inputBox.textContent;
    if(isDigit(getLastToken())) {
        var valid = true;
        for(let i = curInput.length - 1; i >= 0; i--) {
            if(isOperator(curInput[i])) {
                break;
            }
            else if(curInput[i] == '.') {
                valid = false;
                break;
            }
        }
        if(valid) {
            append('.');
        }
    }
}

const zeroButton = document.getElementById('zero');
zeroButton.onclick = function() {
    console.log(`0 clicked`);
    const lastToken = getLastToken();
    if(isDigit(lastToken) || lastToken == '.') {
        append('0');
    }
    else if(isOperator(lastToken) || lastToken == '\0') {
        append('0.');
    }
}

function precedence(p, q) {
    return !(((p == '+') || (p == '-')) && ((q == '*') || (q == '/')));
}

const calcButton = document.getElementById('calc');
calcButton.onclick = function() {
    const lastToken = getLastToken();
    if(isDigit(lastToken)) {
        console.log(`evluating expression`);
        const expression = inputBox.textContent;
        var values = [];
        var ops = [];
        var i = 0;
        while(i < expression.length) {
            // console.log(i);
            var j = i;
            while(j < expression.length && !isOperator(expression[j])) {
                ++j;
            }
            const value = parseFloat(expression.slice(i, j));
            values.push(value);
            // console.log('1');
            if(j < expression.length) {
                const op = expression[j];
                // console.log(op);
                for(let k = ops.length - 1; k >= 0 && precedence(ops[k], op); k--) {
                    // console.log(k);
                    const b = values.pop();
                    const a = values.pop();
                    console.log(`popped ${a} and ${b}`);
                    values.push(find(a, b, ops.pop()));
                }
                console.log(`pushed ${op}`);
                ops.push(op);
            }
            i = j + 1;
        }
        console.log(`${values}`);
        console.log(`${ops}`);
        while(ops.length) {
            const op = ops.pop();
            const b = values.pop();
            const a = values.pop();
            values.push(find(a, b, op));
        }
        console.log(`${values}`);
        console.log(`${ops}`);
        inputBox.textContent = values[0];
    }
}

function find(a, b, op) {
    if(op == '+') {
        return a + b;
    }
    else if(op == '-') {
        return a - b;
    }
    else if(op == '*') {
        return a * b;
    }
    else if(op == '/') {
        return a / b;
    }
}