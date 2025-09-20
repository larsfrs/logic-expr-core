import { ExpressionTreeHistory } from '../transformations/index.js';
import { ExpressionNode, LeafNode, UnaryOperatorNode } from '../expressionTree/expressionTree.js';
import { NaryOperatorNode, treeCanonicalForm } from '../expressionTree/naryTree.js';
import { associativityLawChildren } from '../laws/associativityLaw.js';

/**
 * Top-down recursive implementation of the idempotency law.
 * 
 * 1. A + A = A
 * 2. A * A = A 
 */
export function idempotencyLaw(
    expressionNode: ExpressionNode,
    history?: ExpressionTreeHistory,
    parent: ExpressionNode | null = null
): ExpressionNode {

    if (expressionNode instanceof LeafNode) {
        return expressionNode;
    }
    
    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = idempotencyLaw(expressionNode.left, history, expressionNode);
        return expressionNode;
    }
    
    if (expressionNode instanceof NaryOperatorNode) {
        const uniqueMap = new Map<string, ExpressionNode>();
        const newChildren: ExpressionNode[] = [];

        for (const child of expressionNode.children) {
            const cf = treeCanonicalForm(child);
            if (!uniqueMap.has(cf)) {
                uniqueMap.set(cf, child);
                newChildren.push(child);
            } else {
                // duplicate found, mark it if history is provided
                if (history) {
                    uniqueMap.get(cf)!.mark = { marked: true, type: 'Idempotency Law', colorGroup: "thistle" };
                }
            }
        }

        if (history && newChildren.length < expressionNode.children.length) {
            history.snapshot(expressionNode);
        }

        if (newChildren.length === 1) {
            if (history && expressionNode.root) {
                newChildren[0].root = true;
            }
            return newChildren[0]; 
            /** 
             * we handle associativity in the parent node,
             * so in the case below.
             */
        } else {
            if (history) expressionNode.children = newChildren;
            expressionNode.children = associativityLawChildren(
                newChildren.map(child =>
                    idempotencyLaw(
                        child,
                        history,
                        expressionNode
                    )
                ),
                expressionNode.operator
            );
            return expressionNode;
        }
    }
}