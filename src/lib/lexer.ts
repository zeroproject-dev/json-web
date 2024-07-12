import { keywords } from "./keywords";
import { Token, TokenType } from "./token";

export class Lexer {
  #data: string = "";
  #tokens: Token[] = [];

  #start = 0;
  #current = 0;
  #line = 1;

  constructor() {}

  public setData(data: string) {
    this.#data = data;
    this.#current = 0;
    this.#line = 1;
    this.#start = 0;
    this.#tokens = [];
    console.log("Data set:", this.#data);
  }

  public advance() {
    return this.#data[this.#current++];
  }

  public addToken(type: TokenType, lexeme: string) {
    const token = new Token(type, lexeme, this.#current, this.#line);
    this.#tokens.push(token);
    return token;
  }

  public nextToken(): Token | null | void {
    const c = this.advance();
    switch (c) {
      case "{":
        return this.addToken(TokenType.BRACKET_OPEN, c);
      case "}":
        return this.addToken(TokenType.BRACKET_CLOSE, c);
      case "[":
        return this.addToken(TokenType.SQUARE_BRACKET_OPEN, c);
      case "]":
        return this.addToken(TokenType.SQUARE_BRACKET_CLOSE, c);
      case ":":
        return this.addToken(TokenType.COLON, c);
      case ",":
        return this.addToken(TokenType.COMMA, c);
      case " ":
      case "\t":
      case "\r":
        break;
      case "\n":
        this.#line++;
        break;
      case '"': {
        while (this.peek() !== '"' && !this.isAtEnd()) {
          if (this.peek() === "\n") this.#line++;
          if (this.match("\\") && this.match('"')) this.advance();
          this.advance();
        }
        if (this.isAtEnd()) {
          throw new Error(
            `Unterminated string at line ${this.#line}; index ${this.#current}`,
          );
        }

        this.advance();
        const value = this.#data.substring(this.#start + 1, this.#current - 1);
        return this.addToken(TokenType.STRING, value);
      }
      default:
        if (this.isDigit(c) || c === "-") {
          this.number();
        } else if (this.isAlpha(c)) {
          this.identifier();
        } else {
          throw new Error(
            `Unexpected character ${c} at line ${this.#line}; index ${this.#current}`,
          );
        }
    }
  }

  public getTokens(): Token[] {
    while (!this.isAtEnd()) {
      this.#start = this.#current;
      this.nextToken();
    }

    return this.#tokens;
  }

  private isAtEnd() {
    return this.#current >= this.#data?.length;
  }

  private peek() {
    if (this.isAtEnd()) return "\0";
    return this.#data.charAt(this.#current);
  }

  private match(expected: string) {
    if (this.isAtEnd()) return false;
    if (this.#data.charAt(this.#current) !== expected) return false;
    this.#current++;
    return true;
  }

  private isDigit(c: string) {
    return c >= "0" && c <= "9";
  }

  private number() {
    console.log(
      "Number, current:",
      this.#current,
      "start:",
      this.#start,
      "peek:",
      this.peek(),
    );
    if (this.peek() === "-") this.advance();
    while (this.isDigit(this.peek())) this.advance();

    if (this.peek() === ".") {
      this.advance();
      while (this.isDigit(this.peek())) this.advance();

      if (this.peek() === "e" || this.peek() === "E") {
        this.advance();
        if (this.peek() === "+" || this.peek() === "-") this.advance();
        while (this.isDigit(this.peek())) this.advance();
      }
    }

    const value = this.#data.substring(this.#start, this.#current);

    return this.addToken(TokenType.NUMBER, value);
  }

  // private peekNext() {
  //   if (this.#current + 1 >= this.#data.length) return "\0";
  //   return this.#data.charAt(this.#current + 1);
  // }

  private isAlpha(c: string) {
    return (c >= "a" && c <= "z") || (c >= "A" && c <= "Z");
  }

  private identifier() {
    while (this.isAlpha(this.peek())) this.advance();

    const text: string = this.#data.substring(this.#start, this.#current);
    const tokenType: TokenType | null = keywords[text] ?? null;
    if (tokenType) {
      return this.addToken(tokenType, text);
    } else {
      throw new Error(
        `Unexpected identifier ${text} at line ${this.#line}; index ${this.#current}`,
      );
    }
  }
}

export const lexer = new Lexer();
