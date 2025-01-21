import { RulesEngine } from "../src/RulesEngine";
import { User, genRule, genExpected } from "./testUtils";

describe("RulesEngine.arrays.test", () => {
  const user1 = {
    id: "user0001",
    name: "Test User",
    age: 20,
    active: true,
    tags: ["a", "b"],
  };
  const user2 = {
    id: "user0002",
    name: "Test User",
    age: 20,
    active: false,
    tags: ["b", "c", "d"],
  };
  const user3 = {
    id: "user0003",
    name: "Test User",
    age: 20,
    active: null,
    tags: null,
  };
  const user4 = { id: "user0004", name: "Test User", age: 20 };
  it("should exact match on literal", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: ["a", "b"] }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should exact match null literal", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: null }));
    const expected = [genExpected(user3)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $elemMatch single", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: { $elemMatch: { $eq: "a" } } }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $elemMatch multiple", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: { $elemMatch: { $eq: "b" } } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $all", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: { $all: ["a", "b"] } }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $in single", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: { $in: ["d"] } }));
    const expected = [genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $in multiple", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: { $in: ["a", "d"] } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $nin", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: { $nin: ["d"] } }));
    const expected = [
      genExpected(user1),
      genExpected(user3),
      genExpected(user4),
    ];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $size", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: { $size: 2 } }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $exists=true", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: { $exists: true } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $exists=false", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ tags: { $exists: false } }));
    const expected = [genExpected(user3), genExpected(user4)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
});
