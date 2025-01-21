import _, { isArray } from "lodash";
import { Insight, InsightIds, InsightRule } from "./types";

export const INSIGHT_IDS_VALUE_ID_INDEX = 0;
export const INSIGHT_IDS_RULE_ID_INDEX = 1;

const ARRAY_MATCH_CRITERIA_OPERATORS = [
  "$elemMatch",
  "$all",
  "$in",
  "$nin",
  "$size",
];

export class RulesEngine<InputT extends { id: string }> {
  constructor(private readonly rules: InsightRule<InputT>[] = []) {}

  public addRule(rule: InsightRule<InputT>): void {
    this.rules.push(rule);
  }

  public getRules(): InsightRule<InputT>[] {
    return this.rules;
  }

  public getRule(id: string): InsightRule<InputT> | undefined {
    return this.rules.find((rule) => rule.id === id);
  }

  public removeRule(id: string): void {
    const index = this.rules.findIndex((rule) => rule.id === id);
    if (index !== -1) {
      this.rules.splice(index, 1);
    }
  }

  public clearRules(): void {
    this.rules.length = 0;
  }

  // TODO validation at compile time with helpful errors
  private compileMatchRule(
    matchRule: InsightRule<InputT>["matchRule"],
    path = "",
    /** Used for array $elemMatch op */
    acceptRawInput = false
  ): (input: InputT) => boolean {
    const getValueFromPath =
      path && !acceptRawInput
        ? (input: InputT) => _.get(input, path)
        : (input: InputT) => input;
    if (Array.isArray(matchRule)) {
      if (matchRule.length === 0) {
        return () => true;
      }
      if (matchRule.every((elem) => _.isPlainObject(elem))) {
        // treat as OR condition
        const compiledOrRules = matchRule.map((rule, i) =>
          this.compileMatchRule(rule, path)
        );
        return (input: InputT) => {
          const value = getValueFromPath(input);
          return compiledOrRules.some((rule) => rule(value));
        };
      } else if (matchRule.some((elem) => _.isPlainObject(elem))) {
        // TODO test this
        throw new Error("Cannot mix objects and non-objects in match rule");
      }
      // treat at literal array match
      return (input: InputT) => {
        const value = getValueFromPath(input);
        return _.isEqual(value, matchRule);
      };
    }
    switch (typeof matchRule) {
      case "string":
      case "number":
      case "boolean":
        return (input: InputT) => _.isEqual(getValueFromPath(input), matchRule);
      case "object": {
        if (matchRule === null) {
          return (input: InputT) => getValueFromPath(input) === null;
        }
        const rules: ((value: any) => boolean)[] = [];
        const $eq = _.get(matchRule, "$eq");
        if ($eq !== undefined) {
          rules.push((value: any) => _.isEqual(value, $eq));
        }
        const $ne = _.get(matchRule, "$ne");
        if ($ne !== undefined) {
          rules.push((value: any) => !_.isEqual(value, $ne));
        }
        const $in = _.get(matchRule, "$in");
        if (Array.isArray($in)) {
          rules.push((value: any) => {
            if (Array.isArray(value)) {
              return $in.some((elem) => value.includes(elem));
            }
            return $in.includes(value);
          });
        }
        const $nin = _.get(matchRule, "$nin");
        if (Array.isArray($nin)) {
          rules.push((value: any) => {
            if (Array.isArray(value)) {
              return !$nin.some((elem) => value.includes(elem));
            }
            return !$nin.includes(value);
          });
        }
        const $gt = _.get(matchRule, "$gt");
        if ($gt !== undefined && $gt !== null) {
          rules.push(
            (value: any) => value > $gt && typeof value === typeof $gt
          );
        }
        const $gte = _.get(matchRule, "$gte");
        if ($gte !== undefined && $gte !== null) {
          rules.push(
            (value: any) => value >= $gte && typeof value === typeof $gte
          );
        }
        const $lt = _.get(matchRule, "$lt");
        if ($lt !== undefined && $lt !== null) {
          rules.push(
            (value: any) => value < $lt && typeof value === typeof $lt
          );
        }
        const $lte = _.get(matchRule, "$lte");
        if ($lte !== undefined && $lte !== null) {
          rules.push(
            (value: any) => value <= $lte && typeof value === typeof $lte
          );
        }
        const $regex = _.get(matchRule, "$regex");
        if (typeof $regex === "string") {
          const pattern = new RegExp($regex);
          rules.push((value: any) => pattern.test(value));
        }
        const $nregex = _.get(matchRule, "$nregex");
        if (typeof $nregex === "string") {
          const pattern = new RegExp($nregex);
          rules.push((value: any) => !pattern.test(value));
        }
        const $exists = _.get(matchRule, "$exists");
        if (typeof $exists === "boolean") {
          rules.push(
            $exists
              ? (value: any) => value !== undefined && value !== null
              : (value: any) => value === undefined || value === null
          );
        }
        const $like = _.get(matchRule, "$like");
        if (typeof $like === "string") {
          const pattern = new RegExp($like.replace(/%/g, ".*"));
          rules.push((value: any) => pattern.test(value));
        }
        const $nlike = _.get(matchRule, "$nlike");
        if (typeof $nlike === "string") {
          const pattern = new RegExp($nlike.replace(/%/g, ".*"));
          rules.push((value: any) => !pattern.test(value));
        }
        const $all = _.get(matchRule, "$all");
        if (Array.isArray($all)) {
          rules.push((value: any) => {
            if (!Array.isArray(value)) {
              return false;
            }
            return $all.every((elem) => value.includes(elem));
          });
        }
        const $size = _.get(matchRule, "$size");
        if (typeof $size === "number") {
          rules.push((value: any) => {
            if (!Array.isArray(value)) {
              return false;
            }
            return value.length === $size;
          });
        }
        const $elemMatch = _.get(matchRule, "$elemMatch");
        if (_.isPlainObject($elemMatch)) {
          const elemMatchRule = this.compileMatchRule(
            $elemMatch as InsightRule<InputT>["matchRule"],
            path,
            true
          );
          rules.push((value: any) => {
            if (!Array.isArray(value)) {
              return false;
            }
            return value.some((elem) => elemMatchRule(elem));
          });
        }
        if (rules.length === 0) {
          return (input) =>
            Object.keys(matchRule)
              .map((key) => {
                return this.compileMatchRule(
                  _.get(matchRule, key),
                  path ? `${path}.${key}` : key
                );
              })
              .every((rule) => rule(input));
        }
        if (rules.length === 1) {
          return (input: InputT) => rules[0](getValueFromPath(input));
        }
        return (input: InputT) => {
          const value = getValueFromPath(input);
          return rules.every((rule) => rule(value));
        };
      }
      default:
        return () => false;
    }
  }

