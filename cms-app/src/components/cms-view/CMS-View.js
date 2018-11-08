import React, { Component } from 'react';
import { Container, Col,
    FormGroup, Label, Input, Row,
    Button, Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Table,
    Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import './CMS-View.css';
import {ToastContainer, ToastStore} from 'react-toasts';


class Report extends Component {

    constructor(props) {
        super(props);

        this.state = {
            contacts: [],
            name: "",
            modal: false,
            password: "",
            newPassword: "",
            crisisValues: "",
            changeSort: false
        };

        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.changePassword = this.changePassword.bind(this);
        this.sortById = this.sortById.bind(this);
        this.handleDropDownStatus = this.handleDropDownStatus.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});
    }


    componentDidMount() {
        this.loadCrisisTypes();
        this.loadData();
    }


    logout() {
        localStorage.clear()
    }

    loadData() {

        fetch("http://172.21.148.165:8000/api/crisis_reports/?format=json")
            .then(response => response.json())
            .then(response => {
                console.log(response);
                this.setState({
                    contacts: response,
                    name: window.localStorage.getItem('localsession')
                });
                console.log("loadData " + this.state.contacts[0].name)


            })
            .catch(error => {
                console.error(error)
            })
    }

    changePassword() {


        fetch('http://172.21.148.165:8000/api/users/changepassword', {
            method: 'put',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': "Token " + window.localStorage.getItem("authToken")
            },
            body: JSON.stringify({
                old_password: this.state.password,
                password1: this.state.newPassword,
                password2: this.state.newPassword,
            })
        }).then(response => {
            if (response.status === 400) {
                ToastStore.error("Password is wrong")

            } else {
                ToastStore.success("Password has been changed")
            }
        }).catch(error => {
            console.log(error)
        });


        this.toggle()

    }

    loadCrisisTypes() {
        fetch("http://172.21.148.165:8000/api/crisis_type")
            .then(response => response.json())
            .then(response => {
                this.setState({
                    crisisValues: response,
                });
            })
            .catch(error => {
                console.error(error)
            })
    }

    renderItems() {

        const assistance = ["Null", "Fire-Fighting", "Gas Leak Control", "Emergency Ambulance", "Rescue and Evacuation"];

        const crisisType = ["Null", "Fire", "Gas Leak", "Disease", "Explosion", "", "Rainstorm", "", "", "", "Other", "Car Accident"]


        if (this.state.changeSort === false) {

            return this.state.contacts.sort((a, b) => (b.id - a.id)).map(element =>
                <tr>
                    <th scope="row">{element.id}</th>
                    <td>{element.name}</td>
                    <td>{element.mobile_number}</td>
                    <td>{element.street_name}</td>
                    <td>{crisisType[element.crisis_type]}</td>
                    <td>{this.renderStatusDropdown(element)}</td>
                    <td>{assistance[element.assistance]}</td>
                    <td>{element.injured_people_num}</td>
                    <td>{element.description}</td>
                    <td>{this.renderButton(element)}</td>
                </tr>
            )
        } else {
            return this.state.contacts.map(element =>
                <tr>
                    <th scope="row">{element.id}</th>
                    <td>{element.name}</td>
                    <td>{element.mobile_number}</td>
                    <td>{element.street_name}</td>
                    <td>{crisisType[element.crisis_type]}</td>
                    <td>{this.renderStatusDropdown(element)}</td>
                    <td>{assistance[element.assistance]}</td>
                    <td>{element.injured_people_num}</td>
                    <td>{element.description}</td>
                    <td>{this.renderButton(element)}</td>
                </tr>
            )
        }
    }

    renderStatusDropdown(element) {
        const status = ["Unhandled", "In Progress", "Solved"];

        if (window.localStorage.getItem('localsession') == "admin") {
            return <Input onChange={(event) => this.handleDropDownStatus(element, event)}
                          type="select" name="select" id="exampleSelect">
                <option value="" selected disabled>{status.filter((val) => val.startsWith(element.status))}</option>
                <option value={"U"}>Unhandled</option>
                <option value={"I"}>In Progress</option>
                <option value={"S"}>Solved</option>
            </Input>
        }

        if (element.creator === window.localStorage.getItem("localsession")) {
            return <Input onChange={(event) => this.handleDropDownStatus(element, event)}
                          type="select" name="select" id="exampleSelect">
                <option value="" selected disabled>{status.filter((val) => val.startsWith(element.status))}</option>
                <option value={"U"}>Unhandled</option>
                <option value={"I"}>In Progress</option>
                <option value={"S"}>Solved</option>
            </Input>
        } else {
            return <div>{status.filter((val) => val.startsWith(element.status))}</div>
        }
    }


    handleDropDownStatus(element, event) {
        this.setState({
            status: event.target.value
        })
        console.log(event.target.value)
        console.log(element)


        fetch('http://172.21.148.165:8000/api/crisis_reports/' + element.id + '/', {
            method: 'patch',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json',
                'Authorization': "Token " + window.localStorage.getItem("authToken")
            },
            body: JSON.stringify({
                status: event.target.value,
            })

        });
        ToastStore.success("Status has been updated!")

    }

    renderButton(element) {

        if (window.localStorage.getItem('localsession') == "admin") {
            return <Button component={Report} href={"#/report/" + element.id}>Edit</Button>
        } else if (element.creator === window.localStorage.getItem("localsession")) {
            return <Button component={Report} href={"#/report/" + element.id}>Edit</Button>
        }
    }




    sortById(event) {

        if (this.state.changeSort === false) {
            this.setState({
                changeSort: true
            })
        }

        if (event.target.value === "id") {
            this.setState(contacts => {
                this.state.contacts.sort((a, b) => (b.id - a.id))
            });
        } else {
            this.setState(contacts => {
                this.state.contacts.sort((a, b) => (a.status.localeCompare(b.status)))
            });
        }

        this.forceUpdate();


    }




    render() {

        if (window.localStorage.getItem('localsession') === null) {
            this.props.history.push('/')
        }

        console.log("authToken" + window.localStorage.getItem("authToken"))



        return (
            <div>
                <div>
                <Navbar color="light" light expand="md">
                    <Button href="#/report">New Record</Button>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink onClick={this.toggle}>{window.localStorage.getItem("localsession")}</NavLink>
                            </NavItem>
                            <NavItem>
                                <NavLink onClick={this.logout} href="/">Log out</NavLink>
                            </NavItem>
                        </Nav>
                    </Collapse>
                </Navbar>
                </div>
                <div>
                    <Container className="AppCMS">
                        <Row>
                            <Col><h2>Crisis Management System</h2></Col>
                        </Row>
                        <br/>
                        <Row>
                       <Col>
                           <FormGroup>
                            <Label for="exampleSelect">Sort By:</Label>
                            <Input onChange={this.sortById} type="select" name="select" id="exampleSelect">
                                <option value={"id"}>ID</option>
                                <option value={"status"}>Status</option>
                            </Input>
                            </FormGroup>
                       </Col>
                            <br/>
                        </Row>
                        <Row>
                            <Table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Mobile number</th>
                                    <th>Street name</th>
                                    <th>Crisis Type</th>
                                    <th>Status</th>
                                    <th>Assistance</th>
                                    <th>Injured number of people</th>
                                    <th>Description</th>
                                    <th></th>

                                </tr>
                                </thead>
                                <tbody>
                                {this.renderItems()}
                                </tbody>
                            </Table>
                            <ToastContainer store={ToastStore}/>
                        </Row>

                    </Container>
                    <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
                        <ModalHeader toggle={this.toggle}>Change password</ModalHeader>
                        <ModalBody>

                            <Form className="form">
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
                                <Row>
                                    <Col>
                                        <FormGroup>
                                            <Label for="examplePassword">New Password</Label>
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
                            <Button color="primary" onClick={this.changePassword}>Change password</Button>{' '}
                            <ToastContainer store={ToastStore}/>
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                </div>
            </div>

        );
    }
}

export default Report;