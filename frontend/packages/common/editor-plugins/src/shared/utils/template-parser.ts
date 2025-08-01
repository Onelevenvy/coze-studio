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
 
import { type SyntaxNode } from '@lezer/common';
import { type EditorAPI } from '@coze-editor/editor/preset-prompt';
import { type SelectionEnlargerSpec } from '@coze-editor/editor';
import { StateField, type EditorState } from '@codemirror/state';
import { syntaxTree } from '@codemirror/language';
export interface MarkRange {
  from: number;
  to: number;
}
export interface MarkRangeInfo {
  from: number;
  to: number;
  open: MarkRange;
  close: MarkRange;
}

// 解析模板字符串: {#slot name="slot_name" #}xxx{#/slot#}
export class TemplateParser {
  public mark!: 'LibraryBlock' | 'InputSlot';
  private openReg!: RegExp;
  private closeReg!: RegExp;
  public markInfoField!: StateField<{
    specs: SelectionEnlargerSpec[];
    contents: MarkRange[];
    marks: MarkRangeInfo[];
  }>;
  static instances = new Map<string, TemplateParser>();
  constructor(props: { mark: 'LibraryBlock' | 'InputSlot' }) {
    if (TemplateParser.instances.has(props.mark)) {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      return TemplateParser.instances.get(props.mark)!;
    }
    const { mark } = props;
    this.mark = mark;
    this.openReg = new RegExp(`^\\{#\\s*${mark}`);
    this.closeReg = new RegExp(`^\\{#\\s*\/${mark}`);
    this.markInfoField = this.getMarkInfoField();
    TemplateParser.instances.set(mark, this);
  }

  getMarkInfoField() {
    return StateField.define({
      create: state => this.getMarkSpecs(state),
      update: (value, tr) => {
        if (tr.docChanged) {
          return this.getMarkSpecs(tr.state);
        }
        return value;
      },
    });
  }

  isOpenNode(node: SyntaxNode, state: EditorState) {
    if (!node || node.name !== 'JinjaComment') {
      return false;
    }

    const text = state.sliceDoc(node.from, node.to);
    return this.openReg.test(text);
  }

  isCloseNode(node: SyntaxNode, state: EditorState) {
    if (!node || node.name !== 'JinjaComment') {
      return false;
    }

    const text = state.sliceDoc(node.from, node.to);
    return this.closeReg.test(text);
  }

  getCursorInMarkNodeRange(state: EditorState): MarkRangeInfo | null {
    const cursor = state.selection.main.head;
    return this.getPostionInMarkNodeRange(cursor, state);
  }

  getSelectionInMarkNodeRange(
    range: { from: number; to: number },
    state: EditorState,
  ): MarkRangeInfo | null {
    return (
      this.getPostionInMarkNodeRange(range.from, state) &&
      this.getPostionInMarkNodeRange(range.to, state)
    );
  }

  getPostionInMarkNodeRange(postion: number, state: EditorState) {
    const markRangeInfo = state
      .field(this.markInfoField)
      .marks.find(
        rangeInfo => rangeInfo.from < postion && postion < rangeInfo.to,
      );
    if (markRangeInfo) {
      return markRangeInfo;
    }
    return null;
  }

  findCloseNode(node: SyntaxNode, state: EditorState) {
    let next = node.nextSibling;
    let close = null;
    while (next) {
      if (this.isCloseNode(next, state)) {
        close = next;
        break;
      }
      next = next.nextSibling;
    }

    return close;
  }

  // 解析模板字符串: {#slot id="slot_id" value="slot_value"#}，获取所有属性
  getData(templateString: string): { [key: string]: string } | null {
    // 根据传入的类型构造正则表达式，例如 slot 或 block
    const regex = new RegExp(`\\{#${this.mark}\\s+([^#]+)#\\}`, 'g');
    const match = regex.exec(templateString);
    if (match !== null) {
      const attributes = match[1].trim(); // 匹配到的属性部分
      const attrRegex = /(\w+)\s*=\s*"([^"]*)"/g;
      const obj: { [key: string]: string } = {}; // 初始对象
      let attrMatch: RegExpExecArray | null;
      while (true) {
        attrMatch = attrRegex.exec(attributes);
        if (attrMatch === null) {
          break;
        }
        obj[attrMatch[1]] = attrMatch[2]; // 将匹配的键值对添加到对象中
      }

