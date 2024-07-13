import { keywords, unaryTokens } from "./keywords";
import { Token, TokenType } from "./token";

export enum NodeType {
  OBJECT = "OBJECT",
  ARRAY = "ARRAY",
  PAIR = "PAIR",
  STRING = "STRING",
  NUMBER = "NUMBER",
  BOOLEAN = "BOOLEAN",
  NULL = "NULL",
}

export interface ASTNode {
  type: NodeType;
}

export interface ObjectNode extends ASTNode {
  type: NodeType.OBJECT;
  pairs: PairNode[];
}

export interface PairNode extends ASTNode {
  type: NodeType.PAIR;
  key: StringNode;
  value: ASTNode;
}

export interface ArrayNode extends ASTNode {
  type: NodeType.ARRAY;
  elements: ASTNode[];
}

export interface StringNode extends ASTNode {
  type: NodeType.STRING;
  value: string;
}

export interface NumberNode extends ASTNode {
  type: NodeType.NUMBER;
  value: number;
}

export interface BooleanNode extends ASTNode {
  type: NodeType.BOOLEAN;
  value: boolean;
}

export interface NullNode extends ASTNode {
  type: NodeType.NULL;
}

function getErrorMessage(token: Token | null): string {
  return `Unexpected token ${token?.lexeme} at line: ${token?.line} at column ${Math.floor((token?.index ?? 1) / (token?.line ?? 1) + 1)}, index ${token?.index}`;
}

export function Json(jsonString: string) {
  let start = 0;
  let current = 0;
  let line = 1;
  const data = jsonString;

  const advance = () => (start = ++current);
  const consumeNumber = () => {
    while (data[current] >= "0" && data[current] <= "9") current++;
  };

  const getNextToken = (): Token | null => {
    while (current < data.length) {
      const c = data[start];
      let type: TokenType;
      switch (c) {
        case " ":
        case "\t":
        case "\r":
        case "\n":
          if (c === "\n") line++;
          advance();
          continue;
        case '"': {
          advance();
          while (data[current] !== '"' && current < data.length) {
            if (data[current] === "\n") line++;
            else if (data[current] === "\\" && data[current + 1] === '"')
              current++;
            current++;
          }

          if (current >= data.length) {
            throw new Error(
              `Unterminated string at line ${line}; index ${current}`,
            );
          }

          const value = data.substring(start, current);
          const token = new Token(TokenType.STRING, value, start - 1, line);
          start = ++current;
          return token;
        }
        default:
          if (unaryTokens[c]) {
            type = unaryTokens[c];
            break;
          } else if ((c >= "0" && c <= "9") || c === "-") {
            if (c === "-") current++;
            consumeNumber();

            if (data[current] === ".") {
              current++;
              consumeNumber();
              if (data[current] === "e" || data[current] === "E") {
                current++;
                if (data[current] === "+" || data[current] === "-") current++;
                consumeNumber();
              }
            } else if (data[current] === "e" || data[current] === "E") {
              current++;
              if (data[current] === "+" || data[current] === "-") current++;
              consumeNumber();
            }

            if (
              data[current] !== "\n" &&
              data[current] !== "" &&
              data[current] !== undefined &&
              data[current] !== " " &&
              data[current] !== "," &&
              data[current] !== "}" &&
              data[current] !== "]"
            ) {
              throw new Error(
                `Unexpected character ${data[current]} at line ${line}; index ${current}`,
              );
            }

            const value = data.substring(start, current);
            const token = new Token(TokenType.NUMBER, value, start, line);
            start = current;
            return token;
          } else if ((c >= "a" && c <= "z") || (c >= "A" && c <= "Z")) {
            while (
              (data[current] >= "a" && data[current] <= "z") ||
              (data[current] >= "A" && data[current] <= "Z")
            )
              current++;

            const text: string = data.substring(start, current);

            const tokenType: TokenType | null = keywords[text] ?? null;
            if (tokenType) {
              const token = new Token(tokenType, text, start, line);
              start = current;
              return token;
            } else {
              throw new Error(
                `Unexpected identifier ${text} at line ${line}; index ${current}`,
              );
            }
          } else {
            throw new Error(
              `Unexpected character ${c} at line ${line}; index ${current}`,
            );
          }
      }

      const value = data.substring(start, current + 1);
      const token = new Token(type, value, start, line);
      advance();
      return token;
    }

    return null;
  };

  const consume = (type: TokenType): Token | null => {
    const token = getNextToken();
    if (token?.type === type) return token;
    throw new Error(getErrorMessage(token));
  };

  const parseValue = (token: Token): ASTNode => {
    if (!token) throw new Error("Unexpected end of file");

    if (token.type === TokenType.NUMBER)
      return {
        type: NodeType.NUMBER,
        value: Number(token.lexeme),
      } as NumberNode;
    if (token.type === TokenType.STRING)
      return { type: NodeType.STRING, value: token.lexeme } as StringNode;
    if (token.type === TokenType.TRUE)
      return { type: NodeType.BOOLEAN, value: true } as BooleanNode;
    if (token.type === TokenType.FALSE)
      return { type: NodeType.BOOLEAN, value: false } as BooleanNode;
    if (token.type === TokenType.NULL) return { type: NodeType.NULL };
    if (token.type === TokenType.SQUARE_BRACKET_OPEN) return parseArray();
    if (token.type === TokenType.BRACKET_OPEN) return parseObject();
    throw new Error(getErrorMessage(token));
  };

  const parseObject = (): ObjectNode => {
    const pairs: PairNode[] = [];
    let token = getNextToken();

    while (token?.type !== TokenType.BRACKET_CLOSE && token) {
      if (token.type !== TokenType.STRING)
        throw new Error("Expected string key");
      const key: StringNode = { type: NodeType.STRING, value: token.lexeme };
      consume(TokenType.COLON);
      const valToken = getNextToken();
      if (!valToken) throw new Error("Unexpected end of file");
      const value = parseValue(valToken);
      pairs.push({ type: NodeType.PAIR, key, value });
      token = getNextToken();
      if (token?.type === TokenType.COMMA) {
        token = getNextToken();
        if (token?.type === TokenType.BRACKET_CLOSE)
          throw new Error(getErrorMessage(token));
      } else if (token?.type !== TokenType.BRACKET_CLOSE) {
        throw new Error(getErrorMessage(token));
      }
    }

    return { type: NodeType.OBJECT, pairs };
  };

  const parseArray = (): ArrayNode => {
    const elements: ASTNode[] = [];
    let token = getNextToken();
    while (token?.type !== TokenType.SQUARE_BRACKET_CLOSE && token) {
      elements.push(parseValue(token));
      token = getNextToken();
      if (token?.type === TokenType.COMMA) {
        token = getNextToken();
        if (token?.type === TokenType.SQUARE_BRACKET_CLOSE)
          throw new Error(getErrorMessage(token));
      } else if (token?.type !== TokenType.SQUARE_BRACKET_CLOSE) {
        throw new Error(getErrorMessage(token));
      }
    }
    return { type: NodeType.ARRAY, elements };
  };

  const firstToken = getNextToken();
  if (!firstToken) throw new Error("Empty Json");

  return parseValue(firstToken);
}
