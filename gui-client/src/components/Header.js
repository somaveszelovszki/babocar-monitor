import React from 'react';
import Navbar from 'react-bootstrap/Navbar';

export default function Header({ isDirectControlEnabled, frontPattern, rearPattern }) {
    return (
        <Navbar bg={isDirectControlEnabled === true ? 'rc-direct-control-mode' : 'rc-safety-enable-mode'}
            variant="light"
            style={{
                textAlign: 'center',
                marginBottom: '5px',
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center'
            }}
        >
            <div
                style={{
                    display: 'flex',
                }}
            >
                <Navbar.Brand href="#home">
                    <img
                        alt=""
                        src={process.env.PUBLIC_URL + '/img/profile.jpg'}
                        width="75"
                        height="75"
                        className="d-inline-block align-top"
                    />{' '}
                </Navbar.Brand>
                <div
                    style={{
                        color: 'black',
                        fontSize: '1rem',
                        fontWeight: 'bold',
                        fontFamily: "Verdana",
                        display: 'flex',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        alignItems: 'center'
                    }}
                >
                    <div>{isDirectControlEnabled === true ? 'Direct control' : 'Safety enable'}</div>
                </div>
            </div>
            <div
                style={{
                    color: 'black',
                    fontSize: '1rem',
                    fontWeight: 'bold',
                    fontFamily: "Verdana",
                }}
            >
                {(frontPattern || rearPattern) && (
                    <>
                        <p>
                            front: {frontPattern}
                        </p>
                        <p>
                            rear: {rearPattern}
                        </p>
                    </>
                )}
            </div>
        </Navbar>
    )
}
