import React, { Component }  from 'react';
import { Container, Col, Form,
    FormGroup, Label, Input, Row,
    Button, Modal, ModalHeader, ModalBody, ModalFooter } from 'reactstrap';
import './App.css';
import {ToastContainer, ToastStore} from 'react-toasts';

class App extends Component {

    constructor(props) {
        super(props);


        this.state = {
            redirectToReferrer: false,
            username: "",
            password: "",
            newUsername: "",
            newPassword: "",
            email: "",
            loggedIn: false,
            modal: false,
        };

        this.handleChange = this.handleChange.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
        this.toggle = this.toggle.bind(this);
        this.createNewAccount = this.createNewAccount.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});

        console.log(this.state.username)
        console.log(this.state.password)
    }

    submitLogin(event) {

        event.preventDefault();
        var self = this;

        console.log(this.state.loggedIn)

        fetch('http://172.21.148.165:8000/api/users/login', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then(res=>res.json()).then(function (data) {
            console.log(data)
            if (data.token != null) {
                self.setState({
                    loggedIn: true
                }, () => {
                    self.props.history.push('/cms');
                    window.localStorage.setItem('localsession', self.state.username)
                    window.localStorage.setItem('authToken', data.token)

                })
            } else {
                ToastStore.error("Wrong username and password.")

            }
        });


    }

    createNewAccount(event) {

        event.preventDefault();

        fetch('http://172.21.148.165:8000/api/users/create', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: this.state.newUsername,
                password: this.state.newPassword,
                email: this.state.email
            })
        }).then(res=>res.json()).then(function (data) {
           console.log(data)
        });

        ToastStore.success("A new account has been created.")
        this.toggle()

    }


    render() {
        return (
            <div>
                <Container className="App">
                    <Row>
                        <Col><h2>Crisis Management System</h2></Col>
                    </Row>
                    <Row>
                        <Form className="form">
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label>Username</Label>
                                        <Input
                                            type="text"
                                            name="username"
                                            id="username"
                                            placeholder="Username"
                                            value={this.state.username}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="examplePassword">Password</Label>
                                        <Input
                                            type="password"
                                            name="password"
                                            id="password"
                                            placeholder="********"
                                            value={this.state.password}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <br/>
                            <Row>
                                <Col><Button onClick={this.submitLogin}>Login</Button></Col>
                                <Col><Button onClick={this.toggle} color="link">Create New Account</Button></Col>
                                <ToastContainer store={ToastStore}/>
                            </Row>
                        </Form>
                    </Row>
                </Container>
                <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                    <ModalHeader toggle={this.toggle}>Create a new account</ModalHeader>
                    <ModalBody>

                        <Form className="form">
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label>Username</Label>
                                        <Input
                                            type="text"
                                            name="newUsername"
                                            id="newUsername"
                                            placeholder="Username"
                                            value={this.state.newUsername}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label>E-Mail</Label>
                                        <Input
                                            type="text"
                                            name="email"
                                            id="email"
                                            placeholder="E-Mail"
                                            value={this.state.email}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                            <Row>
                                <Col>
                                    <FormGroup>
                                        <Label for="examplePassword">Password</Label>
                                        <Input
                                            type="password"
                                            name="password"
                                            id="newPassword"
                                            placeholder="********"
                                            value={this.state.newPassword}
                                            onChange={this.handleChange}
                                        />
                                    </FormGroup>
                                </Col>
                            </Row>
                        </Form>

                    </ModalBody>
                    <ModalFooter>
                        <Button color="primary" onClick={this.createNewAccount}>Create Account</Button>{' '}
                        <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                    </ModalFooter>
                </Modal>
            </div>
        );
    }
}

export default App;
