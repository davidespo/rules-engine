/**
 * Defines criteria for matching string fields.
 * Allows direct string or null values and various comparison operators.
 */
type StringMatchCriteria =
  | string
  | null
  | {
      /** Matches values equal to a specified string or null. */
      $eq?: string | null;
      /** Matches values not equal to a specified string or null. */
      $ne?: string | null;
      /** Matches any value in the provided array of strings or nulls. */
      $in?: (string | null)[] | null;
      /** Matches values not in the provided array of strings or nulls. */
      $nin?: (string | null)[] | null;
      /** Matches values greater than the specified string. */
      $gt?: string | null;
      /** Matches values greater than or equal to the specified string. */
      $gte?: string | null;
      /** Matches values less than the specified string. */
      $lt?: string | null;
      /** Matches values less than or equal to the specified string. */
      $lte?: string | null;
      /** Matches values that satisfy the specified regular expression. */
      $regex?: string | null;
      /** Matches values that do not satisfy the specified regular expression. */
      $nregex?: string | null;
      /** Matches documents where the field exists or does not exist. */
      $exists?: boolean | null;
      /** Matches values that contain the specified substring. */
      $like?: string | null;
      /** Matches values that do not contain the specified substring. */
      $nlike?: string | null;
    };

/**
 * Defines criteria for matching numeric fields.
 * Allows direct number or null values and various comparison operators.
 */
type NumberMatchCriteria =
  | number
  | null
  | {
      /** Matches values equal to a specified number or null. */
      $eq?: number | null;
      /** Matches values not equal to a specified number or null. */
      $ne?: number | null;
      /** Matches any value in the provided array of numbers or nulls. */
      $in?: (number | null)[] | null;
      /** Matches values not in the provided array of numbers or nulls. */
      $nin?: (number | null)[] | null;
      /** Matches values greater than the specified number. */
      $gt?: number | null;
      /** Matches values greater than or equal to the specified number. */
      $gte?: number | null;
      /** Matches values less than the specified number. */
      $lt?: number | null;
      /** Matches values less than or equal to the specified number. */
      $lte?: number | null;
      /** Matches documents if the array field exists or does not exist. */
      $exists?: boolean;
    };

/**
 * Defines criteria for matching boolean fields.
 * Allows direct boolean or null values and various comparison operators.
 */
type BooleanMatchCriteria =
  | boolean
  | null
  | {
      /** Matches values equal to a specified boolean or null. */
      $eq?: boolean | null;
      /** Matches values not equal to a specified boolean or null. */
      $ne?: boolean | null;
      /** Matches documents where the field exists or does not exist. */
      $exists?: boolean | null;
      /** Matches any value in the provided array of booleans or nulls. */
      $nin?: (boolean | null)[] | null;
      /** Matches values not in the provided array of booleans or nulls. */
      $in?: (boolean | null)[] | null;
    };

/**
 * Defines criteria for matching arrays.
 * Allows direct arrays or null, as well as operators for querying array contents.
 */
type ArrayMatchCriteria<T> =
  | T[]
  | null
  | {
      /** Matches if at least one array element satisfies the specified match criteria. */
      $elemMatch?: ValueMatcher<T>;
      /** Matches arrays that contain all specified elements. */
      $all?: T[];
      /** Matches arrays if at least one element is in the given list. */
      $in?: T[];
      /** Matches arrays if no element is in the given list. */
      $nin?: T[];
      /** Matches arrays with the specified length. */
      $size?: number;
      /** Matches documents if the array field exists or does not exist. */
      $exists?: boolean;
    };

/**
 * Defines how to match individual values based on their type.
 * Dispatches to StringMatchCriteria, NumberMatchCriteria, etc.,
 * or recurses for array/object structures.
 */
type ValueMatcher<T> = T extends unknown
  ? T extends string
    ? StringMatchCriteria
    : T extends number
    ? NumberMatchCriteria
    : T extends boolean
    ? BooleanMatchCriteria
    : T extends (infer U)[]
    ? ArrayMatchCriteria<U>
    : T extends object
    ? { [K in keyof T]: ValueMatcher<T[K]> }
    : never
  : never;

/**
 * Creates a match criteria object for a given type `T`,
 * where each field is replaced by a corresponding `ValueMatcher`.
 */
export type Matcher<T> = {
  [K in keyof T]?: ValueMatcher<T[K]>;
};

/**
 * A tuple of two strings, representing the value ID and rule ID of an insight.
 */
export type InsightIds = [string, string][];

export type Insight = {
  valueId: string;
  ruleId: string;
  title: string;
  description: string;
  solution: string;
  severity: string;
  tags: string[];
};

export type InsightRule<InputT> = {
  id: string;
  titleTemplate: string;
  descriptionTemplate: string;
  solutionTemplate: string;
  severity: string;
  tags: string[];
  matchRule: Matcher<InputT> | Matcher<InputT>[];
};
