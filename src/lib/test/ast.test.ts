import { test, expect } from "vitest";
import { Json, NodeType } from "../ast";

test("Simple json one pair", () => {
  const json = '{ "name": "John" }';
  expect(Json(json)).toEqual({
    type: NodeType.OBJECT,
    pairs: expect.any(Array),
  });
});
test("Should throw error trailing comma", () => {
  const json = '{ "name": "John", }';
  expect(() => Json(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing comma", () => {
  const json = '{ "name": "John" "age": 30 }';
  expect(() => Json(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing colon", () => {
  const json = '{ "name" "John" }';
  expect(() => Json(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing value", () => {
  const json = '{ "name": }';
  expect(() => Json(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing key", () => {
  const json = '{ : "John" }';
  expect(() => Json(json) === undefined).toThrowError("Expected string key");
});

test("Shold throw error empty json", () => {
  const json = "";
  expect(() => Json(json) === undefined).toThrowError("Empty Json");
});

test("Should throw error unexpected end of file", () => {
  const json = '{ "name": "John';
  expect(() => Json(json) === undefined).toThrowError("Unterminated string");
});

// Testing arrays

test("Simple array", () => {
  const json = "[1, 2, 3]";
  expect(Json(json)).toEqual({
    type: NodeType.ARRAY,
    elements: expect.any(Array),
  });
});

test("Should throw error missing comma in array", () => {
  const json = "[1 2, 3]";
  expect(() => Json(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing value in array", () => {
  const json = "[1, , 3]";
  expect(() => Json(json) === undefined).toThrowError("Unexpected");
});

test("Should throw error missing closing bracket in array", () => {
  const json = "[1, 2, 3";
  expect(() => Json(json) === undefined).toThrowError("Unexpected");
});
