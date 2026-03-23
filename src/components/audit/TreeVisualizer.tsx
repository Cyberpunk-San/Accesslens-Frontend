'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronRight,
  ChevronDown,
  Box,
  Type,
  Link as LinkIcon,
  Square,
  Hash,
  Activity,
  AlertCircle,
  Search,
  Maximize2,
  Database,
  Terminal,
  MousePointer2,
  Tag,
  ShieldCheck,
  EyeOff,
  Zap
} from 'lucide-react';

interface AXNode {
  nodeId: string;
  role?: string | { value: string };
  name?: string | { value: string };
  description?: string;
  children?: AXNode[];
  focusable?: boolean;
  hidden?: boolean;
  [key: string]: any;
}

interface TreeVisualizerProps {
  tree: { nodes: AXNode[] } | AXNode;
  issues?: any[];
}

const LANDMARK_ROLES = ['main', 'nav', 'header', 'footer', 'aside', 'region', 'complementary'];
const INTERACTIVE_ROLES = ['button', 'link', 'input', 'select', 'textarea', 'tab', 'checkbox', 'radio'];

export function TreeVisualizer({ tree, issues = [] }: TreeVisualizerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedNode, setSelectedNode] = useState<AXNode | null>(null);

  const nodes = useMemo(() => {
    if ((tree as any).accessibility_tree?.nodes) return (tree as any).accessibility_tree.nodes;
    if ((tree as any).nodes) return (tree as any).nodes;
    if (Array.isArray(tree)) return tree;
    return [tree];
  }, [tree]);

  return (
    <div className="flex flex-col lg:flex-row gap-8 min-h-[700px]">
      {/* Main Tree View */}
      <div className="flex-1 glass-card p-10 border-white/5 bg-[#020617]/90 backdrop-blur-3xl overflow-hidden relative group">
        <div className="absolute top-0 right-0 p-8 text-cyan-500/5 rotate-12 group-hover:rotate-0 transition-transform duration-1000">
          <Database size={200} />
        </div>

        <div className="relative z-10 space-y-10">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-8 border-b border-white/5">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/5 flex items-center justify-center text-cyan-400 border border-cyan-500/20 shadow-lg shadow-cyan-500/5">
                <Activity size={24} />
              </div>
              <div>
                <h2 className="text-sm font-black uppercase tracking-[0.3em] text-white">Digital Architecture</h2>
                <p className="text-[10px] font-bold text-slate-600 uppercase tracking-widest mt-1">Hierarchical AX Matrix Scan</p>
              </div>
            </div>

            <div className="relative w-full sm:w-80 group/search">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-700 group-focus-within/search:text-cyan-400 transition-colors" size={16} />
              <input
                type="text"
                placeholder="Filter roles or names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/50 border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm font-medium text-white placeholder:text-slate-700 focus:outline-none focus:border-cyan-500/30 focus:ring-4 focus:ring-cyan-500/5 transition-all outline-none"
              />
            </div>
          </div>

          <div className="relative overflow-y-auto max-h-[600px] pr-4 scrollbar-premium">
            <div className="space-y-1 pl-2">
              {nodes.map((node: AXNode, idx: number) => (
                <TreeNode
                  key={node.nodeId || idx}
                  node={node}
                  depth={0}
                  issues={issues}
                  searchQuery={searchQuery}
                  onSelect={setSelectedNode}
                  isSelected={selectedNode?.nodeId === node.nodeId}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Node Detail Side Panel */}
      <AnimatePresence mode="wait">
        {selectedNode && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="w-full lg:w-96 space-y-6"
          >
            <div className="glass-card p-8 border-cyan-500/10 bg-slate-950/40 relative overflow-hidden">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <Terminal size={16} className="text-cyan-400" />
                  <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Node Inspector</h3>
                </div>
                {LANDMARK_ROLES.includes(nodeValue(selectedNode.role).toLowerCase()) && (
                  <span className="px-2 py-0.5 bg-cyan-500/10 text-cyan-400 text-[8px] font-black uppercase rounded border border-cyan-500/20">Landmark</span>
                )}
              </div>

              <div className="space-y-6">
                <div>
                  <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 block mb-2">Primary Signature</span>
                  <h4 className="text-lg font-black text-white italic tracking-tight uppercase leading-none">
                    {nodeValue(selectedNode.role) || 'Element'}
                  </h4>
                  <div className="flex items-center gap-3 mt-4 bg-slate-900/30 px-3 py-1.5 rounded-lg border border-white/5 w-fit">
                    <span className="text-[8px] font-black text-slate-600 uppercase tracking-widest">Trace ID</span>
                    <span className="text-[10px] font-bold text-cyan-400 font-mono">{selectedNode.nodeId}</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 border-y border-white/5 py-6">
                  <DetailItem label="Interactive" value={selectedNode.focusable ? 'YES' : 'NO'} />
                  <DetailItem label="Hidden" value={selectedNode.hidden ? 'YES' : 'NO'} />
                  <DetailItem label="Level" value={selectedNode.level || 'N/A'} />
                  <DetailItem label="Children" value={selectedNode.children?.length || 0} />
                </div>

                {selectedNode.name && (
                  <div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-slate-600 block mb-2">Accessibility Name</span>
                    <p className="text-sm font-medium text-slate-300 leading-relaxed bg-slate-900/50 p-4 rounded-xl border border-white/5 italic">
                      "{nodeValue(selectedNode.name)}"
                    </p>
                  </div>
                )}

                <div className="p-5 bg-slate-950/80 rounded-2xl border border-white/5 space-y-3 shadow-inner">
                  <h5 className="text-[8px] font-black text-slate-700 uppercase tracking-widest flex items-center gap-2">
                    <Zap size={10} className="text-cyan-500" /> Intelligence Insight
                  </h5>
                  <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic">
                    {getNodeInsight(selectedNode)}
                  </p>
                </div>

                <div className="pt-4">
                  <button className="w-full bg-slate-900 border border-cyan-500/10 hover:border-cyan-500/30 hover:bg-slate-800 text-cyan-400 rounded-xl py-3 text-[10px] font-black uppercase tracking-widest transition-all" onClick={() => setSelectedNode(null)}>
                    Release Selection
                  </button>
                </div>
              </div>
            </div>

            {/* Micro Alerts */}
            <div className="glass-card p-6 border-white/5 bg-slate-900/40">
              <div className="flex items-center gap-3 mb-4">
                <MousePointer2 size={14} className="text-slate-600" />
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-600">Event Handlers</span>
              </div>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
                Deep scan reveals {Object.keys(selectedNode).filter(k => k.startsWith('on')).length} active listeners on this node.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function nodeValue(val: any): string {
  if (!val) return '';
  if (typeof val === 'object') return val.value || '';
  return String(val);
}

function getNodeInsight(node: AXNode): string {
  const role = nodeValue(node.role).toLowerCase();

  if (LANDMARK_ROLES.includes(role)) {
    return "This is a critical navigation landmark. It helps users with motor or visual impairments jump to this section directly via screen reader shortcuts.";
  }
  if (INTERACTIVE_ROLES.includes(role) || node.focusable) {
    return "Interactive element. This node must have a clear focus state and be operable via keyboard (Enter/Space) to meet WCAG 2.1 standards.";
  }
  if (role === 'text' || role === 'heading') {
    return "Content node. Ensure the reading order is logical and contrast meets the 4.5:1 ratio for standard readability.";
  }
  if (node.hidden) {
    return "This node is hidden from the accessibility tree. Verify if this omission is intentional to avoid shadow content for AT users.";
  }
  if (node.shadow || node.role === 'shadow-root') {
    return "This node is a Shadow Root or is part of an encapsulated Shadow DOM. AccessLens has successfully pierced this boundary to analyze its contents.";
  }
  return "Standard structural node. Part of the semantic skeleton of the page.";
}

function DetailItem({ label, value }: { label: string, value: any }) {
  return (
    <div>
      <span className="text-[8px] font-black uppercase tracking-widest text-slate-600 block">{label}</span>
      <span className="text-[10px] font-bold text-white uppercase">{String(value)}</span>
    </div>
  );
}

function TreeNode({ node, depth, issues, searchQuery, onSelect, isSelected }: {
  node: AXNode, depth: number, issues: any[], searchQuery: string, onSelect: (n: AXNode) => void, isSelected: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(depth < 2 || searchQuery !== '');
  const hasChildren = node.children && node.children.length > 0;

  const roleLabel = nodeValue(node.role).toLowerCase() || 'element';
  const nameLabel = nodeValue(node.name);

  const matchesSearch = searchQuery === '' ||
    roleLabel.includes(searchQuery.toLowerCase()) ||
    nameLabel.toLowerCase().includes(searchQuery.toLowerCase());

  if (!matchesSearch && !hasChildren) return null;

  const getIcon = (role: string) => {
    switch (role.toLowerCase()) {
      case 'text': return <Type size={12} />;
      case 'link': return <LinkIcon size={12} />;
      case 'button': return <Square size={12} />;
      case 'heading': return <Hash size={12} />;
      default: return <Box size={12} />;
    }
  };

  const hasIssue = issues.some(issue =>
    issue.location?.selector?.toLowerCase().includes(roleLabel)
  );

  return (
    <div className={`select-none transition-opacity duration-300 ${matchesSearch ? 'opacity-100' : 'opacity-40'}`}>
      <div
        className={`
          flex items-center gap-3 py-1.5 px-4 rounded-xl transition-all duration-300 group cursor-pointer border
          ${isSelected ? 'bg-cyan-500/5 border-cyan-500/20' : 'bg-transparent border-transparent hover:bg-white/[0.03]'}
          ${hasIssue ? 'border-l-rose-700 bg-rose-900/5' : ''}
        `}
        style={{ marginLeft: `${depth * 12}px` }}
        onClick={(e) => {
          e.stopPropagation();
          onSelect(node);
          if (hasChildren) setIsExpanded(!isExpanded);
        }}
      >
        <div className="w-4 flex items-center justify-center text-slate-800">
          {hasChildren ? (
            <motion.div animate={{ rotate: isExpanded ? 90 : 0 }}>
              <ChevronRight size={14} />
            </motion.div>
          ) : (
            <div className="w-1 h-1 rounded-full bg-slate-900" />
          )}
        </div>

        <div className={`
          w-7 h-7 rounded-lg flex items-center justify-center transition-all duration-300 shadow-inner
          ${isSelected ? 'bg-cyan-600 text-white shadow-cyan-500/10' : 'bg-[#0f172a] border border-white/5 text-slate-700 group-hover:text-cyan-400 group-hover:border-cyan-500/10'}
          ${hasIssue && !isSelected ? 'border-rose-900/30 text-rose-800 shadow-rose-950/10' : ''}
        `}>
          {getIcon(roleLabel)}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-baseline sm:gap-3 overflow-hidden">
          <span className={`text-[10px] font-black uppercase tracking-widest truncate min-w-[60px] ${isSelected ? 'text-cyan-300' : 'text-slate-700 group-hover:text-slate-500 transition-colors'
            }`}>
            {roleLabel}
          </span>
          {nameLabel && (
            <span className={`text-xs font-bold truncate max-w-[200px] ${isSelected ? 'text-white' : 'text-slate-500 transition-colors'
              }`}>
              {nameLabel}
            </span>
          )}
        </div>

        {LANDMARK_ROLES.includes(roleLabel) && (
          <span className="ml-2 px-1.5 py-0.5 bg-cyan-500/5 text-cyan-400 text-[8px] font-black uppercase rounded border border-cyan-500/10">LM</span>
        )}

        {(node.shadow || node.role === 'shadow-root') && (
          <span className="ml-2 px-1.5 py-0.5 bg-purple-500/5 text-purple-600 text-[8px] font-black uppercase rounded border border-purple-500/10">SHADOW</span>
        )}

        {hasIssue && (
          <div className="ml-auto w-1.5 h-1.5 rounded-full bg-rose-800 shadow-[0_0_4px_rgba(159,18,57,0.4)]" />
        )}
      </div>

      <AnimatePresence>
        {isExpanded && hasChildren && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-l border-white/5 ml-[34px] my-1"
          >
            {node.children!.map((child: AXNode, idx: number) => (
              <TreeNode
                key={child.nodeId || idx}
                node={child}
                depth={depth + 1}
                issues={issues}
                searchQuery={searchQuery}
                onSelect={onSelect}
                isSelected={isSelected}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
