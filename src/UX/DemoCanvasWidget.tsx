import styled from '@emotion/styled';
import {
    DagreEngine,
    DiagramEngine,
    DiagramModel,
} from '@projectstorm/react-diagrams';
import * as React from 'react';

export interface DemoCanvasWidgetProps {
    model: DiagramModel;
    engine: DiagramEngine;
    color?: string;
    background?: string;
    model_number: number;
}

const Container = styled.div<{ color: string; background: string }>`
    height: 100%;
    background-color: ${(p) => p.background} !important;
    background-size: 50px 50px;
    display: flex;
    > * {
        height: 100%;
        min-height: 100%;
        width: 100%;
    }
    background-image: linear-gradient(
            0deg,
            transparent 24%,
            ${(p) => p.color} 25%,
            ${(p) => p.color} 26%,
            transparent 27%,
            transparent 74%,
            ${(p) => p.color} 75%,
            ${(p) => p.color} 76%,
            transparent 77%,
            transparent
        ),
        linear-gradient(
            90deg,
            transparent 24%,
            ${(p) => p.color} 25%,
            ${(p) => p.color} 26%,
            transparent 27%,
            transparent 74%,
            ${(p) => p.color} 75%,
            ${(p) => p.color} 76%,
            transparent 77%,
            transparent
        );
`;

export class DemoCanvasWidget extends React.Component<
    DemoCanvasWidgetProps,
    any
> {
    engine: DagreEngine;

    model_number: number;

    constructor(props: any) {
        super(props);
        this.engine = new DagreEngine({
            graph: {
                rankdir: 'TB',
                ranker: 'tight-tree',
                marginx: 25,
                marginy: 25,
            },
            includeLinks: false,
        });
        this.model_number = -1;
    }

    redistribute() {
        this.engine.redistribute(this.props.model);
        this.props.engine.repaintCanvas();
    }

    render() {
        return (
            <Container
                background={this.props.background || 'rgb(60,60,60)'}
                color={this.props.color || 'rgba(255,255,255, 0.05)'}
            >
                {this.props.children}
            </Container>
        );
    }

    componentDidUpdate() {
        if (this.props.model_number > this.model_number) {
            this.model_number = this.props.model_number;
            console.log('check');
            setTimeout(() => {
                this.redistribute();
                this.props.engine.zoomToFit();
            }, 0);
        }
    }
}
