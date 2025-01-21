import { RulesEngine } from "../src/RulesEngine";
import { User, genRule, genExpected } from "./testUtils";

describe("RulesEngine.number.test", () => {
  const user1 = { id: "user0001", name: "Test User", age: 80, active: true };
  const user2 = { id: "user0002", name: "Test User", age: 20, active: false };
  const user3 = { id: "user0003", name: "Test User", age: null, active: false };
  const user4 = { id: "user0004", name: "Test User", active: false };
  it("should exact match on literal", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: 80 }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should exact match null literal", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: null }));
    const expected = [genExpected(user3)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $eq", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $eq: 80 } }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $eq null", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $eq: null } }));
    const expected = [genExpected(user3)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $ne", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $ne: 80 } }));
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
    re.addRule(genRule({ age: { $ne: null } }));
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
    re.addRule(genRule({ age: { $in: [80, 20] } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $in null", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $in: [12345, null] } }));
    const expected = [genExpected(user3)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $nin", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $nin: [80, 20] } }));
    const expected = [genExpected(user3), genExpected(user4)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $nin null", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $nin: [12345, null] } }));
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
    re.addRule(genRule({ age: { $gt: 20 } }));
    const expected = [genExpected(user1)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $gte", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $gte: 20 } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $lt", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $lt: 80 } }));
    const expected = [genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $lte", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $lte: 80 } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $exists=true", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $exists: true } }));
    const expected = [genExpected(user1), genExpected(user2)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
  it("should $exists=false", () => {
    const re = new RulesEngine<User>();
    re.addRule(genRule({ age: { $exists: false } }));
    const expected = [genExpected(user3), genExpected(user4)];
    const actual = re.getInsightIds([user1, user2, user3, user4]);
    expect(actual).toEqual(expected);
  });
});
