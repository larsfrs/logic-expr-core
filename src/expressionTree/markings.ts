export const markingTypes = [
    'Distributive Law',
    'Idempotency Law',
    'DeMorgan\'s Law',
    'Absorption Law',
    'Identity Law',
    'Complement Law',
    'Associativity Law',
    'Commutativity Law',
    'Double Negation Law',
    'Dominant Law',
] as const;

// katex color names
export const colorGroups = [
    'lightsteelblue',
    'palegreen',
    'thistle',
    'peachpuff',
    'gray'
] as const;

/**
 * Markings are used to highlight parts of the expression tree
 * that have been modified by a transformation. They are purely for 
 * visualization purposes and not used in any logic operations.
 * A marking can be either unmarked, or marked with a type and colorGroup.
 */
export type Marking =
  | { 
        marked: false;
        type?: never;
        colorGroup?: never
    }
  | { 
        marked: true;
        type: typeof markingTypes[number];
        colorGroup: typeof colorGroups[number];
    };

export const defaultMarking: Marking = { marked: false };

