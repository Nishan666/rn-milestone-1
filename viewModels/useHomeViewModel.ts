import { useSelector } from 'react-redux';
import { RootState } from '../store';

export const useHomeViewModel = () => {
  const { data: profileData, loading: profileLoading } = useSelector(
    (state: RootState) => state.profile,
  );
  const { data: roomData, loading: roomLoading } = useSelector((state: RootState) => state.room);

  const loading = profileLoading || roomLoading;

  return {
    profileData,
    roomData,
    loading,
  };
};
