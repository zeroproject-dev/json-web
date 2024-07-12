import { TokenType } from "./token";

export const keywords: {
  [key: string]: TokenType;
} = {
  true: TokenType.TRUE,
  false: TokenType.FALSE,
  null: TokenType.NULL,
};
