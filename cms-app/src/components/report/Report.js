import React, { Component } from 'react';
import { Container, Col,
    FormGroup, Label, Input, Row,
    Button, } from 'reactstrap';
import '../../App.css';
import {ToastStore} from 'react-toasts';


class Report extends Component {

    constructor(props) {
        super(props);

        this.state = {
            name: "",
            mobilephone: "",
            streetname: "",
            status: "U",
            crisisType: 1,
            injuredpeople: "",
            description: "",
            assistance: 1,
            contacts: "",
            crisisId: [],
            crisisTypes: [],
            crisisValues: [],
            toggleCheckVal: false
        };

        this.createNewAccount = this.createNewAccount.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleDropDownAssistance = this.handleDropDownAssistance.bind(this);
        this.handleDropDownCrisis = this.handleDropDownCrisis.bind(this);
        this.handleDropDownStatus = this.handleDropDownStatus.bind(this);
        this.toggleCheckVal = this.toggleCheckVal.bind(this);
        this.resetToggle = this.resetToggle.bind(this);
        this.preSelectStatus = this.preSelectStatus.bind(this);
        this.preSelectAssistance = this.preSelectAssistance.bind(this);
        this.preSelectCrisisType = this.preSelectCrisisType.bind(this);

    }

    handleChange(event) {
        this.setState({[event.target.id]: event.target.value});
        console.log(event.target.value)
        console.log(this.state.toggleCheckVal)
    }

    handleDropDownCrisis(event) {
        this.setState({
            crisisType: event.target.value
        })
        console.log(event.target.value)
    }

    handleDropDownAssistance(event) {
        this.setState({
            assistance: event.target.value
        })
        console.log(event.target.value)
    }


    handleDropDownStatus(event) {
        this.setState({
            status: event.target.value
        })
        console.log(event.target.value)
    }

    toggleCheckVal() {
        this.setState({
            toggleCheckVal: true
        })
    }

    resetToggle() {
        this.setState({
            toggleCheckVal: false
        })
    }



