/**
 * data.js
 * Mode definitions, family members, and default suggestion lists
 */

// ── Family Members ────────────────────────────────────────────────────────────
const FAMILY = [
  {
    id: 'praveen',
    name: 'Praveen',
    role: 'Dad',
    emoji: '🧔',
    color: '#f59e0b',
    colorGlow: 'rgba(245,158,11,.4)',
    colorBg:   'rgba(245,158,11,.13)',
    colorBorder:'rgba(245,158,11,.45)',
  },
  {
    id: 'maria',
    name: 'Maria',
    role: 'Mum',
    emoji: '👩',
    color: '#f43f5e',
    colorGlow: 'rgba(244,63,94,.4)',
    colorBg:   'rgba(244,63,94,.13)',
    colorBorder:'rgba(244,63,94,.45)',
  },
  {
    id: 'leila',
    name: 'Leila',
    role: 'Daughter',
    emoji: '👧',
    color: '#06b6d4',
    colorGlow: 'rgba(6,182,212,.4)',
    colorBg:   'rgba(6,182,212,.13)',
    colorBorder:'rgba(6,182,212,.45)',
  },
  {
    id: 'liam',
    name: 'Liam',
    role: 'Son',
    emoji: '👦',
    color: '#a855f7',
    colorGlow: 'rgba(168,85,247,.4)',
    colorBg:   'rgba(168,85,247,.13)',
    colorBorder:'rgba(168,85,247,.45)',
  },
];

function getFamilyMember(id) {
  return FAMILY.find(f => f.id === id) || null;
}

