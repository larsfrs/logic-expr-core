import { parseToTree } from 'logic-expr-core';
import { binaryToNaryTree } from 'logic-expr-core/expressionTree';
import { toDNF, toExpandedDNF, toNNF } from 'logic-expr-core/transformations';

self.onmessage = (e) => {
    const { expr, method, limit } = e.data;
    try {
        const binaryTree = parseToTree(expr, undefined, undefined, { addAndOperator: true });
        const tree = binaryToNaryTree(binaryTree);

        let result, resultingForm = '';
        switch (method) {
            case 'nnf':
                result = toNNF(tree, false, limit);
                resultingForm = '(NNF)';
                break;
            case 'dnf':
                result = toDNF(tree, limit);
                resultingForm = '(DNF)';
                break;
            case 'ednf':
                result = toExpandedDNF(tree, limit);
                resultingForm = '(expanded DNF)';
                break;
            default:
                throw new Error('Method not implemented, yet.');
        }

        // Convert to string in the worker!
        const versionsLatex = result.history.versions.map(
            v => v.toString(undefined, undefined, undefined, { latex: true, darkMode: true })
        );
        const exprLatex = result.expressionNode.toString(undefined, undefined, undefined, { latex: true, darkMode: true });

        self.postMessage({
            success: true,
            result: {
                versionsLatex,
                exprLatex,
                resultingForm
            }
        });
    } catch (err) {
        self.postMessage({
            success: false,
            error: (err as Error).message
        });
    }
};