    createNewAccount(event) {

        event.preventDefault();

        if (this.state.toggleCheckVal == false) {

            fetch('http://172.21.148.165:8000/api/crisis_reports/', {
                method: 'post',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': "Token " + window.localStorage.getItem("authToken")
                },
                body: JSON.stringify({
                    name: this.state.name,
                    mobile_number: this.state.mobilephone,
                    street_name: this.state.streetname,
                    description: this.state.description,
                    injured_people_num: this.state.injuredpeople,
                    status: this.state.status,
                    crisis_type: this.state.crisisType,
                    assistance: [this.state.assistance],
                })
            }).then(res => res.json()).then(function (data) {
                console.log(data)
            });

            ToastStore.success("A new report has been created.")
            this.props.history.push('/cms')
            this.resetToggle()

        } else {
            let url = this.props.location.pathname;
            let reportID = url.substr(url.lastIndexOf('/') + 1);
            console.log("False")
            fetch('http://172.21.148.165:8000/api/crisis_reports/' + reportID + "/", {
                method: 'patch',
                headers: {
                    'Accept': 'application/json, text/plain, */*',
                    'Content-Type': 'application/json',
                    'Authorization': "Token " + window.localStorage.getItem("authToken")
                },
                body: JSON.stringify({
                    name: this.state.name,
                    mobile_number: this.state.mobilephone,
                    street_name: this.state.streetname,
                    description: this.state.description,
                    injured_people_num: this.state.injuredpeople,
                    status: this.state.status,
                    crisis_type: this.state.crisisType,
                    assistance: [this.state.assistance],
                })
            }).then(res => res.json()).then(function (data) {
                console.log(data)
            });

            ToastStore.success("A new report has been created.")
            this.props.history.push('/cms')
            this.resetToggle()
        }

    }




    componentDidMount() {
        let url = this.props.location.pathname;
        let reportID = url.substr(url.lastIndexOf('/') + 1);

        this.loadCrisisTypes()

        console.log(reportID)

        if (reportID === "report") {
            this.resetToggle()
        } else {
            fetch("http://172.21.148.165:8000/api/crisis_reports/" + reportID + "/?format=json")
                .then(response => response.json())
                .then(response => {
                    console.log(response.name)
                    this.setState({
                        name: response.name,
                        mobilephone: response.mobile_number,
                        streetname: response.street_name,
                        status: response.status,
                        crisisType: response.crisis_type,
                        injuredpeople: response.injured_people_num,
                        description: response.description,
                        assistance: response.assistance,
                    })

                    this.toggleCheckVal()
                    console.log(this.state.toggleCheckVal)


                })
                .catch(error => {
                    console.error(error)
                })


        }
        console.log(this.state.toggleCheckVal)



    }

    loadCrisisTypes() {
        fetch("http://172.21.148.165:8000/api/crisis_type")
            .then(response => response.json())
            .then(response => {
                    this.setState({
                        crisisValues: response,
                });
                console.log("Crisis types" + this.state.crisisValues[0].id)
            })
            .catch(error => {
                console.error(error)
            })
    }

    renderCrisisTypes() {

        return this.state.crisisValues.map(element =>
            <option value={element.id}>{element.crisis_type}</option>)
    }

    preSelectCrisisType() {

        if (this.state.toggleCheckVal == true) {
            return <option value="" selected disabled>{this.state.crisisType}</option>

        }
    }


    preSelectStatus() {

        const status = ["Unhandled", "In Progress", "Solved"];

        if (this.state.toggleCheckVal == true) {
            return <option value="" selected disabled>{status.filter((val) => val.startsWith(this.state.status))}</option>

        }

    }

    preSelectAssistance() {

        const assistance = ["Null", "Rescue and Evacuation", "Emergency Ambulance", "Gas Leak Control", "Fire-Fighting"];

        if (this.state.toggleCheckVal == true) {
            return <option value="" selected disabled>{assistance[this.state.assistance]}</option>

        }
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
                                   placeholder={this.state.name}
                                   id="name"
                                   onChange={this.handleChange}
                            />
                        </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col><FormGroup>
                            <Label >Mobile number *</Label>
                            <Input type="text"
                                   value={this.state.mobilephone}
                                   placeholder={this.state.mobilephone}
                                   id="mobilephone"
                                   onChange={this.handleChange}
                            />
                        </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col><FormGroup>
                            <Label for="exampleEmail">Street name *</Label>
                            <Input value={this.state.streetname}
                                   id="streetname"
                                   onChange={this.handleChange}
                                   placeholder={this.state.streetname} />
                        </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label>Crisis Type *</Label>
                                <Input onChange={this.handleDropDownCrisis} type="select" name="select">
                                    {this.preSelectCrisisType()}
                                    {this.renderCrisisTypes()}
                                </Input>

                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col>
                            <FormGroup>
                                <Label for="exampleSelect">Status *</Label>
                                <Input onChange={this.handleDropDownStatus} type="select" name="select" id="exampleSelect">
                                    {this.preSelectStatus()}
                                    <option value="U">Unhandled</option>
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
                                <Input onChange={this.handleDropDownAssistance}
                                       type="select" name="select" id="exampleSelect">
                                    {this.preSelectAssistance()}
                                    <option value={2}>Emergency Ambulance</option>
                                    <option value={1}>Rescue and Evacuation</option>
                                    <option value={4}>Fire-Fighting</option>
                                    <option value={3}>Gas Leak Control</option>
                                </Input>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col><FormGroup>
                            <Label>Injured number of people *</Label>
                            <Input placeholder={this.state.injuredpeople}
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
                                       placeholder={this.state.description}
                                       value={this.state.description}
                                       onChange={this.handleChange}
                                       id="description"/>
                            </FormGroup>
                        </Col>
                    </Row>
                    <Row>
                        <Col><Button onClick={this.createNewAccount} href="#/cms">Save</Button></Col>
                        <Col sm={{ size: 'auto', offset: 1 }}><Button
                            onClick={this.resetToggle}
                            href="#/cms">Discard</Button></Col>
                    </Row>
                </Container>
            </div>
        );
    }
}

export default Report;