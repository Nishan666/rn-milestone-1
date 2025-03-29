import { useDispatch } from 'react-redux';
import { getEnvironment, getEnvironmentAssets } from '../utils/environment';
import { AppDispatch } from '../store';
import { clearRoom } from '../store/slices/roomSlice';
import { setUser } from '../store/slices/authSlice';
import { clearNickname, clearProfile } from '../store/slices/profileSlice';
import { FirebaseService } from '../services/FirebaseService';

export const useDrawerContentViewModel = () => {
  const { appName, environment } = getEnvironment();
  const { icon } = getEnvironmentAssets();
  const dispatch = useDispatch<AppDispatch>();
  const firebaseService = FirebaseService.getInstance();


  const handleLogout = async () => {
    dispatch(clearRoom());
    dispatch(clearNickname());
    dispatch(clearProfile());
    dispatch(
      setUser({
        uid: '',
        email: '',
      }),
    );
    await firebaseService.signOut();
  };

  return {
    appName,
    environment,
    icon,
    handleLogout
  };
};
