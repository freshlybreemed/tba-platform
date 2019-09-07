import React, { Component, lazy } from 'react';
import { Line } from 'react-chartjs-2';
import { Link } from 'react-router-dom'
import axios from 'axios'
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Progress,
  Row,
  Table
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';
import { getStyle, hexToRgba } from '@coreui/coreui/dist/js/coreui-utilities'

const Widget03 = lazy(() => import('../../views/Widgets/Widget03'));

const brandPrimary = getStyle('--primary')
const brandSuccess = getStyle('--success')
const brandInfo = getStyle('--info')
const brandWarning = getStyle('--warning')
const brandDanger = getStyle('--danger')

// Card Chart 1
const cardChartData1 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandPrimary,
      borderColor: 'rgba(255,255,255,.55)',
      data: [65, 59, 84, 84, 51, 55, 40],
    },
  ],
};

const cardChartOpts1 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData1.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData1.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      borderWidth: 1,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  }
}
// Card Chart 2
const cardChartData2 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: brandInfo,
      borderColor: 'rgba(255,255,255,.55)',
      data: [1, 18, 9, 17, 34, 22, 11],
    },
  ],
};

const cardChartOpts2 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          color: 'transparent',
          zeroLineColor: 'transparent',
        },
        ticks: {
          fontSize: 2,
          fontColor: 'transparent',
        },

      }],
    yAxes: [
      {
        display: false,
        ticks: {
          display: false,
          min: Math.min.apply(Math, cardChartData2.datasets[0].data) - 5,
          max: Math.max.apply(Math, cardChartData2.datasets[0].data) + 5,
        },
      }],
  },
  elements: {
    line: {
      tension: 0.00001,
      borderWidth: 1,
    },
    point: {
      radius: 4,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

// Card Chart 3
const cardChartData3 = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.2)',
      borderColor: 'rgba(255,255,255,.55)',
      data: [78, 81, 80, 45, 34, 12, 40],
    },
  ],
};

const cardChartOpts3 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
    },
  },
};

// Card Chart 4
const cardChartData4 = {
  labels: ['', '', '', '', '', '', '', '', '', '', '', '', '', '', '', ''],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: 'rgba(255,255,255,.3)',
      borderColor: 'transparent',
      data: [78, 81, 80, 45, 34, 12, 40, 75, 34, 89, 32, 68, 54, 72, 18, 98],
    },
  ],
};

const cardChartOpts4 = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false,
        barPercentage: 0.6,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
};

// Social Box Chart
const socialBoxData = [
  { data: [65, 59, 84, 84, 51, 55, 40], label: 'facebook' },
  { data: [1, 13, 9, 17, 34, 41, 38], label: 'twitter' },
  { data: [78, 81, 80, 45, 34, 12, 40], label: 'linkedin' },
  { data: [35, 23, 56, 22, 97, 23, 64], label: 'google' },
];

const makeSocialBoxData = (dataSetNo) => {
  const dataset = socialBoxData[dataSetNo];
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        backgroundColor: 'rgba(255,255,255,.1)',
        borderColor: 'rgba(255,255,255,.55)',
        pointHoverBackgroundColor: '#fff',
        borderWidth: 2,
        data: dataset.data,
        label: dataset.label,
      },
    ],
  };
  return () => data;
};

const socialChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  responsive: true,
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        display: false,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
};

// sparkline charts
const sparkLineChartData = [
  {
    data: [35, 23, 56, 22, 97, 98, 99],
    label: 'New Clients',
  },
  {
    data: [65, 59, 84, 84, 51, 55, 40],
    label: 'Recurring Clients',
  },
  {
    data: [35, 23, 56, 22, 97, 23, 64],
    label: 'Pageviews',
  },
  {
    data: [65, 59, 84, 84, 51, 55, 40],
    label: 'Organic',
  },
  {
    data: [78, 81, 80, 45, 34, 12, 40],
    label: 'CTR',
  },
  {
    data: [1, 13, 9, 17, 34, 41, 38],
    label: 'Bounce Rate',
  },
];

const makeSparkLineData = (dataSetNo, variant) => {
  const dataset = sparkLineChartData[dataSetNo];
  const data = {
    labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    datasets: [
      {
        backgroundColor: 'transparent',
        borderColor: variant ? variant : '#c2cfd6',
        data: dataset.data,
        label: dataset.label,
      },
    ],
  };
  return () => data;
};

const sparklineChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips
  },
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    xAxes: [
      {
        display: false,
      }],
    yAxes: [
      {
        display: false,
      }],
  },
  elements: {
    line: {
      borderWidth: 2,
    },
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
  legend: {
    display: false,
  },
};

// Main Chart

//Random Numbers
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

var elements = 27;
var data1 = [];
var data2 = [];
var data3 = [];

for (var i = 0; i <= elements; i++) {
  data1.push(random(50, 200));
  data2.push(random(80, 100));
  data3.push(65);
}

const mainChart = {
  labels: ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'],
  datasets: [
    {
      label: 'My First dataset',
      backgroundColor: hexToRgba(brandInfo, 10),
      borderColor: brandInfo,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data1,
    },
    {
      label: 'My Second dataset',
      backgroundColor: 'transparent',
      borderColor: brandSuccess,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 2,
      data: data2,
    },
    {
      label: 'My Third dataset',
      backgroundColor: 'transparent',
      borderColor: brandDanger,
      pointHoverBackgroundColor: '#fff',
      borderWidth: 1,
      borderDash: [8, 5],
      data: data3,
    },
  ],
};

const mainChartOpts = {
  tooltips: {
    enabled: false,
    custom: CustomTooltips,
    intersect: true,
    mode: 'index',
    position: 'nearest',
    callbacks: {
      labelColor: function(tooltipItem, chart) {
        return { backgroundColor: chart.data.datasets[tooltipItem.datasetIndex].borderColor }
      }
    }
  },
  maintainAspectRatio: false,
  legend: {
    display: false,
  },
  scales: {
    xAxes: [
      {
        gridLines: {
          drawOnChartArea: false,
        },
      }],
    yAxes: [
      {
        ticks: {
          beginAtZero: true,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5),
          max: 250,
        },
      }],
  },
  elements: {
    point: {
      radius: 0,
      hitRadius: 10,
      hoverRadius: 4,
      hoverBorderWidth: 3,
    },
  },
};

