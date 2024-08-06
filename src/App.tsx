import {useCallback, useMemo, useState} from 'react';
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  BackgroundVariant, BaseEdge,
  Connection,
  Controls,
  Edge,
  EdgeChange, EdgeLabelRenderer, EdgeText, getStraightPath,
  Handle, MarkerType, MiniMap,
  Node,
  NodeChange, Panel,
  Position,
  ReactFlow, useReactFlow,
} from '@xyflow/react';
import {useDebouncedCallback} from "use-debounce";

const initialNodes: Node[] = [];

const initialEdges: Edge[] = [];
const Circle = ({id, data}: any) => {
  const {updateNode } = useReactFlow()
  const [text, setText] = useState('');
  console.debug('data',data)

  const debounced = useDebouncedCallback<(value: string) => void>((value) => {
    updateNode(id, {
      data: { label: value }
    })
  }, 1000)

  const handleChangeLabel = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    debounced(e.target.value)
  }

  return <div className="circle">
    {/*<NodeResizer*/}
    {/*  color="#ff0071"*/}
    {/*  isVisible={selected}*/}
    {/*  minWidth={100}*/}
    {/*  minHeight={30}*/}
    {/*/>*/}
    <Handle type="target" position={Position.Top}/>
    <textarea value={text} onChange={handleChangeLabel} className="nondrag"/>
    <Handle type="source" position={Position.Bottom}/>
  </div>
}

const Diamond = ({id, data}: any) => {
  const {updateNode } = useReactFlow()
  const [text, setText] = useState('');
  console.debug('data',data)

  const debounced = useDebouncedCallback<(value: string) => void>((value) => {
    updateNode(id, {
      data: { label: value }
    })
  }, 1000)

  const handleChangeLabel = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    debounced(e.target.value)
  }

  return <div className="diamond-container">
    <section className="diamond">
      <section className="diamond-border"></section>
    </section>
    {/*<NodeResizer*/}
    {/*  color="#ff0071"*/}
    {/*  isVisible={selected}*/}
    {/*  minWidth={100}*/}
    {/*  minHeight={30}*/}
    {/*/>*/}
    <Handle type="source" position={Position.Bottom}/>

    <textarea value={text} onChange={handleChangeLabel} className="nondrag" />
    <Handle type="target" position={Position.Top}/>
  </div>
}

const Square = ({id, data}: any) => {
  const {updateNode } = useReactFlow()
  const [text, setText] = useState('');
  console.debug('data',data)

  const debounced = useDebouncedCallback<(value: string) => void>((value) => {
    updateNode(id, {
      data: { label: value }
    })
  }, 1000)

  const handleChangeLabel = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value)
    debounced(e.target.value)
  }

  return <div className="square">
    <Handle type="target" position={Position.Top} />
    <textarea value={text} onChange={handleChangeLabel} className="nondrag" />
    <Handle type="source" position={Position.Bottom} />
  </div>
}

const TextEdge = ({ id, sourceX, sourceY, targetX, targetY, data, selected }: any) => {
  const { updateEdge } = useReactFlow();
  const [edgePath, labelX, labelY] = getStraightPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });
  const [text, setText] = useState('');
  console.debug('data',data)

  const debounced = useDebouncedCallback<(value: string) => void>((value) => {
    updateEdge(id, {
      data: { label: value }
    })
  }, 1000)

  const handleChangeLabel = (e:  React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value)
    debounced(e.target.value)
  }

  return <>
    <BaseEdge id={id} path={edgePath} label="fdsf"/>
    <EdgeLabelRenderer>
      <input type="text" className="edge-input" value={text} onChange={handleChangeLabel}
             style={{transform: `translate(-50%, -200%) translate(${labelX}px,${labelY}px)`, display: `${selected ? 'block' : 'none'}` }}/>
    </EdgeLabelRenderer>
    <EdgeText
      x={labelX}
      y={labelY}
      label={text}
      labelStyle={{fill: 'black'}}
      labelShowBg
      labelBgStyle={{fill: 'white'}}
      labelBgPadding={[2, 4]}
      labelBgBorderRadius={2}
    />
  </>
}

function generateShapeId(arr: Node[]) {
  if (arr.length === 0) return '1'

  return String(Number(arr[arr.length - 1].id) + 1);
}

