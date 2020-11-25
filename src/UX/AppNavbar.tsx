import React, { useState } from 'react';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import './AppNavbar.css';
import {
    CreateContractModal,
    LoadHexModal,
    SapioCompilerModal,
    SaveHexModal,
    ViewContractModal,
} from './CreateVaultModal';

export function AppNavbar(props: any): JSX.Element {
    const [modalView, setModalView] = useState(false);
    const [modalCreate, setModalCreate] = useState(false);
    const [modalSapioCompiler, setModalaSapioCompiler] = useState(false);
    const [modalLoadHex, setModalaLoadHex] = useState(false);
    const [modalSaveHex, setModalSaveHex] = useState(false);
    const [showSim, setSim] = useState(true);
    const toggleSim = () => {
        console.log('TOG', showSim);
        props.toggle_timing_simulator(showSim);
        setSim(!showSim);
    };

    return (
        <Navbar variant="dark">
            <Navbar.Brand> tux. </Navbar.Brand>

            <Nav className="justify-content-end w-100">
                <Nav.Link
                    eventKey="create"
                    onSelect={() => setModalCreate(true)}
                    aria-controls="create-contract-form"
                    aria-expanded={modalCreate}
                />
                <Nav.Link eventKey="sim" onSelect={toggleSim}>
                    Timing Simulator
                </Nav.Link>

                <Nav.Link
                    eventKey="view"
                    onSelect={() => setModalView(true)}
                    aria-controls="view-contract-form"
                    aria-expanded={modalView}
                >
                    View
                </Nav.Link>

                <Nav.Link
                    eventKey="sapio-compiler"
                    onSelect={() => setModalaSapioCompiler(true)}
                    aria-controls="sapio-compiler-form"
                    aria-expanded={modalSapioCompiler}
                >
                    Sapio
                </Nav.Link>

                <Nav.Link
                    eventKey="load-hex"
                    onSelect={() => setModalaLoadHex(true)}
                    aria-controls="load-hex-form"
                    aria-expanded={modalLoadHex}
                >
                    Load
                </Nav.Link>

                <Nav.Link
                    eventKey="save-hex"
                    onSelect={() => setModalSaveHex(true)}
                    aria-controls="save-hex-form"
                    aria-expanded={modalSaveHex}
                >
                    Save
                </Nav.Link>
            </Nav>
            <CreateContractModal
                show={modalCreate}
                hide={() => setModalCreate(false)}
                load_new_model={props.load_new_model}
                compiler={props.compiler}
                dynamic_forms={props.dynamic_forms}
            />
            <ViewContractModal
                show={modalView}
                hide={() => setModalView(false)}
                bitcoin_node_manager={props.bitcoin_node_manager}
            />

            <SapioCompilerModal
                show={modalSapioCompiler}
                hide={() => setModalaSapioCompiler(false)}
                compiler={props.compiler}
            />

            <LoadHexModal
                show={modalLoadHex}
                hide={() => setModalaLoadHex(false)}
                load_new_model={props.load_new_model}
            />

            <SaveHexModal
                show={modalSaveHex}
                hide={() => setModalSaveHex(false)}
                contract={props.contract}
            />
        </Navbar>
    );
}
