import { apiFetch, getAuthHeaders } from './config';

export type UserDto = {
  _id: string;
  username: string;
  createdAt?: string;
};

export type BoardDto = {
  _id: string;
  ownerId: string;
  title: string;
  description?: string;
  createdAt?: string;
};

export type PostAuthorDto =
  | string
  | {
      _id?: string;
      id?: string;
      username?: string;
    };

export type PostDto = {
  _id: string;
  boardId: string;
  authorId: PostAuthorDto;
  content: string;
  category?: 'Q&A' | '공지' | '일반';
  createdAt?: string;
};

type AuthResponseDto = {
  token: string;
  user: {
    id: string;
    username: string;
  };
};

const DEV_MENTOR_USERNAME = 'devmentor';
const DEV_MENTOR_PASSWORD = 'devmentor1234';
const DEV_VIEWER_USERNAME = 'devviewer';
const DEV_VIEWER_PASSWORD = 'devviewer1234';

type RequestOptions = {
  body?: unknown;
  method?: 'DELETE' | 'GET' | 'POST' | 'PUT';
  signal?: AbortSignal;
  token?: string;
};

async function requestJson<T>(
  path: string,
  {
    body,
    method = 'GET',
    signal,
    token,
  }: RequestOptions = {},
): Promise<T> {
  const response = await apiFetch(path, {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token ? getAuthHeaders(token) : {}),
    },
    method,
    signal,
  });

  const text = await response.text();

  if (!response.ok) {
    let message = `${method} ${path} failed: ${response.status}`;
    try {
      const data = JSON.parse(text) as Record<string, unknown>;
      if (typeof data.error === 'string') {
        message = data.error;
      }
    } catch {}
    throw new Error(message);
  }

  if (!text) {
    return undefined as T;
  }

  return JSON.parse(text) as T;
}

async function getJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  return requestJson<T>(path, { signal });
}

async function postJson<T>(
  path: string,
  body: unknown,
  options: {
    signal?: AbortSignal;
    token?: string;
  } = {},
): Promise<T> {
  return requestJson<T>(path, {
    body,
    method: 'POST',
    signal: options.signal,
    token: options.token,
  });
}

async function putJson<T>(
  path: string,
  body: unknown,
  options: {
    signal?: AbortSignal;
    token?: string;
  } = {},
): Promise<T> {
  return requestJson<T>(path, {
    body,
    method: 'PUT',
    signal: options.signal,
    token: options.token,
  });
}

async function deleteJson<T>(
  path: string,
  options: {
    signal?: AbortSignal;
    token?: string;
  } = {},
): Promise<T> {
  return requestJson<T>(path, {
    method: 'DELETE',
    signal: options.signal,
    token: options.token,
  });
}

export type AuthDto = {
  token: string;
  user: { id: string; username: string };
};

export async function login({
  username,
  password,
  signal,
}: {
  username: string;
  password: string;
  signal?: AbortSignal;
}): Promise<AuthDto> {
  return postJson<AuthDto>('/auth/login', { username, password }, { signal });
}

export async function signup({
  username,
  password,
  signal,
}: {
  username: string;
  password: string;
  signal?: AbortSignal;
}): Promise<void> {
  await postJson<{ message?: string }>('/auth/signup', { username, password }, { signal });
}

export async function fetchUsers(signal?: AbortSignal): Promise<UserDto[]> {
  const users = await getJson<unknown>('/user/list', signal);

  if (!Array.isArray(users)) {
    throw new Error('User list response must be an array');
  }

  return users as UserDto[];
}

export function fetchUserBoard(
  userId: string,
  signal?: AbortSignal,
): Promise<BoardDto> {
  return getJson<BoardDto>(`/user/${userId}/board`, signal);
}

export async function fetchBoardPosts(
  boardId: string,
  signal?: AbortSignal,
): Promise<PostDto[]> {
  const posts = await getJson<unknown>(`/user/board/${boardId}/posts`, signal);

  if (!Array.isArray(posts)) {
    throw new Error('Board posts response must be an array');
  }

  return posts as PostDto[];
}

