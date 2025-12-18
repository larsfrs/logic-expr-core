import katex from 'katex';

// @ts-ignore
import CalcWorker from './calc.worker?worker';
const worker = new CalcWorker();

const input = document.getElementById('expr-input') as HTMLInputElement;
const historyDiv = document.getElementById('history') as HTMLDivElement;
const selector = document.getElementById('method-select') as HTMLSelectElement;
const limitInput = document.getElementById('limit-input') as HTMLInputElement;

function calculateAndDisplay() {
    const expr = input.value.trim();
    if (!expr) {
        historyDiv.textContent = 'Please enter an expression.';
        return;
    }
    historyDiv.textContent = 'Calculating...';

    worker.postMessage({
        expr,
        method: selector.value,
        limit: parseInt(limitInput.value)
    });
}

worker.onmessage = (e) => {
    if (e.data.success) {
        const { versionsLatex, exprLatex, resultingForm } = e.data.result;

        let output = '';
        for (let i = 0; i < versionsLatex.length; ++i) {
            output += versionsLatex[i];
            if (i === 0) output += ' \\; \\text{(input expression)}';
            output += ' \\\\[0.5em]';
        }
        output += exprLatex + ' \\; \\text{' + resultingForm + '}';

        historyDiv.innerHTML = katex.renderToString(output, { throwOnError: false });
    } else {
        if (e.data.error.includes('HARD_LIMIT')) {
            historyDiv.textContent = 'Hard limit reached during calculation. Try increasing the limit or simplifying the input expression.';
        } else {
            historyDiv.textContent = 'Error: ' + e.data.error;
        }
    }
};

input.addEventListener('input', calculateAndDisplay);
selector.addEventListener('change', calculateAndDisplay);
window.addEventListener('load', calculateAndDisplay);