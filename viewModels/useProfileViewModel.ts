import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { loadProfile, clearNickname } from '../store/slices/profileSlice';
import { useNavigation } from '@react-navigation/native';

export const useProfileViewModel = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  const { data: profile, loading } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    dispatch(loadProfile());
  }, [dispatch]);

  const handleEdit = () => {
    dispatch(clearNickname());
    (navigation as any).navigate('HomeStack');
  };

  return {
    profile,
    loading,
    handleEdit,
  };
};
