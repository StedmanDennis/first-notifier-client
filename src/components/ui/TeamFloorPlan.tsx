'use client';

import React, { useEffect, useRef, useMemo, JSX, useState } from 'react';
import * as d3 from 'd3';
import { Team, TeamPosition } from '@/lib/api/first_notifier/schema_alias';
import { useQuery } from '@tanstack/react-query';
import { getAllTeamPositionsOptions, getAllTeamsOptions } from '@/lib/api/first_notifier/react_query_options';

type TeamWithPosition = Team & Omit<TeamPosition, 'teamNumber'>
type FloorPlanData = Record<string, TeamWithPosition>

export default function TeamFloorPlan() {
    const { data: teams } = useQuery(getAllTeamsOptions())
    const { data: positions } = useQuery(getAllTeamPositionsOptions())
    const [floorPlanPositions, setFloorPlanPositions] = useState<FloorPlanData>({})
    const svgRef = useRef<SVGSVGElement>(null)
    const width = 400;
    const height = 400;
    const gridSize = 20;

    // Update floor plan positions when data loads
    useEffect(() => {
        if (!teams || !positions) return

        const newPositions = positions.reduce((acc, pos) => {
            //safe to assume a team that has a position exists in the team array
            //because the a team must exist to have a position
            const team = teams.find(t => t.teamNumber === pos.teamNumber)!
            acc[pos.teamNumber] = { ...team, x: pos.x, y: pos.y }
            return acc
        }, {} as FloorPlanData)

        setFloorPlanPositions(newPositions)
    }, [teams, positions])

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
        const drag = d3.drag<SVGGElement, [string, TeamWithPosition]>()
            .on('drag', function (event, d) {
                // Grid snap
                let newX = Math.round(event.x / gridSize) * gridSize;
                let newY = Math.round(event.y / gridSize) * gridSize;

                // Boundaries
                newX = Math.max(0, Math.min(width, newX));
                newY = Math.max(0, Math.min(height, newY));

                // Update transform
                d3.select(this).attr('transform', `translate(${newX},${newY})`);
            });

        // Apply drag behavior to React-rendered team markers
        if (svgRef.current) {
            d3.select(svgRef.current)
                .selectAll<SVGGElement, [string, TeamWithPosition]>('.team-marker')
                .data(Object.entries(floorPlanPositions))
                .call(drag);
        }
    }, [floorPlanPositions, gridSize, width, height]);

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
                    {Object.entries(floorPlanPositions).map(([teamNumber, data]) => (
                        <g
                            key={teamNumber}
                            className="team-marker"
                            transform={`translate(${data.x},${data.y})`}
                            style={{ cursor: 'grab' }}
                        >
                            <title>{`${data.name} (${teamNumber})`}</title>
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
                                {teamNumber}
                            </text>
                        </g>
                    ))}
                </g>
            </svg>
        </div>
    );
}
