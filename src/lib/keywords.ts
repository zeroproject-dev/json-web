import { TokenType } from "./token";

export const keywords: {
  [key: string]: TokenType;
} = {
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  null: TokenType.NULL,
};

export const unaryTokens: { [key: string]: TokenType } = {
  "{": TokenType.BRACKET_OPEN,
  "}": TokenType.BRACKET_CLOSE,
  "[": TokenType.SQUARE_BRACKET_OPEN,
  "]": TokenType.SQUARE_BRACKET_CLOSE,
  ":": TokenType.COLON,
  ",": TokenType.COMMA,
};
