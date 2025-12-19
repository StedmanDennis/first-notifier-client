'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { cn } from '@/lib/utils';

interface TeamFloorPlanProps {
    teams: Team[];
    positions: TeamPosition[];
    onPositionChange?: (teamNumber: string, x: number, y: number) => void;
    className?: string;
    width?: number;
    height?: number;
    gridSize?: number;
}

export default function TeamFloorPlan({
    teams,
    positions,
    onPositionChange,
    className,
    width = 400,
    height = 400,
    gridSize = 20
}: TeamFloorPlanProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    useEffect(() => {
        if (!svgRef.current) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous renders

        // Draw Grid
        const gridGroup = svg.append('g').attr('class', 'grid');

        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            gridGroup.append('line')
                .attr('x1', x)
                .attr('y1', 0)
                .attr('x2', x)
                .attr('y2', height)
                .attr('stroke', '#e5e7eb')
                .attr('stroke-width', 1);
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            gridGroup.append('line')
                .attr('x1', 0)
                .attr('y1', y)
                .attr('x2', width)
                .attr('y2', y)
                .attr('stroke', '#e5e7eb')
                .attr('stroke-width', 1);
        }

        const teamsGroup = svg.append('g').attr('class', 'teams');

        // Prepare data merging teams and positions
        const data = teams.map(team => {
            const pos = positions.find(p => p.teamNumber === team.teamNumber) || { x: 50, y: 50 }; // Default pos
            return { ...team, ...pos };
        });

        // Drag handler
        const drag = d3.drag<SVGGElement, typeof data[0]>()
            .on('drag', function (event, d) {
                // simple grid snap
                let newX = Math.round(event.x / gridSize) * gridSize;
                let newY = Math.round(event.y / gridSize) * gridSize;

                // Boundaries
                newX = Math.max(0, Math.min(width, newX));
                newY = Math.max(0, Math.min(height, newY));

                d3.select(this)
                    .attr('transform', `translate(${newX},${newY})`);
                console.log(d3.select(this).data())

                if (onPositionChange) {
                    onPositionChange(d.teamNumber, newX, newY);
                }
            });

        const teamGroups = teamsGroup.selectAll('g.team-marker')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'team-marker')
            .attr('transform', d => `translate(${d.x},${d.y})`)
            .attr('cursor', 'grab')
            .call(drag);

        // Circle
        teamGroups.append('circle')
            .attr('r', 15)
            .attr('fill', '#3b82f6')
            .attr('stroke', '#1d4ed8')
            .attr('stroke-width', 2);

        // Text Label
        teamGroups.append('text')
            .attr('dy', 5)
            .attr('text-anchor', 'middle')
            .attr('fill', 'white')
            .attr('font-size', '10px')
            .attr('font-weight', 'bold')
            .attr('pointer-events', 'none') // Let drag pass through to group/circle
            .text(d => d.teamNumber);

        // Tooltip (simple title for now)
        teamGroups.append('title')
            .text(d => `${d.name} (${d.teamNumber})`);

    }, [teams, positions, width, height, gridSize, onPositionChange]);

    return (
        <div className={cn("border rounded bg-white shadow-sm overflow-hidden", className)}>
            <svg
                ref={svgRef}
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                className="block"
            />
        </div>
    );
}
