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
 
/* eslint-disable complexity -- no need to check */
import React, {
  useCallback,
  type CSSProperties,
  useState,
  useMemo,
  useRef,
} from 'react';

import classnames from 'classnames';
import { type SchemaObject } from 'ajv';
import {
  ValueExpression,
  ValueExpressionType,
  ViewVariableType,
  useNodeTestId,
  type LiteralExpression,
} from '@coze-workflow/base';
import { I18n } from '@coze-arch/i18n';
import { type SelectProps } from '@coze-arch/bot-semi/Select';
import { IconCozApply } from '@coze-arch/coze-design/icons';
import { IconButton } from '@coze-arch/coze-design';

import { useRefInputNode } from '@/hooks/use-ref-input';
import {
  LiteralValueInput,
  type LiteralValueType,
  type InputType as LiteralInputType,
} from '@/form-extensions/components/literal-value-input';

import {
  type RenderDisplayVarName,
  type CustomFilterVar,
} from '../tree-variable-selector/types';
import { FileInput } from '../file-input';
import { type VariableSelectorProps } from '../../components/tree-variable-selector';
import { VoiceTag } from './voice/voice-option';
import useVoice from './voice/use-voice';
import {
  type RefTagColor,
  type RefValueDisplayProps,
} from './ref-value-display';
import { ObjectRefValueDisplay } from './object-ref-display';
import { ValueExpressionInputContext } from './context';
import { SELECT_POPOVER_MIN_WIDTH, VARIABLE_SELECTOR_STYLE } from './const';

import styles from './index.module.less';

export interface ValueExpressionInputProps {
  className?: string;
  testId?: string;
  value: ValueExpression | undefined;
  onChange: (value: ValueExpression | undefined) => void;
  onBlur?: () => void;
  disabled?: boolean;
  /**
   * 指定 inputType 后，参数类型固定不可切换，但仍可选择非该数据类型的变量，运行态会进行类型转换
   */
  inputType?: LiteralInputType;
  /**
   * 可以在指定的几个类型之间切换, length = 1 时,用法同 inputType
   * 只在 TypedValueExpressionInput 中生效
   * 同时指定 inputType 时，会取两个 prop 的并集
   */
  inputTypes?: LiteralInputType[];
  /**
   * 默认选择的数据类型
   */
  defaultInputType?: LiteralInputType;
  availableFileTypes?: Array<ViewVariableType>;
  validateStatus?: SelectProps['validateStatus'];
  optionFilter?: VariableSelectorProps['optionFilter'];
  handleDataSource?: VariableSelectorProps['handleDataSource'];
  invalidContent?: string;
  style?: CSSProperties;
  selectStyle?: CSSProperties;
  literalStyle?: CSSProperties;
  variableTagStyle?: CSSProperties;
  readonly?: boolean;
  /** 禁止选择的数据类型 */
  disabledTypes?: Array<ViewVariableType>;
  literalDisabled?: boolean;

  /** 是否禁用变量引用模式 */
  refDisabled?: boolean;
  literalConfig?: {
    min?: number;
    max?: number;
    optionsList?: { label: string; value: string }[];
    /**
     * 对象类型的 schema 配置，用于 json editor 代码提示和校验
     */
    jsonSchema?: SchemaObject;
  };
  showClear?: boolean;
  customFilterVar?: CustomFilterVar;
  refTagColor?: RefTagColor;
  placeholder?: string;
  inputPlaceholder?: string;
  renderDisplayVarName?: RenderDisplayVarName;
  hideSettingIcon?: boolean;
  hideDeleteIcon?: boolean;
  enableSelectNode?: boolean;
  variablesDatasource?: VariableSelectorProps['dataSource'];
  /**
   * 禁止类型转换。当选择了引用变量(ValueExpression)时，不支持切换变量类型
   */
  forbidTypeCast?: boolean;
  /* 类型限制，引用类型不满足限制时，显示警告信息 */
  variableTypeConstraints?: RefValueDisplayProps['variableTypeConstraints'];
}

