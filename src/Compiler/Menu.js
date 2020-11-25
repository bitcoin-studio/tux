import React from 'react';
import Form from '@rjsf/core';
import Nav from 'react-bootstrap/Nav';
import Tab from 'react-bootstrap/Tab';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

export class Menu extends React.Component {
    render() {
        let nav_options = [];
        let tab_options = [];
        let default_key = null;

        for (let option of this.props.args['oneOf']) {
            let key = 'dyanimic_form_' + option.title;
            default_key = default_key || key;
            nav_options.push(
                <Nav.Item key={option.title}>
                    <Nav.Link eventKey={key}> {option.title} </Nav.Link>
                </Nav.Item>
            );
            tab_options.push(
                <Tab.Pane eventKey={key} key={option.title} title={option}>
                    <Row>
                        <Col
                            sm={{
                                span: 10,
                                offset: 1,
                            }}
                        >
                            <Form
                                schema={option}
                                onSubmit={({ formData }, e) =>
                                    this.handleSubmit(formData, e, option.title)
                                }
                            />
                        </Col>
                    </Row>
                </Tab.Pane>
            );
        }
        return (
            <Tab.Container defaultActiveKey={default_key}>
                <Nav variant="tabs" justify className="navbar">
                    {nav_options}
                </Nav>
                <Tab.Content>{tab_options}</Tab.Content>
            </Tab.Container>
        );
    }

    handleSubmit(formData, event, type) {
        const compiler = this.props.compiler;
        event.preventDefault();
        compiler.create(type, formData, this.props.load_new_model);

        this.props.hide();
    }
}
