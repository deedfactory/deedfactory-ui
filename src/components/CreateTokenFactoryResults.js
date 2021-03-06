import async from 'async';
import React, { Component } from 'react';
import { Link, Router, Route, Switch } from 'react-router-dom';
import { Card, CircularProgress, DropDownMenu, MenuItem, RaisedButton, Paper, Toggle, TextField } from 'material-ui';
import { grey900, grey500, grey300, grey100, blue500, green500 } from 'material-ui/styles/colors';

import { abi } from '../FactoryABI.json';

import ethJsUtil from 'ethereumjs-util';

const paperStyle = {
  height: 'inherit',
  width: '100%',
  'word-wrap': 'break-word',
  textAlign: 'center',
  display: 'grid',
  padding: 8,
  'grid-template-rows': '50% 25% 25%',
  overflow: 'contain'
};

class SearchTokenFactoryResults extends Component {
  constructor(props) {
    super(props);

    this.state = {
      contractAddress: '',
      loading: true
    };
  }

  render() {
    if(this && this.state.loading) {
      return <form className="CreateTokenFactoryResults">
        <CircularProgress className="justify-center" size={60} thickness={7} />
      </form>
    } else {
      return (
        <div className="CreateTokenFactoryResults">
          <Paper style={paperStyle} zDepth={3} >
            <i className="fa fa-5x fa-check-circle justify-center" style={{ color: green500 }} />
            <p className="break-word justify-center">{this.props.location.state.name} Tokens created with a maximum supply of {this.props.location.state.maxSupply}.</p>
            <span className="break-word justify-center"><a target="_blank" href={`https://rinkeby.etherscan.io/tx/${this.state.registryContractAddress}`} >View Transaction</a></span>
          </Paper>
        </div>
      );
    }
  }

  componentDidMount() {
    const MyContract = new window.web3.eth.Contract(abi, '0xb33dfc1a9544a952e5e1a98fca1c346f0e5cd29a');

    return window.web3.eth.getAccounts(async (error, accounts) => {
      if (error) {
        //handle
        return;
      }

      MyContract.methods.createRegistry(
        this.props.location.state.name,
        this.props.location.state.symbol,
        this.props.location.state.description,
        Number(this.props.location.state.maxSupply)
      ).send({ from: accounts[0] }, (err, transaction) => {
        if (error) {
          //handle
          return;
        }
        var timer = setInterval(() => {
          window.web3.eth.getTransaction(transaction, (error, data) => {
            if (data && data.blockNumber) {
              this.toggleLoading();
              clearInterval(timer);
              window.location.href = "http://localhost:3000/search/results";
            }
          });
        }, 5000);
      });
    });
  }

  toggleLoading() {
    this.setState({ loading: !this.state.loading });
  }
}

export default SearchTokenFactoryResults;