  private compileRule(rule: InsightRule<InputT>) {
    return {
      ...rule,
      matcher: this.compileMatchRule(rule.matchRule),
      titleBuilder: safeTemplate(rule, rule.titleTemplate),
      descriptionBuilder: safeTemplate(rule, rule.descriptionTemplate),
      solutionBuilder: safeTemplate(rule, rule.solutionTemplate),
    };
  }

  private compileRules(rules = this.rules) {
    return rules.map((rule) => this.compileRule(rule));
  }

  public getInsightIds(inputs: InputT[]): InsightIds {
    const rules = this.compileRules();
    return inputs.flatMap((input) => {
      const matches = rules.filter((rule) => rule.matcher(input));
      return matches.map((rule): [string, string] => [input.id, rule.id]);
    });
  }

  public getInsight(ruleId: string, value: InputT): Insight | undefined {
    const rule = this.getRule(ruleId);
    if (!rule) {
      return undefined;
    }
    const compiledRule = this.compileRule(rule);
    return {
      valueId: value.id,
      ruleId,
      title: compiledRule.titleBuilder(value),
      description: compiledRule.descriptionBuilder(value),
      severity: compiledRule.severity,
      solution: compiledRule.solutionBuilder(value),
      tags: compiledRule.tags,
    };
  }
}

const safeTemplate = <RuleInputT>(
  rule: InsightRule<RuleInputT>,
  template: string
) => {
  const compiled = _.template(template);
  return (input: RuleInputT) => {
    try {
      return compiled({ rule, value: input });
    } catch (e) {
      const error = e as Error;
      const message = `Error generating string from compiled cause="${error.message}" template="${template}"`;
      //   console.error(message, error);
      return message;
    }
  };
};
