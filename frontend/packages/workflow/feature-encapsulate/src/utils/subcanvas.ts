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
 
import {
  FlowNodeBaseType,
  type FlowNodeEntity,
} from '@flowgram-adapter/free-layout-editor';
import { type WorkflowSubCanvas } from '@flowgram-adapter/free-layout-editor';

/**
 * 多节点是否在子画布中
 * @param nodes
 * @returns
 */
export const isNodesInSubCanvas = (nodes?: FlowNodeEntity[]) =>
  isNodeInSubCanvas(nodes?.[0]);

/**
 * 单节点是否在子画布中
 * @param nodes
 * @returns
 */
export const isNodeInSubCanvas = (node?: FlowNodeEntity) =>
  node?.parent?.id !== 'root';

/**
 * 是不是子画布节点
 * @param node
 * @returns
 */
export const isSubCanvasNode = (node?: FlowNodeEntity) =>
  node?.flowNodeType === FlowNodeBaseType.SUB_CANVAS;

/**
 * 获取子画布的父节点
 * @param node
 * @returns
 */
export const getSubCanvasParent = (node?: FlowNodeEntity) => {
  const nodeMeta = node?.getNodeMeta();
  const subCanvas: WorkflowSubCanvas = nodeMeta?.subCanvas(node);
  return subCanvas?.parentNode;
};
