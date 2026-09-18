import { Router } from 'expo-router';

export interface IOtpNavigationStrategy {
  navigate(router: Router): void;
}

export class ParentNavigationStrategy implements IOtpNavigationStrategy {
  navigate(router: Router): void {
    router.replace('/(parent-tabs)/home' as never);
  }
}

export class QariNavigationStrategy implements IOtpNavigationStrategy {
  navigate(router: Router): void {
    router.replace('/check-in' as never);
  }
}

export class OtpNavigationFactory {
  private static readonly strategies: Record<string, IOtpNavigationStrategy> = {
    parent: new ParentNavigationStrategy(),
    qari: new QariNavigationStrategy(),
  };

  static getStrategy(email: string): IOtpNavigationStrategy {
    const role = email.includes('parent') ? 'parent' : 'qari';
    return this.strategies[role] ?? this.strategies.qari;
  }
}