'use client';

import React, { useEffect, useRef, useMemo, JSX } from 'react';
import * as d3 from 'd3';
import { Team, TeamPosition } from '@/lib/api/first_notifier/schema_alias';

interface TeamFloorPlanProps {
    teams: Team[];
    positions: TeamPosition[];
    onPositionChange?: (teamNumber: string, x: number, y: number) => void;
    width?: number;
    height?: number;
    gridSize?: number;
}

type TeamWithPosition = Team & Omit<TeamPosition, 'teamNumber'>

export default function TeamFloorPlan({
    teams,
    positions,
    onPositionChange,
    width = 400,
    height = 400,
    gridSize = 20
}: TeamFloorPlanProps) {
    const svgRef = useRef<SVGSVGElement>(null);

    // Merge teams with their positions
    const teamsWithPositions = useMemo<TeamWithPosition[]>(() => {
        return teams.map(team => {
            const pos = positions.find(p => p.teamNumber === team.teamNumber) || { x: 50, y: 50 };
            return { ...team, ...pos };
        });
    }, [teams, positions]);

    // Generate grid lines
    const gridLines = useMemo(() => {
        const lines: JSX.Element[] = [];

        // Vertical lines
        for (let x = 0; x <= width; x += gridSize) {
            lines.push(
                <line
                    key={`v-${x}`}
                    x1={x}
                    y1={0}
                    x2={x}
                    y2={height}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                />
            );
        }

        // Horizontal lines
        for (let y = 0; y <= height; y += gridSize) {
            lines.push(
                <line
                    key={`h-${y}`}
                    x1={0}
                    y1={y}
                    x2={width}
                    y2={y}
                    stroke="#e5e7eb"
                    strokeWidth={1}
                />
            );
        }

        return lines;
    }, [width, height, gridSize]);

    // Setup D3 drag behavior
    useEffect(() => {
        const drag = d3.drag<SVGGElement, TeamWithPosition>()
            .on('drag', function (event, d) {
                // Grid snap
                let newX = Math.round(event.x / gridSize) * gridSize;
                let newY = Math.round(event.y / gridSize) * gridSize;

                // Boundaries
                newX = Math.max(0, Math.min(width, newX));
                newY = Math.max(0, Math.min(height, newY));

                // Update transform
                d3.select(this).attr('transform', `translate(${newX},${newY})`);

                if (onPositionChange) {
                    onPositionChange(d.teamNumber, newX, newY);
                }
            });

        // Apply drag behavior to React-rendered team markers
        if (svgRef.current) {
            d3.select(svgRef.current)
                .selectAll<SVGGElement, TeamWithPosition>('.team-marker')
                .data(teamsWithPositions)
                .call(drag);
        }
    }, [teamsWithPositions, gridSize, width, height, onPositionChange]);

    return (
        <div className="border rounded bg-white shadow-sm overflow-hidden">
            <svg
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                ref={svgRef}
            >
                {/* Grid */}
                <g className="grid">
                    {gridLines}
                </g>

                {/* Teams */}
                <g className="teams">
                    {teamsWithPositions.map(team => (
                        <g
                            key={team.teamNumber}
                            className="team-marker"
                            transform={`translate(${team.x},${team.y})`}
                            style={{ cursor: 'grab' }}
                        >
                            <title>{`${team.name} (${team.teamNumber})`}</title>
                            <circle
                                r={15}
                                fill="#3b82f6"
                                stroke="#1d4ed8"
                                strokeWidth={2}
                            />
                            <text
                                dy={5}
                                textAnchor="middle"
                                fill="white"
                                fontSize="10px"
                                fontWeight="bold"
                                pointerEvents="none"
                            >
                                {team.teamNumber}
                            </text>
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
}