export const ValueExpressionInput = ({
  className,
  value,
  onChange,
  onBlur,
  disabled,
  variablesDatasource: variablesDataSource,
  inputType = ViewVariableType.String,
  availableFileTypes = [],
  validateStatus,
  invalidContent,
  style,
  literalStyle,
  readonly,
  testId,
  disabledTypes,
  optionFilter,
  literalDisabled = false,
  refDisabled = false,
  showClear = false,
  hideDeleteIcon = false,
  hideSettingIcon = false,
  enableSelectNode = false,
  renderDisplayVarName,
  customFilterVar,
  literalConfig = {},
  refTagColor,
  placeholder,
  inputPlaceholder,
  variableTagStyle,
  handleDataSource,
  variableTypeConstraints,
}: ValueExpressionInputProps) => {
  const { concatTestId } = useNodeTestId();
  const containerRef = useRef<HTMLDivElement>(null);

  const onLiteralChange = useCallback(
    (v?: LiteralValueType): void => {
      onChange({ type: ValueExpressionType.LITERAL, content: v ?? undefined });
    },
    [onChange],
  );

  const onImageChange = useCallback(
    v => {
      onChange({
        type: ValueExpressionType.LITERAL,
        content: v?.url || '',
        rawMeta: { fileName: v?.name, type: inputType },
      });
    },
    [onChange],
  );

  const [focused, setFocused] = useState(false);

  const handleFocus = () => setFocused(true);
  const handleBlur = () => {
    setFocused(false);
    onBlur?.();
  };

  const isRefValue =
    !!value && ValueExpression.isRef(value) && !!value.content?.keyPath;

  const isLiteralJsonValue = useMemo(
    () =>
      !!value &&
      ValueExpression.isLiteral(value) &&
      ViewVariableType.isJSONInputType(inputType),
    [value, inputType],
  );

  const [isUploadingFile, setIsUploadingFile] = useState(false);

  const isLiteralMultiFileValue =
    ((value &&
      !ValueExpression.isEmpty(value) &&
      ValueExpression.isLiteral(value)) ||
      isUploadingFile) &&
    ViewVariableType.isArrayType(inputType) &&
    ViewVariableType.isFileType(inputType) &&
    inputType !== ViewVariableType.ArrayVoice;

  const isLiteralMultiLineValue =
    isLiteralJsonValue &&
    String((value as LiteralExpression)?.content)?.includes('\n');

  const [expandLiteralInput, setExpandLiteralInput] = useState(false);

  const isVoiceValue =
    ViewVariableType.isVoiceType(inputType) &&
    !!value &&
    ValueExpression.isLiteral(value) &&
    value.content;

  const { renderVariableSelectorExtraOption, selectVoiceModal, voiceSelector } =
    useVoice({
      inputType,
      onChange,
      onBlur,
      disabled,
      validateStatus,
      value,
    });

  const renderInputRight = () => {
    if (ViewVariableType.isVoiceType(inputType)) {
      return voiceSelector;
    }

    if (ViewVariableType.isFileType(inputType)) {
      return (
        <FileInput
          value={value as LiteralExpression}
          inputType={inputType}
          availableFileTypes={availableFileTypes}
          onChange={onImageChange}
          onUploadChange={uploading => setIsUploadingFile(uploading)}
          onBlur={onBlur}
        />
      );
    }

    return (
      <LiteralValueInput
        className={classnames(styles['literal-value-input'], {
          'pb-[24px]':
            isLiteralMultiLineValue ||
            (ViewVariableType.isJSONInputType(inputType) && expandLiteralInput),
        })}
        testId={concatTestId(testId ?? '', 'literal-input')}
        readonly={readonly}
        disabled={disabled}
        value={(value as LiteralExpression)?.content}
        inputType={inputType}
        onBlur={handleBlur}
        onFocus={handleFocus}
        onChange={onLiteralChange}
        config={{
          ...literalConfig,
          onRequestInputExpand: isLiteralJsonValue
            ? setExpandLiteralInput
            : undefined,
        }}
        style={literalStyle}
        placeholder={inputPlaceholder ?? I18n.t('workflow_241015_01')}
      />
    );
  };

  const { renderVariableSelect, renderVariableDisplay } = useRefInputNode({
    value,
    onChange,
    onBlur,
    disabled,
    variablesDataSource,
    validateStatus,
    readonly,
    testId,
    disabledTypes,
    showClear,
    invalidContent,
    renderDisplayVarName,
    customFilterVar,
    setFocused,
    style: VARIABLE_SELECTOR_STYLE,
    refTagColor,
    hideDeleteIcon,
    variableTagStyle,
    optionFilter,
    renderExtraOption: renderVariableSelectorExtraOption,
    enableSelectNode,
    handleDataSource,
    popoverStyle: containerRef.current
      ? {
          minWidth: Math.max(
            containerRef.current.clientWidth,
            SELECT_POPOVER_MIN_WIDTH,
          ),
        }
      : undefined,
    variableTypeConstraints,
  });

  const renderInput = () => {
    if (isVoiceValue) {
      return renderVariableSelect(
        <div
          className={classnames(
            'cursor-pointer w-full overflow-hidden flex items-center pl-0.5',
          )}
        >
          <VoiceTag
            name={
              (value as LiteralExpression)?.rawMeta?.fileName || value?.content
            }
            onClose={() => onChange?.(undefined)}
          />
        </div>,
      );
    }

    return isRefValue ? renderVariableDisplay() : renderInputRight();
  };
  const finalClassName = useMemo(
    () =>
      classnames(
        className,
        'flex items-start border border-solid bg-transparent max-w-[100%] py-[1px]',
        {
          'semi-input-wrapper-error': validateStatus === 'error',
          'coz-stroke-plus': validateStatus !== 'error',
          '!bg-transparent': focused,
          '!coz-stroke-hglt': focused && validateStatus !== 'error',
          'pointer-events-none': readonly,
        },
        'hover:coz-mg-primary-hovered',
        isLiteralMultiLineValue || isLiteralMultiFileValue || expandLiteralInput
          ? 'h-full'
          : 'h-[24px]',
        styles['value-expression-input-wrap-new'],
        'semi-input-wrapper semi-input-wrapper-small',
      ),
    [
      className,
      validateStatus,
      focused,
      readonly,
      styles,
      isLiteralMultiLineValue,
      isLiteralMultiFileValue,
      expandLiteralInput,
    ],
  );

  if (value && ValueExpression.isObjectRef(value)) {
    return (
      <div className={finalClassName} style={style} ref={containerRef}>
        <ObjectRefValueDisplay />
      </div>
    );
  }

  return (
    <ValueExpressionInputContext.Provider value={{ testId }}>
      <div className={finalClassName} style={style} ref={containerRef}>
        <div className="ref-wrapper flex-1 flex w-full h-full items-center overflow-hidden">
          {/* 判断是否变量选择场景 */}
          {!refDisabled && // 引用模式启用时，检查：
          literalDisabled && // 场景1: 字面量被禁用
          !isRefValue ? ( // 场景2: 当前值不是引用类型
            renderVariableSelect(
              <div className="cursor-pointer w-full h-full overflow-hidden flex items-center px-1">
                <p className="text-[12px] text-[var(--coz-fg-secondary)] pointer-events-none whitespace-nowrap">
                  {placeholder || I18n.t('workflow_variable_ref_placeholder')}
                </p>
              </div>,
            )
          ) : (
            <div className={styles['input-wrapper']}>{renderInput()}</div>
          )}
        </div>
        {refDisabled || hideSettingIcon ? null : (
          <div
            className={classnames(
              styles['setting-button-wrap'],
              'flex-none leading-none',
              {
                [styles['pos-absolute']]: isLiteralJsonValue,
                [styles['self-end']]: isLiteralMultiFileValue,
              },
            )}
          >
            {renderVariableSelect(
              <IconButton
                color="secondary"
                size="small"
                icon={<IconCozApply className="coz-fg-primary text-sm" />}
                data-testid={concatTestId(testId ?? '', 'variable-trigger')}
              ></IconButton>,
            )}
          </div>
        )}

        {selectVoiceModal}
      </div>
    </ValueExpressionInputContext.Provider>
  );
};
