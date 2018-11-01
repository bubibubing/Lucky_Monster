import React, { Component } from 'react';
import { Container, Col,
    FormGroup, Label, Input, Row,
    Button, Collapse,
    Navbar,
    NavbarToggler,
    Nav,
    NavItem,
    NavLink,
    Table, Pagination, PaginationItem, PaginationLink,
    Modal, ModalHeader, ModalBody, ModalFooter, Form } from 'reactstrap';
import './CMS-View.css';


class Report extends Component {

    constructor(props) {
        super(props);

        this.state = {
            contacts: [],
            name: "",
            modal: false,
            password: "",
            newPassword: "",
        };

        this.toggle = this.toggle.bind(this);
        this.logout = this.logout.bind(this);
        this.changePassword = this.changePassword.bind(this);
    }

    toggle() {
        this.setState({
            modal: !this.state.modal
        });
    }

    componentDidMount() {
        this.loadData()
        console.log("componentDidMount " + this.state.contacts)
        console.log("cDM" + this.state.name)
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

    }


    render() {

        if (window.localStorage.getItem('localsession') === null) {
            this.props.history.push('/')
        }

        return (
            <div>
                <div>
                <Navbar color="light" light expand="md">
                    <Button href="#/report">New Record</Button>
                    <NavbarToggler onClick={this.toggle} />
                    <Collapse isOpen={this.state.isOpen} navbar>
                        <Nav className="ml-auto" navbar>
                            <NavItem>
                                <NavLink onClick={this.toggle}>UserName</NavLink>
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
                       <Col> <FormGroup>
                            <Label for="exampleSelect">Sort By:</Label>
                            <Input type="select" name="select" id="exampleSelect">
                                <option>Time</option>
                                <option>Location</option>
                                <option>Status</option>
                            </Input>
                       </FormGroup>

                           <FormGroup>
                               <Label for="exampleSelect">Duration:</Label>
                           <Input type="select" name="select" id="exampleSelect">
                               <option>Before Two Weeks</option>
                               <option>Before One Week</option>
                               <option>A day ago</option>
                           </Input>
                       </FormGroup>
                       </Col>
                        </Row>
                        <hr/>

                        <Row>
                            <Table>
                                <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Type of Crisis</th>
                                    <th>Recorded Time</th>
                                    <th>Name of Witness</th>
                                    <th>Location</th>
                                    <th>Postal Code</th>
                                    <th>Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                <tr>
                                    <th scope="row">1</th>
                                    <td>Lorem Ipsum</td>
                                    <td>Dolor Sit</td>
                                    <td>Consetetur Sadipscing</td>
                                    <td>Sed Diam</td>
                                    <td>Nonumy Eirmod </td>
                                    <td>tempor invidunt</td>
                                </tr>
                                <tr>
                                    <th scope="row">2</th>
                                    <td>Lorem Ipsum</td>
                                    <td>Dolor Sit</td>
                                    <td>Consetetur Sadipscing</td>
                                    <td>Sed Diam</td>
                                    <td>Nonumy Eirmod </td>
                                    <td>tempor invidunt</td>
                                </tr>
                                <tr>
                                    <th scope="row">3</th>
                                    <td>Lorem Ipsum</td>
                                    <td>Dolor Sit</td>
                                    <td>Consetetur Sadipscing</td>
                                    <td>Sed Diam</td>
                                    <td>Nonumy Eirmod </td>
                                    <td>tempor invidunt</td>
                                </tr>
                                </tbody>
                            </Table>
                        </Row>
                        <Row>
                            <div className="center">
                            <Pagination size="sm" aria-label="Page navigation example">
                                <PaginationItem>
                                    <PaginationLink previous href="#" />
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        1
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        2
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        3
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        4
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        5
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        6
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        7
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        8
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        9
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink href="#">
                                        10
                                    </PaginationLink>
                                </PaginationItem>
                                <PaginationItem>
                                    <PaginationLink next href="#" />
                                </PaginationItem>
                            </Pagination>
                            </div>
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
                            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
                        </ModalFooter>
                    </Modal>

                </div>
            </div>

        );
    }
}

export default Report;