import { test, expect } from "vitest";
import { JsonAST, NodeType } from "../ast";

test("Simple json one pair", () => {
  const json = '{ "name": "John" }';
  expect(JsonAST(json)).toEqual({
    type: NodeType.OBJECT,
    pairs: expect.any(Array),
  });
});
test("Should throw error trailing comma", () => {
  const json = '{ "name": "John", }';
  expect(() => JsonAST(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing comma", () => {
  const json = '{ "name": "John" "age": 30 }';
  expect(() => JsonAST(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing colon", () => {
  const json = '{ "name" "John" }';
  expect(() => JsonAST(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing value", () => {
  const json = '{ "name": }';
  expect(() => JsonAST(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing key", () => {
  const json = '{ : "John" }';
  expect(() => JsonAST(json) === undefined).toThrowError("Expected string key");
});

test("Shold throw error empty json", () => {
  const json = "";
  expect(() => JsonAST(json) === undefined).toThrowError("Empty Json");
});

test("Should throw error unexpected end of file", () => {
  const json = '{ "name": "John';
  expect(() => JsonAST(json) === undefined).toThrowError("Unterminated string");
});

// Testing arrays

test("Simple array", () => {
  const json = "[1, 2, 3]";
  expect(JsonAST(json)).toEqual({
    type: NodeType.ARRAY,
    elements: expect.any(Array),
  });
});

test("Should throw error missing comma in array", () => {
  const json = "[1 2, 3]";
  expect(() => JsonAST(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing value in array", () => {
  const json = "[1, , 3]";
  expect(() => JsonAST(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing closing bracket in array", () => {
  const json = "[1, 2, 3";
  expect(() => JsonAST(json) === undefined).toThrowError("Unexpected");
});

// Test numbers

test("Simple number", () => {
  const json = "123";
  expect(JsonAST(json)).toEqual({ type: NodeType.NUMBER, value: 123 });
});

test("Simple negative number", () => {
  const json = "-123";
  expect(JsonAST(json)).toEqual({ type: NodeType.NUMBER, value: -123 });
});

test("Simple float", () => {
  const json = "123.45";
  expect(JsonAST(json)).toEqual({ type: NodeType.NUMBER, value: 123.45 });
});

test("Simple negative float", () => {
  const json = "-123.45";
  expect(JsonAST(json)).toEqual({ type: NodeType.NUMBER, value: -123.45 });
});

test("Exponential notation", () => {
  const json = "1.23e4";
  expect(JsonAST(json)).toEqual({ type: NodeType.NUMBER, value: 12300 });
});

test("Negative exponential notation", () => {
  const json = "-1.23e4";
  expect(JsonAST(json)).toEqual({ type: NodeType.NUMBER, value: -12300 });
});

test("Exponential notation with negative exponent", () => {
  const json = "1.23e-4";
  expect(JsonAST(json)).toEqual({ type: NodeType.NUMBER, value: 0.000123 });
});

test("Negative exponential notation with negative exponent", () => {
  const json = "-123e-4";
  expect(JsonAST(json)).toEqual({ type: NodeType.NUMBER, value: -0.0123 });
});

test("Should throw error invalid number", () => {
  const json = "123.45.67";
  expect(() => JsonAST(json) === undefined).toThrowError("Unexpected");
});
