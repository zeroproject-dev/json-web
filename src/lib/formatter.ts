import {
  ArrayNode,
  ASTNode,
  BooleanNode,
  JsonAST,
  NodeType,
  NumberNode,
  ObjectNode,
  PairNode,
  StringNode,
} from "./ast";

export interface FormatOptions {
  indentSize: number;
  charIndent: string;
}

export function JsonFormat(
  jsonString: string,
  opts: FormatOptions = { indentSize: 2, charIndent: " " },
): string {
  const ast = JsonAST(jsonString);
  let indentLevel = 0;

  const indent = () => {
    return opts.charIndent.repeat(indentLevel * opts.indentSize);
  };

  const formatString = (str: StringNode): string => {
    return `"${str.value}"`;
  };

  const formatNumber = (num: NumberNode): string => {
    return num.value.toString();
  };

  const formatBoolean = (bool: BooleanNode): string => {
    return bool.value.toString();
  };

  const formatNull = () => {
    return "null";
  };

  const formatPair = ({ key, value }: PairNode) => {
    return `${indent()}${formatString(key)}: ${formatNode(value)}`;
  };

  const formatObject = ({ pairs }: ObjectNode): string => {
    if (pairs.length === 0) return "{}";
    indentLevel++;
    const ps = pairs.map((p) => formatPair(p)).join(",\n");
    indentLevel--;
    return `{\n${ps}\n${indent()}}`;
  };

  const formatArray = ({ elements }: ArrayNode): string => {
    if (elements.length === 0) return "[]";

    indentLevel++;
    const whitespace = indent();
    const es = elements.map((e) => formatNode(e)).join(",\n" + indent());
    indentLevel--;
    return `[\n${whitespace}${es}\n${indent()}]`;
  };

  const formatNode = (ast: ASTNode) => {
    switch (ast.type) {
      case NodeType.OBJECT:
        return formatObject(ast as ObjectNode);
      case NodeType.ARRAY:
        return formatArray(ast as ArrayNode);
      case NodeType.STRING:
        return formatString(ast as StringNode);
      case NodeType.NUMBER:
        return formatNumber(ast as NumberNode);
      case NodeType.BOOLEAN:
        return formatBoolean(ast as BooleanNode);
      case NodeType.NULL:
        return formatNull();
      default:
        throw new Error("Unexpected node type: " + ast.type);
    }
  };

  return formatNode(ast);
}