function Flow() {
  const [nodes, setNodes] = useState<Node[]>(initialNodes);
  const [edges, setEdges] = useState(initialEdges);

  const nodeTypes = useMemo(() => ({circle: Circle, diamond: Diamond, square: Square}), [])
  const edgeTypes = useMemo(() => ({ text: TextEdge }), [])

  const exportFlowChart = () => {
    console.debug([
      ...nodes,
      ...edges
    ])

    const fileData = JSON.stringify({
      shapes: nodes,
      edges: edges
    })

    const blob = new Blob([fileData], {type: 'text/plain'})

    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.download = "aira.drawio";

    link.href = url;
    link.click();
  }

  const handleAddDiamond = () => {
    setNodes(prev => ([...prev, {
      id: generateShapeId(prev),
      style: { color: '#000' },
      data: {  },
      position: { x: 0, y: 0 },
      type: 'diamond'
    }]))
  }

  const handleAddCircle = () => {
    setNodes(prev => ([...prev, {
      id: generateShapeId(prev),
      style: { color: '#000' },
      data: { label: 'circle' },
      position: { x: 0, y: 0 },
      type: 'circle'
    }]))
  }

  const handleAddSquare = () => {
    setNodes(prev => ([...prev, {
      id: generateShapeId(prev),
      style: { color: '#000' },
      data: { },
      position: { x: 0, y: 0 },
      type: 'square'
    }]))
  }

  const onNodesChange = useCallback(
    (changes:  NodeChange<Node>[]) => {
      console.debug(changes)
      setNodes((nds) => applyNodeChanges(changes, nds))
    },
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange<Edge>[]) => {
      console.debug(changes)
      setEdges((eds) => applyEdgeChanges(changes, eds.map(edg => ({
        ...edg, markerEnd: { type: MarkerType.Arrow }, type: 'text', data: { label: 'test' } }
      ))))
    },
    [],
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      // const edge = { ...connection, type: 'text' };
      const edge = { ...connection };
      setEdges((eds) => addEdge(edge, eds));
    },
    [setEdges],
  );

  return (
    <div className="container">
      <ReactFlow
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        nodes={nodes}
        onNodesChange={onNodesChange}
        edges={edges}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background variant={BackgroundVariant.Lines} />
        <Controls style={{ color: '#000' }} />
        <MiniMap />

        <Panel>
          <button className="export-btn" onClick={exportFlowChart}>
            Export
          </button>
        </Panel>
        <ShapesPanel handleAddDiamond={handleAddDiamond} handleAddCircle={handleAddCircle} handleAddSquare={handleAddSquare} />
      </ReactFlow>
    </div>
  );
}


const ShapesPanel = ({ handleAddDiamond, handleAddSquare, handleAddCircle }: any) => {
  return <Panel position="top-center" className="panel-horizontal">
    <button className="shapes-icons" onClick={handleAddDiamond}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" className="bi bi-diamond" viewBox="0 0 16 16"
           id="Diamond--Streamline-Bootstrap" height={16} width={16}>
        <desc>{"Diamond Streamline Icon: https://streamlinehq.com"}</desc>
        <path
          d="M6.95 0.435c0.58 -0.58 1.52 -0.58 2.1 0l6.515 6.516c0.58 0.58 0.58 1.519 0 2.098L9.05 15.565c-0.58 0.58 -1.519 0.58 -2.098 0L0.435 9.05a1.48 1.48 0 0 1 0 -2.098zm1.4 0.7a0.495 0.495 0 0 0 -0.7 0L1.134 7.65a0.495 0.495 0 0 0 0 0.7l6.516 6.516a0.495 0.495 0 0 0 0.7 0l6.516 -6.516a0.495 0.495 0 0 0 0 -0.7L8.35 1.134z"
          strokeWidth={1}/>
      </svg>
    </button>
    <button className="shapes-icons" onClick={handleAddSquare}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" className="bi bi-square" viewBox="0 0 16 16"
           id="Square--Streamline-Bootstrap" height={16} width={16}>
        <desc>{"Square Streamline Icon: https://streamlinehq.com"}</desc>
        <path
          d="M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1 -1 1H2a1 1 0 0 1 -1 -1V2a1 1 0 0 1 1 -1zM2 0a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2V2a2 2 0 0 0 -2 -2z"
          strokeWidth={1}/>
      </svg>
    </button>
    <button className="shapes-icons" onClick={handleAddCircle}>
      <svg xmlns="http://www.w3.org/2000/svg" fill="#000000" className="bi bi-circle" viewBox="0 0 16 16"
           id="Circle--Streamline-Bootstrap" height={16} width={16}>
        <desc>{"Circle Streamline Icon: https://streamlinehq.com"}</desc>
        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" strokeWidth={1}/>
      </svg>
    </button>
  </Panel>
}

export default Flow;
