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
 
export interface AudioRecordProps {
  isPointerMoveOut?: boolean;
  isRecording?: boolean;
  getVolume?: () => number;
  text?: string;
}

type EventType = MouseEvent | TouchEvent | KeyboardEvent;
type InteractionEventType = EventType | KeyboardEvent;

export interface AudioRecordEvents {
  onStart?: (eventType: InteractionEventType) => void;
  onEnd?: (eventType: InteractionEventType | undefined) => void;
  onMoveLeave?: () => void;
  onMoveEnter?: () => void;
}

export interface AudioRecordOptions {
  getIsShortcutKeyDisabled?: () => boolean;
  /** 参考 ahooks useKeypress 入参 */
  shortcutKey?: string | number;
  enabled?: boolean;
  getActiveZoneTarget?: () => HTMLElement | null;
}
