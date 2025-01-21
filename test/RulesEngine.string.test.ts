import { RulesEngine } from "../src/RulesEngine";
import { Insight, InsightRule } from "../src/types";
import { User, genRule, genExpected } from "./testUtils";

describe("RulesEngine.string.test", () => {
  const user1 = { id: "user0001", name: "Test User", age: 20, active: true };
  const user2 = { id: "user0002", name: "David", age: 21, active: false };
  const user3 = { id: "user0003", name: null, age: 21, active: false };
  const user4 = { id: "user0004", age: 21, active: false };
  it("should exact match on literal", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: "Test User" }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should exact match null literal", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: null }));
    const user = { id: "user0001", name: null, age: 20, active: true };
    const expected = [genExpected(user3)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $eq", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $eq: "Test User" } }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $eq null", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $eq: null } }));
    const expected = [genExpected(user3)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $ne", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $ne: "Test User" } }));
    const expected = [
      genExpected(user2),
      genExpected(user3),
      genExpected(user4),
    ];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $ne null", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $ne: null } }));
    const expected = [
      genExpected(user1),
      genExpected(user2),
      genExpected(user4),
    ];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $in", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $in: ["Test User", "David"] } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $in null", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $in: ["Not a real name", null] } }));
    const expected = [genExpected(user3)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $nin", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $nin: ["Test User", "David"] } }));
    const expected = [genExpected(user3), genExpected(user4)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $nin null", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $nin: ["Not a real name", null] } }));
    const expected = [
      genExpected(user1),
      genExpected(user2),
      genExpected(user4),
    ];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $gt", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $gt: "David" } }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $gte", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $gte: "David" } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $lt", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $lt: "Test User" } }));
    const expected = [genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $lte", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $lte: "Test User" } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $regex", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $regex: "U.er$" } }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $nregex", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $nregex: "U.er$" } }));
    const expected = [
      genExpected(user2),
      genExpected(user3),
      genExpected(user4),
    ];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $exists=true", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $exists: true } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $exists=false", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $exists: false } }));
    const expected = [genExpected(user3), genExpected(user4)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $like", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $like: "Test%" } }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $nlike", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ name: { $nlike: "Test%" } }));
    const expected = [
      genExpected(user2),
      genExpected(user3),
      genExpected(user4),
    ];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
});
