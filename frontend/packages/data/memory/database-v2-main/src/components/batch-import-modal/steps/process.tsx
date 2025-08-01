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
 
import { useState, useEffect, useMemo } from 'react';

import { useRequest } from 'ahooks';
import { type UnitItem } from '@coze-data/knowledge-resource-processor-core';
import {
  type ProcessProgressItemProps,
  ProcessStatus,
} from '@coze-data/knowledge-resource-processor-base/types';
import { ProcessProgressItem } from '@coze-data/knowledge-resource-processor-base';
import { I18n, type I18nKeysNoOptionsType } from '@coze-arch/i18n';
import { formatBytes } from '@coze-arch/bot-utils';
import { IconUploadXLS } from '@coze-arch/bot-icons';
import { type TableType, type TableSheet } from '@coze-arch/bot-api/memory';
import { MemoryApi } from '@coze-arch/bot-api';
import { Typography } from '@coze-arch/coze-design';

type ProcessProps = Pick<
  ProcessProgressItemProps,
  'mainText' | 'subText' | 'tipText' | 'percent' | 'status' | 'actions'
>;

const INIT_PERCENT = 10;
const COMPLETE_PERCENT = 100;

const statusTextMap: Record<ProcessStatus, I18nKeysNoOptionsType> = {
  [ProcessStatus.Processing]: 'datasets_createFileModel_step4_processing',
  [ProcessStatus.Complete]: 'datasets_createFileModel_step4_Finish',
  [ProcessStatus.Failed]: 'datasets_createFileModel_step4_failed',
};

export interface StepProcessProps {
  databaseId: string;
  tableType: TableType;
  fileItem: UnitItem;
  tableSheet?: TableSheet;
  connectorId?: string;
}

export function StepProcess({
  databaseId,
  tableType,
  fileItem,
  tableSheet,
  connectorId,
}: StepProcessProps) {
  const fileSize = useMemo(
    () => formatBytes(fileItem.fileInstance?.size ?? 0),
    [fileItem],
  );
  const [progressProps, setProgressProps] = useState<ProcessProps>({
    // 第一行文本（文件名）
    mainText: fileItem.name,
    // 第二行文本（文件大小）
    subText: fileSize,
    // hover 时显示的第二行文本，与上面保持一致
    tipText: fileSize,
    // 进度条百分比，初始 10% 与 @coze-data/knowledge-resource-processor-base/unit-progress 保持一致
    percent: INIT_PERCENT,
    status: ProcessStatus.Processing,
  });

  const { run, cancel } = useRequest(
    () =>
      MemoryApi.DatabaseFileProgressData({
        database_id: databaseId,
        table_type: tableType,
      }),
    {
      manual: true,
      pollingInterval: 3000,
      onSuccess: res => {
        const { data } = res;
        if (data) {
          // 有错误信息代表处理失败，展示错误信息，并停止轮询
          if (data.status_descript) {
            const msg = data.status_descript;
            setProgressProps(props => ({
              ...props,
              subText: msg,
              tipText: msg,
              status: ProcessStatus.Failed,
            }));
            cancel();
          } else {
            setProgressProps(props => ({
              ...props,
              percent: data.progress ?? 0,
            }));
            // 进度 100 代表处理完成，更新状态并停止轮询
            if (data.progress === COMPLETE_PERCENT) {
              setProgressProps(props => ({
                ...props,
                status: ProcessStatus.Complete,
                actions: [I18n.t('datasets_unit_process_success')],
              }));
              cancel();
            }
          }
        }
      },
    },
  );

  // 提交任务，并开始轮询进度
  useEffect(() => {
    MemoryApi.SubmitDatabaseInsertTask({
      database_id: databaseId,
      table_type: tableType,
      file_uri: fileItem.uri,
      table_sheet: tableSheet,
      connector_id: connectorId,
    }).finally(() => {
      run();
    });
  }, []);

  return (
    <>
      <div className="h-[32px] leading-[32px] mb-[8px]">
        <Typography.Text fontSize="14px" weight={500}>
          {I18n.t(statusTextMap[progressProps.status])}
        </Typography.Text>
      </div>
      <ProcessProgressItem
        avatar={<IconUploadXLS />}
        {...progressProps}
        className="[&_.process-progress-item-actions]:!block"
      />
    </>
  );
}
