import React, { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Input } from '@/components/Input/Input';
import { Colors } from '@/constants/theme';

interface PasswordInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  errorMessage?: string | null;
  placeholder?: string;
}

export function PasswordInput({
  label,
  value,
  onChangeText,
  errorMessage,
  placeholder,
}: PasswordInputProps) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <Input
      label={label}
      value={value}
      onChangeText={onChangeText}
      errorMessage={errorMessage}
      placeholder={placeholder}
      secureTextEntry={!isVisible}
      autoCapitalize="none"
      rightElement={
        <TouchableOpacity onPress={() => setIsVisible((prev) => !prev)} hitSlop={8}>
          <Ionicons
            name={isVisible ? 'eye-outline' : 'eye-off-outline'}
            size={20}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      }
    />
  );
}