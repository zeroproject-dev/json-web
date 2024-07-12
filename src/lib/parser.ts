import {
  ArrayNode,
  ASTNode,
  BooleanNode,
  NodeType,
  NumberNode,
  ObjectNode,
  PairNode,
  StringNode,
} from "./ast";
import { Token, TokenType } from "./token";

export class Parser {
  #tokens: Token[] = [];
  #current = 0;

  constructor(tokens: Token[] = []) {
    this.#tokens = tokens;
  }

  public setTokens(tokens: Token[]) {
    this.#tokens = tokens;
    this.#current = 0;
  }

  public parse(): ASTNode {
    if (this.check(TokenType.SQUARE_BRACKET_OPEN)) return this.parseArray();
    if (this.check(TokenType.BRACKET_OPEN)) return this.parseObject();
    throw new Error(
      `Unexpected token ${this.peek().lexeme} at line ${this.peek().line}, at index ${this.#current}, token ${JSON.stringify(this.peek())}`,
    );
  }

  private parseObject(): ObjectNode {
    this.consume(TokenType.BRACKET_OPEN);

    const pairs: PairNode[] = [];

    while (!this.check(TokenType.BRACKET_CLOSE) && !this.isAtEnd()) {
      pairs.push(this.parsePairs());
      if (!this.check(TokenType.BRACKET_CLOSE)) {
        this.consume(TokenType.COMMA);
      }
    }

    this.consume(TokenType.BRACKET_CLOSE);

    return { type: NodeType.OBJECT, pairs };
  }

  private parsePairs(): PairNode {
    const key = this.parseString();
    this.consume(TokenType.COLON);
    const value = this.parseValue();

    return { type: NodeType.PAIR, key, value };
  }

  private parseString(): StringNode {
    const token = this.consume(TokenType.STRING);
    return { type: NodeType.STRING, value: token.lexeme };
  }

  private parseValue(): ASTNode {
    if (this.check(TokenType.SQUARE_BRACKET_OPEN)) return this.parseArray();
    if (this.check(TokenType.BRACKET_OPEN)) return this.parseObject();
    if (this.check(TokenType.STRING)) return this.parseString();
    if (this.check(TokenType.NUMBER)) return this.parseNumber();
    if (this.match(TokenType.NULL)) return { type: NodeType.NULL };
    if (this.match(TokenType.FALSE))
      return { type: NodeType.BOOLEAN, value: false } as BooleanNode;
    if (this.match(TokenType.TRUE))
      return { type: NodeType.BOOLEAN, value: true } as BooleanNode;
    throw new Error(
      `Unexpected token ${this.peek().lexeme} at line ${this.peek().line}`,
    );
  }

  private parseArray(): ArrayNode {
    this.consume(TokenType.SQUARE_BRACKET_OPEN);

    const objects: ASTNode[] = [];

    while (!this.check(TokenType.SQUARE_BRACKET_CLOSE) && !this.isAtEnd()) {
      objects.push(this.parseValue());
      if (!this.check(TokenType.SQUARE_BRACKET_CLOSE))
        this.consume(TokenType.COMMA);
    }

    this.consume(TokenType.SQUARE_BRACKET_CLOSE);

    return { type: NodeType.ARRAY, elements: objects };
  }

  private parseNumber(): NumberNode {
    const value = this.consume(TokenType.NUMBER);
    return { type: NodeType.NUMBER, value: Number(value) };
  }

  private consume(type: TokenType) {
    if (this.check(type)) return this.advance();
    throw new Error(
      `Unexpected token ${this.peek().lexeme} at line: ${this.peek().line} at index ${this.peek().index}`,
    );
  }

  private match(type: TokenType) {
    if (!this.check(type)) return false;
    this.advance();
    return true;
  }

  private advance() {
    if (!this.isAtEnd()) this.#current++;
    return this.#tokens[this.#current - 1];
  }

  private check(type: TokenType) {
    if (this.isAtEnd()) return false;
    return this.#tokens[this.#current].type === type;
  }

  private isAtEnd() {
    return this.#current >= this.#tokens.length;
  }

  private peek() {
    return this.#tokens[this.#current];
  }
}

export const parser = new Parser();
