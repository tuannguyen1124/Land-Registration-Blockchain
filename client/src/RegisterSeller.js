import React, { Component } from "react";
import LandContract from "./artifacts/Land.json";
import getWeb3 from "./getWeb3";
import ipfs from "./ipfs";

import {
  FormGroup,
  FormControl,
  Button,
  Spinner,
  FormFile,
} from "react-bootstrap";

//import Navigation from './Navigation'

class RegisterSeller extends Component {
  constructor(props) {
    super(props);

    this.state = {
      LandInstance: undefined,
      account: null,
      web3: null,
      name: "",
      age: "",
      IDNumber: "",
      phoneNumber: "",
      landsOwned: "",
      isVerified: false,
      buffer2: null,
      document: "",
    };
    this.captureDoc = this.captureDoc.bind(this);
    this.addDoc = this.addDoc.bind(this);
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

      const networkId = await web3.eth.net.getId();
      const deployedNetwork = LandContract.networks[networkId];
      const instance = new web3.eth.Contract(
        LandContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      this.setState({
        LandInstance: instance,
        web3: web3,
        account: accounts[0],
      });
    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`
      );
      console.error(error);
    }
  };

  addDoc = async () => {
    const ipfsHash = await ipfs.add(this.state.buffer2);
    this.setState({ document: ipfsHash.path });
  };

  registerSeller = async () => {
    this.addDoc();
  
    await new Promise((resolve) => setTimeout(resolve, 10000));
    if (
      this.state.name == "" ||
      this.state.age == "" ||
      this.state.IDNumber == "" ||
      this.state.phoneNumber == "" ||
      this.state.landsOwned == ""
    ) {
      alert("All the fields are compulsory!");
    } else if (
      !Number(this.state.IDNumber) ||
      this.state.IDNumber.length != 12
    ) {
      alert("ID Number should be 12 digits long!");
    } else if (this.state.phoneNumber.length != 10) {
      alert("Phone Number should be a 10 digit unique number!");
    } else if (!Number(this.state.age) || this.state.age < 21) {
      alert("Your age must be a number");
    } else {
      await this.state.LandInstance.methods
        .registerSeller(
          this.state.name,
          this.state.age,
          this.state.IDNumber,
          this.state.phoneNumber,
          this.state.landsOwned,
          this.state.document
        )
        .send({
          from: this.state.account,
          gas: 2100000,
        })
        .then((response) => {
          this.props.history.push("/Seller/SellerDashboard");
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
  captureDoc(event) {
    event.preventDefault();
    const file2 = event.target.files[0];
    const reader2 = new window.FileReader();
    reader2.readAsArrayBuffer(file2);
    reader2.onloadend = () => {
      this.setState({ buffer2: Buffer(reader2.result) });
      console.log("buffer2", this.state.buffer2);
    };
    console.log("capture doc...");
  }

  render() {
    if (!this.state.web3) {
      return (
        <div>
          <div className="img-wrapper">
            <img
              src="https://i.pinimg.com/originals/71/6e/00/716e00537e8526347390d64ec900107d.png"
              className="logo"
            />
            <div className="wine-text-container">
              <div className="site-title wood-text">Land Registry</div>
            </div>
          </div>
          <div className="auth-wrapper">
            <div className="auth-inner">
              <div>
                <div>
                  <h1>
                    <Spinner animation="border" variant="warning" />
                  </h1>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="bodyC">
        {/* <div className="img-wrapper">
          <img
            src="https://i.pinimg.com/originals/71/6e/00/716e00537e8526347390d64ec900107d.png"
            className="logo"
          />
          <div className="wine-text-container">
            <div className="site-title wood-text">Land Registry</div>
          </div>
        </div> */}
        <div className="auth-wrapper">
          <div className="auth-inner">
            <div className="App">
              <div>
                <div>
                  <h1 style={{ color: "black" }}>Seller Registration</h1>
                </div>
              </div>

              <div className="form">
                <FormGroup>
                  <div className="form-label">Enter Name </div>
                  <div className="form-input">
                    <FormControl
                      input="text"
                      value={this.state.name}
                      onChange={this.updateName}
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <div className="form-label">Enter Age </div>
                  <div className="form-input">
                    <FormControl
                      input="text"
                      value={this.state.age}
                      onChange={this.updateAge}
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <div className="form-label">Enter ID Number</div>
                  <div className="form-input">
                    <FormControl
                      input="text"
                      value={this.state.IDNumber}
                      onChange={this.updateID}
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <div className="form-label">Enter Phone Number</div>
                  <div className="form-input">
                    <FormControl
                      input="text"
                      value={this.state.phoneNumber}
                      onChange={this.updatePan}
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <div className="form-label">Enter Owned Lands</div>
                  <div className="form-input">
                    <FormControl
                      input="text"
                      value={this.state.landsOwned}
                      onChange={this.updateOwnedLands}
                    />
                  </div>
                </FormGroup>

                <FormGroup>
                  <label>Add your ID Card (PDF Format)</label>
                  <FormFile id="File2" onChange={this.captureDoc} />
                </FormGroup>

                <Button onClick={this.registerSeller} className="button-vote">
                  Register as Seller
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterSeller;
