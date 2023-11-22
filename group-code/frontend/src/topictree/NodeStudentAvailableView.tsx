import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';

type NodeStudentAvailableProps = { data: any, isConnectable: boolean }

const styles = {
  fontSize: '12px',
  background: '#eee',
  borderRadius: '5px',
  height: 76,
  width: 172,
}

export default memo((props: NodeStudentAvailableProps) => {
  return (
    <div style={styles}>
      <Handle
        type="target"
        position={Position.Left}
        style={{ background: '#555' }}
        isConnectable={props.isConnectable}
      />
      <div title={props.data.label} className='flex flex-col text-center justify-center items-center' style={{ height: '100%', width: '100%' }}>
        <p className='py-1' style={{ backgroundColor: 'rgb(253 224 71)', width: '100%', borderTopLeftRadius: '4px', borderTopRightRadius: '4px'}}>
          AVAILABLE
        </p>
        <p className='flex-1 flex justify-center items-center text-sm' style={{ width: '100%' }}>{props.data.label}</p>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        style={{ background: '#555' }}
        isConnectable={props.isConnectable}
      />
    </div>
  );
});