class Manage extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.onRadioBtnClick = this.onRadioBtnClick.bind(this);
    this.salesData = this.salesData.bind(this)
    this.renderRecentOrders = this.renderRecentOrders.bind(this)
    this.getTime = this.getTime.bind(this)
    this.getTixQuantity = this.getTixQuantity.bind(this)

    this.state = {
      dropdownOpen: false,
      isEventFetched: false,
      radioSelected: 2,
      event: {
        "_id": "5d4f8597736a117fe680b83c",
        "title": "The Hav Mercy show",
        "description": "Going to be soooo much fun. Endless suya and goat and beautiful people celebrating amazing culture.\n\nFeaturing a live band and music by Seagraves. See you all soon!",
        "endDate": "2019-10-02",
        "startDate": "2019-10-02",
        "eventType": "17",
        "image": {
          "cdnUri": "https://res.cloudinary.com/dzsf703vh/image/upload/v1564787834/zrtj1pjky7lnzta1h1l6.jpg",
          "files": [
            ""
          ]
        },
        "location": {
          "name": "Cloak & Dagger, U Street Northwest, Washington, DC, USA",
          "address": {
            "streetAddress": "1359 U St NW",
            "city": "Washington",
            "state": "DC",
            "postalCode": "20009",
            "country": "US"
          }
        },
        "organizer": "Freshly Breemed",
        "refundable": true,
        "tags": "",
        "ticketTypes": {
          "GA": {
            "name": "GA",
            "type": "paid",
            "price": 15,
            "fees": 2.45,
            "currentQuantity": 0,
            "startingQuantity": 20
          },
          "RSVP": {
            "name": "RSVP",
            "type": "rsvp",
            "price": 0,
            "fees": 0,
            "startingQuantity": 20,
            "currentQuantity": 2
          }
        },
        "user": "",
        "doorTime": "",
        "eventStatus": "live",
        "organizerId": "google-oauth2|113156531283332339776",
        "tickets": [
          {
            "id": "ch_1FFApeGNRUDqyjL3zFpFWwFR",
            "object": "charge",
            "amount": 1745,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FFApeGNRUDqyjL3kuRBJnkO",
            "billing_details": {
              "address": {
                "city": "Silver Spring",
                "country": "United States",
                "line1": "14238 Castle Blvd",
                "line2": null,
                "postal_code": "20904",
                "state": "MD"
              },
              "email": null,
              "name": "ebrima Solomon jobe",
              "phone": null
            },
            "captured": true,
            "created": 1567650982,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "updatedAt": "1567647519",
              "GA": "1",
              "RSVP": "2"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 62,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FFApaGNRUDqyjL36Zryq1eW",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 2,
                "exp_year": 2032,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FFApeGNRUDqyjL3zFpFWwFR/rcpt_FkgCxf9JDjjwCeUfD22tYaUEne513uX",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FFApeGNRUDqyjL3zFpFWwFR/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FFApaGNRUDqyjL36Zryq1eW",
              "object": "card",
              "address_city": "Silver Spring",
              "address_country": "United States",
              "address_line1": "14238 Castle Blvd",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "MD",
              "address_zip": "20904",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 2,
              "exp_year": 2032,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "ebrima Solomon jobe",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FFApeGNRUDqyjL3zFpFWwFR",
            "object": "charge",
            "amount": 1745,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FFApeGNRUDqyjL3kuRBJnkO",
            "billing_details": {
              "address": {
                "city": "Silver Spring",
                "country": "United States",
                "line1": "14238 Castle Blvd",
                "line2": null,
                "postal_code": "20904",
                "state": "MD"
              },
              "email": null,
              "name": "ebrima Solomon jobe",
              "phone": null
            },
            "captured": true,
            "created": 1567650982,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "updatedAt": "1567647519",
              "GA": "1",
              "RSVP": "2"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 62,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FFApaGNRUDqyjL36Zryq1eW",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 2,
                "exp_year": 2032,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FFApeGNRUDqyjL3zFpFWwFR/rcpt_FkgCxf9JDjjwCeUfD22tYaUEne513uX",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FFApeGNRUDqyjL3zFpFWwFR/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FFApaGNRUDqyjL36Zryq1eW",
              "object": "card",
              "address_city": "Silver Spring",
              "address_country": "United States",
              "address_line1": "14238 Castle Blvd",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "MD",
              "address_zip": "20904",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 2,
              "exp_year": 2032,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "ebrima Solomon jobe",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FF9vnGNRUDqyjL39ftzKeff",
            "object": "charge",
            "amount": 1745,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FF9vnGNRUDqyjL3nC4SNyvw",
            "billing_details": {
              "address": {
                "city": "Silver Spring",
                "country": "United States",
                "line1": "14238 Castle Blvd",
                "line2": null,
                "postal_code": "20904",
                "state": "MD"
              },
              "email": null,
              "name": "Ant123",
              "phone": null
            },
            "captured": true,
            "created": 1567647519,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "updatedAt": "1567624041",
              "GA": "1",
              "RSVP": "0"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 31,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FF9vkGNRUDqyjL3c2uk8oaS",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 2,
                "exp_year": 2032,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FF9vnGNRUDqyjL39ftzKeff/rcpt_FkfGTfsIbM6TlgIqu18WZW164Gc9cZx",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FF9vnGNRUDqyjL39ftzKeff/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FF9vkGNRUDqyjL3c2uk8oaS",
              "object": "card",
              "address_city": "Silver Spring",
              "address_country": "United States",
              "address_line1": "14238 Castle Blvd",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "MD",
              "address_zip": "20904",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 2,
              "exp_year": 2032,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "Ant123",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FEQLNGNRUDqyjL3X5cgOyf8",
            "object": "charge",
            "amount": 3490,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FEQLOGNRUDqyjL3106TTrvB",
            "billing_details": {
              "address": {
                "city": "silver spring",
                "country": "United States",
                "line1": "3751 Castle terrace",
                "line2": null,
                "postal_code": "20904",
                "state": "MD"
              },
              "email": null,
              "name": "Fred Seagraves",
              "phone": null
            },
            "captured": true,
            "created": 1567472281,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "GA": "2",
              "RSVP": "0"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 42,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FEQLKGNRUDqyjL3JpuOOQbJ",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 2,
                "exp_year": 2032,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FEQLNGNRUDqyjL3X5cgOyf8/rcpt_Fju91nxrsldCNksode8OT179jkOpkig",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FEQLNGNRUDqyjL3X5cgOyf8/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FEQLKGNRUDqyjL3JpuOOQbJ",
              "object": "card",
              "address_city": "silver spring",
              "address_country": "United States",
              "address_line1": "3751 Castle terrace",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "MD",
              "address_zip": "20904",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 2,
              "exp_year": 2032,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "Fred Seagraves",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FEQMOGNRUDqyjL3cv72hX9S",
            "object": "charge",
            "amount": 1745,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FEQMPGNRUDqyjL38aCr0209",
            "billing_details": {
              "address": {
                "city": "Silver Spring",
                "country": "United States",
                "line1": "14238 Castle Blvd",
                "line2": null,
                "postal_code": "20904",
                "state": "MD"
              },
              "email": null,
              "name": "ebrima Solomon jobe",
              "phone": null
            },
            "captured": true,
            "created": 1567472344,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "GA": "1",
              "RSVP": "0"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 30,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FEQMLGNRUDqyjL3iKH4G5Ff",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 2,
                "exp_year": 2032,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FEQMOGNRUDqyjL3cv72hX9S/rcpt_FjuAPwxvVfe8E1rbCXWWU4uFP2Rj0d5",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FEQMOGNRUDqyjL3cv72hX9S/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FEQMLGNRUDqyjL3iKH4G5Ff",
              "object": "card",
              "address_city": "Silver Spring",
              "address_country": "United States",
              "address_line1": "14238 Castle Blvd",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "MD",
              "address_zip": "20904",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 2,
              "exp_year": 2032,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "ebrima Solomon jobe",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FEQMQGNRUDqyjL3POLi6O5I",
            "object": "charge",
            "amount": 3490,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FEQMQGNRUDqyjL3CRzOWAKB",
            "billing_details": {
              "address": {
                "city": "Los Angeles",
                "country": "United States",
                "line1": "1762 West blvd",
                "line2": null,
                "postal_code": "90019",
                "state": "CA"
              },
              "email": null,
              "name": "Ebrima Jobe",
              "phone": null
            },
            "captured": true,
            "created": 1567472346,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "GA": "2",
              "RSVP": "0"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 20,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FEQMMGNRUDqyjL3WIhROnoU",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 12,
                "exp_year": 2032,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FEQMQGNRUDqyjL3POLi6O5I/rcpt_FjuAdVCsSsxANItXDhejaRRrVvljoKd",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FEQMQGNRUDqyjL3POLi6O5I/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FEQMMGNRUDqyjL3WIhROnoU",
              "object": "card",
              "address_city": "Los Angeles",
              "address_country": "United States",
              "address_line1": "1762 West blvd",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "CA",
              "address_zip": "90019",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 12,
              "exp_year": 2032,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "Ebrima Jobe",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FER80GNRUDqyjL3aAeRv802",
            "object": "charge",
            "amount": 1745,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FER80GNRUDqyjL3VYKke5eC",
            "billing_details": {
              "address": {
                "city": "Los angeles",
                "country": "United States",
                "line1": "1762 west blvd",
                "line2": null,
                "postal_code": "90019",
                "state": "CA"
              },
              "email": null,
              "name": "ebrima s jobe",
              "phone": null
            },
            "captured": true,
            "created": 1567475296,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "updatedAt": "1567472346",
              "GA": "1",
              "RSVP": "0"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 16,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FER7xGNRUDqyjL3ox7JWshG",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 5,
                "exp_year": 2055,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FER80GNRUDqyjL3aAeRv802/rcpt_FjuxFLZLE3m7O1ggdUffRJoASztDplB",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FER80GNRUDqyjL3aAeRv802/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FER7xGNRUDqyjL3ox7JWshG",
              "object": "card",
              "address_city": "Los angeles",
              "address_country": "United States",
              "address_line1": "1762 west blvd",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "CA",
              "address_zip": "90019",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 5,
              "exp_year": 2055,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "ebrima s jobe",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FERCmGNRUDqyjL3K3pZQ9v0",
            "object": "charge",
            "amount": 1745,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FERCmGNRUDqyjL3V1eKh2Yv",
            "billing_details": {
              "address": {
                "city": "silver spring",
                "country": "United States",
                "line1": "3751 Castle terrace",
                "line2": null,
                "postal_code": "20904",
                "state": "MD"
              },
              "email": null,
              "name": "Fred Seagraves",
              "phone": null
            },
            "captured": true,
            "created": 1567475592,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "updatedAt": "1567475296",
              "GA": "1",
              "RSVP": "0"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 17,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FERCjGNRUDqyjL3y3AHGpvL",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 3,
                "exp_year": 2055,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FERCmGNRUDqyjL3K3pZQ9v0/rcpt_Fjv2iVjHjIPwrl6YfyvaHHhoFYvvZIW",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FERCmGNRUDqyjL3K3pZQ9v0/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FERCjGNRUDqyjL3y3AHGpvL",
              "object": "card",
              "address_city": "silver spring",
              "address_country": "United States",
              "address_line1": "3751 Castle terrace",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "MD",
              "address_zip": "20904",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 3,
              "exp_year": 2055,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "Fred Seagraves",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FERxvGNRUDqyjL3YQNUR8w0",
            "object": "charge",
            "amount": 1745,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FERxvGNRUDqyjL3hqUMiKKR",
            "billing_details": {
              "address": {
                "city": "SIlver Spring",
                "country": "United States",
                "line1": "9617 Cotrell Terrace",
                "line2": null,
                "postal_code": "20904",
                "state": "MD"
              },
              "email": null,
              "name": "Carl L Garner Jr",
              "phone": null
            },
            "captured": true,
            "created": 1567478515,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "updatedAt": "1567475592",
              "GA": "1",
              "RSVP": "0"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 36,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FERxsGNRUDqyjL3KJ90ydFv",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 3,
                "exp_year": 2055,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FERxvGNRUDqyjL3YQNUR8w0/rcpt_FjvpYpf4BOQ9mFSwscRCbfbI6sQ62y1",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FERxvGNRUDqyjL3YQNUR8w0/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FERxsGNRUDqyjL3KJ90ydFv",
              "object": "card",
              "address_city": "SIlver Spring",
              "address_country": "United States",
              "address_line1": "9617 Cotrell Terrace",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "MD",
              "address_zip": "20904",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 3,
              "exp_year": 2055,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "Carl L Garner Jr",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FEVHiGNRUDqyjL3acxVIi80",
            "object": "charge",
            "amount": 1745,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FEVHiGNRUDqyjL3MkcmlZrA",
            "billing_details": {
              "address": {
                "city": "Silver Spring",
                "country": "United States",
                "line1": "14238 Castle Blvd",
                "line2": null,
                "postal_code": "20904",
                "state": "MD"
              },
              "email": null,
              "name": "ebrima Solomon jobe",
              "phone": null
            },
            "captured": true,
            "created": 1567491274,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "updatedAt": "1567478516",
              "GA": "1",
              "RSVP": "0"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 51,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FEVHfGNRUDqyjL3rwrdtE1E",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 2,
                "exp_year": 2032,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FEVHiGNRUDqyjL3acxVIi80/rcpt_FjzGftKMVmSyfkoQtlgNykaFCwakvny",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FEVHiGNRUDqyjL3acxVIi80/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FEVHfGNRUDqyjL3rwrdtE1E",
              "object": "card",
              "address_city": "Silver Spring",
              "address_country": "United States",
              "address_line1": "14238 Castle Blvd",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "MD",
              "address_zip": "20904",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 2,
              "exp_year": 2032,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "ebrima Solomon jobe",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FF290GNRUDqyjL3e0B94dVc",
            "object": "charge",
            "amount": 3490,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FF290GNRUDqyjL3ozhVJACM",
            "billing_details": {
              "address": {
                "city": "Los Angeles",
                "country": "United States",
                "line1": "1762 West blvd",
                "line2": null,
                "postal_code": "90019",
                "state": "CA"
              },
              "email": null,
              "name": "Ebrima Jobe",
              "phone": null
            },
            "captured": true,
            "created": 1567617586,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "updatedAt": "1567491275",
              "GA": "2",
              "RSVP": "0"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 14,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FF28wGNRUDqyjL3cLoudtHY",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 2,
                "exp_year": 2032,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FF290GNRUDqyjL3e0B94dVc/rcpt_FkXDInsZFA4RWJePD42lkzbn6dz59GJ",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FF290GNRUDqyjL3e0B94dVc/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FF28wGNRUDqyjL3cLoudtHY",
              "object": "card",
              "address_city": "Los Angeles",
              "address_country": "United States",
              "address_line1": "1762 West blvd",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "CA",
              "address_zip": "90019",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 2,
              "exp_year": 2032,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "Ebrima Jobe",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          },
          {
            "id": "ch_1FF3p6GNRUDqyjL3ot2OCpAH",
            "object": "charge",
            "amount": 1745,
            "amount_refunded": 0,
            "application": null,
            "application_fee": null,
            "application_fee_amount": null,
            "balance_transaction": "txn_1FF3p6GNRUDqyjL3LOQedYVn",
            "billing_details": {
              "address": {
                "city": "Silver Spring",
                "country": "United States",
                "line1": "14238 Castle Blvd",
                "line2": null,
                "postal_code": "20904",
                "state": "MD"
              },
              "email": null,
              "name": "Ben Minah",
              "phone": null
            },
            "captured": true,
            "created": 1567624040,
            "currency": "usd",
            "customer": null,
            "description": null,
            "destination": null,
            "dispute": null,
            "failure_code": null,
            "failure_message": null,
            "fraud_details": {},
            "invoice": null,
            "livemode": false,
            "metadata": {
              "eventId": "5d4f8597736a117fe680b83c",
              "updatedAt": "1567617587",
              "GA": "1",
              "RSVP": "0"
            },
            "on_behalf_of": null,
            "order": null,
            "outcome": {
              "network_status": "approved_by_network",
              "reason": null,
              "risk_level": "normal",
              "risk_score": 34,
              "seller_message": "Payment complete.",
              "type": "authorized"
            },
            "paid": true,
            "payment_intent": null,
            "payment_method": "card_1FF3p3GNRUDqyjL3BzitsPa2",
            "payment_method_details": {
              "card": {
                "brand": "visa",
                "checks": {
                  "address_line1_check": "pass",
                  "address_postal_code_check": "pass",
                  "cvc_check": "pass"
                },
                "country": "US",
                "exp_month": 2,
                "exp_year": 2034,
                "fingerprint": "xvoovnnTKuci9zAA",
                "funding": "credit",
                "last4": "4242",
                "three_d_secure": null,
                "wallet": null
              },
              "type": "card"
            },
            "receipt_email": null,
            "receipt_number": null,
            "receipt_url": "https://pay.stripe.com/receipts/acct_1EWUgYGNRUDqyjL3/ch_1FF3p6GNRUDqyjL3ot2OCpAH/rcpt_FkYxfMarnc3SyKa8uOJi0Wbaq6TvXzF",
            "refunded": false,
            "refunds": {
              "object": "list",
              "data": [],
              "has_more": false,
              "total_count": 0,
              "url": "/v1/charges/ch_1FF3p6GNRUDqyjL3ot2OCpAH/refunds"
            },
            "review": null,
            "shipping": null,
            "source": {
              "id": "card_1FF3p3GNRUDqyjL3BzitsPa2",
              "object": "card",
              "address_city": "Silver Spring",
              "address_country": "United States",
              "address_line1": "14238 Castle Blvd",
              "address_line1_check": "pass",
              "address_line2": null,
              "address_state": "MD",
              "address_zip": "20904",
              "address_zip_check": "pass",
              "brand": "Visa",
              "country": "US",
              "customer": null,
              "cvc_check": "pass",
              "dynamic_last4": null,
              "exp_month": 2,
              "exp_year": 2034,
              "fingerprint": "xvoovnnTKuci9zAA",
              "funding": "credit",
              "last4": "4242",
              "metadata": {},
              "name": "Ben Minah",
              "tokenization_method": null
            },
            "source_transfer": null,
            "statement_descriptor": null,
            "statement_descriptor_suffix": null,
            "status": "succeeded",
            "transfer_data": null,
            "transfer_group": null
          }
        ],
        "updatedAt": 1567650983
      }
      
    };
  }
  componentDidMount() {
    let event;
    // console.log(process.env)
    let id =window.location.href.split('/')[window.location.href.split('/').length-1]
    if (process.env.NODE_ENV !== "development") {
      // axios.get(`/api/event?id=${id}`)
      axios.get(`/api/event/${id}`)
        .then(res => {
          console.log(res)
          event = res.data[0]
          this.setState({event, isEventFetched: true})
          this.salesData()
        })
        .catch(err=>console.log(err))
    } else {
      this.setState({isEventFetched:true},()=>this.salesData())
    }
  }
  salesData(){
    var date = new Date().getTime()/1000
    var yesterday = date - 86400
    var ticketDayCount = 0
    let totalBalance = 0
    let ticketTypes = this.state.event.ticketTypes;
    var totalTicketCount = 0
    this.state.event.tickets.forEach((ticket)=>{
      for (let ticketType in ticket.metadata){
        if(typeof ticket.metadata.eventId !=="undefined" && ticketType !== "eventId" && ticketType !== "updatedAt"){
          totalTicketCount += parseInt(ticket.metadata[ticketType])
          totalBalance += ticketTypes[ticketType].price*  parseInt(ticket.metadata[ticketType])
          if (ticket.created > yesterday && ticket.created < date) {
            ticketDayCount+=  parseInt(ticket.metadata[ticketType])
          }
        }
      }
    })
    this.setState({ticketDayCount, totalTicketCount, totalBalance:totalBalance.toFixed(2)},()=>console.log(this.state))
  }

  getTixQuantity(ticket){
    let quantity = 0
    for (let ticketType in ticket.metadata){
    if(ticketType !== "eventId" && ticketType !== "updatedAt"){
      quantity+=parseInt(ticket.metadata[ticketType])
        }
    }
  return quantity
  }
  toggle() {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen,
    });
  }

  onRadioBtnClick(radioSelected) {
    this.setState({
      radioSelected: radioSelected,
    });
  }

  loading = () => <div className="animated fadeIn pt-1 text-center">Loading...</div>

  getTime(datetime){
    var months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    var days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    var dateTime = new Date(datetime)
    var day = days[dateTime.getDay()];
    var hr = dateTime.getHours();
    var min = dateTime.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    var ampm = "am";
    if( hr > 12 ) {
        hr -= 12;
        ampm = "pm";
    }
    var date = dateTime.getDate();
    if (date > 3 && date < 21) date = date+ 'th'; 
    switch (date % 10) {
      case 1:  date = date+"st"; break
      case 2:  date = date+ "nd";break
      case 3:  date = date+ "rd";break
      default: break
    }
    var month = months[dateTime.getMonth()];
    var year = dateTime.getFullYear();
    return day + ", " + month + " "+ date;
  }
  renderRecentOrders(){
    let recentOrders = [];
    const capitalize = (text) => (
      text.toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
      )

    if (this.state.isEventFetched) {
      const event = this.state.event
      let count = 0
      for (let order in event.tickets){
        const person = event.tickets[order]
        const date = new Date(person.created*1000).toString()
        // console.log(event.tickets[order])
        recentOrders.push(<tr>
          <td className="text-center">
            <div>
              <a href="#">{String(person.created).substring(5)}</a>
            </div>
          </td>
          <td>
            <div>{capitalize(person.billing_details.name)}</div>
            <div className="small text-muted">
              <span>freshlybreemed@gmail.com</span> 
            </div>
          </td>
          <td className="text-center">
            <div>{this.getTixQuantity(person)}</div>
          </td>
          <td>
            <div className="clearfix">
              <div>
                <small className="text-muted">{this.getTime(date)}</small>
              </div>
            </div>
          </td>
          <td className="text-center">
            <i className={`fa fa-cc-${person.payment_method_details.card.brand}`}style={{ fontSize: 24 + 'px' }}></i>
          </td>
          <td>
            <strong>{`$${(person.amount/100).toFixed(2)}`}</strong>
          </td>
          <td>
          <Link class="btn btn-success">
            <i class="fa fa-edit"></i>
          </Link>          </td>
        </tr>
        )
        count++
        if (count > 6) break
      }
    }
    return recentOrders;
  }
  render() {
    console.log(this.state.totalTicketCount)
    return (
      <div className="animated fadeIn">
        <h4>Traffic & Sales</h4> 
        <Row>
          <Col xs="12" sm="6" lg="3">
            <Card>
              <CardBody>
              {/* <div className="callout callout-info"> */}
                <small className="text-muted">Tickets Sold</small>
                <br />
                <strong className="h4">{this.state.totalTicketCount}</strong>
                <div className="chart-wrapper">
                  <Line data={makeSparkLineData(0, brandPrimary)} options={sparklineChartOpts} width={100} height={30} />
                </div>
              {/* </div> */}
              </CardBody>
          </Card>
            
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card>
              <CardBody>
                <small className="text-muted">Balance </small>
                <br />
                <strong className="h4">${this.state.totalBalance}</strong>
                <div className="chart-wrapper">
                  <Line data={makeSparkLineData(0, brandInfo)} options={sparklineChartOpts} width={100} height={30} />
                </div>
              </CardBody>
            </Card>
            
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card>
              <CardBody>                       
                <small className="text-muted">Pageviews</small>
                <br />
                <strong className="h4">78,623</strong>
                <div className="chart-wrapper">
                  <Line data={makeSparkLineData(2, brandWarning)} options={sparklineChartOpts} width={100} height={30} />
                </div>
            </CardBody>                       
          </Card>
          </Col>
          <Col xs="12" sm="6" lg="3">
            <Card>
              <CardBody>                       
                <small className="text-muted">24-Hour Sales</small>
                <br />
                <strong className="h4">{this.state.ticketDayCount? this.state.ticketDayCount + (this.state.ticketDayCount>1? " Tickets" : " Ticket"): "0"}</strong>
                <div className="chart-wrapper">
                  <Line data={makeSparkLineData(2, brandWarning)} options={sparklineChartOpts} width={100} height={30} />
                </div>
            </CardBody>                       
          </Card>
        </Col>
        </Row>
        <Row>
          <Col>
            <Card>
              <CardHeader>
                Crank Karaoke
              </CardHeader>
              <CardBody>
                <Row>
                  <Col> 
                  <h4>Recent Orders</h4>
                    <Table hover responsive className="table-outline mb-0 d-sm-table">
                      <thead className="thead-light">
                        <tr>
                          <th className="text-center">Order #</th>
                          <th>Name</th>
                          <th className="text-center">Quantity</th>
                          <th>Date</th>
                          <th className="text-center">Payment Method</th>
                          <th>Total</th>
                          <th className="text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {this.renderRecentOrders()}
                      </tbody>
                    </Table>
                    <a href="/">View More...</a>
                  </Col>
                  <Col xs="12" md="6" xl="6">
                    <hr className="mt-0" />
                    <h4>Marketing</h4>

                    <ul>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-user progress-group-icon"></i>
                          <span className="title">Male</span>
                          <span className="ml-auto font-weight-bold">43%</span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress className="progress-xs" color="warning" value="43" />
                        </div>
                      </div>
                      <div className="progress-group mb-5">
                        <div className="progress-group-header">
                          <i className="icon-user-female progress-group-icon"></i>
                          <span className="title">Female</span>
                          <span className="ml-auto font-weight-bold">37%</span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress className="progress-xs" color="warning" value="37" />
                        </div>
                      </div>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-globe progress-group-icon"></i>
                          <span className="title">Organic Search</span>
                          <span className="ml-auto font-weight-bold">191,235 <span className="text-muted small">(56%)</span></span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress className="progress-xs" color="success" value="56" />
                        </div>
                      </div>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-social-facebook progress-group-icon"></i>
                          <span className="title">Facebook</span>
                          <span className="ml-auto font-weight-bold">51,223 <span className="text-muted small">(15%)</span></span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress className="progress-xs" color="success" value="15" />
                        </div>
                      </div>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-social-twitter progress-group-icon"></i>
                          <span className="title">Twitter</span>
                          <span className="ml-auto font-weight-bold">37,564 <span className="text-muted small">(11%)</span></span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress className="progress-xs" color="success" value="11" />
                        </div>
                      </div>
                      <div className="progress-group">
                        <div className="progress-group-header">
                          <i className="icon-social-linkedin progress-group-icon"></i>
                          <span className="title">LinkedIn</span>
                          <span className="ml-auto font-weight-bold">27,319 <span className="text-muted small">(8%)</span></span>
                        </div>
                        <div className="progress-group-bars">
                          <Progress className="progress-xs" color="success" value="8" />
                        </div>
                      </div>
                      <div className="divider text-center">
                        <Button color="link" size="sm" className="text-muted" data-toggle="tooltip" data-placement="top"
                                title="" data-original-title="show more"><i className="icon-options"></i></Button>
                      </div>
                    </ul>
                    
                  </Col>
                </Row>
                <br />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default Manage;