      return obj; // 返回解析结果
    }

    return null; // 没有匹配时返回 null
  }

  getCursorTemplateData(state: EditorState) {
    const markRangeInfo = this.getCursorInMarkNodeRange(state);
    if (!markRangeInfo) {
      return;
    }
    const { from, to } = markRangeInfo.open;
    const text = state.sliceDoc(from, to);
    return this.getData(text);
  }

  getAllMarksByState(state: EditorState): MarkRangeInfo[] {
    const marks: MarkRangeInfo[] = [];
    const tree = syntaxTree(state);
    const cursor = tree.cursor();
    do {
      if (this.isOpenNode(cursor.node, state)) {
        const open = cursor.node;
        const close = this.findCloseNode(cursor.node, state);
        if (close) {
          marks.push({
            from: open.from,
            to: close.to,
            open: { from: open.from, to: open.to },
            close: { from: close.from, to: close.to },
          });
        }
      }
    } while (cursor.next());
    return marks;
  }

  getMarkSpecs(state: EditorState): {
    specs: SelectionEnlargerSpec[];
    contents: MarkRange[];
    marks: MarkRangeInfo[];
  } {
    const marks = this.getAllMarksByState(state);
    const specs: SelectionEnlargerSpec[] = [];
    const contents: MarkRange[] = [];
    marks.forEach((markRangeInfo: MarkRangeInfo) => {
      specs.push({
        source: {
          from: markRangeInfo.open.from,
          to: markRangeInfo.open.to,
        },
        target: {
          from: markRangeInfo.from,
          to: markRangeInfo.to,
        },
      });
      specs.push({
        source: {
          from: markRangeInfo.close.from,
          to: markRangeInfo.close.to,
        },
        target: {
          from: markRangeInfo.from,
          to: markRangeInfo.to,
        },
      });
      contents.push({
        from: markRangeInfo.open.to,
        to: markRangeInfo.close.from,
      });
    });
    return { specs, contents, marks };
  }

  /**
   * 修改当前光标所在位置的模板数据: {#slot placeholder="default_placeholder"#} 修改为 {#slot placeholder="new_placeholder"#}
   * 新增: {#slot placeholder="default_placeholder"#} 新增 {#slot value="new_value" placeholder="new_placeholder"#}
   */
  updateCursorTemplateData(editor: EditorAPI, data: { [key: string]: string }) {
    const { state } = editor.$view;
    const markRangeInfo = this.getCursorInMarkNodeRange(state);
    if (!markRangeInfo) {
      return;
    }
    const { from, to } = markRangeInfo.open;
    const text = state.sliceDoc(from, to);
    const preData = this.getData(text);
    const newData = { ...preData, ...data };
    if (!preData) {
      this.addCursorTemplateData(editor, newData);
      return;
    }
    const newText = this.generateOpenTemplateByData(newData);
    editor.$view.dispatch({
      changes: {
        from,
        to,
        insert: newText,
      },
    });
  }
  addCursorTemplateData(editor: EditorAPI, data: { [key: string]: string }) {
    const { state } = editor.$view;
    const markRangeInfo = this.getCursorInMarkNodeRange(state);
    if (!markRangeInfo) {
      return;
    }
    const { from, to } = markRangeInfo.open;
    const text = state.sliceDoc(from, to);
    const preData = this.getData(text);
    const newData = { ...preData, ...data };
    const newText = this.generateOpenTemplateByData(newData);
    editor.replaceTextByRange({
      from,
      to,
      text: newText,
    });
  }
  generateOpenTemplateByData(data: { [key: string]: string }) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const text = keys
      .map((key, index) => `${key}="${values[index]}"`)
      .join(' ');
    return `{#${this.mark} ${text}#}`;
  }
  generateTemplate({
    content,
    data,
  }: {
    content: string;
    data: { [key: string]: string };
  }) {
    const openTemplate = this.generateOpenTemplateByData(data);
    const closeTemplate = `{#/${this.mark}#}`;
    return `${openTemplate}${content}${closeTemplate}`;
  }
  generateTemplateJson({
    content,
    data,
  }: {
    content: string;
    data: { [key: string]: string };
  }) {
    const openTemplate = this.generateOpenTemplateByData(data);
    const closeTemplate = `{#/${this.mark}#}`;
    const textContent = this.extractTemplateContent(content);
    return {
      open: openTemplate,
      close: closeTemplate,
      textContent,
      template: `${openTemplate}${content}${closeTemplate}`,
    };
  }
  updateCursorTemplateContent(editor: EditorAPI, content: string) {
    const { state } = editor.$view;
    const markRangeInfo = this.getCursorInMarkNodeRange(state);
    if (!markRangeInfo) {
      return;
    }
    editor.replaceTextByRange({
      from: markRangeInfo.open.to,
      to: markRangeInfo.close.from,
      text: content,
    });
  }
  getCursorTemplateContent(editor: EditorAPI) {
    const { state } = editor.$view;
    const markRangeInfo = this.getCursorInMarkNodeRange(state);
    if (!markRangeInfo) {
      return;
    }
    return state.sliceDoc(markRangeInfo.open.to, markRangeInfo.close.from);
  }

  insertTemplateByCursor(editor: EditorAPI, template: string) {
    const { state } = editor.$view;
    const cursorPosition = state.selection.main.head;
    if (!cursorPosition) {
      return;
    }
    editor.$view.dispatch({
      changes: {
        from: cursorPosition,
        to: cursorPosition,
        insert: template,
      },
    });
  }

  insertTemplateByRange(
    editor: EditorAPI,
    template: string,
    range: { from: number; to: number },
  ) {
    const { from, to } = range;
    editor.$view.dispatch({
      changes: {
        from,
        to,
        insert: template,
      },
    });
  }
  // 提取模板中内容{#InputSlot placeholder="placeholder"#}123{#/InputSlot#}xxx，嵌套模板下内部所有的content
  extractTemplateContent(template: string) {
    // 使用正则表达式匹配 {#InputSlot ... #} 的部分
    const regex = new RegExp(
      `\\{#${this.mark}\\s+[^#]+#\\}|\\{#\\/${this.mark}#\\}`,
      'g',
    );
    // 使用 replace 方法替换掉匹配的部分
    const result = template.replace(regex, '');
    console.log('extractTemplateContent', result);
    return result;
  }
}