export async function ensureDevMentorAccount(
  signal?: AbortSignal,
): Promise<AuthResponseDto> {
  return ensureDevAccount({
    password: DEV_MENTOR_PASSWORD,
    signal,
    username: DEV_MENTOR_USERNAME,
  });
}

export async function ensureDevViewerAccount(
  signal?: AbortSignal,
): Promise<AuthResponseDto> {
  return ensureDevAccount({
    password: DEV_VIEWER_PASSWORD,
    signal,
    username: DEV_VIEWER_USERNAME,
  });
}

async function ensureDevAccount({
  password,
  signal,
  username,
}: {
  password: string;
  signal?: AbortSignal;
  username: string;
}): Promise<AuthResponseDto> {
  const credentials = {
    password,
    username,
  };

  try {
    return await postJson<AuthResponseDto>('/auth/login', credentials, {
      signal,
    });
  } catch {
    await postJson('/auth/signup', credentials, { signal });

    return postJson<AuthResponseDto>('/auth/login', credentials, {
      signal,
    });
  }
}

export async function fetchMentorBoard(signal?: AbortSignal): Promise<{
  board: BoardDto;
  user: UserDto;
}> {
  return fetchMentorBoardByUsername(DEV_MENTOR_USERNAME, signal, {
    createIfMissing: true,
  });
}

export async function fetchMentorBoardByUsername(
  username: string,
  signal?: AbortSignal,
  options: {
    createIfMissing?: boolean;
  } = {},
): Promise<{
  board: BoardDto;
  user: UserDto;
}> {
  const users = await fetchUsers(signal);
  let user = users.find(nextUser => nextUser.username === username);

  if (!user && options.createIfMissing && username === DEV_MENTOR_USERNAME) {
    const auth = await ensureDevMentorAccount(signal);
    user = {
      _id: auth.user.id,
      username: auth.user.username,
    };
  }

  if (!user) {
    throw new Error(`${username} 멘토 게시판을 찾지 못했습니다.`);
  }

  const board = await fetchUserBoard(user._id, signal);

  return { board, user };
}

export type SubscriptionDto = {
  _id: string;
  subscriberId: string;
  mentorId: string | { _id: string; username: string; createdAt?: string };
  createdAt?: string;
};

export async function fetchMySubscriptions(
  token: string,
  signal?: AbortSignal,
): Promise<SubscriptionDto[]> {
  return requestJson<SubscriptionDto[]>('/user/subscriptions', {
    signal,
    token,
  });
}

export async function subscribeMentor({
  mentorId,
  signal,
  token,
}: {
  mentorId: string;
  signal?: AbortSignal;
  token: string;
}): Promise<SubscriptionDto> {
  return postJson<SubscriptionDto>(`/user/subscribe/${mentorId}`, undefined, {
    signal,
    token,
  });
}

export async function unsubscribeMentor({
  mentorId,
  signal,
  token,
}: {
  mentorId: string;
  signal?: AbortSignal;
  token: string;
}): Promise<{ message?: string }> {
  return deleteJson<{ message?: string }>(`/user/subscribe/${mentorId}`, {
    signal,
    token,
  });
}

export async function createBoardPost({
  boardId,
  content,
  signal,
  title,
  token,
}: {
  boardId: string;
  content: string;
  signal?: AbortSignal;
  title: string;
  token: string;
}): Promise<PostDto> {
  return postJson<PostDto>(
    `/user/board/${boardId}/post`,
    {
      category: '일반',
      content,
      title,
    },
    {
      signal,
      token,
    },
  );
}

export async function updateBoardPost({
  category,
  content,
  postId,
  signal,
  token,
}: {
  category?: 'Q&A' | '공지' | '일반';
  content: string;
  postId: string;
  signal?: AbortSignal;
  token: string;
}): Promise<PostDto> {
  return putJson<PostDto>(
    `/posts/${postId}`,
    {
      ...(category ? { category } : {}),
      content,
    },
    {
      signal,
      token,
    },
  );
}

export function deleteBoardPost({
  postId,
  signal,
  token,
}: {
  postId: string;
  signal?: AbortSignal;
  token: string;
}): Promise<{ message?: string }> {
  return deleteJson<{ message?: string }>(`/posts/${postId}`, {
    signal,
    token,
  });
}
