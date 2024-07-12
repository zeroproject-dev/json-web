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
