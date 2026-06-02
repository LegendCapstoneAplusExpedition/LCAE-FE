import React from 'react';

import { PostComposeScreen } from '../../../screens/mentor/PostComposeScreen';
import {
  createBoardPost,
  fetchMentorBoard,
  fetchMentorBoardByUsername,
} from '../../../../services/api/users';

type Props = {
  mentorToken?: string | null;
  mentorUsername?: string | null;
  onBack?: () => void;
  onSubmit?: () => void;
};

const noop = () => undefined;

export function MentorBoardCreatePage({
  mentorToken,
  mentorUsername,
  onBack = noop,
  onSubmit = noop,
}: Props): React.JSX.Element {
  const handleSubmit = async (title: string, body: string) => {
    if (!mentorToken) {
      throw new Error('로그인이 필요합니다.');
    }

    const { board } = mentorUsername
      ? await fetchMentorBoardByUsername(mentorUsername, undefined, {
          createIfMissing: true,
        })
      : await fetchMentorBoard();
    await createBoardPost({
      boardId: board._id,
      content: body.trim(),
      title: title.trim(),
      token: mentorToken,
    });

    onSubmit();
  };

  return <PostComposeScreen onBack={onBack} onSubmit={handleSubmit} />;
}

export default MentorBoardCreatePage;
