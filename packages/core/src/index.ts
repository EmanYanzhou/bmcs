enum BmcsCoreState {
  Uninitialized,
  Initialized,
  Ready,
  Destroyed,
}

enum LifeCycleHookName {
  BeforeInit = 'beforeInit',
  AfterInit = 'afterInit',
  BeforeDestroy = 'beforeDestroy',
  AfterDestroy = 'afterDestroy',
}

type LifeCycleHook = (...args: Array<unknown>) => void | Promise<unknown>;

class BmcsCore {
  // 单例实例
  private static instance: BmcsCore | undefined = undefined;
  // 当前生命周期状态
  private currentLifeCycleState: BmcsCoreState = BmcsCoreState.Uninitialized;
  // 生命周期钩子函数集合
  private lifeCycleHooks: Map<LifeCycleHookName, Array<LifeCycleHook>> = new Map([
    [LifeCycleHookName.BeforeInit, []],
    [LifeCycleHookName.AfterInit, []],
    [LifeCycleHookName.BeforeDestroy, []],
    [LifeCycleHookName.AfterDestroy, []],
  ]);

  // 私有构造函数
  private constructor() {}
  // 获取核心单例实例
  public static getCoreInstance(): BmcsCore {
    return (BmcsCore.instance ??= new BmcsCore());
  }

  // 初始化应用
  public async init(): Promise<void> {
    if (this.currentLifeCycleState !== BmcsCoreState.Uninitialized) {
      console.log('TODO: add global exception handler -  init() can only be called once');
      return;
    }
    await this.runHooks(LifeCycleHookName.BeforeInit);
    this.currentLifeCycleState = BmcsCoreState.Initialized;
    await this.runHooks(LifeCycleHookName.AfterInit);
  }
  // 应用就绪
  public ready(): void {
    if (this.currentLifeCycleState !== BmcsCoreState.Initialized) {
      console.log('TODO: add global exception handler - ready() can only be called after init()');
      return;
    }
    this.currentLifeCycleState = BmcsCoreState.Ready;
  }
  // 销毁应用
  public async destroy(): Promise<void> {
    if (this.currentLifeCycleState === BmcsCoreState.Destroyed) {
      console.log('TODO: add global exception handler - destroy() can only be called once');
      return;
    }
    await this.runHooks(LifeCycleHookName.BeforeDestroy);
    this.currentLifeCycleState = BmcsCoreState.Destroyed;
    await this.runHooks(LifeCycleHookName.AfterDestroy);
  }
  // 重置应用状态
  public reset(): void {
    this.currentLifeCycleState = BmcsCoreState.Uninitialized;
  }

  // 注册初始化前钩子函数
  public beforeInit(hook: LifeCycleHook): BmcsCore {
    this.lifeCycleHooks.get(LifeCycleHookName.BeforeInit)!.push(hook);
    return this;
  }
  // 注册初始化后钩子函数
  public afterInit(hook: LifeCycleHook): BmcsCore {
    this.lifeCycleHooks.get(LifeCycleHookName.AfterInit)!.push(hook);
    return this;
  }
  // 注册销毁前钩子函数
  public beforeDestroy(hook: LifeCycleHook): BmcsCore {
    this.lifeCycleHooks.get(LifeCycleHookName.BeforeDestroy)!.push(hook);
    return this;
  }
  // 注册销毁后钩子函数
  public afterDestroy(hook: LifeCycleHook): BmcsCore {
    this.lifeCycleHooks.get(LifeCycleHookName.AfterDestroy)!.push(hook);
    return this;
  }

  // 运行生命周期钩子函数
  private async runHooks(hookName: LifeCycleHookName): Promise<void> {
    const hooks = this.lifeCycleHooks.get(hookName);
    if (!hooks || hooks.length === 0) return;
    for (const hook of hooks) {
      await hook();
    }
  }

  // 启动应用
  public async start(): Promise<void> {
    await this.init();
    this.ready();
  }

  // 获取当前生命周期状态
  public getCurrentLifeCycleState(): BmcsCoreState {
    return this.currentLifeCycleState;
  }
}

export default BmcsCore;
