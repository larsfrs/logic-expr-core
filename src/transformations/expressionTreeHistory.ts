import { resetMarkings } from '../expressionTree/markingsUtilities.js';
import { ExpressionNode } from '../expressionTree/expressionTree.js';
import { deepCopy, treeCanonicalForm } from '../expressionTree/naryTree.js';


export class ExpressionTreeHistory {
    rootRef: ExpressionNode;
    versions: ExpressionNode[];

    constructor(initialNode: ExpressionNode) {
        this.rootRef = initialNode; // reference to the root node
        this.versions = [deepCopy(initialNode)];
    }

    // after each transformation law, reassign the root
    setRoot(newRoot: ExpressionNode) {
        this.rootRef = newRoot;
    }

    getRoot(): ExpressionNode {
        return this.rootRef;
    }

    snapshot(node: ExpressionNode) {
        if (node.root === true && node !== this.rootRef) {
            this.rootRef = node;
        }
        this.versions.push(deepCopy(this.rootRef));
        resetMarkings(this.rootRef);
    }

    getLastVersion(): ExpressionNode {
        return this.versions[this.versions.length - 1];
    }

    hasChanged(
        node1: ExpressionNode,
        node2: ExpressionNode
    ): boolean {
        return treeCanonicalForm(node1) !== treeCanonicalForm(node2);
    }
}


export function renderHistory(history: ExpressionTreeHistory) {
    return history.versions.map(version => version.toString()).join("\n");
}