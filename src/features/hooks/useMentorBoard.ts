import { useCallback, useEffect, useState } from 'react';

import {
  fetchBoardPosts,
  fetchMentorBoard,
  type BoardDto,
  type PostAuthorDto,
  type PostDto,
  type UserDto,
} from '../../services/api/users';
import type { MentorPost } from '../mocks';

type MentorBoardProfile = {
  name: string;
  subtitle: string;
};

type MentorBoardState = {
  board: BoardDto | null;
  error: string | null;
  loading: boolean;
  posts: MentorPost[];
  profile: MentorBoardProfile | null;
  refetch: () => Promise<void>;
};

function getAuthorName(author: PostAuthorDto): string {
  if (typeof author === 'string') {
    return author;
  }

  return author.username ?? author.id ?? author._id ?? '멘토';
}

function formatDate(value?: string): string {
  if (!value) {
    return '';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return date.toLocaleDateString('ko-KR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

function toMentorPost(post: PostDto): MentorPost {
  return {
    id: post._id,
    mentor: getAuthorName(post.authorId),
    time: formatDate(post.createdAt),
    body: post.content,
    likes: 0,
    comments: 0,
  };
}

function toProfile(user: UserDto, board: BoardDto): MentorBoardProfile {
  return {
    name: user.username,
    subtitle: board.description ?? board.title,
  };
}

export function useMentorBoard(): MentorBoardState {
  const [board, setBoard] = useState<BoardDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<MentorPost[]>([]);
  const [profile, setProfile] = useState<MentorBoardProfile | null>(null);

  const load = useCallback(async (signal?: AbortSignal) => {
    setLoading(true);
    setError(null);

    try {
      const { board: nextBoard, user } = await fetchMentorBoard(signal);
      const nextPosts = await fetchBoardPosts(nextBoard._id, signal);

      setBoard(nextBoard);
      setPosts(nextPosts.map(toMentorPost));
      setProfile(toProfile(user, nextBoard));
    } catch (nextError) {
      if (nextError instanceof Error && nextError.name === 'AbortError') {
        return;
      }

      setBoard(null);
      setError(
        nextError instanceof Error
          ? nextError.message
          : 'Failed to fetch mentor board',
      );
      setPosts([]);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    void load(controller.signal);

    return () => controller.abort();
  }, [load]);

  return {
    board,
    error,
    loading,
    posts,
    profile,
    refetch: () => load(),
  };
}
