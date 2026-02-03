/**
 * セッション管理ユーティリティ
 */

import { 
  createDefaultUserProfile, 
  createDefaultSessionState 
} from '../models/schemas.js';

// メモリ内のストレージ（簡易実装）
// TODO: 将来的にはDBに移行
const userProfiles = new Map();
const sessionStates = new Map();

/**
 * ユーザープロファイルを取得
 * 存在しない場合はデフォルトを作成
 */
export function getUserProfile(userId) {
  if (!userProfiles.has(userId)) {
    const profile = createDefaultUserProfile(userId);
    userProfiles.set(userId, profile);
  }
  return userProfiles.get(userId);
}

/**
 * ユーザープロファイルを保存
 */
export function saveUserProfile(userId, profile) {
  profile.updated_at = new Date().toISOString();
  userProfiles.set(userId, profile);
}

/**
 * セッション状態を取得
 * 存在しない場合はデフォルトを作成
 */
export function getSessionState(sessionId, userId) {
  if (!sessionStates.has(sessionId)) {
    const state = createDefaultSessionState(sessionId, userId);
    sessionStates.set(sessionId, state);
  }
  return sessionStates.get(sessionId);
}

/**
 * セッション状態を保存
 */
export function saveSessionState(sessionId, state) {
  state.updated_at = new Date().toISOString();
  sessionStates.set(sessionId, state);
}

/**
 * セッションIDを生成
 */
export function generateSessionId(userId) {
  return `session_${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * セッションをクリア（テスト用）
 */
export function clearSession(sessionId) {
  sessionStates.delete(sessionId);
}

/**
 * 全セッションをクリア（テスト用）
 */
export function clearAllSessions() {
  sessionStates.clear();
}

/**
 * ユーザープロファイルをクリア（テスト用）
 */
export function clearUserProfile(userId) {
  userProfiles.delete(userId);
}

/**
 * 全ユーザープロファイルをクリア（テスト用）
 */
export function clearAllUserProfiles() {
  userProfiles.clear();
}

