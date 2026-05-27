import React, { useMemo, useState } from 'react';
import { Alert, StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  LiveListPage,
  LiveMentorBoardDetailPage,
  LiveMentorBoardPage,
  LiveMentorReplayPage,
  LiveRecapPage,
  LiveStreamingPage,
  LiveSubPage,
  MentorBoardCreatePage,
  MentorBoardDetailPage,
  MentorBoardPage,
  MentorBroadcastCreatePage,
  MentorBroadcastPage,
  MentorBroadcastPageModalFinish,
  MentorReplayPage,
  MyPage,
  SearchPage,
} from '../features/pages';
import type { LiveSession } from '../features/mocks';
import { ds } from '../design-system/tokens';
import {
  ensureDevMentorAccount,
  ensureDevViewerAccount,
} from '../services/api/users';
import { endBroadcast } from '../services/api/broadcasts';
import {
  createBroadcastSession,
  disconnectBroadcastSocket,
  type BroadcastSession,
} from '../services/socket/broadcastSocket';

type RouteName =
  | 'LiveListPage'
  | 'LiveSubPage'
  | 'LiveStreamingPage'
  | 'LiveMentorBoardPage'
  | 'LiveMentorReplayPage'
  | 'LiveMentorBoardDetailPage'
  | 'MentorBoardPage'
  | 'MentorBroadcastCreatePage'
  | 'MentorReplayPage'
  | 'MentorBoardCreatePage'
  | 'MentorBoardDetailPage'
  | 'MentorBroadcastPage'
  | 'MentorBroadcastPageModalFinish'
  | 'MyPage'
  | 'LiveRecapPage'
  | 'SearchPage';

