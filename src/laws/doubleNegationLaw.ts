import { ExpressionNode, UnaryOperatorNode } from '../expressionTree/expressionTree.js';
import { ExpressionTreeHistory } from '../transformations';
import { updateParentChildren } from '../laws/recursionTools.js';


/**
 * Top-down recursive application of the double negation law.
 * 
 * !!A = A
 */
export function doubleNegationLaw(
    node: ExpressionNode,
    history?: ExpressionTreeHistory,
    parent: ExpressionNode | null = null
): ExpressionNode {

    if (node instanceof UnaryOperatorNode && node.operator === '!') {
        if (node.left instanceof UnaryOperatorNode && node.left.operator === '!') {
            if (history) {
                /**
                 * The root property is not explicitly set to true here. Instead, we ensure
                 * it mirrors the root property of the top-level node. This approach allows
                 * the deMorgan function to be used flexibly, without being tightly coupled
                 * to history or root-specific properties.
                 */
                if (node.root) node.left.left.root = node.root;

                node.mark = { marked: true, type: 'Double Negation Law' };
                history.snapshot(node.left.left);
            }

            updateParentChildren(node.left.left, parent, node);
            return doubleNegationLaw(
                node.left.left,
                history,
                node
            );
        }

        node.left = doubleNegationLaw(
            node.left,
            history,
            node
        );
    }

    return node;
}

/**
 * Application of the double negation law once.
 *
 * !!A = A
 */
export function doubleNegationLawOnce(
    node: ExpressionNode,
    history?: ExpressionTreeHistory
) : ExpressionNode {

    if (node instanceof UnaryOperatorNode && node.operator === '!') {
        if (node.left instanceof UnaryOperatorNode && node.left.operator === '!') {
            if (history) {
                if (node.root) node.left.left.root = node.root;
                node.mark = { marked: true, type: 'Double Negation Law' };
                history.snapshot(node.left.left);
            }

            return node.left.left;
        }
    }
    return node;
}
