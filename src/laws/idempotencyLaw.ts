import { ExpressionNode, LeafNode, UnaryOperatorNode } from '../expressionTree/expressionTree.js';
import { NaryOperatorNode, treeCanonicalForm } from '../expressionTree/naryTree.js';

/**
 * Top-down recursive implementation of the idempotency law.
 * 
 * 1. A + A = A
 * 2. A * A = A 
 */
export function idempotencyLaw(
    expressionNode: ExpressionNode
): ExpressionNode {

    if (expressionNode instanceof LeafNode) {
        return expressionNode;
    }
    
    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = idempotencyLaw(expressionNode.left);
        return expressionNode;
    }
    
    if (expressionNode instanceof NaryOperatorNode) {

        // get all unique children
        const uniqueMap = new Map<string, ExpressionNode>();
        for (const child of expressionNode.children) {
            const cf = treeCanonicalForm(child);
            if (!uniqueMap.has(cf)) {
                uniqueMap.set(cf, child);
            }
        }

        // reconstruct the node with unique children
        if (uniqueMap.size === 1) {
            return Array.from(uniqueMap.values())[0]; // return single node instead of NaryOperatorNode
        } else {
            expressionNode.children = Array.from(uniqueMap.values());
            // recursively apply idempotency law to each child, then return the modified NaryOperatorNode
            expressionNode.children = expressionNode.children.map(idempotencyLaw);
            return expressionNode;
        }
    }
}