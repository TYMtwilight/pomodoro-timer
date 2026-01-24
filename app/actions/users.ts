'use server';

import { auth, signOut } from '@/auth';
import { prisma } from '@/lib/prisma';

/**
 * ユーザーアカウントを削除する
 * 関連するすべてのデータ（設定、作業記録）もCascade削除される
 */
export async function deleteUserAccount(): Promise<{
  success: boolean;
  error?: string;
}> {
  const session = await auth();

  // 未ログインの場合はエラー
  if (!session?.user?.id) {
    return {
      success: false,
      error: 'ログインが必要です',
    };
  }

  try {
    // ユーザーを削除（Cascade deleteで関連データも削除される）
    await prisma.user.delete({
      where: {
        id: session.user.id,
      },
    });

    // セッションを破棄してログアウト
    await signOut({ redirect: false });

    return {
      success: true,
    };
  } catch (error) {
    console.error('アカウント削除に失敗しました：', error);
    return {
      success: false,
      error: 'アカウント削除に失敗しました',
    };
  }
}
