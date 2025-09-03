import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphLink } from '../../types';
import { ZoomIn, ZoomOut, Maximize2, RotateCcw, MousePointer, Hand } from 'lucide-react';

interface ObsidianGraphProps {
  nodes: GraphNode[];
  links: GraphLink[];
  onNodeClick?: (node: GraphNode) => void;
}

export function ObsidianGraph({ nodes, links, onNodeClick }: ObsidianGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState({ x: 0, y: 0, k: 1 });
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [hoveredNode, setHoveredNode] = useState<GraphNode | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || nodes.length === 0) return;

    const svg = d3.select(svgRef.current);
    const container = containerRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // Clear previous content
    svg.selectAll('*').remove();

    // Set up SVG dimensions
    svg.attr('width', width).attr('height', height);

    // Create zoom behavior
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        const { transform } = event;
        setTransform({ x: transform.x, y: transform.y, k: transform.k });
        g.attr('transform', transform);
      });

    svg.call(zoom);

    // Main group for all elements
    const g = svg.append('g');

    // Create force simulation with better physics
    const simulation = d3.forceSimulation(nodes as any)
      .force('link', d3.forceLink(links).id((d: any) => d.id).distance(120).strength(0.3))
      .force('charge', d3.forceManyBody().strength(-400))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('collision', d3.forceCollide().radius(35))
      .force('x', d3.forceX(width / 2).strength(0.1))
      .force('y', d3.forceY(height / 2).strength(0.1));

    // Create gradient definitions
    const defs = svg.append('defs');
    
    // Node gradients
    const nodeGradients = defs.selectAll('radialGradient')
      .data(['concept', 'topic', 'question', 'answer'])
      .enter()
      .append('radialGradient')
      .attr('id', d => `gradient-${d}`)
      .attr('cx', '30%')
      .attr('cy', '30%')
      .attr('r', '70%');

    nodeGradients.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', d => {
        switch (d) {
          case 'concept': return '#3b82f6';
          case 'topic': return '#8b5cf6';
          case 'question': return '#f59e0b';
          case 'answer': return '#10b981';
          default: return '#6b7280';
        }
      });

    nodeGradients.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', d => {
        switch (d) {
          case 'concept': return '#1d4ed8';
          case 'topic': return '#7c3aed';
          case 'question': return '#d97706';
          case 'answer': return '#059669';
          default: return '#4b5563';
        }
      });

    // Create links with better styling
    const link = g.append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', '#6b7280')
      .attr('stroke-opacity', 0.4)
      .attr('stroke-width', 2)
      .style('filter', 'drop-shadow(0 0 3px rgba(107, 114, 128, 0.2))')
      .style('transition', 'stroke-opacity 0.3s ease');

    // Create node groups
    const nodeGroup = g.append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .style('cursor', 'pointer')
      .call(d3.drag<SVGGElement, GraphNode>()
        .on('start', (event, d) => {
          setIsDragging(true);
          if (!event.active) simulation.alphaTarget(0.3).restart();
          d.fx = d.x;
          d.fy = d.y;
        })
        .on('drag', (event, d) => {
          d.fx = event.x;
          d.fy = event.y;
        })
        .on('end', (event, d) => {
          setIsDragging(false);
          if (!event.active) simulation.alphaTarget(0);
          d.fx = null;
          d.fy = null;
        })
      );

    // Add circles to nodes with gradients
    const circles = nodeGroup.append('circle')
      .attr('r', (d) => {
        switch (d.type) {
          case 'concept': return 14;
          case 'topic': return 12;
          case 'question': return 10;
          case 'answer': return 10;
          default: return 12;
        }
      })
      .attr('fill', (d) => `url(#gradient-${d.type})`)
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 3)
      .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))')
      .style('transition', 'all 0.3s ease')
      .on('mouseover', function(event, d) {
        setHoveredNode(d);
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d: GraphNode) => {
            switch (d.type) {
              case 'concept': return 18;
              case 'topic': return 16;
              case 'question': return 14;
              case 'answer': return 14;
              default: return 16;
            }
          })
          .style('filter', 'drop-shadow(0 6px 12px rgba(0, 0, 0, 0.25))');
        
        // Highlight connected links
        link.style('stroke-opacity', (l: any) => 
          l.source.id === d.id || l.target.id === d.id ? 0.8 : 0.1
        );
      })
      .on('mouseout', function(event, d) {
        setHoveredNode(null);
        d3.select(this)
          .transition()
          .duration(200)
          .attr('r', (d: GraphNode) => {
            switch (d.type) {
              case 'concept': return 14;
              case 'topic': return 12;
              case 'question': return 10;
              case 'answer': return 10;
              default: return 12;
            }
          })
          .style('filter', 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.15))');
        
        // Reset link opacity
        link.style('stroke-opacity', 0.4);
      })
      .on('click', (event, d) => {
        setSelectedNode(d);
        onNodeClick?.(d);
      });

    // Add labels to nodes with better styling
    const labels = nodeGroup.append('text')
      .text(d => d.label)
      .attr('text-anchor', 'middle')
      .attr('dy', -25)
      .attr('font-size', '11px')
      .attr('font-weight', '600')
      .attr('fill', '#1f2937')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 1px 3px rgba(255, 255, 255, 0.9)')
      .style('transition', 'opacity 0.3s ease')
      .style('opacity', 0.8);

    // Add node type badges
    const badges = nodeGroup.append('text')
      .text(d => d.type.toUpperCase())
      .attr('text-anchor', 'middle')
      .attr('dy', 25)
      .attr('font-size', '8px')
      .attr('font-weight', '700')
      .attr('fill', '#ffffff')
      .style('pointer-events', 'none')
      .style('text-shadow', '0 1px 2px rgba(0, 0, 0, 0.5)');

    // Update positions on simulation tick
    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      nodeGroup
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    // Cleanup
    return () => {
      simulation.stop();
    };
  }, [nodes, links, onNodeClick]);

  const handleZoomIn = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(
          d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
          1.5
        );
    }
  };

  const handleZoomOut = () => {
    if (svgRef.current) {
      d3.select(svgRef.current)
        .transition()
        .duration(300)
        .call(
          d3.zoom<SVGSVGElement, unknown>().scaleBy as any,
          1 / 1.5
        );
    }
  };

  const handleFitToView = () => {
    if (svgRef.current && containerRef.current) {
      const svg = d3.select(svgRef.current);
      const container = containerRef.current;
      
      svg.transition()
        .duration(500)
        .call(
          d3.zoom<SVGSVGElement, unknown>().transform as any,
          d3.zoomIdentity.translate(container.clientWidth / 2, container.clientHeight / 2).scale(1)
        );
    }
  };

  const handleReset = () => {
    if (svgRef.current) {
      const svg = d3.select(svgRef.current);
      svg.transition()
        .duration(500)
        .call(
          d3.zoom<SVGSVGElement, unknown>().transform as any,
          d3.zoomIdentity
        );
    }
  };

  return (
    <div ref={containerRef} className="relative w-full h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 overflow-hidden">
      {/* Graph Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col space-y-2">
        <button
          onClick={handleZoomIn}
          className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <button
          onClick={handleFitToView}
          className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
          aria-label="Fit to view"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
        <button
          onClick={handleReset}
          className="p-2 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg hover:bg-white dark:hover:bg-gray-800 transition-all duration-200"
          aria-label="Reset view"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Graph Info */}
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <div className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
          <div>Nodes: {nodes.length}</div>
          <div>Links: {links.length}</div>
          <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">
            Zoom: {Math.round(transform.k * 100)}%
          </div>
          {hoveredNode && (
            <div className="mt-2 pt-2 border-t border-gray-200 dark:border-gray-600">
              <div className="font-medium text-gray-900 dark:text-gray-100">
                {hoveredNode.label}
              </div>
              <div className="text-gray-500 dark:text-gray-400">
                Type: {hoveredNode.type}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="absolute top-4 left-4 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-3">
        <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-2">Node Types</h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-blue-500 to-blue-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Concepts</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-500 to-purple-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Topics</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-amber-500 to-amber-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Questions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-500 to-green-600"></div>
            <span className="text-gray-600 dark:text-gray-400">Answers</span>
          </div>
        </div>
      </div>

      {/* Interaction Mode Indicator */}
      <div className="absolute top-1/2 left-4 transform -translate-y-1/2 z-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2">
        <div className="text-center">
          {isDragging ? (
            <Hand className="w-4 h-4 text-blue-600" />
          ) : (
            <MousePointer className="w-4 h-4 text-gray-400" />
          )}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {isDragging ? 'Dragging' : 'Hover'}
        </div>
      </div>

      {/* SVG Canvas */}
      <svg
        ref={svgRef}
        className="w-full h-full"
        style={{ 
          background: 'radial-gradient(circle at 50% 50%, rgba(59, 130, 246, 0.03) 0%, transparent 70%)',
        }}
      />
    </div>
  );
}