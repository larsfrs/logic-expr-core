import { ExpressionNode } from '../expressionTree/expressionTree.js';
import { deepCopy, treeCanonicalForm } from '../expressionTree/naryTree.js';


export class ExpressionTreeHistory {
    versions: ExpressionNode[];

    constructor(initialNode: ExpressionNode) {
        this.versions = [deepCopy(initialNode)];
    }

    snapshot(node: ExpressionNode) {
        this.versions.push(deepCopy(node));
    }

    getLastVersion(): ExpressionNode {
        return this.versions[this.versions.length - 1];
    }

    hasChanged(node: ExpressionNode): boolean {
        return treeCanonicalForm(this.versions[this.versions.length - 1])
               !== treeCanonicalForm(node);
    }
}


export function renderHistory(history: ExpressionTreeHistory) {
    return history.versions.map(version => version.toString()).join("\n");
}