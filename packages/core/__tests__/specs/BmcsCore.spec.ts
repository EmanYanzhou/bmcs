import { describe, it, expect, beforeEach, vi } from 'vitest';
import BmcsCore from '@bmcs/core';

// 共享单例实例
const core = BmcsCore.getCoreInstance();

// 清空内部私有的钩子集合（通过 Reflect 访问）
function clearHooks() {
  const hooks = Reflect.get(core as object, 'lifeCycleHooks') as
    | Map<unknown, Array<(...args: unknown[]) => unknown | Promise<unknown>>>
    | undefined;
  if (hooks && typeof hooks.forEach === 'function') {
    hooks.forEach((_, key) => hooks.set(key, []));
  }
}

beforeEach(() => {
  core.reset();
  clearHooks();
});

// 根据源码枚举定义的状态码（Uninitialized=0, Initialized=1, Ready=2, Destroyed=3）
const STATE = { Uninitialized: 0, Initialized: 1, Ready: 2, Destroyed: 3 };

describe('BmcsCore 核心生命周期', () => {
  it('getCoreInstance 返回同一单例', () => {
    const a = BmcsCore.getCoreInstance();
    const b = BmcsCore.getCoreInstance();
    expect(a).toBe(b);
  });

  it('初始状态为未初始化', () => {
    expect(core.getCurrentLifeCycleState()).toBe(STATE.Uninitialized);
  });

  it('ready() 在 init() 前调用会被拒绝并保持未初始化', () => {
    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    core.ready();
    expect(core.getCurrentLifeCycleState()).toBe(STATE.Uninitialized);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('init() 将状态置为已初始化；重复调用会被拒绝', async () => {
    await core.init();
    expect(core.getCurrentLifeCycleState()).toBe(STATE.Initialized);

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await core.init();
    expect(core.getCurrentLifeCycleState()).toBe(STATE.Initialized);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('start() 依次执行 init() 与 ready()，最终就绪', async () => {
    await core.start();
    expect(core.getCurrentLifeCycleState()).toBe(STATE.Ready);
  });

  it('destroy() 将状态置为已销毁；重复调用会被拒绝', async () => {
    await core.destroy();
    expect(core.getCurrentLifeCycleState()).toBe(STATE.Destroyed);

    const spy = vi.spyOn(console, 'log').mockImplementation(() => {});
    await core.destroy();
    expect(core.getCurrentLifeCycleState()).toBe(STATE.Destroyed);
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });

  it('reset() 可重置状态回未初始化', async () => {
    await core.start();
    expect(core.getCurrentLifeCycleState()).toBe(STATE.Ready);
    core.reset();
    expect(core.getCurrentLifeCycleState()).toBe(STATE.Uninitialized);
  });

  it('钩子：init 前/后按注册顺序执行，支持异步', async () => {
    const seq: string[] = [];
    core.beforeInit(() => {
      seq.push('beforeInit-1');
    });
    core.beforeInit(async () => {
      await Promise.resolve();
      seq.push('beforeInit-2');
    });
    core.afterInit(() => {
      seq.push('afterInit');
    });

    await core.init();

    expect(seq).toEqual(['beforeInit-1', 'beforeInit-2', 'afterInit']);
  });

  it('钩子：destroy 前/后执行', async () => {
    const seq: string[] = [];
    core.beforeDestroy(() => {
      seq.push('beforeDestroy');
    });
    core.afterDestroy(() => {
      seq.push('afterDestroy');
    });

    await core.destroy();

    expect(seq).toEqual(['beforeDestroy', 'afterDestroy']);
    expect(core.getCurrentLifeCycleState()).toBe(STATE.Destroyed);
  });

  it('钩子注册 API 支持链式调用', () => {
    const returned = core.beforeInit(() => {}).afterInit(() => {});
    expect(returned).toBe(core);
  });
});
