export interface TabConfig {
  name: string;
  label: string;
  activeIcon: any;
  inactiveIcon: any;
}

export const TAB_CONFIG = [
  {
    name: 'profile',
    label: 'پروفائل',
    activeIcon: require('@/assets/icons/profile-active.png'),
    inactiveIcon: require('@/assets/icons/profile-inactive.png'),
  },
  {
    name: 'performance',
    label: 'کارکردگی',
    activeIcon: require('@/assets/icons/performance-active.png'),
    inactiveIcon: require('@/assets/icons/performance-inactive.png'),
  },
  {
    name: 'roznama',
    label: 'روزنامہ',
    activeIcon: require('@/assets/icons/diary-active.png'),
    inactiveIcon: require('@/assets/icons/diary-inactive.png'),
  },
  {
    name: 'attendance',
    label: 'حاضری',
    activeIcon: require('@/assets/icons/attendance-active.png'),
    inactiveIcon: require('@/assets/icons/attendance-inactive.png'),
  },
  {
    name: 'home',
    label: 'ہوم',
    activeIcon: require('@/assets/icons/home-active.png'),
    inactiveIcon: require('@/assets/icons/home-inactive.png'),
  },
];