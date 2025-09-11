import { operatorEvalBoolean, booleanContext } from "../expressionTree/expressionTreeOperators.js";
import { Marking, defaultMarking } from "../expressionTree/markings.js";

const allOperators = booleanContext.operatorMetadata;

export abstract class ExpressionNode {
    mark: Marking = defaultMarking;
    root?: true; // optional property that can only be `true`

    // args optional, so that we can get default values when we omit the args in the method call
    abstract toString(
        parentPrecendce?: number,
        isRightChild?: boolean,
        sorted?: boolean,
        settings?: { latex: boolean }
    ): string;
    abstract evaluate(variables: Map<string, boolean>): boolean;
}

export class UnaryOperatorNode extends ExpressionNode {
    constructor(
        public left: ExpressionNode,
        public operator: string,
        public root?: true,
        public mark: Marking = defaultMarking
    ) {
        super();
    }

    evaluate(variables: Map<string, boolean>): boolean {
        return operatorEvalBoolean[this.operator](
            this.left.evaluate(variables)
        );
    }

    toString(
        parentPrecedence: number = 0,
        isRightChild: boolean = false,
        sorted: boolean = false,
        settings: { latex: boolean } = { latex: false }
    ): string {
        const precedence = allOperators[this.operator].precedence || 0;
        const childString = this.left.toString(precedence, false, sorted, settings);

        const opString = settings.latex && booleanContext.operatorMetadata[this.operator].canonical === 'NOT'
            ? '\\neg ' : this.operator;

        let tempString = `${opString}${childString}`;
        if (settings.latex && this.mark.marked) {
            tempString = `\\colorbox{${this.mark.colorGroup}}{\$${tempString}\$}`;
            tempString = `\\underbrace{${tempString}}_{\\text{${this.mark.type}}}`;
        }

        // for example: !!a, not !(!a)
        return precedence < parentPrecedence ? `(${tempString})` : tempString;
    }
}

export class BinaryOperatorNode extends ExpressionNode {
    constructor(
        public left: ExpressionNode,
        public right: ExpressionNode,
        public operator: string,
        public root?: true,
        public mark: Marking = defaultMarking
    ) {
        super();
    }
    evaluate(variables: Map<string, boolean>): boolean {
        return operatorEvalBoolean[this.operator](
            this.left.evaluate(variables),
            this.right.evaluate(variables)
        );
    }

    toString(
        parentPrecedence: number = 0,
        isRightChild: boolean = false,
        sorted: boolean = false,
        settings: { latex: boolean } = { latex: false }
    ): string {
        const precedence: number = allOperators[this.operator].precedence || 0;
        const associativity: string = allOperators[this.operator].associativity || 'left';

        const leftString: string = this.left.toString(precedence, false, sorted, settings);
        const rightString: string = this.right.toString(precedence, true, sorted, settings);

        const expression: string = `${leftString}${this.operator}${rightString}`;

        // examples for this: (spaces around the operator of the current node)
        // (a + b)+c => a+b+c as left associativity, no parentheses needed
        // a+(b + c) => a+(b+c) as left associativity, paraentheses needed
        const needsParentheses: boolean = (precedence < parentPrecedence) ||
            (precedence === parentPrecedence && associativity === 'left' && isRightChild) ||
            (precedence === parentPrecedence && associativity === 'right' && !isRightChild);

        return needsParentheses ? `(${expression})` : expression;
    }

}

export class LeafNode extends ExpressionNode {
    constructor(
        public value: string,
        public root?: true,
        public mark: Marking = defaultMarking
    ) {
        super();
    }

    evaluate(variables: Map<string, boolean>): boolean {
        return variables.get(this.value) ?? false; // default to false if variable not found
    }

    toString(
        parentPrecedence: number = 0,
        isRightChild: boolean = false,
        sorted: boolean = false,
        settings: { latex: boolean } = { latex: false }
    ): string {
        let returnString = this.value.toString();
        if (settings.latex && this.mark.marked) {
            returnString = `\\colorbox{${this.mark.colorGroup}}{\$${returnString}\$}`;
            returnString = `\\underbrace{${returnString}}_{\\text{${this.mark.type}}}`;
        }
        return returnString;
    }
}