import { useEffect, useState } from 'react';
import { View, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/theme';
import { scale } from '@/utils/scaling';

export default function SplashScreen() {
  const router = useRouter();
  const [showLogo, setShowLogo] = useState(false);

  useEffect(() => {
    // 1. First stage: 1.5s (1500ms) baad logo show hoga
    const logoTimer = setTimeout(() => {
      setShowLogo(true);
    }, 1500);

    // 2. Second stage: Total 3.0s (3000ms) baad login screen par replace hoga
    const navigateTimer = setTimeout(() => {
      router.replace('/login');
    }, 3000);

    return () => {
      clearTimeout(logoTimer);
      clearTimeout(navigateTimer);
    };
  }, []);

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' }}>
      {/* Background Building Image */}
      <Image
        source={require('../assets/images/splash.png')}
        style={{
          width: '100%',
          height: '100%',
          position: 'absolute',
        }}
        resizeMode="cover"
      />

      {/* 1.5 Second Baad Render Hone Wala Center Logo */}
      {showLogo && (
        <Image
          source={require('../assets/images/md.png')}
          style={{
            width: scale(424),
            height: scale(424),
          }}
          resizeMode="contain"
        />
      )}
    </View>
  );
}