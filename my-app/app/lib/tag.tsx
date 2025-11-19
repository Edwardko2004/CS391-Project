// app/lib/tag.ts

export type TagMap = {
  [key: string]: {
    color: string;
  };
};

const tags: TagMap = {
  other: { color: "#4a4a4aff" },
  pizza: { color: "#f52a2aff" },
  chinese: { color: "#ff0000ff" },
  tacos: { color: "#438922ff" },
  burgers: { color: "#a84c0aff" },
  pasta: { color: "#b7a92eff" },
  vegan: { color: "#65b632ff" },
  donuts: { color: "#f953e8ff" },
  coffee: { color: "#66451cff" },
};

export default tags;
