import katex from 'katex';

// @ts-ignore
import CalcWorker from './calc.worker?worker';
const worker = new CalcWorker();

const input = document.getElementById('expr-input') as HTMLInputElement;
const historyDiv = document.getElementById('history') as HTMLDivElement;
const selector = document.getElementById('method-select') as HTMLSelectElement;
const limitInput = document.getElementById('limit-input') as HTMLInputElement;
const shareBtn = document.getElementById('share-btn') as HTMLButtonElement;

const toastDiv = document.getElementById('toast') as HTMLDivElement | null;
let toastTimer: number | undefined;


/**
 * Very simple toast notification system.
 */
function showToast(message: string, kind: 'success' | 'error' = 'success') {
    if (!toastDiv) return;

    // Reset any previous timer
    if (toastTimer) window.clearTimeout(toastTimer);

    toastDiv.textContent = message;
    toastDiv.classList.remove('hidden');

    // Minimal styling via existing utility classes
    if (kind === 'success') {
        toastDiv.classList.remove('bg-red-950/80', 'border-red-700', 'text-red-200');
        toastDiv.classList.add('bg-emerald-950/80', 'border-emerald-700', 'text-emerald-200');
    } else {
        toastDiv.classList.remove('bg-emerald-950/80', 'border-emerald-700', 'text-emerald-200');
        toastDiv.classList.add('bg-red-950/80', 'border-red-700', 'text-red-200');
    }

    toastTimer = window.setTimeout(() => {
        toastDiv.classList.add('hidden');
    }, 1800);
}


/**
 * Construct a link that shares the current expression and settings.
 */
function shareCurrentExpression() {
    const expr = encodeURIComponent(input.value.trim());
    const method = encodeURIComponent(selector.value);
    const limit = encodeURIComponent(limitInput.value);

    const url = `${window.location.origin}${window.location.pathname}?expr=${expr}&method=${method}&limit=${limit}`;

    navigator.clipboard.writeText(url).then(() => {
        showToast('Link copied to clipboard!', 'success');
    }).catch(err => {
        showToast('Failed to copy link: ' + err, 'error');
    });
}

/**
 * Apply URL parameters to input fields if present.
 */
function applyUrlParams() {
    const params = new URLSearchParams(window.location.search);

    const exprParam = params.get('expr');
    if (exprParam !== null) {
        const maxLen = input.maxLength > 0 ? input.maxLength : undefined;
        input.value = maxLen ? exprParam.slice(0, maxLen) : exprParam;
    }

    const methodParam = params.get('method');
    if (methodParam) {
        const opt = Array.from(selector.options).find(o => o.value === methodParam);
        if (opt && !opt.disabled) {
            selector.value = methodParam;
        }
    }

    const limitParam = params.get('limit');
    if (limitParam) {
        const n = Number.parseInt(limitParam, 10);
        if (Number.isFinite(n) && n > 0) {
            limitInput.value = String(n);
        }
    }
}


/**
 * Start a worker to calculate the selected transformations.
 */
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


/**
 * Handle return message from worker.
 */
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


// Event listeners
input.addEventListener('input', calculateAndDisplay);
selector.addEventListener('change', calculateAndDisplay);
window.addEventListener('load', () => {
    applyUrlParams();
    calculateAndDisplay();
});
shareBtn?.addEventListener('click', (e) => {
  e.preventDefault();
  shareCurrentExpression();
});