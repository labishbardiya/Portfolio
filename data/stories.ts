export type Story = {
  id: string;
  title: string;
  topic: string;
  thought: string;
  image: string;
  position: { left: string; top: string };
  rotation: number;
  shape: "round" | "pebble" | "cloud" | "leaf";
};

/**
 * These are intentionally small, personal fragments rather than portfolio claims.
 * Their positions are stable on first load, so they feel discovered—not jarringly random.
 */
export const stories: Story[] = [
  {
    id: "useful-doubt",
    title: "Useful doubt",
    topic: "Philosophy",
    thought: "I do not think doubt is the opposite of conviction. The useful kind is a flashlight: it makes me look at the edges of an idea before I build the middle of it. I want to keep that habit, especially when an answer feels too convenient.",
    image: "/stories/lantern-path.jpg",
    position: { left: "2.5vw", top: "25vh" },
    rotation: -7,
    shape: "round",
  },
  {
    id: "maps-are-arguments",
    title: "Maps are arguments",
    topic: "Geography",
    thought: "A map never simply tells you where things are. It decides what deserves a name, what becomes a boundary, and what fades into the margin. Geography keeps teaching me that perspective is not an abstract problem—it changes the route you take.",
    image: "/stories/map-to-mountains.jpg",
    position: { left: "8vw", top: "72vh" },
    rotation: 6,
    shape: "pebble",
  },
  {
    id: "physics-listens",
    title: "Physics is a form of listening",
    topic: "Physics",
    thought: "The parts of physics I love most do not make the universe feel cold. They make it legible. A pendulum, a wave, a shadow—each is the world answering a careful question in its own handwriting.",
    image: "/stories/pendulum-waves.jpg",
    position: { left: "calc(100vw - 142px)", top: "22vh" },
    rotation: 5,
    shape: "leaf",
  },
  {
    id: "night-laboratory",
    title: "The night is a laboratory",
    topic: "Astronomy",
    thought: "Astronomy is a reminder that mystery is not a failure of knowledge. Looking up does not make the questions smaller; it makes them worth carrying. I like that the sky rewards patience more than certainty.",
    image: "/stories/night-telescope.jpg",
    position: { left: "calc(100vw - 150px)", top: "58vh" },
    rotation: -5,
    shape: "cloud",
  },
  {
    id: "scale-changes-question",
    title: "Scale changes the question",
    topic: "Geography + philosophy",
    thought: "Standing in front of a coastline or a mountain does not solve anything, but it changes the size of the problem in my head. I want to build things that remember the human scale even when the system behind them is enormous.",
    image: "/stories/moonlit-map.jpg",
    position: { left: "28vw", top: "81vh" },
    rotation: -3,
    shape: "round",
  },
  {
    id: "make-orbit-visible",
    title: "Make the orbit visible",
    topic: "Astrophysics",
    thought: "A model is not the thing itself, but a good model lets you see a relationship that was hiding in plain sight. That is what I am after when I build: make a complicated orbit visible enough for someone to move with it.",
    image: "/stories/notebook-orbits.jpg",
    position: { left: "66vw", top: "78vh" },
    rotation: 4,
    shape: "pebble",
  },
  {
    id: "keep-receiving",
    title: "Keep receiving",
    topic: "Signals + curiosity",
    thought: "Curiosity is not only about sending ideas into the world. It is also about building enough quiet into your day to receive a signal you did not expect. Some of the best directions begin as weak transmissions.",
    image: "/stories/constellation-radio.jpg",
    position: { left: "57vw", top: "27vh" },
    rotation: -6,
    shape: "leaf",
  },
];
