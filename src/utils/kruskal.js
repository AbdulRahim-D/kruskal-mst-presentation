// Kruskal's Algorithm with Step-by-Step State Recording and DSU visualization

export const GROUP_COLORS = [
  { name: 'Purple', bg: 'rgba(139, 92, 246, 0.25)', border: '#8B5CF6', text: '#C4B5FD', solid: '#8B5CF6' },
  { name: 'Cyan', bg: 'rgba(6, 182, 212, 0.25)', border: '#06B6D4', text: '#67E8F9', solid: '#06B6D4' },
  { name: 'Amber', bg: 'rgba(245, 158, 11, 0.25)', border: '#F59E0B', text: '#FCD34D', solid: '#F59E0B' },
  { name: 'Rose', bg: 'rgba(236, 72, 153, 0.25)', border: '#EC4899', text: '#F472B6', solid: '#EC4899' },
  { name: 'Emerald', bg: 'rgba(16, 185, 129, 0.25)', border: '#10B981', text: '#6EE7B7', solid: '#10B981' },
  { name: 'Blue', bg: 'rgba(59, 130, 246, 0.25)', border: '#3B82F6', text: '#93C5FD', solid: '#3B82F6' },
  { name: 'Orange', bg: 'rgba(249, 115, 22, 0.25)', border: '#F97316', text: '#FDBA74', solid: '#F97316' },
  { name: 'Indigo', bg: 'rgba(99, 102, 241, 0.25)', border: '#6366F1', text: '#A5B4FC', solid: '#6366F1' },
];

export class DisjointSet {
  constructor(nodeIds) {
    this.parent = {};
    this.rank = {};
    this.colorIdx = {};

    nodeIds.forEach((id, idx) => {
      this.parent[id] = id;
      this.rank[id] = 0;
      this.colorIdx[id] = idx % GROUP_COLORS.length;
    });
  }

  find(i) {
    if (this.parent[i] === i) return i;
    this.parent[i] = this.find(this.parent[i]);
    return this.parent[i];
  }

  union(i, j) {
    const rootI = this.find(i);
    const rootJ = this.find(j);

    if (rootI === rootJ) return false;

    // Union by rank, propagate color of surviving root
    if (this.rank[rootI] < this.rank[rootJ]) {
      this.parent[rootI] = rootJ;
    } else if (this.rank[rootI] > this.rank[rootJ]) {
      this.parent[rootJ] = rootI;
    } else {
      this.parent[rootJ] = rootI;
      this.rank[rootI]++;
    }
    return true;
  }

  // Clone internal state for a snapshot
  snapshot(nodeIds) {
    const groups = {};
    nodeIds.forEach(id => {
      const root = this.find(id);
      if (!groups[root]) {
        groups[root] = {
          root,
          color: GROUP_COLORS[this.colorIdx[root]],
          members: []
        };
      }
      groups[root].members.push(id);
    });

    const nodeGroupMap = {};
    Object.values(groups).forEach(g => {
      g.members.forEach(m => {
        nodeGroupMap[m] = g;
      });
    });

    return {
      groups: Object.values(groups),
      nodeGroupMap
    };
  }
}

