import { InsightRule, Insight } from "../src/types";

export type User = {
  id: string;
  name?: string | null;
  age?: number | null;
  active?: boolean | null;
  tags?: string[] | null;
};

export const genRule = (matchRule: InsightRule<User>["matchRule"]) => ({
  id: "rule0001",
  titleTemplate: "Has Test User",
  descriptionTemplate: "Found Test User <%= JSON.stringify(value) %>",
  solutionTemplate: "Ensure Test User is removed",
  severity: "LOW",
  tags: ["testing"],
  matchRule,
});

export const genExpected = (user: User): [string, string] => [
  user.id,
  "rule0001",
];

export const genExpectedInsight = (user: User): Insight => ({
  valueId: user.id,
  ruleId: "rule0001",
  title: "Has Test User",
  description: `Found Test User ${JSON.stringify(user)}`,
  solution: "Ensure Test User is removed",
  severity: "LOW",
  tags: ["testing"],
});