// ── Mode Definitions ──────────────────────────────────────────────────────────
const MODES = [
  {
    id: 'dinner',
    name: 'Dinner',
    emoji: '🍕',
    color: '#ff8c00',
    question: 'What should we eat tonight?',
    placeholder: ['Pizza', 'Tacos', 'Pasta', 'Burgers', 'Sushi', 'Curry', 'Fried Rice', 'Steak'],
    defaultOptions: [
      { text: 'Pizza 🍕',   owner: 'liam'    },
      { text: 'Tacos 🌮',   owner: 'leila'   },
      { text: 'Pasta 🍝',   owner: 'maria'   },
      { text: 'Burgers 🍔', owner: 'praveen' },
    ],
    winMessages: {
      praveen: ["Dad's pick wins! Tonight it's", "Praveen chose —", "Dad wins this round! It's"],
      maria:   ["Mum knows best! Maria picked", "Maria's choice wins tonight —", "Mum wins! It's"],
      leila:   ["Leila's pick is on the menu!", "Leila wins the dinner vote —", "Leila says we're having"],
      liam:    ["Liam's pick tonight!", "Liam wins! Get ready for", "Liam's choice is on the table —"],
      none:    ["Chef's kiss! Tonight we're having", "The universe has spoken — it's", "Dinner time! The wheel picked"],
    },
  },
  {
    id: 'activity',
    name: 'Activity',
    emoji: '🎮',
    color: '#00f5ff',
    question: 'What shall we do?',
    placeholder: ['Swimming', 'Cycling', 'Movie', 'Park', 'Gaming', 'Drawing', 'Cooking', 'Hiking'],
    defaultOptions: [
      { text: 'Go to the park 🌳', owner: 'praveen' },
      { text: 'Movie night 🎬',    owner: 'maria'   },
      { text: 'Video games 🎮',    owner: 'liam'    },
      { text: 'Bike ride 🚴',      owner: 'leila'   },
    ],
    winMessages: {
      praveen: ["Dad's activity wins! It's", "Praveen's plan is locked in —", "Dad chose! It's"],
      maria:   ["Mum's idea wins! It's", "Maria picked the activity —", "Mum's choice! Today it's"],
      leila:   ["Leila's activity wins! It's", "Leila gets to choose — it's", "Leila's pick! Time for"],
      liam:    ["Liam's activity wins! It's", "Liam's idea it is —", "Liam gets his way! Today we're doing"],
      none:    ["Adventure awaits! You're doing", "Let's goooo! The plan is", "Get your shoes on, time for"],
    },
  },
  {
    id: 'boardgame',
    name: 'Board Game',
    emoji: '🎲',
    color: '#bf5fff',
    question: 'Which game are we playing?',
    placeholder: ['Uno', 'Monopoly', 'Chess', 'Scrabble', 'Jenga', 'Cluedo', 'Risk', 'Pictionary'],
    defaultOptions: [
      { text: 'Uno 🃏',      owner: 'liam'    },
      { text: 'Monopoly 🎩', owner: 'praveen' },
      { text: 'Jenga 🏗',    owner: 'leila'   },
      { text: 'Scrabble 📝', owner: 'maria'   },
    ],
    winMessages: {
      praveen: ["Praveen's game wins! Setting up", "Dad picks the game — it's", "Praveen's the game master! Tonight it's"],
      maria:   ["Maria's game wins! It's", "Mum picked — no switching! It's", "Maria's choice, game on —"],
      leila:   ["Leila's game wins! Set up", "Leila gets to choose — it's", "Leila's pick! Setting up"],
      liam:    ["Liam's game wins! Get out", "Liam picks tonight — it's", "Liam chose! Time to play"],
      none:    ["Game night champion selector chose", "Shuffle the cards! Tonight it's", "Clear the table for"],
    },
  },
  {
    id: 'movie',
    name: 'Movie',
    emoji: '🎬',
    color: '#ff2d78',
    question: 'What movie are we watching?',
    placeholder: ['Avengers', 'Finding Nemo', 'Toy Story', 'Frozen', 'Moana', 'Harry Potter'],
    defaultOptions: [
      { text: 'Marvel movie 🦸',    owner: 'liam'    },
      { text: 'Disney classic 🏰',  owner: 'leila'   },
      { text: 'Romantic comedy 💕', owner: 'maria'   },
      { text: 'Action film 💥',     owner: 'praveen' },
    ],
    winMessages: {
      praveen: ["Praveen's movie wins! Watching", "Dad chose — grab the remote! It's", "Praveen's film night! It's"],
      maria:   ["Maria's movie wins! It's", "Mum wins the remote — watching", "Maria's pick! Lights out for"],
      leila:   ["Leila's movie wins! It's", "Leila picks tonight's film —", "Leila's choice! Movie time with"],
      liam:    ["Liam's movie wins! It's", "Liam picks tonight — watching", "Liam chose — popcorn ready for"],
      none:    ["Grab the popcorn! Tonight we watch", "Lights, camera, action — it's", "Movie night winner is"],
    },
  },
  {
    id: 'chores',
    name: 'Chores 😅',
    emoji: '🧹',
    color: '#39ff14',
    question: 'Spin to assign a chore!',
    placeholder: ['Wash dishes', 'Vacuum', 'Take out trash', 'Clean bathroom', 'Mow lawn', 'Do laundry'],
    defaultOptions: [
      { text: 'Wash the dishes 🍽', owner: null },
      { text: 'Vacuum the floor 🌀', owner: null },
      { text: 'Take out trash 🗑',  owner: null },
      { text: 'Tidy bedroom 🛏',    owner: null },
    ],
    winMessages: {
      praveen: ["Ha! Praveen gets the chore! It's", "Dad can't escape it —", "Sorry Praveen, wheel says"],
      maria:   ["Oops! Maria got picked! It's", "The spinner picked Mum —", "Maria's turn to do"],
      leila:   ["Leila's got a chore! It's", "Leila can't escape the wheel —", "Leila's turn! Get started on"],
      liam:    ["Liam's on chore duty! It's", "The spinner got Liam —", "Liam's turn! Time to"],
      none:    ["Ha! No getting out of this —", "The chore spinner has decided —", "The unlucky job is"],
    },
  },
  {
    id: 'custom',
    name: 'Custom ✨',
    emoji: '⭐',
    color: '#ffe600',
    question: 'Add your own options!',
    placeholder: ['Option 1', 'Option 2', 'Option 3', 'Option 4', 'Option 5'],
    defaultOptions: [],
    winMessages: {
      praveen: ["Praveen wins! It's", "Dad's option is chosen —", "Praveen's pick wins —"],
      maria:   ["Maria wins! It's", "Mum's option wins —", "Maria's pick is"],
      leila:   ["Leila wins! It's", "Leila's option is chosen —", "Leila's pick wins —"],
      liam:    ["Liam wins! It's", "Liam's option is chosen —", "Liam's pick wins —"],
      none:    ["The decision is made! It's", "Fate has chosen", "And the winner is"],
    },
  },
];

const RESULT_EMOJIS = {
  dinner:    ['🍕', '🌮', '🍝', '🍔', '🎉', '😋', '👨‍🍳', '🔥'],
  activity:  ['🎉', '🎊', '🚀', '⚡', '🌟', '🎯', '💪', '🏆'],
  boardgame: ['🎲', '🃏', '🏆', '🎯', '🎉', '👑', '⚔️', '🎭'],
  movie:     ['🎬', '🍿', '⭐', '🎥', '🎞️', '😎', '🌟', '🎭'],
  chores:    ['😅', '💀', '😭', '🧹', '💦', '😤', '🫡', '🤦'],
  custom:    ['🎉', '✨', '🌟', '🎊', '🔥', '⚡', '💫', '🎯'],
};

const CONFETTI_COLORS = [
  '#f59e0b', '#f43f5e', '#06b6d4', '#a855f7',
  '#ff2d78', '#00f5ff', '#ffe600', '#39ff14',
];
