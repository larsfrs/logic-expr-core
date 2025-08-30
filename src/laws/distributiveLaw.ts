import { ExpressionNode, LeafNode, UnaryOperatorNode } from "../expressionTree/expressionTree.js";
import { associativityLawChildren } from "./associativityLaw.js";
import { NaryOperatorNode } from "../expressionTree/naryTree.js";


export function isNaryNode(node: ExpressionNode): node is NaryOperatorNode {
    return node instanceof NaryOperatorNode;
}

export function isNaryAndDistributable(node: ExpressionNode, op: string): node is NaryOperatorNode {
    return node instanceof NaryOperatorNode && node.operator == op;
}


export function distributiveLaw(
    expressionNode: ExpressionNode, // A * (B + C)
    distributeWithCanOp: string = '*', // *
    distributeOverCanOp: string = '+' // +
): ExpressionNode {

    if (expressionNode instanceof LeafNode) return expressionNode;

    if (expressionNode instanceof UnaryOperatorNode) {
        expressionNode.left = distributiveLaw(expressionNode.left, distributeWithCanOp, distributeOverCanOp);
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
                    const childsChildren = [...otherChildren, child];
                    const newNode = distributiveLaw(
                            new NaryOperatorNode(childsChildren, distributeWithCanOp),
                            distributeWithCanOp,
                            distributeOverCanOp
                        );
                    newChildren.push(newNode);
                }

                return new NaryOperatorNode(
                    associativityLawChildren(newChildren, distributeOverCanOp),
                    distributeOverCanOp
                );
            }
        } else {
            expressionNode.children = expressionNode.children.map(child =>
                distributiveLaw(child, distributeWithCanOp, distributeOverCanOp)
            );
        }
    }

    return expressionNode;
}