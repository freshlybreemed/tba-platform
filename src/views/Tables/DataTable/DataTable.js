import React, {Component} from 'react';
import { NavLink } from 'react-router-dom'
import {Card, CardHeader, CardBody} from 'reactstrap';
import {BootstrapTable, TableHeaderColumn} from 'react-bootstrap-table';
import 'react-bootstrap-table/dist//react-bootstrap-table-all.min.css';
import data from './_tickets';


class DataTable extends Component {
  constructor(props) {
    super(props);
    this.tickets = []
    this.table = data.tickets.forEach(tix=>{
      this.tickets.push({
        name : tix.billing_details.name,
        paid: tix.paid,
        currency: tix.currency,
        amount: tix.amount
      })
    })
    this.options = {
      sortIndicator: true,
      hideSizePerPage: true,
      paginationSize: 3,
      hidePageListOnlyOnePage: true,
      clearSearch: true,
      alwaysShowAllBtns: false,
      withFirstAndLast: false
    }

  }

  // just an example
  nameFormat(cell, row) {
    const id = `/users/${row.id}`
      return (
      <NavLink strict to={id}> {cell} </NavLink>
    );
  };

  render() {

    return (
      <div className="animated">
        <Card>
          <CardHeader>
            <i className="icon-menu"></i>Data Table{' '}
            <a href="https://coreui.io/pro/react/" className="badge badge-danger">CoreUI Pro Component</a>
            <div className="card-header-actions">
              <a href="https://github.com/AllenFang/react-bootstrap-table" rel="noopener noreferrer" target="_blank" className="card-header-action">
                <small className="text-muted">docs</small>
              </a>
            </div>
          </CardHeader>
          <CardBody>
            <BootstrapTable data={this.tickets} version="4" striped hover pagination search options={this.options}>
              <TableHeaderColumn dataField="name" dataSort dataFormat={this.nameFormat} >Name</TableHeaderColumn>
              <TableHeaderColumn isKey dataField="paid">Paid</TableHeaderColumn>
              <TableHeaderColumn dataField="currency" dataSort>Currency</TableHeaderColumn>
              <TableHeaderColumn dataField="amount" dataSort>$</TableHeaderColumn>
            </BootstrapTable>
          </CardBody>
        </Card>
      </div>
    );
  }
}

export default DataTable;
