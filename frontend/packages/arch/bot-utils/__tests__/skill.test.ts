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
 
import { SkillKeyEnum } from '@coze-agent-ide/tool-config';

import { skillKeyToApiStatusKeyTransformer } from '../src/skill';

vi.stubGlobal('IS_DEV_MODE', false);

vi.mock('@coze-agent-ide/tool', () => ({
  SkillKeyEnum: {
    TEXT_TO_SPEECH: 'tts',
  },
}));

describe('skill', () => {
  test('skillKeyToApiStatusKeyTransformer', () => {
    const test = SkillKeyEnum.TEXT_TO_SPEECH;
    expect(skillKeyToApiStatusKeyTransformer(test)).equal(`${test}_tab_status`);
  });
});
