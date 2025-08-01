/*
 * Copyright 2025 coze-dev Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
import { type create } from 'zustand';

export interface SetterAction<T> {
  /**
   * 增量更新
   *
   * @example
   * // store.x: { a: 1, b: 2 }
   * setX({a: 2});
   * // store.x: { a: 2, b: 2 }
   */
  (state: Partial<T>): void;
  /**
   * 全量更新
   *
   * @example
   * // store.x: { a: 1, b: 2 }
   * setX({a: 2}, { replace: true });
   * // store.x: { a: 2 }
   */
  (state: T, config: { replace: true }): void;
}

export function setterActionFactory<T>(
  set: Parameters<Parameters<typeof create<T, []>>[0]>[0],
): SetterAction<T> {
  return (state: Partial<T>, config?: { replace: true }) => {
    if (config?.replace) {
      set(state);
    } else {
      set(prevState => ({ ...prevState, ...state }));
    }
  };
}
