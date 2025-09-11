import { ExpressionNode, BinaryOperatorNode, UnaryOperatorNode, LeafNode } from '../expressionTree/expressionTree.js';
import { NaryOperatorNode } from '../expressionTree/naryTree.js';
import { defaultMarking } from '../expressionTree/markings';

/**
 * Top-down recursive function to reset all markings in the expression tree.
 */
export function resetMarkings(expression: ExpressionNode): void {
    expression.mark = defaultMarking;

    if (expression instanceof LeafNode) return;

    if (expression instanceof UnaryOperatorNode) {
        resetMarkings(expression.left);
    }

    if (expression instanceof BinaryOperatorNode) {
        resetMarkings(expression.left);
        resetMarkings(expression.right);
    }

    if (expression instanceof NaryOperatorNode) {
        expression.children.forEach(child => resetMarkings(child));
    }

    return;
}