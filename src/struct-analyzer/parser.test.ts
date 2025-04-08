import {
    parse,
    isParseError,
    ParseResult,
    ParseError,
    ParseErrorCode,
    TypeKind,
    PrimitiveType,
} from './parser';

test('Returns ERROR_NO_STRUCTURES when passed an empty string', () => {
    const result = parse('');
    expect(isParseError(result)).toBeTruthy();
    expect((result as ParseError).error).toEqual(
        ParseErrorCode.ERROR_NO_STRUCTURES
    );
});

test('Returns ERROR_SYNTAX when passed an invalid struct', () => {
    const result = parse(`struct {`);
    expect(isParseError(result)).toBeTruthy();
    expect((result as ParseError).error).toEqual(ParseErrorCode.ERROR_SYNTAX);
});

test('Returns ERROR_SYNTAX when passed an invalid type', () => {
    const result = parse(`
                         struct test_struct {
                             blah first;
                             double second;
                         }
                         `);
    expect(isParseError(result)).toBeTruthy();
    expect((result as ParseError).error).toEqual(ParseErrorCode.ERROR_SYNTAX);
});

test('Properly parses a simple structure', () => {
    const result = parse(`
                         struct test_struct {
                             int first;
                             double second;
                         }
                         `);
    expect(isParseError(result)).toBeFalsy();
    const parseResult = result as ParseResult;
    expect(parseResult.structures[0].name).toEqual('test_struct');
    expect(parseResult.structures[0].members[0].name).toEqual('first');
    expect(parseResult.structures[0].members[0].type.kind).toEqual(
        TypeKind.PRIMITIVE
    );
    const parsedType1 = parseResult.structures[0].members[0]
        .type as PrimitiveType;
    expect(parsedType1.type).toEqual('int');

    expect(parseResult.structures[0].members[1].name).toEqual('second');
    expect(parseResult.structures[0].members[1].type.kind).toEqual(
        TypeKind.PRIMITIVE
    );
    const parsedType2 = parseResult.structures[0].members[1]
        .type as PrimitiveType;
    expect(parsedType2.type).toEqual('double');
});
