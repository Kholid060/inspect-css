import mitt from 'mitt';

type MittEvents = {
  'content:el-selected': Element;
};

export const emitter = mitt<MittEvents>();

export default mitt;
