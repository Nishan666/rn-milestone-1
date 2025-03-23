import { useState } from 'react';
import { saveProfile } from '../store/slices/profileSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';

export const useNicknameViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [nickname, setNickname] = useState('');
  const [errors, setErrors] = useState<{
    nickname?: string;
  }>({});

  const validateForm = () => {
    const newErrors: {
      nickname?: string;
      email?: string;
    } = {};

    if (!nickname.trim()) {
      newErrors.nickname = 'Nickname is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    dispatch(saveProfile({ email: 'sad.com', nickname: nickname }));
  };

  return {
    handleSubmit,
    nickname,
    setNickname,
    errors,
    setErrors
  };
};
