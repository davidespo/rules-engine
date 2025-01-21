import { RulesEngine } from "../src/RulesEngine";
import { Insight, InsightRule } from "../src/types";
import { User, genExpectedInsight } from "./testUtils";

type NestedUser = {
  id: string;
  name?: string | null;
  profile?: {
    age?: number | null;
    active?: boolean | null;
    tags?: string[];
  };
};

export const genRule = (matchRule: InsightRule<NestedUser>["matchRule"]) => ({
  id: "rule0001",
  titleTemplate: "Has Test User",
  descriptionTemplate: "Found Test User <%= JSON.stringify(value) %>",
  solutionTemplate: "Ensure Test User is removed",
  severity: "LOW",
  tags: ["testing"],
  matchRule,
});

export const genExpected = (user: NestedUser): [string, string] => [
  user.id,
  "rule0001",
];

describe("RulesEngine.complex.test", () => {
  const user1 = {
    id: "user0001",
    name: "Test User",
    profile: { age: 80, active: true, tags: ["a", "b"] },
  };
  const user2 = {
    id: "user0002",
    name: null,
    profile: { age: 20, active: true, tags: ["b", "c", "d"] },
  };
  describe("Nesting Objects", () => {
    it("should exact match on literal", () => {
      const re = new RulesEngine<NestedUser>();
      re.addRule(genRule({ profile: { age: 20 } }));
      const expected = [genExpected(user2)];
      const actual = re.getInsightIds([user1, user2]);
      expect(actual).toEqual(expected);
    });
    it("should $eq", () => {
      const re = new RulesEngine<NestedUser>();
      re.addRule(genRule({ profile: { age: { $eq: 20 } } }));
      const expected = [genExpected(user2)];
      const actual = re.getInsightIds([user1, user2]);
      expect(actual).toEqual(expected);
    });
  });
  describe("OR Conditions", () => {
    it("should OR", () => {
      const re = new RulesEngine<NestedUser>();
      re.addRule(genRule([{ profile: { age: 20 } }, { profile: { age: 80 } }]));
      const expected = [genExpected(user1), genExpected(user2)];
      const actual = re.getInsightIds([user1, user2]);
      expect(actual).toEqual(expected);
    });
  });
  describe("AND Conditions", () => {
    it("should AND", () => {
      const re = new RulesEngine<NestedUser>();
      re.addRule(genRule({ profile: { age: 20, active: true } }));
      const expected = [genExpected(user2)];
      const actual = re.getInsightIds([user1, user2]);
      expect(actual).toEqual(expected);
    });
  });
  // it("should generate insight for existing rule", () => {
  //   const re = new RulesEngine<User>();
  //   re.addRule(genRule({ active: true }));
  //   const expected = genExpectedInsight(user1);
  //   const actual = re.getInsight("rule0001", user1);
  //   expect(actual).toEqual(expected);
  // });
  // it("should return undefined for rule not found", () => {
  //   const re = new RulesEngine<User>();
  //   const expected = undefined;
  //   const actual = re.getInsight("rule0001", user1);
  //   expect(actual).toEqual(expected);
  // });
  // it("should swallow template errors: title", () => {
  //   const re = new RulesEngine<User>();
  //   re.addRule(titleError);
  //   const expected: Insight = {
  //     valueId: user2.id,
  //     ruleId: "rule0001",
  //     title: "name=<%= value.name.length %>",
  //     description: "name=",
  //     solution: "name=",
  //     severity: "LOW",
  //     tags: ["testing"],
  //   };
  //   const actual = re.getInsight("rule0001", user2);
  //   expect(actual).toEqual(expected);
  // });
  // it("should swallow template errors: description", () => {
  //   const re = new RulesEngine<User>();
  //   re.addRule(descriptionError);
  //   const expected: Insight = {
  //     valueId: user2.id,
  //     ruleId: "rule0001",
  //     title: "name=",
  //     description: "name=<%= value.name.length %>",
  //     solution: "name=",
  //     severity: "LOW",
  //     tags: ["testing"],
  //   };
  //   const actual = re.getInsight("rule0001", user2);
  //   expect(actual).toEqual(expected);
  // });
  // it("should swallow template errors: solution", () => {
  //   const re = new RulesEngine<User>();
  //   re.addRule(solutionError);
  //   const expected: Insight = {
  //     valueId: user2.id,
  //     ruleId: "rule0001",
  //     title: "name=",
  //     description: "name=",
  //     solution: "name=<%= value.name.length %>",
  //     severity: "LOW",
  //     tags: ["testing"],
  //   };
  //   const actual = re.getInsight("rule0001", user2);
  //   expect(actual).toEqual(expected);
  // });
  // it("should swallow multiple template errors", () => {
  //   const re = new RulesEngine<User>();
  //   re.addRule(multipleError);
  //   const expected: Insight = {
  //     valueId: user2.id,
  //     ruleId: "rule0001",
  //     title: "name=<%= value.name.length %>",
  //     description: "name=<%= value.name.length %>",
  //     solution: "name=<%= value.name.length %>",
  //     severity: "LOW",
  //     tags: ["testing"],
  //   };
  //   const actual = re.getInsight("rule0001", user2);
  //   expect(actual).toEqual(expected);
  // });
});
