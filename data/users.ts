/**
 * Mock User Data
 * Used for demo purposes - will be replaced with real API data
 */

import { CauseCode } from '../constants/colors';

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar?: string;
  bio?: string;
  karma: number;
  cause: CauseCode;
  followers: number;
  following: number;
  posts: number;
  isVerified?: boolean;
}

// Avatar URLs from UIFaces/RandomUser style
const avatarBase = 'https://i.pravatar.cc/200';

export const mockUsers: User[] = [
  {
    id: 'user_1',
    name: 'Sarah Chen',
    username: 'sarahcreates',
    email: 'sarah@example.com',
    avatar: `${avatarBase}?img=1`,
    bio: '✨ Creating positive vibes | Environmental advocate | Nature lover 🌿',
    karma: 87,
    cause: 'EC',
    followers: 12500,
    following: 890,
    posts: 156,
    isVerified: true,
  },
  {
    id: 'user_2',
    name: 'Marcus Johnson',
    username: 'marcus_fit',
    email: 'marcus@example.com',
    avatar: `${avatarBase}?img=3`,
    bio: 'Fitness coach | Mental health advocate 💪🧠',
    karma: 92,
    cause: 'MH',
    followers: 45000,
    following: 520,
    posts: 234,
    isVerified: true,
  },
  {
    id: 'user_3',
    name: 'Emma Wilson',
    username: 'emma.good',
    email: 'emma@example.com',
    avatar: `${avatarBase}?img=5`,
    bio: 'Spreading kindness one post at a time 💚',
    karma: 76,
    cause: 'HW',
    followers: 8900,
    following: 1200,
    posts: 89,
  },
  {
    id: 'user_4',
    name: 'David Park',
    username: 'davidventures',
    email: 'david@example.com',
    avatar: `${avatarBase}?img=7`,
    bio: 'Adventure seeker | Animal rescue volunteer 🐕',
    karma: 81,
    cause: 'AW',
    followers: 23000,
    following: 670,
    posts: 312,
    isVerified: true,
  },
  {
    id: 'user_5',
    name: 'Lisa Thompson',
    username: 'lisa_cooks',
    email: 'lisa@example.com',
    avatar: `${avatarBase}?img=9`,
    bio: 'Plant-based chef 🌱 | Health advocate',
    karma: 68,
    cause: 'HH',
    followers: 15600,
    following: 430,
    posts: 178,
  },
  {
    id: 'user_6',
    name: 'Alex Rivera',
    username: 'alex_helps',
    email: 'alex@example.com',
    avatar: `${avatarBase}?img=11`,
    bio: 'Humanitarian worker | Making a difference 🌍',
    karma: 95,
    cause: 'HC',
    followers: 67000,
    following: 340,
    posts: 445,
    isVerified: true,
  },
  {
    id: 'user_7',
    name: 'Jordan Lee',
    username: 'jordanlee',
    email: 'jordan@example.com',
    avatar: `${avatarBase}?img=13`,
    bio: 'Content creator | Ocean conservation 🌊',
    karma: 73,
    cause: 'EC',
    followers: 34000,
    following: 890,
    posts: 267,
  },
  {
    id: 'user_8',
    name: 'Mia Santos',
    username: 'miawellness',
    email: 'mia@example.com',
    avatar: `${avatarBase}?img=15`,
    bio: 'Yoga instructor | Mindfulness 🧘‍♀️',
    karma: 84,
    cause: 'MH',
    followers: 28000,
    following: 560,
    posts: 198,
    isVerified: true,
  },
  {
    id: 'user_9',
    name: 'Chris Martin',
    username: 'chrisoutdoors',
    email: 'chris@example.com',
    avatar: `${avatarBase}?img=17`,
    bio: 'Wildlife photographer 📷 | Conservation',
    karma: 79,
    cause: 'AW',
    followers: 41000,
    following: 280,
    posts: 523,
    isVerified: true,
  },
  {
    id: 'user_10',
    name: 'Nina Patel',
    username: 'ninahelps',
    email: 'nina@example.com',
    avatar: `${avatarBase}?img=19`,
    bio: 'Social worker | Community builder 💛',
    karma: 88,
    cause: 'HW',
    followers: 19000,
    following: 720,
    posts: 145,
  },
];

// Helper to get random users for suggestions
export const getRandomUsers = (count: number, excludeIds: string[] = []): User[] => {
  const available = mockUsers.filter((u) => !excludeIds.includes(u.id));
  const shuffled = [...available].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
};

// Helper to get user by ID
export const getUserById = (id: string): User | undefined => {
  return mockUsers.find((u) => u.id === id);
};
