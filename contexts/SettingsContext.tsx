'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useSession } from 'next-auth/react';
import { getSettings, saveSettings } from '@/app/actions/settings';
import { DEFAULT_SETTINGS, type Settings } from '@/types/settings';

/**
 * SettingsContextの型定義
 */
interface SettingsContextType {
  settings: Settings;
  updateSettings: (newSettings: Settings) => Promise<{
    success: boolean;
    error?: string;
  }>;
  isLoading: boolean;
}

/**
 * Contextの作成（初期値はundefined）
 */
const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

/**
 * SettingsProviderコンポーネント
 * アプリ全体に設定データを提供する
 */
export function SettingsProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [isLoading, setIsLoading] = useState(true);

  /**
   * ログイン状態が変わったら設定を読み込む
   */
  useEffect(() => {
    async function loadSettings() {
      // 認証状態の確認中は何もしない
      if (status === 'loading') {
        return;
      }

      // 未ログインの場合はデフォルト値を使用
      if (!session) {
        setSettings(DEFAULT_SETTINGS);
        setIsLoading(false);
        return;
      }

      // ログイン済みの場合はデータベースから設定を取得
      try {
        const userSettings = await getSettings();
        if (userSettings) {
          setSettings(userSettings);
        }
      } catch (error) {
        console.error('設定の読み込みに失敗しました:', error);
        setSettings(DEFAULT_SETTINGS);
      } finally {
        setIsLoading(false);
      }
    }

    loadSettings();
  }, [session, status]);

  /**
   * 設定を更新する関数
   * ログイン時のみデータベースに保存
   */
  const updateSettings = async (newSettings: Settings) => {
    // 元の設定を保存しておく
    const previousSettings = settings;
    
    // まずローカルの状態を更新（即座にUIに反映）
    setSettings(newSettings);

    // ログイン済みの場合のみデータベースに保存
    if (session) {
      const result = await saveSettings(newSettings);
      if (!result.success) {
        // 保存失敗時は元の設定に戻す
        setSettings(previousSettings);
        console.error('設定の保存に失敗しました：', result.error);
        return result;
      }
      return result;
    }

    // 未ログイン時は保存せず成功を返す（ローカルの状態のみ更新）
    return { success: true };
  };

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, isLoading }}>
      {children}
    </SettingsContext.Provider>
  );
}

/**
 * useSettingsフック
 * どこからでも設定データにアクセスできる
 */
export function useSettings() {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error( 'useSettingsはSettingsProvider内で使用してください。');
  }
  return context;
}