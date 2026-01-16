/**
 * Mock Post Data
 * Used for demo purposes - will be replaced with real API data
 */

export type PostType = 'image' | 'video' | 'carousel';

export interface Post {
  id: string;
  authorId: string;
  type: PostType;
  mediaUrl?: string;
  mediaUrls?: string[]; // For carousel
  videoUrl?: string;
  caption?: string;
  likes: number;
  comments: number;
  supernovas: number;
  isFeelGood: boolean;
  timestamp: string;
  hashtags?: string[];
}

// Sample image URLs from Unsplash
const sampleImages = [
  'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
  'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800',
  'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?w=800',
  'https://images.unsplash.com/photo-1433086966358-54859d0ed716?w=800',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800',
  'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800',
  'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800',
  'https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=800',
  'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800',
  'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800',
];

export const mockPosts: Post[] = [
  {
    id: 'post_1',
    authorId: 'user_1',
    type: 'image',
    mediaUrl: sampleImages[0],
    caption: 'Morning hike in the mountains 🏔️ Nothing beats fresh air and beautiful views. #nature #hiking #feelgood',
    likes: 1234,
    comments: 89,
    supernovas: 45,
    isFeelGood: true,
    timestamp: '2 hours ago',
    hashtags: ['nature', 'hiking', 'feelgood'],
  },
  {
    id: 'post_2',
    authorId: 'user_2',
    type: 'image',
    mediaUrl: sampleImages[1],
    caption: 'Remember: Your mental health matters more than any workout 💪🧠 Take breaks when you need them.',
    likes: 3456,
    comments: 234,
    supernovas: 128,
    isFeelGood: true,
    timestamp: '4 hours ago',
    hashtags: ['mentalhealth', 'fitness', 'selfcare'],
  },
  {
    id: 'post_3',
    authorId: 'user_3',
    type: 'image',
    mediaUrl: sampleImages[2],
    caption: 'Found this peaceful spot today. Sometimes you just need to disconnect and breathe 🌿',
    likes: 892,
    comments: 45,
    supernovas: 23,
    isFeelGood: false,
    timestamp: '5 hours ago',
  },
  {
    id: 'post_4',
    authorId: 'user_4',
    type: 'image',
    mediaUrl: sampleImages[3],
    caption: 'Another successful rescue mission! This little guy is now safe and being cared for 🐕💚',
    likes: 5678,
    comments: 456,
    supernovas: 234,
    isFeelGood: true,
    timestamp: '6 hours ago',
    hashtags: ['animalrescue', 'dogsofinstagram', 'adopt'],
  },
  {
    id: 'post_5',
    authorId: 'user_5',
    type: 'image',
    mediaUrl: sampleImages[4],
    caption: 'Beach cleanup day! 2 hours and 50 pounds of trash collected 🌊♻️ Every action counts!',
    likes: 2345,
    comments: 178,
    supernovas: 89,
    isFeelGood: true,
    timestamp: '8 hours ago',
    hashtags: ['beachcleanup', 'environment', 'volunteer'],
  },
  {
    id: 'post_6',
    authorId: 'user_6',
    type: 'image',
    mediaUrl: sampleImages[5],
    caption: 'Delivering supplies to communities in need. The smiles make everything worth it 🌍💛',
    likes: 8901,
    comments: 567,
    supernovas: 345,
    isFeelGood: true,
    timestamp: '10 hours ago',
    hashtags: ['humanitarian', 'givingback', 'community'],
  },
  {
    id: 'post_7',
    authorId: 'user_7',
    type: 'image',
    mediaUrl: sampleImages[6],
    caption: 'Sunset from the trail. Nature always knows how to put on a show 🌅',
    likes: 1567,
    comments: 67,
    supernovas: 34,
    isFeelGood: false,
    timestamp: '12 hours ago',
  },
  {
    id: 'post_8',
    authorId: 'user_8',
    type: 'image',
    mediaUrl: sampleImages[7],
    caption: 'Morning meditation by the lake. Starting the day with intention and gratitude 🧘‍♀️✨',
    likes: 3210,
    comments: 145,
    supernovas: 78,
    isFeelGood: true,
    timestamp: '14 hours ago',
    hashtags: ['meditation', 'mindfulness', 'wellness'],
  },
  {
    id: 'post_9',
    authorId: 'user_9',
    type: 'image',
    mediaUrl: sampleImages[8],
    caption: 'Caught this family of foxes during my morning shoot 🦊📷 Wildlife photography never gets old!',
    likes: 6789,
    comments: 389,
    supernovas: 167,
    isFeelGood: true,
    timestamp: '16 hours ago',
    hashtags: ['wildlife', 'photography', 'nature'],
  },
  {
    id: 'post_10',
    authorId: 'user_10',
    type: 'image',
    mediaUrl: sampleImages[9],
    caption: 'Community garden project update! Fresh vegetables for 20 families this month 🥬🍅',
    likes: 2890,
    comments: 198,
    supernovas: 95,
    isFeelGood: true,
    timestamp: '18 hours ago',
    hashtags: ['community', 'garden', 'localfood'],
  },
];

// Helper to get posts by user
export const getPostsByUser = (userId: string): Post[] => {
  return mockPosts.filter((p) => p.authorId === userId);
};

// Helper to get feel-good posts only
export const getFeelGoodPosts = (): Post[] => {
  return mockPosts.filter((p) => p.isFeelGood);
};

// Helper to get recent posts (paginated)
export const getRecentPosts = (page: number = 1, limit: number = 10): Post[] => {
  const start = (page - 1) * limit;
  return mockPosts.slice(start, start + limit);
};