export function AppRoot(): React.JSX.Element {
  const [mentorToken, setMentorToken] = useState<string | null>(null);
  const [viewerToken, setViewerToken] = useState<string | null>(null);
  const [viewerSession, setViewerSession] = useState<LiveSession | null>(null);
  const [broadcastSession, setBroadcastSession] =
    useState<BroadcastSession | null>(null);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [routeStack, setRouteStack] = useState<RouteName[]>(['LiveListPage']);
  const route = routeStack[routeStack.length - 1];
  const usesBottomNavigation =
    route === 'LiveListPage' ||
    route === 'LiveSubPage' ||
    route === 'MyPage' ||
    route === 'SearchPage' ||
    route === 'MentorBoardPage' ||
    route === 'MentorBroadcastCreatePage' ||
    route === 'MentorReplayPage';

  const navigation = useMemo(() => {
    const navigate = (next: RouteName) => {
      setRouteStack(stack => [...stack, next]);
    };
    const replace = (next: RouteName) => {
      setRouteStack(stack => [...stack.slice(0, -1), next]);
    };
    const reset = (next: RouteName) => {
      setRouteStack([next]);
    };
    const goBack = (fallback: RouteName = 'LiveListPage') => {
      setRouteStack(stack =>
        stack.length > 1 ? stack.slice(0, -1) : [fallback],
      );
    };

    return { goBack, navigate, replace, reset };
  }, []);

  const enterMentorConsole = async () => {
    try {
      const auth = await ensureDevMentorAccount();
      setMentorToken(auth.token);
      navigation.navigate('MentorBoardPage');
    } catch (error) {
      setMentorToken(null);
      Alert.alert(
        '멘토 모드 진입 실패',
        error instanceof Error
          ? error.message
          : '백엔드 서버 연결을 확인해주세요.',
      );
    }
  };

  const openViewerLive = async (session?: LiveSession) => {
    setViewerSession(session ?? null);

    try {
      const auth = await ensureDevViewerAccount();
      setViewerToken(auth.token);
    } catch {
      setViewerToken(null);
    }

    navigation.navigate('LiveStreamingPage');
  };

  const exitMentorConsole = () => {
    setMentorToken(null);
    setBroadcastSession(null);
    setShowFinishModal(false);
    disconnectBroadcastSocket();
    navigation.reset('LiveListPage');
  };

  const startMentorBroadcast = async (title: string) => {
    if (!mentorToken) {
      throw new Error('멘토 토큰이 없습니다.');
    }

    const session = await createBroadcastSession({
      title,
      token: mentorToken,
    });

    setBroadcastSession(session);
    setShowFinishModal(false);
    navigation.replace('MentorBroadcastPage');
  };

  const finishMentorBroadcast = async () => {
    try {
      if (broadcastSession && mentorToken) {
        await endBroadcast({
          broadcastId: broadcastSession.broadcastId,
          token: mentorToken,
        });
      }
    } finally {
      disconnectBroadcastSocket();
      setBroadcastSession(null);
      setShowFinishModal(false);
    }
  };

  const screen = (() => {
    switch (route) {
      case 'LiveListPage':
        return (
          <LiveListPage
            onOpenLive={session => {
              void openViewerLive(session);
            }}
            onOpenMentor={() => navigation.navigate('LiveMentorBoardPage')}
            onOpenMy={() => navigation.navigate('MyPage')}
          />
        );
      case 'LiveSubPage':
        return (
          <LiveSubPage
            onOpenLive={session => {
              void openViewerLive(session);
            }}
            onOpenMentor={() => navigation.navigate('LiveMentorBoardPage')}
            onOpenMy={() => navigation.navigate('MyPage')}
          />
        );
      case 'LiveStreamingPage':
        return (
          <LiveStreamingPage
            onBack={navigation.goBack}
            session={viewerSession}
            viewerToken={viewerToken}
          />
        );
      case 'LiveMentorBoardPage':
        return (
          <LiveMentorBoardPage
            onBack={navigation.goBack}
            onOpenPost={() => navigation.navigate('LiveMentorBoardDetailPage')}
            onOpenPrepare={() => {
              void openViewerLive();
            }}
            onOpenReplay={() => navigation.navigate('LiveMentorReplayPage')}
          />
        );
      case 'LiveMentorReplayPage':
        return <LiveMentorReplayPage onBack={navigation.goBack} />;
      case 'LiveMentorBoardDetailPage':
        return <LiveMentorBoardDetailPage onBack={navigation.goBack} />;
      case 'MentorBoardPage':
        return (
          <MentorBoardPage
            mentorToken={mentorToken}
            onBack={exitMentorConsole}
            onCompose={() => navigation.navigate('MentorBoardCreatePage')}
            onOpenPost={() => navigation.navigate('MentorBoardDetailPage')}
            onOpenPrepare={() => navigation.reset('MentorBroadcastCreatePage')}
            onOpenReplay={() => navigation.reset('MentorReplayPage')}
          />
        );
      case 'MentorBroadcastCreatePage':
        return (
          <MentorBroadcastCreatePage
            onBack={exitMentorConsole}
            onOpenBoard={() => navigation.reset('MentorBoardPage')}
            onOpenReplay={() => navigation.reset('MentorReplayPage')}
            onStart={startMentorBroadcast}
          />
        );
      case 'MentorReplayPage':
        return (
          <MentorReplayPage
            onBack={exitMentorConsole}
            onOpenBoard={() => navigation.reset('MentorBoardPage')}
            onOpenLive={() => navigation.reset('MentorBroadcastCreatePage')}
          />
        );
      case 'MentorBoardCreatePage':
        return (
          <MentorBoardCreatePage
            mentorToken={mentorToken}
            onBack={navigation.goBack}
            onSubmit={() => navigation.replace('MentorBoardPage')}
          />
        );
      case 'MentorBoardDetailPage':
        return <MentorBoardDetailPage onBack={navigation.goBack} />;
      case 'MentorBroadcastPage':
        return (
          <View className="flex-1">
            <MentorBroadcastPage
              mentorToken={mentorToken}
              session={broadcastSession}
              onEnd={() => setShowFinishModal(true)}
            />
            {showFinishModal ? (
              <MentorBroadcastPageModalFinish
                onCancel={() => setShowFinishModal(false)}
                onConfirm={() => {
                  void finishMentorBroadcast().finally(() => {
                    navigation.replace('LiveRecapPage');
                  });
                }}
              />
            ) : null}
          </View>
        );
      case 'MentorBroadcastPageModalFinish':
        return (
          <MentorBroadcastPageModalFinish
            onCancel={navigation.goBack}
            onConfirm={() => {
              void finishMentorBroadcast().finally(() => {
                navigation.replace('LiveRecapPage');
              });
            }}
          />
        );
      case 'MyPage':
        return (
          <MyPage
            onOpenLive={() => navigation.reset('LiveListPage')}
            onOpenMentorConsole={() => {
              void enterMentorConsole();
            }}
            onOpenMyLive={() => navigation.navigate('LiveSubPage')}
          />
        );
      case 'LiveRecapPage':
        return (
          <LiveRecapPage onBack={() => navigation.reset('LiveListPage')} />
        );
      case 'SearchPage':
        return (
          <SearchPage
            onBack={navigation.goBack}
            onOpenLive={session => {
              void openViewerLive(session);
            }}
            onOpenMentor={() => navigation.navigate('LiveMentorBoardPage')}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <SafeAreaView
      className="flex-1"
      style={{
        backgroundColor: usesBottomNavigation ? ds.color.white : ds.color.bg,
      }}
    >
      <StatusBar barStyle="dark-content" backgroundColor={ds.color.bg} />
      {screen}
    </SafeAreaView>
  );
}