// Generate the full step sequence for Kruskal's algorithm
export function computeKruskalSteps(nodes, edges) {
  const steps = [];
  const nodeIds = nodes.map(n => n.id);
  const V = nodeIds.length;
  const targetEdges = Math.max(0, V - 1);

  // Initial DSU
  const dsu = new DisjointSet(nodeIds);
  let initialSnap = dsu.snapshot(nodeIds);

  // Step 0: Initial Raw State
  steps.push({
    stepIndex: 0,
    title: 'Initial Village Layout',
    phase: 'INITIAL',
    action: 'OBSERVE',
    explanation: `We have ${V} isolated houses needing fiber connection. Each house is in its own isolated network component (5 separate color groups). Total edges required for a tree: V - 1 = ${targetEdges}.`,
    edgesSorted: [...edges],
    currentEdge: null,
    acceptedEdges: [],
    rejectedEdges: [],
    pendingEdges: edges.map(e => e.id),
    totalWeight: 0,
    edgesCount: 0,
    targetEdges,
    dsuSnapshot: initialSnap,
    cycleNodes: []
  });

  // Step 1: Sort All Edges
  const sortedEdges = [...edges].sort((a, b) => a.weight - b.weight);

  steps.push({
    stepIndex: 1,
    title: 'Greedy Sorting Phase',
    phase: 'SORT',
    action: 'SORT_EDGES',
    explanation: `Step 1: Sort all ${edges.length} candidate roads in ascending order of installation cost (from ₹${sortedEdges[0]?.weight ?? 0}k to ₹${sortedEdges[sortedEdges.length - 1]?.weight ?? 0}k). Kruskal will always inspect the cheapest available road first!`,
    edgesSorted: sortedEdges,
    currentEdge: null,
    acceptedEdges: [],
    rejectedEdges: [],
    pendingEdges: sortedEdges.map(e => e.id),
    totalWeight: 0,
    edgesCount: 0,
    targetEdges,
    dsuSnapshot: initialSnap,
    cycleNodes: []
  });

  let accepted = [];
  let rejected = [];
  let totalCost = 0;
  let stepCounter = 2;

  // Process sorted edges
  for (let i = 0; i < sortedEdges.length; i++) {
    const edge = sortedEdges[i];
    const u = edge.from;
    const v = edge.to;

    // Are we already finished?
    if (accepted.length >= targetEdges) {
      break;
    }

    const snapBefore = dsu.snapshot(nodeIds);
    const rootU = dsu.find(u);
    const rootV = dsu.find(v);
    const willFormCycle = rootU === rootV;

    // Step: EXAMINE edge
    steps.push({
      stepIndex: stepCounter++,
      title: `Examining Road (${u} ↔ ${v})`,
      phase: 'EXAMINE',
      action: 'CHECK_CYCLE',
      explanation: `Inspect Road (${u} ↔ ${v}) with cost ₹${edge.weight}k. House ${u} is in ${snapBefore.nodeGroupMap[u]?.color.name} group; House ${v} is in ${snapBefore.nodeGroupMap[v]?.color.name} group. ${willFormCycle ? 'They already belong to the same connected group!' : 'They are in different groups!'}`,
      edgesSorted: sortedEdges,
      currentEdge: edge,
      acceptedEdges: [...accepted],
      rejectedEdges: [...rejected],
      pendingEdges: sortedEdges.slice(i + 1).map(e => e.id),
      totalWeight: totalCost,
      edgesCount: accepted.length,
      targetEdges,
      dsuSnapshot: snapBefore,
      cycleNodes: willFormCycle ? snapBefore.nodeGroupMap[u]?.members || [u, v] : []
    });

    if (!willFormCycle) {
      // ACCEPT edge
      dsu.union(u, v);
      accepted.push(edge.id);
      totalCost += edge.weight;
      const snapAfter = dsu.snapshot(nodeIds);

      steps.push({
        stepIndex: stepCounter++,
        title: `Accepted: Road (${u} ↔ ${v})`,
        phase: 'DECISION',
        action: 'ACCEPT',
        explanation: `Road (${u} ↔ ${v}) [Cost ₹${edge.weight}k] ACCEPTED! It safely joins two previously disconnected groups without creating any loop. Running installation cost: ₹${totalCost}k. (${accepted.length}/${targetEdges} edges selected).`,
        edgesSorted: sortedEdges,
        currentEdge: edge,
        acceptedEdges: [...accepted],
        rejectedEdges: [...rejected],
        pendingEdges: sortedEdges.slice(i + 1).map(e => e.id),
        totalWeight: totalCost,
        edgesCount: accepted.length,
        targetEdges,
        dsuSnapshot: snapAfter,
        cycleNodes: []
      });
    } else {
      // REJECT edge
      rejected.push(edge.id);
      const snapAfter = dsu.snapshot(nodeIds);

      steps.push({
        stepIndex: stepCounter++,
        title: `Rejected: Road (${u} ↔ ${v}) (Cycle Detected!)`,
        phase: 'DECISION',
        action: 'REJECT',
        explanation: `Road (${u} ↔ ${v}) [Cost ₹${edge.weight}k] REJECTED! A path already exists between House ${u} and House ${v}. Adding this road would waste funds and form a closed redundant loop (cycle).`,
        edgesSorted: sortedEdges,
        currentEdge: edge,
        acceptedEdges: [...accepted],
        rejectedEdges: [...rejected],
        pendingEdges: sortedEdges.slice(i + 1).map(e => e.id),
        totalWeight: totalCost,
        edgesCount: accepted.length,
        targetEdges,
        dsuSnapshot: snapAfter,
        cycleNodes: snapAfter.nodeGroupMap[u]?.members || [u, v]
      });
    }
  }

  // Final Completion Step
  const finalSnap = dsu.snapshot(nodeIds);
  const isConnected = finalSnap.groups.length === 1 || V <= 1;

  steps.push({
    stepIndex: stepCounter,
    title: isConnected ? 'Minimum Spanning Tree Complete!' : 'Kruskal Finished (Spanning Forest)',
    phase: 'COMPLETE',
    action: 'FINISHED',
    explanation: isConnected
      ? `Goal Achieved! Exactly ${targetEdges} edges (V - 1) have been selected. All ${V} houses are now interconnected with fiber optic cable with ZERO loops at the mathematically proven lowest total cost: ₹${totalCost}k!`
      : `Algorithm completed. The graph has ${finalSnap.groups.length} disconnected components, forming a Minimum Spanning Forest with total cost ₹${totalCost}k.`,
    edgesSorted: sortedEdges,
    currentEdge: null,
    acceptedEdges: [...accepted],
    rejectedEdges: [...rejected],
    pendingEdges: [],
    totalWeight: totalCost,
    edgesCount: accepted.length,
    targetEdges,
    dsuSnapshot: finalSnap,
    cycleNodes: []
  });

  return steps;
}
