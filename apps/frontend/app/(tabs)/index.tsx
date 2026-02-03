import { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Animated,
  Image,
} from 'react-native';
import { useChat } from '../../hooks/useChat';
import { theme } from '../../lib/theme';
import { ChatMessage } from '../../lib/store';

// チャットバブルコンポーネント
function ChatBubble({
  message,
  isUser,
}: {
  message: ChatMessage;
  isUser: boolean;
}) {
  return (
    <View style={[styles.bubbleContainer, isUser && styles.bubbleContainerUser]}>
      {!isUser && (
        <View style={styles.avatarContainer}>
          <Text style={styles.avatarText}>🎀</Text>
        </View>
      )}
      <View style={[styles.bubble, isUser ? styles.bubbleUser : styles.bubbleAssistant]}>
        <Text style={[styles.bubbleText, isUser && styles.bubbleTextUser]}>
          {message.content}
        </Text>
      </View>
    </View>
  );
}

// ローディングインジケーター
function TypingIndicator() {
  const dots = [useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current, useRef(new Animated.Value(0)).current];

  useEffect(() => {
    const animations = dots.map((dot, index) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(index * 200),
          Animated.timing(dot, {
            toValue: 1,
            duration: 400,
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 400,
            useNativeDriver: true,
          }),
        ])
      )
    );

    animations.forEach((anim) => anim.start());

    return () => animations.forEach((anim) => anim.stop());
  }, []);

  return (
    <View style={styles.typingContainer}>
      <View style={styles.avatarContainer}>
        <Text style={styles.avatarText}>🎀</Text>
      </View>
      <View style={styles.typingBubble}>
        {dots.map((dot, index) => (
          <Animated.View
            key={index}
            style={[
              styles.typingDot,
              {
                transform: [
                  {
                    translateY: dot.interpolate({
                      inputRange: [0, 1],
                      outputRange: [0, -6],
                    }),
                  },
                ],
              },
            ]}
          />
        ))}
      </View>
    </View>
  );
}

// クイックリプライボタン
function QuickReply({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) {
  return (
    <TouchableOpacity style={styles.quickReply} onPress={onPress}>
      <Text style={styles.quickReplyText}>{text}</Text>
    </TouchableOpacity>
  );
}

export default function HomeScreen() {
  const { messages, loading, sendMessage, clearMessages } = useChat();
  const [inputText, setInputText] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  // 新しいメッセージが追加されたらスクロール
  useEffect(() => {
    if (scrollViewRef.current) {
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  }, [messages, loading]);

  const handleSend = () => {
    if (inputText.trim() && !loading) {
      sendMessage(inputText);
      setInputText('');
    }
  };

  const handleQuickReply = (text: string) => {
    if (!loading) {
      sendMessage(text);
    }
  };

  const quickReplies = [
    '今日の運勢を教えて',
    '恋愛相談したい',
    '仕事で悩んでる',
    '元気が出る言葉をちょうだい',
  ];

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
    >
      {/* キャラクターエリア */}
      {messages.length === 0 && (
        <View style={styles.characterArea}>
          <View style={styles.characterImageContainer}>
            <Image
              source={{ uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop' }}
              style={styles.characterImage}
            />
            <View style={styles.characterBadge}>
              <Text style={styles.characterBadgeText}>AI</Text>
            </View>
          </View>
          <Text style={styles.characterName}>マツコAI</Text>
          <Text style={styles.characterDescription}>
            愛のある毒舌でアンタを導くわよ！{'\n'}
            何でも相談してちょうだい 💕
          </Text>
        </View>
      )}

      {/* チャットエリア */}
      <ScrollView
        ref={scrollViewRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.length === 0 && (
          <View style={styles.welcomeMessage}>
            <View style={styles.welcomeBubble}>
              <Text style={styles.welcomeText}>
                あら、いらっしゃい！アタシはマツコAI。{'\n'}
                占いもできるし、悩み相談も聞くわよ。{'\n'}
                何か話したいことがあったら、遠慮なく言ってちょうだい！
              </Text>
            </View>
          </View>
        )}

        {messages.map((message) => (
          <ChatBubble
            key={message.id}
            message={message}
            isUser={message.role === 'user'}
          />
        ))}

        {loading && <TypingIndicator />}
      </ScrollView>

      {/* クイックリプライ */}
      {messages.length === 0 && (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.quickRepliesContainer}
        >
          {quickReplies.map((reply) => (
            <QuickReply
              key={reply}
              text={reply}
              onPress={() => handleQuickReply(reply)}
            />
          ))}
        </ScrollView>
      )}

      {/* 入力エリア */}
      <View style={styles.inputArea}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.textInput}
            placeholder="メッセージを入力..."
            placeholderTextColor={theme.colors.textLight}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={!loading}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!inputText.trim() || loading) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!inputText.trim() || loading}
          >
            <Text style={styles.sendButtonText}>送信</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  characterArea: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 20,
  },
  characterImageContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  characterImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: theme.colors.primary,
  },
  characterBadge: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.secondary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: theme.colors.backgroundWhite,
  },
  characterBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: theme.colors.textWhite,
  },
  characterName: {
    fontSize: 24,
    fontWeight: '800',
    color: theme.colors.textPrimary,
    marginBottom: 8,
  },
  characterDescription: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  chatArea: {
    flex: 1,
  },
  chatContent: {
    padding: 16,
    paddingBottom: 8,
  },
  welcomeMessage: {
    marginBottom: 16,
  },
  welcomeBubble: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  welcomeText: {
    fontSize: 14,
    lineHeight: 22,
    color: theme.colors.textSecondary,
    fontStyle: 'italic',
  },
  bubbleContainer: {
    flexDirection: 'row',
    marginBottom: 12,
    alignItems: 'flex-end',
  },
  bubbleContainerUser: {
    flexDirection: 'row-reverse',
  },
  avatarContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontSize: 18,
  },
  bubble: {
    maxWidth: '75%',
    padding: 12,
    borderRadius: 16,
  },
  bubbleAssistant: {
    backgroundColor: theme.colors.backgroundWhite,
    borderBottomLeftRadius: 4,
    ...theme.shadow.sm,
  },
  bubbleUser: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: 4,
    marginLeft: 44,
  },
  bubbleText: {
    fontSize: 15,
    lineHeight: 22,
    color: theme.colors.textPrimary,
  },
  bubbleTextUser: {
    color: theme.colors.textWhite,
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginBottom: 12,
  },
  typingBubble: {
    flexDirection: 'row',
    backgroundColor: theme.colors.backgroundWhite,
    padding: 12,
    borderRadius: 16,
    borderBottomLeftRadius: 4,
    ...theme.shadow.sm,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.primary,
    marginHorizontal: 3,
  },
  quickRepliesContainer: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 8,
  },
  quickReply: {
    backgroundColor: theme.colors.backgroundWhite,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  quickReplyText: {
    fontSize: 14,
    color: theme.colors.primary,
    fontWeight: '500',
  },
  inputArea: {
    padding: 12,
    backgroundColor: theme.colors.backgroundWhite,
    borderTopWidth: 1,
    borderTopColor: theme.colors.borderLight,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  textInput: {
    flex: 1,
    backgroundColor: theme.colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    color: theme.colors.textPrimary,
  },
  sendButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: theme.colors.border,
  },
  sendButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: theme.colors.textWhite,
  },
});
