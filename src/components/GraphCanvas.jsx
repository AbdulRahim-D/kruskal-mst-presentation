import React, { useRef } from 'react';

export default function GraphCanvas({
  nodes = [],
  edges = [],
  currentEdge = null,
  acceptedEdges = [],
  rejectedEdges = [],
  dsuSnapshot = null,
  cycleNodes = [],
  onNodeClick = null,
  onNodeDrag = null,
  selectedNode = null,
  isEditable = false,
  width = 720,
  height = 440
}) {
  const svgRef = useRef(null);
  const draggingNodeRef = useRef(null);

  // Helper to get node by ID
  const getNode = (id) => nodes.find(n => n.id === id);

  // Mouse drag handlers for playground
  const handleMouseDown = (e, node) => {
    if (!isEditable) return;
    e.stopPropagation();
    draggingNodeRef.current = node.id;
  };

  const handleMouseMove = (e) => {
    if (!isEditable || !draggingNodeRef.current || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = Math.round(((e.clientX - rect.left) / rect.width) * width);
    const y = Math.round(((e.clientY - rect.top) / rect.height) * height);

    // Keep within bounds
    const boundedX = Math.max(40, Math.min(width - 40, x));
    const boundedY = Math.max(40, Math.min(height - 40, y));

    if (onNodeDrag) {
      onNodeDrag(draggingNodeRef.current, boundedX, boundedY);
    }
  };

  const handleMouseUp = () => {
    draggingNodeRef.current = null;
  };

  // Pre-calculate badge positions with collision prevention
  const placedBadges = [];
  const preparedEdges = edges.map((edge) => {
    const u = getNode(edge.from);
    const v = getNode(edge.to);
    if (!u || !v) return null;

    let ratio = edge.badgeRatio ?? 0.5;
    let midX = u.x + (v.x - u.x) * ratio;
    let midY = u.y + (v.y - u.y) * ratio;

    // Check if this badge position collides with an already placed badge (distance < 28px)
    if (edge.badgeRatio === undefined) {
      const collides = placedBadges.some(b => Math.hypot(b.x - midX, b.y - midY) < 28);
      if (collides) {
        ratio = 0.3;
        midX = u.x + (v.x - u.x) * ratio;
        midY = u.y + (v.y - u.y) * ratio;
        if (placedBadges.some(b => Math.hypot(b.x - midX, b.y - midY) < 28)) {
          ratio = 0.7;
          midX = u.x + (v.x - u.x) * ratio;
          midY = u.y + (v.y - u.y) * ratio;
        }
      }
    }

    placedBadges.push({ x: midX, y: midY });
    return { edge, u, v, midX, midY };
  }).filter(Boolean);

  return (
    <div className="relative w-full overflow-hidden select-none">
      <svg
        ref={svgRef}
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[460px] bg-[#0D1017] rounded-2xl border border-[#1F2636] shadow-2xl transition-all"
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <defs>
          {/* Subtle grid pattern */}
          <pattern id="graph-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#161B26" strokeWidth="1" />
            <circle cx="0" cy="0" r="1.5" fill="#202738" />
          </pattern>

          {/* Glow filters */}
          <filter id="glow-orange" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#FF6129" floodOpacity="0.8" />
          </filter>
          <filter id="glow-emerald" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor="#10B981" floodOpacity="0.85" />
          </filter>
          <filter id="glow-red" x="-50%" y="-50%" width="200%" height="200%">
            <feDropShadow dx="0" dy="0" stdDeviation="5" floodColor="#EF4444" floodOpacity="0.85" />
          </filter>
        </defs>

        {/* Background grid */}
        <rect width={width} height={height} fill="url(#graph-grid)" />

        {/* 1. EDGES LAYER */}
        <g className="edges-layer">
          {preparedEdges.map(({ edge, u, v, midX, midY }) => {
            const isCurrent = currentEdge?.id === edge.id;
            const isAccepted = acceptedEdges.includes(edge.id);
            const isRejected = rejectedEdges.includes(edge.id);

            let strokeColor = '#2A3347';
            let strokeWidth = 2.5;
            let strokeDasharray = '5 5';
            let filter = undefined;
            let className = '';

            if (isAccepted) {
              strokeColor = '#10B981';
              strokeWidth = 4.5;
              strokeDasharray = 'none';
              filter = 'url(#glow-emerald)';
            } else if (isCurrent) {
              strokeColor = '#FF6129';
              strokeWidth = 4.5;
              strokeDasharray = '8 8';
              filter = 'url(#glow-orange)';
              className = 'animate-cable-active';
            } else if (isRejected) {
              strokeColor = '#EF4444';
              strokeWidth = 2.5;
              strokeDasharray = '4 4';
              filter = 'url(#glow-red)';
              className = 'opacity-60';
            }

            return (
              <g key={edge.id} className="transition-all duration-300">
                {/* Edge line */}
                <line
                  x1={u.x}
                  y1={u.y}
                  x2={v.x}
                  y2={v.y}
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDasharray}
                  filter={filter}
                  className={className}
                  strokeLinecap="round"
                />

                {/* Weight badge pill */}
                <g transform={`translate(${midX}, ${midY})`}>
                  <rect
                    x="-20"
                    y="-13"
                    width="40"
                    height="26"
                    rx="13"
                    fill={isAccepted ? '#0A2E22' : isCurrent ? '#3D170B' : isRejected ? '#3A1414' : '#141A26'}
                    stroke={isAccepted ? '#10B981' : isCurrent ? '#FF6129' : isRejected ? '#EF4444' : '#2C364D'}
                    strokeWidth={isAccepted || isCurrent ? 2 : 1}
                    className="transition-colors duration-200"
                  />
                  <text
                    x="0"
                    y="4"
                    textAnchor="middle"
                    fill={isAccepted ? '#6EE7B7' : isCurrent ? '#FFB295' : isRejected ? '#FCA5A5' : '#94A3B8'}
                    fontSize="12"
                    fontWeight="700"
                    className="font-mono pointer-events-none select-none"
                  >
                    {edge.label || edge.weight}
                  </text>
                </g>
              </g>
            );
          })}
        </g>

        {/* 2. NODES LAYER */}
        <g className="nodes-layer">
          {nodes.map((node) => {
            const groupInfo = dsuSnapshot?.nodeGroupMap?.[node.id];
            const groupColor = groupInfo?.color;
            const isSelected = selectedNode === node.id;
            const isCycleNode = cycleNodes.includes(node.id);
            const isCurrentEndpoint = currentEdge?.from === node.id || currentEdge?.to === node.id;

            const borderColor = groupColor?.border || (isSelected ? '#FF6129' : '#334155');
            const bgColor = groupColor?.bg || '#1E2536';
            const solidColor = groupColor?.solid || '#64748B';

            return (
              <g
                key={node.id}
                transform={`translate(${node.x}, ${node.y})`}
                className={`transition-transform duration-200 ${isEditable ? 'cursor-grab active:cursor-grabbing' : 'cursor-pointer'}`}
                onMouseDown={(e) => handleMouseDown(e, node)}
                onClick={() => onNodeClick && onNodeClick(node)}
              >
                {/* Active endpoint radar ring */}
                {isCurrentEndpoint && (
                  <circle
                    r="34"
                    fill="none"
                    stroke="#FF6129"
                    strokeWidth="2"
                    opacity="0.7"
                    className="animate-ping origin-center"
                  />
                )}

                {/* Cycle alert halo */}
                {isCycleNode && (
                  <circle
                    r="30"
                    fill="none"
                    stroke="#EF4444"
                    strokeWidth="2.5"
                    strokeDasharray="4 3"
                    className="animate-spin"
                    style={{ animationDuration: '4s' }}
                  />
                )}

                {/* Outer set-colored aura */}
                <circle
                  r="24"
                  fill={bgColor}
                  stroke={borderColor}
                  strokeWidth={isSelected || isCurrentEndpoint ? 3 : 2}
                  className="transition-all duration-300"
                />

                {/* Node inner body */}
                <circle
                  r="18"
                  fill="#121622"
                  stroke={solidColor}
                  strokeWidth="1.5"
                />

                {/* Node label letter */}
                <text
                  x="0"
                  y="5"
                  textAnchor="middle"
                  fill="#FFFFFF"
                  fontSize="13"
                  fontWeight="800"
                  className="font-heading pointer-events-none select-none"
                >
                  {node.id}
                </text>

                {/* Node caption / subtitle below */}
                <g transform="translate(0, 36)">
                  <rect
                    x="-42"
                    y="-10"
                    width="84"
                    height="20"
                    rx="10"
                    fill="#0A0C12"
                    stroke="#232B3C"
                    strokeWidth="1"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    fill="#CBD5E1"
                    fontSize="10"
                    fontWeight="600"
                    className="pointer-events-none select-none"
                  >
                    {node.label || `House ${node.id}`}
                  </text>
                </g>

                {/* DSU Set badge above node */}
                {groupColor && (
                  <g transform="translate(0, -32)">
                    <rect
                      x="-32"
                      y="-8"
                      width="64"
                      height="16"
                      rx="8"
                      fill="#0C0F17"
                      stroke={groupColor.border}
                      strokeWidth="1"
                    />
                    <text
                      x="0"
                      y="4"
                      textAnchor="middle"
                      fill={groupColor.text}
                      fontSize="9"
                      fontWeight="700"
                      className="pointer-events-none select-none"
                    >
                      {groupColor.name} Set
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Interactive canvas hint */}
      {isEditable && (
        <div className="absolute top-3 right-3 text-xs font-mono text-slate-400 bg-black/60 px-2.5 py-1 rounded-md border border-white/10 backdrop-blur-sm pointer-events-none">
          Drag nodes • Click to connect
        </div>
      )}
    </div>
  );
}
