import React, { useCallback, useMemo, useRef, useState } from 'react';
import { StatusBar, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import {
  LiveListPage,
  LiveMentorBoardDetailPage,
  LiveMentorBoardPage,
  LiveStreamingPage,
  LiveSubPage,
  LoginPage,
  MentorBoardCreatePage,
  MentorBoardDetailPage,
  MentorBoardPage,
  MentorBroadcastCreatePage,
  MentorBroadcastPage,
  MentorBroadcastPageModalFinish,
  MentorBroadcastSummaryPage,
  MyPage,
  SearchPage,
} from '../features/pages';
import type { LiveBroadcastSummary } from '../features/screens/mentor/LiveBroadcastSummaryScreen';
import type { LivePrepareDraft } from '../features/screens/mentor/LivePrepareScreen';
import type { LiveSession } from '../features/mocks';
import { ds } from '../design-system/tokens';
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
  | 'LiveMentorBoardDetailPage'
  | 'LoginPage'
  | 'MentorBoardPage'
  | 'MentorBroadcastCreatePage'
  | 'MentorBoardCreatePage'
  | 'MentorBoardDetailPage'
  | 'MentorBroadcastPage'
  | 'MentorBroadcastPageModalFinish'
  | 'MentorBroadcastSummaryPage'
  | 'MyPage'
  | 'SearchPage';

export function AppRoot(): React.JSX.Element {
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [authUser, setAuthUser] = useState<{ id: string; username: string } | null>(null);
  const [viewerSession, setViewerSession] = useState<LiveSession | null>(null);
  const [selectedMentorBoardUsername, setSelectedMentorBoardUsername] =
    useState<string | null>(null);
  const [broadcastSession, setBroadcastSession] =
    useState<BroadcastSession | null>(null);
  const [broadcastSummary, setBroadcastSummary] =
    useState<LiveBroadcastSummary | null>(null);
  const [showBroadcastEndedModal, setShowBroadcastEndedModal] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [routeStack, setRouteStack] = useState<RouteName[]>(['LiveListPage']);
  const broadcastRuntimeRef = useRef({
    liveTime: '00:00',
    viewersCount: 0,
  });
  const route = routeStack[routeStack.length - 1];
  const usesBottomNavigation =
    route === 'LiveListPage' ||
    route === 'LiveSubPage' ||
    route === 'MyPage' ||
    route === 'SearchPage' ||
    route === 'MentorBoardPage' ||
    route === 'MentorBroadcastCreatePage' ||
    route === 'MentorBroadcastSummaryPage';

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

  const handleLogin = (token: string, user: { id: string; username: string }) => {
    setAuthToken(token);
    setAuthUser(user);
    navigation.goBack();
  };

  const openLoginPage = () => {
    navigation.navigate('LoginPage');
  };

  const enterMentorConsole = () => {
    if (!authToken) {
      navigation.navigate('LoginPage');
      return;
    }
    navigation.navigate('MentorBoardPage');
  };

  const openViewerLive = (session?: LiveSession) => {
    setViewerSession(session ?? null);
    setShowBroadcastEndedModal(false);
    navigation.navigate('LiveStreamingPage');
  };

  const openMentorBroadcastCreate = () => {
    if (!authToken) {
      navigation.navigate('LoginPage');
      return;
    }
    navigation.reset('MentorBroadcastCreatePage');
  };

  const openPublicMentorBoard = (username?: string | null) => {
    setSelectedMentorBoardUsername(username?.trim() || null);
    navigation.navigate('LiveMentorBoardPage');
  };

  const exitMentorConsole = () => {
    setBroadcastSession(null);
    setBroadcastSummary(null);
    setShowBroadcastEndedModal(false);
    setShowFinishModal(false);
    disconnectBroadcastSocket();
    navigation.reset('LiveListPage');
  };

  const handleViewerBroadcastEnded = useCallback(() => {
    setShowBroadcastEndedModal(true);
  }, []);

  const leaveEndedBroadcast = () => {
    disconnectBroadcastSocket();
    setViewerSession(null);
    setShowBroadcastEndedModal(false);
    navigation.reset('LiveListPage');
  };

  const startMentorBroadcast = async ({ title, topic }: LivePrepareDraft) => {
    if (!authToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const session = await createBroadcastSession({
      topic,
      title,
      token: authToken,
    });

    setBroadcastSession(session);
    setBroadcastSummary(null);
    broadcastRuntimeRef.current = {
      liveTime: '00:00',
      viewersCount: session.viewersCount ?? 0,
    };
    setShowFinishModal(false);
    navigation.replace('MentorBroadcastPage');
  };

  const finishMentorBroadcast = async (): Promise<LiveBroadcastSummary | null> => {
    const session = broadcastSession;
    const summary = session
      ? {
          durationSeconds: getDurationSeconds(session.createdAt),
          title: session.title,
          viewersCount: broadcastRuntimeRef.current.viewersCount,
        }
      : null;

    try {
      if (session && authToken) {
        await endBroadcast({
          broadcastId: session.broadcastId,
          token: authToken,
        });
      }
    } finally {
      disconnectBroadcastSocket();
      setBroadcastSession(null);
      setBroadcastSummary(summary);
      setShowFinishModal(false);
    }

    return summary;
  };

  const openMentorBoardFromSummary = () => {
    setBroadcastSummary(null);
    navigation.reset('MentorBoardPage');
  };

  const screen = (() => {
    switch (route) {
      case 'LiveListPage':
        return (
          <LiveListPage
            authToken={authToken}
            onOpenLive={session => openViewerLive(session)}
            onOpenLogin={openLoginPage}
            onOpenMentor={() => openPublicMentorBoard()}
            onOpenMy={() => navigation.navigate('MyPage')}
          />
        );
      case 'LiveSubPage':
        return (
          <LiveSubPage
            authToken={authToken}
            onOpenLive={session => openViewerLive(session)}
            onOpenLogin={openLoginPage}
            onOpenMentor={() => openPublicMentorBoard()}
            onOpenMy={() => navigation.navigate('MyPage')}
          />
        );
      case 'LiveStreamingPage':
        return (
          <LiveStreamingPage
            onBack={navigation.goBack}
            onBroadcastEnded={handleViewerBroadcastEnded}
            onOpenMentorBoard={() =>
              openPublicMentorBoard(viewerSession?.mentor)
            }
            session={viewerSession}
            viewerToken={authToken}
          />
        );
      case 'LiveMentorBoardPage':
        return (
          <LiveMentorBoardPage
            mentorUsername={selectedMentorBoardUsername}
            onBack={navigation.goBack}
            onOpenPost={() => navigation.navigate('LiveMentorBoardDetailPage')}
            onOpenPrepare={() => {
              void openMentorBroadcastCreate();
            }}
            viewerToken={authToken}
          />
        );
      case 'LiveMentorBoardDetailPage':
        return <LiveMentorBoardDetailPage onBack={navigation.goBack} />;
      case 'LoginPage':
        return (
          <LoginPage onBack={navigation.goBack} onLogin={handleLogin} />
        );
      case 'MentorBoardPage':
        return (
          <MentorBoardPage
            mentorToken={authToken}
            mentorUsername={authUser?.username}
            onBack={exitMentorConsole}
            onCompose={() => navigation.navigate('MentorBoardCreatePage')}
            onOpenPost={() => navigation.navigate('MentorBoardDetailPage')}
            onOpenPrepare={() => navigation.reset('MentorBroadcastCreatePage')}
          />
        );
      case 'MentorBroadcastCreatePage':
        return (
          <MentorBroadcastCreatePage
            mentorUsername={authUser?.username}
            onBack={exitMentorConsole}
            onOpenBoard={() => navigation.reset('MentorBoardPage')}
            onStart={startMentorBroadcast}
          />
        );
      case 'MentorBoardCreatePage':
        return (
          <MentorBoardCreatePage
            mentorToken={authToken}
            mentorUsername={authUser?.username}
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
              mentorToken={authToken}
              session={broadcastSession}
              onEnd={() => setShowFinishModal(true)}
              onRuntimeStatusChange={status => {
                broadcastRuntimeRef.current = status;
              }}
            />
          </View>
        );
      case 'MentorBroadcastPageModalFinish':
        return (
          <MentorBroadcastPageModalFinish
            onCancel={navigation.goBack}
            onConfirm={() => {
              void finishMentorBroadcast().finally(() => {
                navigation.replace('MentorBroadcastSummaryPage');
              });
            }}
          />
        );
      case 'MentorBroadcastSummaryPage':
        return (
          <MentorBroadcastSummaryPage
            onExit={openMentorBoardFromSummary}
            summary={broadcastSummary}
          />
        );
      case 'MyPage':
        return (
          <MyPage
            authUser={authUser}
            onOpenLive={() => navigation.reset('LiveListPage')}
            onOpenLogin={openLoginPage}
            onOpenMentorConsole={enterMentorConsole}
            onOpenMyLive={() => navigation.navigate('LiveSubPage')}
          />
        );
      case 'SearchPage':
        return (
          <SearchPage
            onBack={navigation.goBack}
            onOpenLive={session => {
              void openViewerLive(session);
            }}
            onOpenMentor={() => openPublicMentorBoard()}
          />
        );
      default:
        return null;
    }
  })();

  return (
    <View
      className="flex-1"
      style={{
        backgroundColor: usesBottomNavigation ? ds.color.white : ds.color.bg,
      }}
    >
      <SafeAreaView
        className="flex-1"
        style={{
          backgroundColor: usesBottomNavigation ? ds.color.white : ds.color.bg,
        }}
      >
        <StatusBar barStyle="dark-content" backgroundColor={ds.color.bg} />
        {screen}
      </SafeAreaView>
      {route === 'MentorBroadcastPage' && showFinishModal ? (
        <MentorBroadcastPageModalFinish
          onCancel={() => setShowFinishModal(false)}
          onConfirm={() => {
            void finishMentorBroadcast().finally(() => {
              navigation.replace('MentorBroadcastSummaryPage');
            });
          }}
        />
      ) : null}
      {route === 'LiveStreamingPage' && showBroadcastEndedModal ? (
        <MentorBroadcastPageModalFinish
          confirmLabel="홈으로"
          description="멘토가 라이브 멘토링을 종료했습니다."
          onConfirm={leaveEndedBroadcast}
          showCancel={false}
          title="라이브가 종료되었습니다"
        />
      ) : null}
    </View>
  );
}

function getDurationSeconds(createdAt?: string): number {
  if (!createdAt) {
    return 0;
  }

  const startedAt = new Date(createdAt).getTime();

  if (!Number.isFinite(startedAt)) {
    return 0;
  }

  return Math.max(0, Math.floor((Date.now() - startedAt) / 1000));
}
