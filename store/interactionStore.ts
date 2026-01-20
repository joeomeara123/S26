import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SUPERNOVA_COST = 100;

interface InteractionState {
  // Post interaction state
  supernovaedPosts: string[];
  savedPosts: string[];
  likedPosts: string[];

  // UI hints state
  hasSeenKarmaHint: boolean;

  // Actions
  supernovaPost: (postId: string, deductKarma: () => boolean) => boolean;
  unsupernovaPost: (postId: string, refundKarma: () => void) => void;
  isSupernovaed: (postId: string) => boolean;

  savePost: (postId: string) => void;
  unsavePost: (postId: string) => void;
  isSaved: (postId: string) => boolean;

  likePost: (postId: string) => void;
  unlikePost: (postId: string) => void;
  isLiked: (postId: string) => boolean;

  markKarmaHintSeen: () => void;

  // Get counts
  getSupernovaCount: () => number;
  getSavedCount: () => number;
}

export const useInteractionStore = create<InteractionState>()(
  persist(
    (set, get) => ({
      // Initial state
      supernovaedPosts: [],
      savedPosts: [],
      likedPosts: [],
      hasSeenKarmaHint: false,

      // Supernova a post - costs 100 karma, auto-saves
      supernovaPost: (postId: string, deductKarma: () => boolean) => {
        const { supernovaedPosts, savedPosts } = get();

        // Check if already supernovaed
        if (supernovaedPosts.includes(postId)) {
          return true;
        }

        // Try to deduct karma (returns false if insufficient)
        const success = deductKarma();
        if (!success) {
          return false;
        }

        // Add to supernovaed posts and auto-save
        set({
          supernovaedPosts: [...supernovaedPosts, postId],
          savedPosts: savedPosts.includes(postId)
            ? savedPosts
            : [...savedPosts, postId],
        });

        return true;
      },

      // Remove supernova from a post
      unsupernovaPost: (postId: string, refundKarma: () => void) => {
        const { supernovaedPosts } = get();

        if (supernovaedPosts.includes(postId)) {
          refundKarma();
          set({
            supernovaedPosts: supernovaedPosts.filter(id => id !== postId),
          });
        }
      },

      isSupernovaed: (postId: string) => {
        return get().supernovaedPosts.includes(postId);
      },

      // Save/unsave posts
      savePost: (postId: string) => {
        const { savedPosts } = get();
        if (!savedPosts.includes(postId)) {
          set({ savedPosts: [...savedPosts, postId] });
        }
      },

      unsavePost: (postId: string) => {
        const { savedPosts, supernovaedPosts } = get();
        // Only allow unsave if not supernovaed (supernovaed posts are always saved)
        if (!supernovaedPosts.includes(postId)) {
          set({ savedPosts: savedPosts.filter(id => id !== postId) });
        }
      },

      isSaved: (postId: string) => {
        return get().savedPosts.includes(postId);
      },

      // Like/unlike posts
      likePost: (postId: string) => {
        const { likedPosts } = get();
        if (!likedPosts.includes(postId)) {
          set({ likedPosts: [...likedPosts, postId] });
        }
      },

      unlikePost: (postId: string) => {
        const { likedPosts } = get();
        set({ likedPosts: likedPosts.filter(id => id !== postId) });
      },

      isLiked: (postId: string) => {
        return get().likedPosts.includes(postId);
      },

      // Karma hint
      markKarmaHintSeen: () => {
        set({ hasSeenKarmaHint: true });
      },

      // Count getters
      getSupernovaCount: () => get().supernovaedPosts.length,
      getSavedCount: () => get().savedPosts.length,
    }),
    {
      name: 'supernova-interactions',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        supernovaedPosts: state.supernovaedPosts,
        savedPosts: state.savedPosts,
        likedPosts: state.likedPosts,
        hasSeenKarmaHint: state.hasSeenKarmaHint,
      }),
    }
  )
);

// Export the cost constant for use elsewhere
export { SUPERNOVA_COST };
