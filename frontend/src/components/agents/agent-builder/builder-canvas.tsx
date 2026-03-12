"use client";

import { useCallback, useRef, useMemo, type DragEvent } from "react";
import {
  ReactFlow,
  Controls,
  MiniMap,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  type Connection,
  type Node,
  type Edge,
  BackgroundVariant,
  type ReactFlowInstance,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Save, Play, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NodePalette } from "./node-palette";
import { TriggerNode } from "./nodes/trigger-node";
import { LLMNode } from "./nodes/llm-node";
import { ToolNode } from "./nodes/tool-node";
import { ConditionNode } from "./nodes/condition-node";
import { OutputNode } from "./nodes/output-node";
import { KnowledgeNode } from "./nodes/knowledge-node";
import { WebhookNode } from "./nodes/webhook-node";
import { ZapierNode } from "./nodes/zapier-node";
import { AnimatedEdge } from "./edges/animated-edge";

const NODE_TYPES = {
  trigger: TriggerNode,
  llm: LLMNode,
  tool: ToolNode,
  condition: ConditionNode,
  output: OutputNode,
  knowledge: KnowledgeNode,
  webhook: WebhookNode,
  zapier: ZapierNode,
} as const;

const EDGE_TYPES = {
  animated: AnimatedEdge,
} as const;

const DEFAULT_NODES: Node[] = [
  {
    id: "trigger-1",
    type: "trigger",
    position: { x: 100, y: 200 },
    data: { label: "Webhook Trigger", triggerType: "webhook" },
  },
  {
    id: "llm-1",
    type: "llm",
    position: { x: 400, y: 200 },
    data: { label: "GPT-4o", provider: "openai", model: "GPT-4o" },
  },
  {
    id: "tool-1",
    type: "tool",
    position: { x: 700, y: 100 },
    data: { label: "GitHub: Create PR", tool: "GitHub" },
  },
  {
    id: "output-1",
    type: "output",
    position: { x: 700, y: 300 },
    data: { label: "Output", format: "JSON response" },
  },
];

const DEFAULT_EDGES: Edge[] = [
  { id: "e1-2", source: "trigger-1", target: "llm-1", type: "animated" },
  { id: "e2-3", source: "llm-1", target: "tool-1", type: "animated" },
  { id: "e2-4", source: "llm-1", target: "output-1", type: "animated" },
];

let nodeIdCounter = 10;

interface BuilderCanvasProps {
  agentName?: string;
  initialNodes?: Node[];
  initialEdges?: Edge[];
}

export function BuilderCanvas({
  agentName,
  initialNodes,
  initialEdges,
}: BuilderCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const reactFlowInstance = useRef<ReactFlowInstance | null>(null);

  const [nodes, setNodes, onNodesChange] = useNodesState(
    initialNodes ?? DEFAULT_NODES,
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    initialEdges ?? DEFAULT_EDGES,
  );

  const onConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) => addEdge({ ...connection, type: "animated" }, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback(
    (event: DragEvent) => {
      event.preventDefault();

      const nodeType = event.dataTransfer.getData("application/reactflow");
      if (!nodeType || !reactFlowInstance.current) return;

      const position = reactFlowInstance.current.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY,
      });

      const newNode: Node = {
        id: `${nodeType}-${++nodeIdCounter}`,
        type: nodeType,
        position,
        data: { label: nodeType.charAt(0).toUpperCase() + nodeType.slice(1) },
      };

      setNodes((nds) => [...nds, newNode]);
    },
    [setNodes],
  );

  const defaultEdgeOptions = useMemo(
    () => ({ type: "animated" as const }),
    [],
  );

  return (
    <div className="flex h-full flex-col">
      {/* Toolbar */}
      <div className="flex items-center justify-between border-b border-border bg-background px-4 py-2">
        <p className="text-sm font-medium text-muted-foreground">
          {agentName ? `Editing: ${agentName}` : "Agent Builder"}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Play className="h-4 w-4" />
            Run
          </Button>
          <Button size="sm">
            <Rocket className="h-4 w-4" />
            Publish
          </Button>
        </div>
      </div>

      {/* Canvas area with palette */}
      <div className="flex flex-1 overflow-hidden">
        <NodePalette />
        <div ref={reactFlowWrapper} className="flex-1">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onInit={(instance) => {
              reactFlowInstance.current = instance;
            }}
            onDrop={onDrop}
            onDragOver={onDragOver}
            nodeTypes={NODE_TYPES}
            edgeTypes={EDGE_TYPES}
            defaultEdgeOptions={defaultEdgeOptions}
            fitView
            snapToGrid
            snapGrid={[16, 16]}
            deleteKeyCode={["Backspace", "Delete"]}
          >
            <Controls />
            <MiniMap
              nodeStrokeWidth={3}
              className="!bg-muted/50 !border-border"
            />
            <Background variant={BackgroundVariant.Dots} gap={16} />
          </ReactFlow>
        </div>
      </div>
    </div>
  );
}
