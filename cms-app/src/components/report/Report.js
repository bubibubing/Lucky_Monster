import React, { Component } from 'react';
import { Container, Col,
    FormGroup, Label, Input, Row,
    Button, } from 'reactstrap';
import '../../App.css';
import {ToastContainer, ToastStore} from 'react-toasts';


class Report extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            mobilephone: "",
            streetname: "",
            status: "",
            crisisType: "",
            injuredpeople: "",
            description: "",
            assistance: ""
        };

        this.createNewAccount = this.createNewAccount.bind(this);
        this.handleChange = this.handleChange.bind(this)

    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});
        console.log(this.state.name)
    }

    createNewAccount(event) {

        event.preventDefault();

        fetch('http://172.21.148.165:8000/api/crisis_reports/', {
            method: 'post',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: this.state.name,
                mobile_number: this.state.mobilephone,
                street_name: this.state.streetname,
                description: this.state.description,
                injured_people_num: this.state.injuredpeople,
                status: this.state.status,
                crisis_type: this.state.crisisType,
                assistance: this.state.assistance,
            })
        }).then(res=>res.json()).then(function (data) {
            console.log(data)
        });

        ToastStore.success(".")

    }



    render() {

        if (window.localStorage.getItem('localsession') === null) {
            this.props.history.push('/')
        }

        return (
            <div>
                <Container className="App">
                    <Row>
                        <Col><h2>New Crisis Record</h2></Col>
                    </Row>
                    <br/>
                    <Row>
                        <Col><FormGroup>
                            <Label>Name *</Label>
                            <Input type="text"
                                   value={this.state.name}
                                   id="name"
                                   onChange={this.handleChange}
                                   placeholder="Text" />
                        </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col><FormGroup>
                            <Label >Mobile number *</Label>
                            <Input type="text"
                                   value={this.state.mobilephone}
                                   id="mobilephone"
                                   onChange={this.handleChange}
                                   placeholder="Text" />
                        </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col><FormGroup>
                            <Label for="exampleEmail">Street name *</Label>
                            <Input value={this.state.streetname}
                                   id="streetname"
                                   onChange={this.handleChange}
                                   placeholder="********" />
                        </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="exampleSelect">Crisis Type *</Label>
                                <Input type="select" name="select" id="exampleSelect">
                                    <option value={1}>Haze</option>
                                    <option value={2}>Fire</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="exampleSelect">Status *</Label>
                                <Input type="select" name="select" id="exampleSelect">
                                    <option value="E">Unhandled</option>
                                    <option value="I">In Progress</option>
                                    <option value="S">Solved</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="exampleSelect">Assistance *</Label>
                                <Input type="select" name="select" id="exampleSelect">
                                    <option value={1}>Emergency</option>
                                    <option value={2}>Emergency</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col><FormGroup>
                            <Label>Injured number of people *</Label>
                            <Input placeholder="Number"
                                   type="number"
                                   value={this.state.injuredpeople}
                                   id="injuredpeople"
                                   onChange={this.handleChange}/>
                        </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Description</Label>
                                <Input type="textarea"
                                       value={this.state.description}
                                       onChange={this.handleChange}
                                       id="description"/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col ><Button onClick={this.createNewAccount} href="#/cms">Save</Button></Col>
                        <ToastContainer store={ToastStore}/>
                        <Col sm={{ size: 'auto', offset: 1 }}><Button href="#/cms">Discard</Button></Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Report;