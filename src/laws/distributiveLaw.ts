import { ExpressionNode, LeafNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { associativityLaw, associativityLawChildren } from "../laws/associativityLaw.js";
import { deepCopy, NaryOperatorNode } from "../expressionTree/naryTree.js";
import { ExpressionTreeHistory } from "../transformations/expressionTreeHistory.js";
import { updateParentChildren } from "../laws/recursionTools.js";


export function isNaryNode(node: ExpressionNode): node is NaryOperatorNode {
    return node instanceof NaryOperatorNode;
}

export function isNaryAndDistributable(node: ExpressionNode, op: string): node is NaryOperatorNode {
    return node instanceof NaryOperatorNode && node.operator == op;
}

/**
 * Top-down recursive application of the distributive law.
 *
 * 1. A * (B + C) => A * B + A * C
 * 2. A + (B * C) => (A + B) * (A + C) (same as 1, with roles of operators reversed)
 */
export function distributiveLaw(
    expressionNode: ExpressionNode, // A * (B + C),
    distributeWithCanOp: string = '*', // *
    distributeOverCanOp: string = '+', // +
    history?: ExpressionTreeHistory,
    /**
     * The following parameters are behind the history parameter,
     * as they are only meant to be used for the recursion, not for the initial call.
     */
    parent: ExpressionNode | null = null
): ExpressionNode {

    if (expressionNode instanceof LeafNode) return expressionNode;

    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = distributiveLaw(
            expressionNode.left,
            distributeWithCanOp,
            distributeOverCanOp,
            history,
            expressionNode
        );
        return expressionNode;
    }

    if (expressionNode instanceof NaryOperatorNode) {
        
        if (expressionNode.operator === distributeWithCanOp) {
            const distributableChild = expressionNode.children.find(child =>
                isNaryAndDistributable(child, distributeOverCanOp)
            );
            
            if (distributableChild) {
                let newChildren: ExpressionNode[] = [];
                const otherChildren = expressionNode.children.filter(child => child !== distributableChild);
                
                // iterativley combine all other children with
                // the distributable child's children
                for (const child of distributableChild.children) {
                    const childsChildren = [...otherChildren.map(deepCopy), deepCopy(child)];
                    const newNodeL = new NaryOperatorNode(childsChildren, distributeWithCanOp);
                    newChildren.push(newNodeL);
                }

                let newNode = new NaryOperatorNode(
                    associativityLawChildren(newChildren, distributeOverCanOp),
                    distributeOverCanOp
                );

                if (history) {
                    /**
                     * The root property is not explicitly set to true here. Instead, we ensure
                     * it mirrors the root property of the top-level node. This approach allows
                     * the deMorgan function to be used flexibly, without being tightly coupled
                     * to history or root-specific properties.
                     */
                    if (expressionNode.root) newNode.root = expressionNode.root;

                    expressionNode.mark = { marked: true, type: 'Distributive Law' };
                    history.snapshot(newNode);
                    
                    /**
                     * Only when we care about the transformation history, it is important to directly update
                     * the root tree with new children. 
                     */
                    updateParentChildren(newNode, parent, expressionNode);
                
                }

                return distributiveLaw(
                    newNode,
                    distributeWithCanOp,
                    distributeOverCanOp,
                    history,
                    expressionNode
                );
            }
        } else {
            expressionNode.children = expressionNode.children.map(child =>
                distributiveLaw(
                    child,
                    distributeWithCanOp,
                    distributeOverCanOp,
                    history,
                    expressionNode
                )
            );
        }

        /**
         * In this case: a+a(b+c), the associativity after the distribution, a+(ab+ac),
         * is not applied to the top level as you can see. So, we need to apply it here,
         * to get the wanted: a+ab+ac.
         */
        return associativityLaw(expressionNode);
    }
}