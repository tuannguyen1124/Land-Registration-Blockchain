import { LoadingContainer } from "@drizzle/react-components";
import { DrizzleProvider } from "@drizzle/react-plugin";
import React, { Component } from "react";
import { Spinner } from "react-bootstrap";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Row,
} from "reactstrap";
import "../../node_modules/bootstrap/dist/css/bootstrap.min.css";
import Land from "../artifacts/Land.json";
import getWeb3 from "../getWeb3";
import "../index.css";

const drizzleOptions = {
  contracts: [Land],
};

// var buyers = 0;
// var sellers = 0;
var seller;
var sellerTable = [];
var verification = [];

class updateSeller extends Component {
  constructor(props) {
    super(props);

    this.state = {
      LandInstance: undefined,
      account: null,
      web3: null,
      buyers: 0,
      sellers: 0,
      address: "",
      name: "",
      age: "",
      IDNumber: "",
      phoneNumber: "",
      landsOwned: "",
      isVerified: false,
      verified: "",
    };
  }

  componentDidMount = async () => {
    //For refreshing page only once
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }

    try {
      //Get network provider and web3 instance
      const web3 = await getWeb3();

      const accounts = await web3.eth.getAccounts();

      const currentAddress = await web3.currentProvider.selectedAddress;
      console.log(currentAddress);
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = Land.networks[networkId];
      const instance = new web3.eth.Contract(
        Land.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({
        LandInstance: instance,
        web3: web3,
        account: accounts[0],
      });
      this.setState({ address: currentAddress });
      var seller_verify = await this.state.LandInstance.methods
        .isVerified(currentAddress)
        .call();
      console.log(seller_verify);

      var not_verify = await this.state.LandInstance.methods
        .isRejected(currentAddress)
        .call();
      console.log(not_verify);
      if (seller_verify) {
        verification.push(
          <p id="verified">
            Verified <i class="fas fa-user-check"></i>
          </p>
        );
      } else if (not_verify) {
        verification.push(
          <p id="rejected">
            Rejected <i class="fas fa-user-times"></i>
          </p>
        );
      } else {
        verification.push(
          <p id="unknown">
            Not Yet Verified <i class="fas fa-user-cog"></i>
          </p>
        );
      }

      seller = await this.state.LandInstance.methods
        .getSellerDetails(currentAddress)
        .call();
      console.log(seller);
      console.log(seller[0]);
      this.setState({
        name: seller[0],
        age: seller[1],
        IDNumber: seller[2],
        phoneNumber: seller[3],
        landsOwned: seller[4],
      });
      //sellerTable.push(<div><p>Name: {seller[0]}</p><p>Age: {seller[1]}</p><p>ID Number: {seller[2]}</p><p>Phone Number: {seller[3]}</p><p>Owned Lands: {seller[4]}</p></div>);
      sellerTable.push(
        <Row>
          <Col md="12">
            <FormGroup>
              <label>Your Wallet Address: </label>
              <Input disabled type="text" value={currentAddress} />
            </FormGroup>
          </Col>
        </Row>
      );
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  updateSeller = async () => {
    if (
      this.state.name == "" ||
      this.state.age == "" ||
      this.state.IDNumber == "" ||
      this.state.phoneNumber == "" ||
      this.state.landsOwned == ""
    ) {
      alert("All the fields are compulsory!");
    } else if (this.state.IDNumber.length != 12) {
      alert("ID Number should be 12 digits long!");
    } else if (this.state.phoneNumber.length != 10) {
      alert("Phone Number should be a 10 digit unique number!");
    } else if (!Number(this.state.age)) {
      alert("Your age must be a number");
    } else {
      await this.state.LandInstance.methods
        .updateSeller(
          this.state.name,
          this.state.age,
          this.state.IDNumber,
          this.state.phoneNumber,
          this.state.landsOwned
        )
        .send({
          from: this.state.address,
          gas: 2100000,
        })
        .then((response) => {
          this.props.history.push("/Seller/sellerProfile");
        });

      //Reload
      window.location.reload(false);
    }
  };

  updateName = (event) => this.setState({ name: event.target.value });
  updateAge = (event) => this.setState({ age: event.target.value });
  updateID = (event) => this.setState({ IDNumber: event.target.value });
  updatePan = (event) => this.setState({ phoneNumber: event.target.value });
  updateOwnedLands = (event) =>
    this.setState({ landsOwned: event.target.value });

  render() {
    if (!this.state.web3) {
      return (
        <div>
          <div>
            <h1>
              <Spinner animation="border" variant="primary" />
            </h1>
          </div>
        </div>
      );
    }

    return (
      <div className="content">
        <DrizzleProvider options={drizzleOptions}>
          <LoadingContainer>
            <Row>
              <Col md="8">
                <Card>
                  <CardHeader>
                    <h5 className="title">Seller Profile</h5>
                    <h5 className="title">{verification}</h5>
                  </CardHeader>
                  <CardBody>
                    <Form>
                      {sellerTable}
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Name</label>
                            <Input
                              type="text"
                              value={this.state.name}
                              onChange={this.updateName}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Age</label>
                            <Input
                              type="text"
                              value={this.state.age}
                              onChange={this.updateAge}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>ID Number</label>
                            <Input
                              type="text"
                              value={this.state.IDNumber}
                              onChange={this.updateID}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Phone Number</label>
                            <Input
                              type="text"
                              value={this.state.phoneNumber}
                              onChange={this.updatePan}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col md="12">
                          <FormGroup>
                            <label>Owned Lands</label>
                            <Input
                              type="text"
                              value={this.state.landsOwned}
                              onChange={this.updateOwnedLands}
                            />
                          </FormGroup>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                  <CardFooter>
                    <Button
                      onClick={this.updateSeller}
                      className="btn-fill"
                      color="primary"
                    >
                      Update
                    </Button>
                  </CardFooter>
                </Card>
              </Col>
            </Row>
          </LoadingContainer>
        </DrizzleProvider>
      </div>
    );
  }
}

export default updateSeller;
