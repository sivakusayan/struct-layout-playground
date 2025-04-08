type Type = PrimitiveType | PointerType | ArrayType | StructureType;
export const enum TypeKind {
    PRIMITIVE,
    POINTER,
    ARRAY,
    STRUCTURE,
}

const isValidPrimitive = (primitive: string) => {
    const validPrimitives = ['char', 'short', 'int', 'double'];
    return validPrimitives.includes(primitive);
};

export type PrimitiveType = {
    kind: TypeKind.PRIMITIVE;
    type: string;
};
type PointerType = {
    kind: TypeKind.POINTER;
    pointeeType: Type;
};
type ArrayType = {
    kind: TypeKind.ARRAY;
    length: number;
    arrayItemType: Type;
};
type StructureType = {
    kind: TypeKind.STRUCTURE;
    structure: Structure;
};
type StructureMember = {
    name: string;
    type: Type;
    alignmentOverride?: number;
};
export type Structure = {
    name: string | null;
    members: StructureMember[];
};

export const enum ParseErrorCode {
    ERROR_SYNTAX,
    ERROR_MISSING_DECLARATION,
    ERROR_NO_STRUCTURES,
    ERROR_NO_STRUCTURES_TO_ANALYZE,
    ERROR_TOO_MANY_STRUCTURES_TO_ANALYZE,
    ERROR_ANONYMOUS_STRUCTURE_MARKED_FOR_ANALYSIS,
}
export type ParseError = {
    error: ParseErrorCode;
    errorMessage: string;
    lineNumber?: number;
};
export type ParseResult = {
    structureToAnalyze: string;
    structures: Structure[];
};

export const isParseError = (object: any): object is ParseError => {
    const obj = object as ParseError;
    return obj.error !== undefined && obj.errorMessage !== undefined;
};

export const parse = (code: string): ParseResult | ParseError => {
    const lines = code.split('\n').map((line) => line.trim());
    let currentLineNumber = 0;
    const structures = [];
    const structuresMarkedForAnalysis = [];

    while (true) {
        const result = getNextStructure(lines, currentLineNumber);
        if (!result) break;
        if (isParseError(result)) return result;

        structures.push(result.structure);
        currentLineNumber = result.nextLine;
        if (result.shouldAnalyzeStructure) {
            structuresMarkedForAnalysis.push(result.structure);
        }
    }

    if (structures.length === 0) {
        return {
            error: ParseErrorCode.ERROR_NO_STRUCTURES,
            errorMessage: 'At least one structure must be present.',
        };
    }

    //    if (structuresMarkedForAnalysis.length === 0) {
    //        return {
    //            error: ParseErrorCode.ERROR_NO_STRUCTURES_TO_ANALYZE,
    //            errorMessage: 'At least one structure must be marked for analysis.',
    //        };
    //    }

    if (structuresMarkedForAnalysis.length > 1) {
        return {
            error: ParseErrorCode.ERROR_TOO_MANY_STRUCTURES_TO_ANALYZE,
            errorMessage: 'At most one structure can be marked for analysis.',
        };
    }

    //    if (!structuresMarkedForAnalysis[0].name) {
    //        return {
    //            error: ParseErrorCode.ERROR_ANONYMOUS_STRUCTURE_MARKED_FOR_ANALYSIS,
    //            errorMessage: 'Only named structures can be marked for analysis.',
    //        };
    //    }

    return {
        structureToAnalyze: '',
        structures,
    };
};

type GetNextStructureResult = {
    structure: Structure;
    shouldAnalyzeStructure: boolean;
    nextLine: number;
};
const getNextStructure = (
    lines: string[],
    lineNumber: number
): GetNextStructureResult | ParseError | null => {
    let structStartIndex = -1;
    for (let i = lineNumber; i < lines.length; i++) {
        if (lines[i].trim().startsWith('struct')) {
            structStartIndex = i;
            break;
        }
    }
    if (structStartIndex === -1) return null;

    const { tokens, tokenLineNumber } = tokenizeUntilClosingBracket(
        lines,
        structStartIndex
    );
    if (!tokens) {
        return {
            error: ParseErrorCode.ERROR_SYNTAX,
            errorMessage: 'Structure encountered with no closing bracket.',
            lineNumber: structStartIndex + 1,
        };
    }

    let i = 2;
    const structure: Structure = {
        name: null,
        members: [],
    };
    if (tokens[1] !== '{') {
        structure.name = tokens[1];
        i++;
    }
    for (; i < tokens.length - 1; ) {
        const type = tokens[i];
        if (!isValidPrimitive(type)) {
            return {
                error: ParseErrorCode.ERROR_SYNTAX,
                errorMessage: 'Invalid Type in Structure',
                lineNumber: structStartIndex,
            };
        }
        const name = tokens[i + 1].replace(';', '');
        structure.members.push({
            name,
            type: { kind: TypeKind.PRIMITIVE, type: type },
        });
        i += 2;
    }

    return {
        structure,
        shouldAnalyzeStructure: false,
        nextLine: tokenLineNumber + 1,
    };
};

const tokenizeUntilClosingBracket = (lines: string[], startingLine: number) => {
    const tokens: string[] = [];
    const currentLine = startingLine;
    for (let i = startingLine; i < lines.length; i++) {
        const lineTokens = lines[i].split(' ').map((token) => token.trim());
        tokens.push(...lineTokens);
        if (lineTokens[lineTokens.length - 1] === '}') {
            return {
                tokens,
                tokenLineNumber: currentLine,
            };
        }
    }
    return {
        tokens: null,
    };
};
