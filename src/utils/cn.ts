export const cn = (...names: (string | null | undefined | boolean)[]) =>
  names.filter((e) => typeof e === "string").join(" ");
