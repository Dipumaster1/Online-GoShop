import React, { useEffect, useState } from "react";
import AddCustomerModal from "./AddCustomerModal";
import { Link, useNavigate } from "react-router-dom";
import Title from "../../CommonComponents/Title";
import Footer from "../../CommonComponents/Footer";
import axios from "axios";
const CustomerComponent = () => {
  const [CustomerToggle, setCustomerToggle] = useState(false);
  const navigate = useNavigate();
  const [data, setdata] = useState([]);
  const [customers, setcustomers] = useState([]);
  const [currentpage, setcurrentpage] = useState(1);
  const [totalpages, settotalpages] = useState(0);
  const customersperpage = 5;
  const getallcustomers = async (token) => {
    try {
      const response = await axios.get(
        "http://localhost:4010/api/getAllCustomers",
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
      alert("Something went wrong. Try again later");
    }
  };
  useEffect(() => {
    const getdata = async () => {
      const userinfo = JSON.parse(localStorage.getItem("Userinfo"));
      if (userinfo && userinfo.Authorization)
        return await getallcustomers(userinfo.Authorization);
      localStorage.clear();
      return navigate("/");
    };
    getdata();
  }, []);
  useEffect(() => {
    if (data.length !== 0) {
      const indexoflastcustomer = currentpage * customersperpage;
      const indexoffirstcustomer = indexoflastcustomer - customersperpage;
      const currentcustomers = data.slice(
        indexoffirstcustomer,
        indexoflastcustomer
      );
      const totalpage = Math.ceil(data.length / customersperpage);
      setcustomers(currentcustomers);
      settotalpages(totalpage);
    }
  }, [data, currentpage]);
  return (
    <div>
      <div className="main-content">
        <div className="page-content">
          <div className="container-fluid">
            <Title Name="Our Customers" />
            <div className="row pb-4 gy-3">
              <div className="col-sm-4">
                <button
                  className="btn btn-primary addPayment-modal"
                  onClick={() => setCustomerToggle(!CustomerToggle)}
                >
                  <i className="las la-plus me-1" /> Add Customer
                </button>
              </div>
              <div className="col-sm-auto ms-auto">
                <div className="d-flex gap-3">
                  <div className="search-box">
                    <input
                      type="text"
                      className="form-control"
                      id="searchMemberList"
                      placeholder="Search for Result"
                    />
                    <i className="las la-search search-icon" />
                  </div>
                  <div>
                    <button
                      type="button"
                      id="dropdownMenuLink1"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                      className="btn btn-soft-info btn-icon fs-14"
                    >
                      <i className="las la-ellipsis-v fs-18" />
                    </button>
                    <ul
                      className="dropdown-menu"
                      aria-labelledby="dropdownMenuLink1"
                    >
                      <li>
                        <a className="dropdown-item" href="#">
                          All
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Last Week
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Last Month
                        </a>
                      </li>
                      <li>
                        <a className="dropdown-item" href="#">
                          Last Year
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-xl-12">
                <div className="card">
                  <div className="card-body">
                    <ul
                      className="nav nav-tabs nav-tabs-custom nav-success mb-3"
                      role="tablist"
                    >
                      <li className="nav-item">
                        <a
                          className="nav-link active"
                          data-bs-toggle="tab"
                          href="#nav-border-top-all"
                          role="tab"
                          aria-selected="true"
                        >
                          All
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="tab"
                          href="#nav-border-top-paid"
                          role="tab"
                          aria-selected="false"
                        >
                          Paid
                        </a>
                      </li>
                      <li className="nav-item">
                        <a
                          className="nav-link"
                          data-bs-toggle="tab"
                          href="#nav-border-top-pending"
                          role="tab"
                          aria-selected="false"
                        >
                          Pending
                        </a>
                      </li>
                    </ul>
                    <div className="tab-content text-muted pt-2">
                      <div
                        className="tab-pane active"
                        id="nav-border-top-all"
                        role="tabpanel"
                      >
                        <div className="card">
                          <div className="card-body">
                            <div className="table-responsive table-card">
                              <table className="table table-hover table-nowrap align-middle mb-0">
                                <thead className="table-light">
                                  <tr className="text-muted text-uppercase">
                                    <th scope="col">#</th>
                                    <th scope="col">Name</th>
                                    <th scope="col">Phone</th>
                                    <th scope="col">Address</th>
                                    <th scope="col">Date</th>
                                    <th scope="col">Balance</th>
                                    <th scope="col">Status</th>
                                    <th scope="col">Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {customers && customers.length !== 0 ? (
                                    customers?.map((customer, index) => {
                                      return (
                                        <tr key={index}>
                                          <td>{index + 1}</td>
                                          <td>{customer?.name}</td>
                                          <td>{customer?.phone}</td>
                                          <td>{customer?.address}</td>
                                          <td>
                                            {customer?.createdat
                                              ? new Date(
                                                  customer?.createdat
                                                ).toLocaleDateString("en-GB", {
                                                  day: "numeric",
                                                  month: "short",
                                                })
                                              : " - "}
                                          </td>
                                          <td>₹{customer?.balance}/-</td>
                                          <td>
                                            {customer?.balance === 0 ? (
                                              <span className="badge bg-success-subtle text-success p-2">
                                                Paid
                                              </span>
                                            ) : (
                                              <span className="badge bg-danger-subtle text-danger p-2">
                                                Pending
                                              </span>
                                            )}
                                          </td>
                                          <td>
                                            <div className="dropdown">
                                              <button
                                                className="btn btn-soft-secondary btn-sm dropdown"
                                                type="button"
                                                data-bs-toggle="dropdown"
                                                aria-expanded="false"
                                              >
                                                <i className="las la-ellipsis-h align-middle fs-18" />
                                              </button>
                                              <ul className="dropdown-menu dropdown-menu-end">
                                                <li>
                                                  <a
                                                    onClick={() => {
                                                      localStorage.setItem(
                                                        "Customerinfo",
                                                        JSON.stringify({
                                                          id: customer._id,
                                                        })
                                                      );
                                                      navigate(
                                                        "/TransactionList"
                                                      );
                                                    }}
                                                  >
                                                    {" "}
                                                    <button className="dropdown-item">
                                                      <i className="las la-eye fs-18 align-middle me-2 text-muted" />
                                                      View
                                                    </button>
                                                  </a>
                                                </li>
                                                <li className="dropdown-divider" />
                                                {customer?.balance === 0 && (
                                                  <li>
                                                    <a
                                                      className="dropdown-item remove-item-btn"
                                                      href="#"
                                                    >
                                                      <i className="las la-trash-alt fs-18 align-middle me-2 text-muted" />
                                                      Delete
                                                    </a>
                                                  </li>
                                                )}
                                              </ul>
                                            </div>
                                          </td>
                                        </tr>
                                      );
                                    })
                                  ) : (
                                    <tr className="text-center">
                                      <td colSpan={8}>No Customer Found</td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row align-items-center mb-2 gy-3">
                      <div className="col-md-5">
                        <p className="mb-0 text-muted">
                          Showing{" "}
                          <b>{(currentpage - 1) * customersperpage + 1}</b> to{" "}
                          <b>
                            {Math.min(
                              currentpage * customersperpage,
                              data.length
                            )}
                          </b>{" "}
                          of <b>{data.length}</b> results
                        </p>
                      </div>
                      <div className="col-sm-auto ms-auto">
                        <nav aria-label="...">
                          <ul className="pagination mb-0">
                            {currentpage !== 1 ? (
                              <li
                                style={{ cursor: "pointer" }}
                                className="page-item"
                                onClick={() => setcurrentpage(currentpage - 1)}
                              >
                                <span className="page-link">Previous</span>
                              </li>
                            ) : (
                              <li className="page-item disabled">
                                <span className="page-link">Previous</span>
                              </li>
                            )}
                            {Array.from({ length: totalpages }, (_, index) => (
                              <li
                                key={index}
                                onClick={() => setcurrentpage(index + 1)}
                                className={
                                  currentpage === index + 1
                                    ? "page-item active"
                                    : "page-item"
                                }
                              >
                                <a className="page-link">{index + 1}</a>
                              </li>
                            ))}
                            {currentpage !== totalpages ? (
                              <li
                                className="page-item"
                                onClick={() => setcurrentpage(currentpage + 1)}
                              >
                                <a className="page-link" href="#">
                                  Next
                                </a>
                              </li>
                            ) : (
                              <li className="page-item disabled">
                                <a className="page-link" href="#">
                                  Next
                                </a>
                              </li>
                            )}
                          </ul>
                        </nav>
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
      {CustomerToggle && (
        <AddCustomerModal
          getallcustomers={getallcustomers}
          setToggle={setCustomerToggle}
        />
      )}
    </div>
  );
};

export default CustomerComponent;
