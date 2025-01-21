import { RulesEngine } from "../src/RulesEngine";
import { Insight, InsightRule } from "../src/types";
import { User, genRule, genExpected, genExpectedInsight } from "./testUtils";

const titleError: InsightRule<User> = {
  id: "rule0001",
  titleTemplate: "name=<%= value.name.length %>",
  descriptionTemplate: "name=<%= value.name %>",
  solutionTemplate: "name=<%= value.name %>",
  severity: "LOW",
  tags: ["testing"],
  matchRule: {},
};
const descriptionError: InsightRule<User> = {
  id: "rule0001",
  titleTemplate: "name=<%= value.name %>",
  descriptionTemplate: "name=<%= value.name.length %>",
  solutionTemplate: "name=<%= value.name %>",
  severity: "LOW",
  tags: ["testing"],
  matchRule: {},
};
const solutionError: InsightRule<User> = {
  id: "rule0001",
  titleTemplate: "name=<%= value.name %>",
  descriptionTemplate: "name=<%= value.name %>",
  solutionTemplate: "name=<%= value.name.length %>",
  severity: "LOW",
  tags: ["testing"],
  matchRule: {},
};
const multipleError: InsightRule<User> = {
  id: "rule0001",
  titleTemplate: "name=<%= value.name.length %>",
  descriptionTemplate: "name=<%= value.name.length %>",
  solutionTemplate: "name=<%= value.name.length %>",
  severity: "LOW",
  tags: ["testing"],
  matchRule: {},
};

describe("RulesEngine.insight.test", () => {
  const user1 = { id: "user0001", name: "Test User", age: 20, active: true };
  const user2 = { id: "user0002", name: null, age: 20, active: true };
  it("should generate insight for existing rule", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: true }));
    const expected = genExpectedInsight(user1);
    const actual = re.getInsight("rule0001", user1);
    expect(actual).toEqual(expected);
  });
  it("should return undefined for rule not found", () => {
    const re = new RulesEngine<User>();
    const expected = undefined;
    const actual = re.getInsight("rule0001", user1);
    expect(actual).toEqual(expected);
  });
  it("should swallow template errors: title", () => {
    const re = new RulesEngine<User>();
    re.addRule(titleError);
    const expected: Insight = {
      valueId: user2.id,
      ruleId: "rule0001",
      title:
        'Error generating string from compiled cause="Cannot read properties of null (reading \'length\')" template="name=<%= value.name.length %>"',
      description: "name=",
      solution: "name=",
      severity: "LOW",
      tags: ["testing"],
    };
    const actual = re.getInsight("rule0001", user2);
    expect(actual).toEqual(expected);
  });
  it("should swallow template errors: description", () => {
    const re = new RulesEngine<User>();
    re.addRule(descriptionError);
    const expected: Insight = {
      valueId: user2.id,
      ruleId: "rule0001",
      title: "name=",
      description:
        'Error generating string from compiled cause="Cannot read properties of null (reading \'length\')" template="name=<%= value.name.length %>"',
      solution: "name=",
      severity: "LOW",
      tags: ["testing"],
    };
    const actual = re.getInsight("rule0001", user2);
    expect(actual).toEqual(expected);
  });
  it("should swallow template errors: solution", () => {
    const re = new RulesEngine<User>();
    re.addRule(solutionError);
    const expected: Insight = {
      valueId: user2.id,
      ruleId: "rule0001",
      title: "name=",
      description: "name=",
      solution:
        'Error generating string from compiled cause="Cannot read properties of null (reading \'length\')" template="name=<%= value.name.length %>"',
      severity: "LOW",
      tags: ["testing"],
    };
    const actual = re.getInsight("rule0001", user2);
    expect(actual).toEqual(expected);
  });
  it("should swallow multiple template errors", () => {
    const re = new RulesEngine<User>();
    re.addRule(multipleError);
    const expected: Insight = {
      valueId: user2.id,
      ruleId: "rule0001",
      title:
        'Error generating string from compiled cause="Cannot read properties of null (reading \'length\')" template="name=<%= value.name.length %>"',
      description:
        'Error generating string from compiled cause="Cannot read properties of null (reading \'length\')" template="name=<%= value.name.length %>"',
      solution:
        'Error generating string from compiled cause="Cannot read properties of null (reading \'length\')" template="name=<%= value.name.length %>"',
      severity: "LOW",
      tags: ["testing"],
    };
    const actual = re.getInsight("rule0001", user2);
    expect(actual).toEqual(expected);
  });
});
