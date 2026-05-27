import { API_BASE_URL } from './config';

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
  const response = await fetch(`${API_BASE_URL}${path}`, {
    body: body === undefined ? undefined : JSON.stringify(body),
    headers: {
      Accept: 'application/json',
      ...(body === undefined ? {} : { 'Content-Type': 'application/json' }),
      ...(token
        ? {
            Authorization: `Bearer ${token}`,
            'x-auth-token': token,
          }
        : {}),
    },
    method,
    signal,
  });

  if (!response.ok) {
    throw new Error(`${method} ${path} failed: ${response.status}`);
  }

  const text = await response.text();

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
  const credentials = {
    password: DEV_MENTOR_PASSWORD,
    username: DEV_MENTOR_USERNAME,
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
  const users = await fetchUsers(signal);
  let user = users.find(nextUser => nextUser.username === DEV_MENTOR_USERNAME);

  if (!user) {
    const auth = await ensureDevMentorAccount(signal);
    user = {
      _id: auth.user.id,
      username: auth.user.username,
    };
  }

  const board = await fetchUserBoard(user._id, signal);

  return { board, user };
}

export async function createBoardPost({
  boardId,
  content,
  signal,
  token,
}: {
  boardId: string;
  content: string;
  signal?: AbortSignal;
  token: string;
}): Promise<PostDto> {
  return postJson<PostDto>(
    `/user/board/${boardId}/post`,
    {
      category: '일반',
      content,
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
