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
 
import * as t from '../src/thrift';

describe('ferry-parser', () => {
  describe('thrift service', () => {
    it('should convert service extenstions', () => {
      const idl = `
      service Foo {
      } (api.uri_prefix = 'https://example.com')
      `;

      const expected = { uri_prefix: 'https://example.com' };
      const document = t.parse(idl);
      const { extensionConfig } = document.body[0] as t.ServiceDefinition;
      return expect(extensionConfig).to.eql(expected);
    });
  });
});
