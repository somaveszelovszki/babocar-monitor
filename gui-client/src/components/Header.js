import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

export default function Header({ isDirectControlEnabled }) {
    return (
        <Navbar bg={isDirectControlEnabled === true ? 'rc-direct-control-mode' : 'rc-safety-enable-mode'}
            variant="light"
            style={{ textAlign: 'center', marginBottom: '5px' }}>
            <Navbar.Brand href="#home">
                <img
                    alt=""
                    src={process.env.PUBLIC_URL + '/img/logo.png'}
                    width="75"
                    height="75"
                    className="d-inline-block align-top"
                />{' '}
            </Navbar.Brand>
            <div style={{ color: 'black', fontSize: '1rem', fontWeight: 'bold', fontFamily: "Verdana" }}>
                {isDirectControlEnabled === true ? 'Direct control' : 'Safety enable'}
            </div>
        </Navbar>
    )
}
