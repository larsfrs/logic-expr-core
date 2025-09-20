import { parseToTree } from 'logic-expr-core';
import { binaryToNaryTree } from 'logic-expr-core/expressionTree';
import { toExpandedDNF } from 'logic-expr-core/transformations';
import katex from 'katex';

const form = document.getElementById('expr-form') as HTMLFormElement;
const input = document.getElementById('expr-input') as HTMLInputElement;
const historyDiv = document.getElementById('history') as HTMLDivElement;
const rawOutputDiv = document.getElementById('raw-output') as HTMLDivElement;

input.addEventListener('input', (e) => {
    e.preventDefault();
    const expr = input.value.trim();
    if (!expr) {
        historyDiv.textContent = 'Please enter an expression.';
        return;
    }
    try {
        const tree = binaryToNaryTree(
            parseToTree(expr, undefined, undefined, { addAndOperator: true })
        );
        const { expressionNode, history } = toExpandedDNF(tree);

        let output = '';
        for (const version of history.versions) {
            output += version.toString(
                undefined, undefined, undefined, { latex: true }
            );

            if (version === history.versions[0]) output += ' \\; \\text{(input expression)}';

            output += ' \\\\[0.5em]'; 
        }
        output += expressionNode.toString(
            undefined, undefined, undefined, { latex: true }
        ) + ' \\; \\text{(expanded dnf)}';

        rawOutputDiv.innerHTML = output;
        historyDiv.innerHTML = katex.renderToString(output, {
            throwOnError: false,
        });

    } catch (err) {
        historyDiv.textContent = 'Error: ' + (err as Error).message;
    }
});
 