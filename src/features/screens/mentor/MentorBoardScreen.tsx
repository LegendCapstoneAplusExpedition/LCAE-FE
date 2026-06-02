import React, { useEffect, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';

import { mentorBoardSummary } from '../../mocks';
import { useMentorBoard } from '../../hooks/useMentorBoard';
import {
  deleteBoardPost,
  fetchMySubscriptions,
  subscribeMentor,
  unsubscribeMentor,
  updateBoardPost,
} from '../../../services/api/users';
import {
  BackButton,
  Screen,
  Tag,
} from '../../../design-system/components/Primitives';
import { MentoLogo } from '../../../design-system/components/MentoLogo';
import { PostCard } from '../../components/Cards';
import {
  MentorConsoleNavigation,
  MentorConsoleTab,
} from '../../components/MentorConsoleNavigation';

type Props = {
  mentorToken?: string | null;
  mentorUsername?: string | null;
  onBack: () => void;
  onCompose?: () => void;
  onOpenPost?: () => void;
  onOpenPrepare?: () => void;
  readOnly?: boolean;
  viewerToken?: string | null;
};

export function MentorBoardScreen({
  mentorToken,
  mentorUsername,
  onBack,
  onCompose,
  onOpenPost,
  onOpenPrepare,
  readOnly = false,
  viewerToken,
}: Props): React.JSX.Element {
  const {
    board,
    error: boardError,
    loading: boardLoading,
    posts: mentorPosts,
    profile: mentorProfile,
    refetch,
  } = useMentorBoard({ username: mentorUsername });
  const [editingPostId, setEditingPostId] = useState<string | null>(null);
  const [editBody, setEditBody] = useState('');
  const [mutationError, setMutationError] = useState<string | null>(null);
  const [savingPostId, setSavingPostId] = useState<string | null>(null);
  const [deletingPostId, setDeletingPostId] = useState<string | null>(null);
  const canManage = Boolean(mentorToken) && !readOnly;
  const canSubscribe = readOnly && Boolean(viewerToken);
  const boardOwnerId = board?.ownerId;
  const [subscribed, setSubscribed] = useState(false);
  const [subscribing, setSubscribing] = useState(false);

  useEffect(() => {
    if (!canSubscribe || !boardOwnerId || !viewerToken) {
      return;
    }

    const controller = new AbortController();

    fetchMySubscriptions(viewerToken, controller.signal)
      .then(subs => {
        const isSubscribed = subs.some(s => {
          const mId = typeof s.mentorId === 'string' ? s.mentorId : s.mentorId._id;
          return mId === boardOwnerId;
        });
        setSubscribed(isSubscribed);
      })
      .catch(() => {});

    return () => controller.abort();
  }, [canSubscribe, boardOwnerId, viewerToken]);

  const handleSubscribeToggle = async () => {
    if (!viewerToken || !board || subscribing) {
      return;
    }

    setSubscribing(true);
    try {
      if (subscribed) {
        await unsubscribeMentor({ mentorId: board.ownerId, token: viewerToken });
        setSubscribed(false);
      } else {
        await subscribeMentor({ mentorId: board.ownerId, token: viewerToken });
        setSubscribed(true);
      }
    } catch {
    } finally {
      setSubscribing(false);
    }
  };

  const beginEdit = (postId: string, body: string) => {
    setEditingPostId(postId);
    setEditBody(body);
    setMutationError(null);
  };

  const cancelEdit = () => {
    setEditingPostId(null);
    setEditBody('');
    setMutationError(null);
  };

  const handleSaveEdit = async (postId: string) => {
    const content = editBody.trim();

    if (!mentorToken) {
      setMutationError('멘토 토큰이 없습니다.');
      return;
    }

    if (!content) {
      setMutationError('내용을 입력하세요.');
      return;
    }

    setSavingPostId(postId);
    setMutationError(null);

    try {
      await updateBoardPost({
        content,
        postId,
        token: mentorToken,
      });
      cancelEdit();
      await refetch();
    } catch {
      setMutationError('게시글을 수정하지 못했습니다.');
    } finally {
      setSavingPostId(null);
    }
  };

  const handleDelete = async (postId: string) => {
    if (!mentorToken) {
      setMutationError('멘토 토큰이 없습니다.');
      return;
    }

    setDeletingPostId(postId);
    setMutationError(null);

    try {
      await deleteBoardPost({
        postId,
        token: mentorToken,
      });
      if (editingPostId === postId) {
        cancelEdit();
      }
      await refetch();
    } catch {
      setMutationError('게시글을 삭제하지 못했습니다.');
    } finally {
      setDeletingPostId(null);
    }
  };

  const confirmDelete = (postId: string) => {
    Alert.alert('게시글 삭제', '이 게시글을 삭제할까요?', [
      { style: 'cancel', text: '취소' },
      {
        onPress: () => {
          void handleDelete(postId);
        },
        style: 'destructive',
        text: '삭제',
      },
    ]);
  };

  const handleTabChange = (tab: MentorConsoleTab) => {
    if (tab === 'live') {
      onOpenPrepare?.();
    }
  };

  return (
    <Screen>
      <View className="h-12 justify-center px-4">
        <BackButton onPress={onBack} />
      </View>

      <ScrollView
        contentContainerClassName="px-5 pb-[18px]"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 pb-[14px] pt-1">
          <MentoLogo size={56} />
          <View className="flex-1">
            <View className="flex-row items-center gap-[6px]">
              <Text className="text-[18px] font-black tracking-normal text-ink">
                {mentorProfile?.name ?? '멘토'}
              </Text>
              <Tag tone="yellow">{readOnly ? '멘토 게시판' : '내 채널'}</Tag>
            </View>
            <Text className="mt-[2px] text-[11.5px] leading-4 tracking-normal text-muted">
              {mentorProfile?.subtitle ?? '게시판 정보를 불러오는 중입니다.'}
            </Text>
          </View>
          {canSubscribe ? (
            <Pressable
              accessibilityRole="button"
              className={`h-9 justify-center rounded-[10px] px-4 active:opacity-70 ${subscribed ? 'bg-chip' : 'bg-yellow'}`}
              disabled={subscribing}
              onPress={() => {
                void handleSubscribeToggle();
              }}
            >
              <Text
                className={`text-[12px] font-black tracking-normal ${subscribed ? 'text-muted' : 'text-ink'}`}
              >
                {subscribing ? '...' : subscribed ? '구독중' : '구독'}
              </Text>
            </Pressable>
          ) : null}
        </View>

        <View className="flex-row items-center justify-between pb-2">
          <Text className="text-[13px] font-black tracking-normal text-ink">
            {readOnly ? '게시글' : '내 게시글'} {mentorPosts.length}
          </Text>
          <Text className="text-[11px] tracking-normal text-muted2">
            {mentorBoardSummary.sortLabel}
          </Text>
        </View>

        <View className="gap-2">
          {mutationError ? (
            <Text className="rounded-[10px] bg-yellowSoft px-3 py-2 text-[11px] font-bold tracking-normal text-yellowDeep">
              {mutationError}
            </Text>
          ) : null}
          {boardLoading ? (
            <Text className="py-8 text-center text-[12px] tracking-normal text-muted">
              게시글을 불러오는 중입니다.
            </Text>
          ) : boardError ? (
            <Text className="py-8 text-center text-[12px] tracking-normal text-muted">
              게시글을 불러오지 못했습니다.
            </Text>
          ) : mentorPosts.length === 0 ? (
            <Text className="py-8 text-center text-[12px] tracking-normal text-muted">
              작성된 게시글이 없습니다.
            </Text>
          ) : (
            mentorPosts.map(post => (
              <View key={post.id} className="gap-2">
                <PostCard
                  actions={
                    canManage ? (
                      <View className="flex-row justify-end gap-2">
                        <Pressable
                          accessibilityRole="button"
                          className="h-8 justify-center rounded-[9px] bg-chip px-3 active:bg-line2"
                          onPress={() => beginEdit(post.id, post.body)}
                        >
                          <Text className="text-[11px] font-black tracking-normal text-muted">
                            수정
                          </Text>
                        </Pressable>
                        <Pressable
                          accessibilityRole="button"
                          className="h-8 justify-center rounded-[9px] bg-yellowSoft px-3 active:bg-line2"
                          onPress={() => confirmDelete(post.id)}
                        >
                          <Text className="text-[11px] font-black tracking-normal text-yellowDeep">
                            {deletingPostId === post.id ? '삭제중' : '삭제'}
                          </Text>
                        </Pressable>
                      </View>
                    ) : undefined
                  }
                  post={post}
                  onPress={onOpenPost}
                />
                {editingPostId === post.id ? (
                  <View className="gap-2 rounded-[14px] border border-line bg-white p-3">
                    <TextInput
                      className="min-h-[110px] rounded-[10px] bg-chip px-3 py-2 text-[13px] leading-[20px] tracking-normal text-ink"
                      multiline
                      onChangeText={setEditBody}
                      placeholder="게시글 내용을 입력하세요."
                      placeholderTextColor="#9A9DAE"
                      textAlignVertical="top"
                      value={editBody}
                    />
                    <View className="flex-row justify-end gap-2">
                      <Pressable
                        accessibilityRole="button"
                        className="h-9 justify-center rounded-[10px] border border-line bg-white px-4 active:bg-chip"
                        onPress={cancelEdit}
                      >
                        <Text className="text-[12px] font-black tracking-normal text-muted">
                          취소
                        </Text>
                      </Pressable>
                      <Pressable
                        accessibilityRole="button"
                        className="h-9 justify-center rounded-[10px] bg-yellow px-4 active:bg-yellowSoft"
                        onPress={() => {
                          void handleSaveEdit(post.id);
                        }}
                      >
                        <Text className="text-[12px] font-black tracking-normal text-ink">
                          {savingPostId === post.id ? '저장중' : '저장'}
                        </Text>
                      </Pressable>
                    </View>
                  </View>
                ) : null}
              </View>
            ))
          )}
          {canManage ? (
            <Pressable
              accessibilityRole="button"
              className="h-11 flex-row items-center justify-center gap-[6px] rounded-[12px] border-[1.5px] border-dashed border-line bg-white active:bg-chip"
              onPress={onCompose}
            >
              <Text className="text-[16px] font-black text-yellowDeep">+</Text>
              <Text className="text-[13px] font-extrabold tracking-normal text-muted">
                새 게시글 작성
              </Text>
            </Pressable>
          ) : null}
        </View>
      </ScrollView>

      {readOnly ? null : (
        <MentorConsoleNavigation active="board" onChange={handleTabChange} />
      )}
    </Screen>
  );
}
