import { resetMarkings } from '../expressionTree/markingsUtilities.js';
import { ExpressionNode } from '../expressionTree/expressionTree.js';
import { deepCopy, treeCanonicalForm } from '../expressionTree/naryTree.js';


export class ExpressionTreeHistory {
    rootRef: ExpressionNode;
    versions: ExpressionNode[];

    // limit has to be bigger than 2
    STEP_LIMIT: number;

    constructor(
        initialNode: ExpressionNode,
        STEP_LIMIT: number = 100
    ) {
        this.rootRef = initialNode; // reference to the root node
        this.versions = [deepCopy(initialNode)];
        if (STEP_LIMIT < 0) {
            throw new Error(`ExpressionTreeHistory: STEP_LIMIT has to be at least 0, got ${STEP_LIMIT}`);
        }
        this.STEP_LIMIT = STEP_LIMIT;
    }

    getRoot(): ExpressionNode {
        return this.rootRef;
    }

    /**
     * First a copy of the current root is stored in the versions array.
     * Then all markings in the tree are reset.
     * Only then the root reference is updated, as we want to snapshot the state
     * before the root changes and the new root is assigned.
     */
    snapshot(node: ExpressionNode) {

        if (this.versions.length >= this.STEP_LIMIT) {
            throw new Error(`ExpressionTreeHistory: STEP_LIMIT of
                ${this.STEP_LIMIT} reached, cannot store more versions in history.`);
        }

        this.versions.push(deepCopy(this.rootRef));
        resetMarkings(this.rootRef);
        if (node.root === true && node !== this.rootRef) {
            this.rootRef = node;
        }
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