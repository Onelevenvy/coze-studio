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
 
export { reporter, Reporter } from './reporter';

// reporter 需要上报到 slardar 的方法导出
export type {
  LoggerCommonProperties,
  CustomEvent,
  CustomErrorLog,
  CustomLog,
  ErrorEvent,
} from './reporter';
// console 控制台打印
export { logger, LoggerContext, Logger } from './logger';

// ErrorBoundary 相关方法
export {
  ErrorBoundary,
  useErrorBoundary,
  useErrorHandler,
  type ErrorBoundaryProps,
  type FallbackProps,
} from './error-boundary';

export { SlardarReportClient, type SlardarInstance } from './slardar';

export { LogLevel } from './types';

export { getSlardarInstance, setUserInfoContext } from './slardar/runtime';
