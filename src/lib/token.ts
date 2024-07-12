export enum TokenType {
  BRACKET_OPEN = "BRACKET_OPEN",
  BRACKET_CLOSE = "BRACKET_CLOSE",
  SQUARE_BRACKET_OPEN = "SQUARE_BRACKET_OPEN",
  SQUARE_BRACKET_CLOSE = "SQUARE_BRACKET_CLOSE",
  COLON = "COLON",
  COMMA = "COMMA",

  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  NULL = "NULL",
  TRUE = "TRUE",
  FALSE = "FALSE",
  BACKSLASH = "BACKSLASH",
}

export class Token {
  constructor(
    public type: TokenType,
    public lexeme: string,
    public index: number,
    public line: number,
  ) {}
}
