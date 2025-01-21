import { RulesEngine } from "../src/RulesEngine";
import { User, genRule, genExpected } from "./testUtils";

describe("RulesEngine.boolean.test", () => {
  const user1 = { id: "user0001", name: "Test User", age: 20, active: true };
  const user2 = { id: "user0002", name: "Test User", age: 20, active: false };
  const user3 = { id: "user0003", name: "Test User", age: 20, active: null };
  const user4 = { id: "user0004", name: "Test User", age: 20 };
  it("should exact match on literal", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: true }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should exact match null literal", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: null }));
    const expected = [genExpected(user3)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $eq", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: { $eq: true } }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $eq null", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: { $eq: null } }));
    const expected = [genExpected(user3)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $ne", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: { $ne: true } }));
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
    re.addRule(genRule({ active: { $ne: null } }));
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
    re.addRule(genRule({ active: { $in: [true, false] } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $in null", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: { $in: [null] } }));
    const expected = [genExpected(user3)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $nin", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: { $nin: [true, false] } }));
    const expected = [genExpected(user3), genExpected(user4)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $nin null", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: { $nin: [null] } }));
    const expected = [
      genExpected(user1),
      genExpected(user2),
      genExpected(user4),
    ];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $exists=true", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: { $exists: true } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $exists=false", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ active: { $exists: false } }));
    const expected = [genExpected(user3), genExpected(user4)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
});
