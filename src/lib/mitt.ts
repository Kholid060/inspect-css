import mitt from 'mitt';
import { ElementProperties } from '../utils/getElProperties';

export type EmitterEvents = {
  'content:remove-selected': void;
  'content:el-selected': { el: Element; properties: ElementProperties };
};

export const emitter = mitt<EmitterEvents>();

export default mitt;
