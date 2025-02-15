import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../CommonComponents/Footer";
import Title from "../../CommonComponents/Title";
import axios from "axios";
const DashboardComponent = () => {
  const navigate = useNavigate();
  const [data, setdata] = useState({});
  const [invoices, setinvoices] = useState([]);
  const [transactions, settransactions] = useState([]);
  const getAllData = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:4010/api/getSalesInfo",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response.status === 202) setdata(response?.data?.data);
      else alert(response?.data?.message);
    } catch (error) {
      return alert("Something went wrong. Try again later");
    }
  };
  const getTransactions = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:4010/api/latestTransactions",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      if (response.status === 202) settransactions(response?.data?.data);
      else alert(response?.data?.message);
    } catch (error) {
      return alert("Something went wrong. Try again later");
    }
  };
  const getInvoices = async (token) => {
    try {
      const response = await axios.get("http://localhost:4010/api/latestInvoices", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      if (response.status === 202) setinvoices(response?.data?.data);
      else alert(response?.data?.message);
    } catch (error) {
      return alert("Something went wrong. Try again later");
    }
  };
  useEffect(() => {
    const getdata = async () => {
      const userinfo = JSON.parse(localStorage.getItem("Userinfo"));
      if (userinfo && userinfo.Authorization) {
        await getAllData(userinfo.Authorization);
        await getTransactions(userinfo.Authorization);
        return await getInvoices(userinfo.Authorization);
      }
      localStorage.clear();
      return navigate("/");
    };
    getdata();
  }, []);
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <Title Name="Dashboard" />
          <div className="row">
            <div className="col-xl-8">
              <div className="card dash-mini">
                <div className="card-header border-0 align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Overview</h4>
                  <div className="flex-shrink-0">
                    <div className="dropdown card-header-dropdown">
                      <a
                        className="text-reset"
                        href="#"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="fw-semibold text-uppercase fs-14">
                          Sort by:{" "}
                        </span>
                        <span className="text-muted">
                          Current Week
                          <i className="las la-angle-down fs-12 ms-2" />
                        </span>
                      </a>
                      <div className="dropdown-menu dropdown-menu-end">
                        <a className="dropdown-item" href="#">
                          Today
                        </a>
                        <a className="dropdown-item" href="#">
                          Last Week
                        </a>
                        <a className="dropdown-item" href="#">
                          Last Month
                        </a>
                        <a className="dropdown-item" href="#">
                          Current Year
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-1">
                  <div className="row">
                    <div className="col-lg-4 mini-widget pb-3 pb-lg-0">
                      <div className="d-flex align-items-end">
                        <div className="flex-grow-1">
                          <h2 className="mb-0 fs-24">
                            <span className="counter-value" data-target={197}>
                              ₹{data?.totalTax}/-
                            </span>
                          </h2>
                          <h5 className="text-muted fs-16 mt-2 mb-0">
                            Tax collected
                          </h5>
                          <p className="text-muted mt-3 pt-1 mb-0 text-truncate">
                            {" "}
                            <span className="badge bg-info me-1">
                              This year
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mini-widget py-3 py-lg-0">
                      <div className="d-flex align-items-end">
                        <div className="flex-grow-1">
                          <h2 className="mb-0 fs-24">
                            <span className="counter-value" data-target={634}>
                              ₹{data?.totalDiscount}/-
                            </span>
                          </h2>
                          <h5 className="text-muted fs-16 mt-2 mb-0">
                            Discount Given
                          </h5>
                          <p className="text-muted mt-3 pt-1 mb-0 text-truncate">
                            {" "}
                            <span className="badge bg-danger me-1">
                              This year
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4 mini-widget pt-3 pt-lg-0">
                      <div className="d-flex align-items-end">
                        <div className="flex-grow-1">
                          <h2 className="mb-0 fs-24">
                            <span className="counter-value" data-target={512}>
                              ₹{data?.totalProfit}/-
                            </span>
                          </h2>
                          <h5 className="text-muted fs-16 mt-2 mb-0">
                            Profit Generated
                          </h5>
                          <p className="text-muted mt-3 pt-1 mb-0 text-truncate">
                            {" "}
                            <span className="badge bg-info me-1">
                              This year
                            </span>
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card">
                <div className="card-header border-0 align-items-center d-flex pb-2">
                  <h4 className="card-title mb-0 flex-grow-1">
                    Payment Overview
                  </h4>
                  <div>
                    <div className="dropdown">
                      <a
                        className="text-reset"
                        href="#"
                        id="dropdownMenuYear"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <span className="fw-semibold text-uppercase fs-14">
                          Sort By:{" "}
                        </span>{" "}
                        <span className="text-muted">
                          Monthly
                          <i className="las la-angle-down fs-12 ms-2" />
                        </span>
                      </a>
                      <div
                        className="dropdown-menu dropdown-menu-end"
                        aria-labelledby="dropdownMenuYear"
                      >
                        <a className="dropdown-item" href="#">
                          Monthly
                        </a>
                        <a className="dropdown-item" href="#">
                          Yearly
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-0">
                  <div style={{ height: "30px" }} className="apex-charts" />
                  <div className="row mt-3 text-center">
                    <div className="col-6 border-end">
                      <div className="my-1">
                        <p className="text-muted text-truncate mb-2">
                          Amount Received
                        </p>
                        <h4 className="mt-2 mb-0 fs-20">
                          ₹{data?.totalPayment}/-
                        </h4>
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="my-1">
                        <p className="text-muted text-truncate mb-2">
                          Sales Generated
                        </p>
                        <h4 className="mt-2 mb-0 fs-20">
                          ₹{data?.totalSales}/-
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-xl-8">
              <div className="card">
                <div className="card-header border-0 align-items-center d-flex">
                  <h4 className="card-title mb-0 flex-grow-1">Invoice List</h4>
                  <div className="dropdown">
                    <a
                      className="text-reset"
                      href="#"
                      id="dropdownMenuButton1"
                      data-bs-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <span className="fw-semibold text-uppercase fs-14">
                        Sort By:{" "}
                      </span>{" "}
                      <span className="text-muted">
                        Weekly
                        <i className="las la-angle-down fs-12 ms-2" />
                      </span>
                    </a>
                    <div
                      className="dropdown-menu dropdown-menu-end"
                      aria-labelledby="dropdownMenuButton1"
                    >
                      <a className="dropdown-item" href="#">
                        Monthly
                      </a>
                      <a className="dropdown-item" href="#">
                        Yearly
                      </a>
                    </div>
                  </div>
                </div>
                <div className="card-body pt-2">
                  <div className="table-responsive table-card">
                    <table className="table table-striped table-nowrap align-middle mb-0">
                      <thead>
                        <tr className="text-muted text-uppercase">
                          <th style={{ width: 50 }}>#</th>
                          <th scope="col">Invoice ID</th>
                          <th scope="col">Customer</th>
                          <th scope="col">Date</th>
                          <th scope="col" style={{ width: "12%" }}>
                            Amount
                          </th>
                          <th scope="col" style={{ width: "12%" }}>
                            Profit
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {invoices?.map((invoice, index) => {
                          return (
                            <tr key={index}>
                              <td>{index + 1}</td>
                              <td>
                                <p className="mb-0">{invoice?.InvoiceNo}</p>
                              </td>
                              <td>
                                <a href="#" className="text-body align-middle">
                                  {invoice?.customerId?.name}
                                </a>
                              </td>
                              <td>
                                {new Date(
                                  invoice?.createdAt
                                ).toLocaleDateString("en-GB", {
                                  day: "2-digit",
                                  month: "short",
                                  year: "numeric",
                                })}
                              </td>
                              <td>
                                <span className="badge bg-success-subtle text-success p-2">
                                  ₹{invoice?.TotalAmount}/-
                                </span>
                              </td>
                              <td>
                                <span className="badge bg-info-subtle text-info p-2">
                                  ₹{invoice?.TotalProfit}/-
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-4">
              <div className="card">
                <div className="card-body">
                  <div className="d-flex align-items-start mb-1">
                    <div className="flex-grow-1">
                      <h5 className="card-title">Recent Transaction</h5>
                    </div>
                    <div className="flex-shrink-0">
                      <div className="dropdown">
                        <a
                          className="text-muted"
                          href="#"
                          data-bs-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                        >
                          <i className="las la-ellipsis-h fs-20" />
                        </a>
                        <div className="dropdown-menu dropdown-menu-end">
                          <a className="dropdown-item" href="#">
                            Yearly
                          </a>
                          <a className="dropdown-item" href="#">
                            Monthly
                          </a>
                          <a className="dropdown-item" href="#">
                            Weekly
                          </a>
                          <a className="dropdown-item" href="#">
                            Today
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div
                    className="mx-n3 px-3"
                    data-simplebar
                    style={{ maxHeight: 418 }}
                  >
                    <p className="text-muted mb-0">Recent</p>
                    <div>
                      {transactions?.map((transaction, index) => {
                        return (
                          <div
                            key={index}
                            className="border-bottom sales-history"
                          >
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm flex-shrink-0">
                                <span className="avatar-title bg-primary rounded-circle fs-3">
                                  <i className="lab la-paypal fs-22" />
                                </span>
                              </div>
                              <div className="flex-grow-1 ms-3 overflow-hidden">
                                <h5 className="fs-15 mb-1 text-truncate">
                                  {transaction?.paymentType === "credit"
                                    ? `Invoiced (${transaction?.paymentType})`
                                    : `Payment (${transaction?.paymentType})`}
                                </h5>
                                <p className="fs-14 text-muted text-truncate mb-0">
                                  {new Date(
                                    transaction?.createdAt
                                  ).toLocaleDateString("en-GB", {
                                    day: "2-digit",
                                    month: "short",
                                    year: "numeric",
                                  })}
                                </p>
                              </div>
                              <div className="flex-shrink-0">
                                {transaction?.TotalAmount ? (
                                  <span className="badge fs-12 bg-success-subtle text-success">
                                    + ₹{transaction?.TotalAmount}/-
                                  </span>
                                ) : (
                                  <span className="badge fs-12 bg-danger-subtle text-danger">
                                    - ₹{transaction?.payment}/-
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default DashboardComponent;
