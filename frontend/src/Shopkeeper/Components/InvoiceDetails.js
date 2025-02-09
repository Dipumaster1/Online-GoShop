import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../CommonComponents/Footer";
import Title from "../../CommonComponents/Title";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
const InvoiceDetails = ({ data }) => {
  const navigate = useNavigate();
  const [customer, setcustomer] = useState({});
  const [shopkeeper, setshopkeeper] = useState({});
  const downloadInvoice = () => {
    const invoiceElement = document.getElementById("invoice-content"); // Target the invoice container
    html2canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save("Invoice.pdf"); // Download as Invoice.pdf
    });
  };
  const today = new Date(data?.result?.createdAt);
  const FutureDate = new Date();
  FutureDate.setDate(today.getDate() + 7);
  const getCustomer = async (token, id) => {
    try {
      const response = await fetch(
        "http://localhost:4010/api/getCustomer/" + id,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      const result = await response.json();
      if (response.status === 202) setcustomer(result?.data);
      else alert(result?.message);
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Try again later");
    }
  };
  const getShopkeeper = async (token) => {
    try {
      const response = await fetch("http://localhost:4010/api/getShopkeeper", {
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
      });
      const result = await response.json();
      if (response.status === 202) setshopkeeper(result?.data);
      else alert(result?.message);
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Try again later");
    }
  };
  useEffect(() => {
    const getdata = async () => {
      const userinfo = JSON.parse(localStorage.getItem("Userinfo"));
      if (userinfo && userinfo.Authorization) {
        await getCustomer(userinfo.Authorization, data?.result?.customerId);
        return await getShopkeeper(userinfo.Authorization);
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
          <Title Name={"Invoices Details"} />
          <div className="row justify-content-center">
            <div className="col-xxl-9">
              <div className="card" id="demo">
                <div className="card-body" id="invoice-content">
                  <div className="row p-4">
                    <div className="col-lg-8">
                      <h3 className="fw-bold mb-4">
                        Invoice To: {customer?.name}{" "}
                      </h3>
                      <div className="row g-4">
                        <div className="col-lg-6 col-6">
                          <p className="text-muted mb-1 text-uppercase fw-medium fs-14">
                            Invoice No
                          </p>
                          <h5 className="fs-16 mb-0">
                            #
                            <span id="invoice-no">
                              {data?.result?.InvoiceNo}
                            </span>
                          </h5>
                        </div>
                        <div className="col-lg-6 col-6">
                          <p className="text-muted mb-1 text-uppercase fw-medium fs-14">
                            Date
                          </p>
                          <h5 className="fs-16 mb-0">
                            <span id="invoice-date">
                              {new Date(
                                data?.result?.createdAt
                              ).toLocaleDateString("en-GB", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })}
                            </span>
                            ,{" "}
                            <small className="text-muted" id="invoice-time">
                              {new Date(
                                data?.result?.createdAt
                              ).toLocaleTimeString("en-US", {
                                hour: "2-digit",
                                minute: "2-digit",
                                hour12: true,
                              })}
                            </small>
                          </h5>
                        </div>
                        <div className="col-lg-6 col-6">
                          <p className="text-muted mb-1 text-uppercase fw-medium fs-14">
                            Payment Status
                          </p>
                          <span
                            className="badge bg-danger-subtle text-danger fs-11"
                            id="payment-status"
                          >
                            Pending
                          </span>
                        </div>
                        <div className="col-lg-6 col-6">
                          <p className="text-muted mb-1 text-uppercase fw-medium fs-14">
                            Total Amount
                          </p>
                          <h5 className="fs-16 mb-0">
                            ₹
                            <span id="total-amount">
                              {data?.result?.TotalAmount}/-
                            </span>
                          </h5>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-4">
                      <div className="mt-sm-0 mt-3">
                        <div className="mb-4">
                          <img
                            src="assets/images/logo-dark.png"
                            className="card-logo card-logo-dark"
                            alt="logo dark"
                            height={17}
                          />
                          <img
                            src="assets/images/logo-light.png"
                            className="card-logo card-logo-light"
                            alt="logo light"
                            height={17}
                          />
                        </div>
                        <h6 className="text-muted text-uppercase fw-semibold">
                          From :-
                        </h6>
                        <p className="text-muted mb-1" id="address-details">
                          {shopkeeper?.name}
                        </p>
                        <p className="text-muted mb-1" id="address-details">
                          {shopkeeper?.address}, {shopkeeper?.city},{" "}
                          {shopkeeper?.state}
                        </p>
                        <h6>
                          <span className="text-muted fw-normal"></span>{" "}
                          <a
                            href={`mailto:${shopkeeper?.email}`}
                            className="link-primary"
                            target="_blank"
                            id="website"
                          >
                            {shopkeeper?.email}
                          </a>
                        </h6>
                        <h6 className="mb-0">
                          <span className="text-muted fw-normal">
                            Contact No:{" "}
                          </span>
                          <span id="contact-no">{shopkeeper?.phone}</span>
                        </h6>
                      </div>
                    </div>
                  </div>
                  <div className="row p-4 border-top border-top-dashed">
                    <div className="col-lg-9">
                      <div className="row g-3">
                        <div className="col-6">
                          <h6 className="text-muted text-uppercase fw-semibold mb-3">
                            Billing Address
                          </h6>
                          <p className="fw-medium mb-2" id="billing-name">
                            {customer?.name}
                          </p>
                          <p
                            className="text-muted mb-1"
                            id="billing-address-line-1"
                          >
                            {customer?.address}
                          </p>
                          <p className="text-muted mb-1">
                            <span>Phone: +</span>
                            <span id="billing-phone-no">{customer?.phone}</span>
                          </p>
                        </div>
                        <div className="col-6"></div>
                      </div>
                    </div>
                    <div className="col-lg-3">
                      <h6 className="text-muted text-uppercase fw-semibold mb-3">
                        Total Amount
                      </h6>
                      <h3 className="fw-bold mb-2">
                        ₹{data?.result?.TotalAmount}/-
                      </h3>
                      <span className="badge bg-success-subtle text-success fs-12">
                        Due Date:{" "}
                        {FutureDate.toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </span>
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-lg-12">
                      <div className="card-body p-4">
                        <div className="table-responsive">
                          <table className="table table-borderless text-center table-nowrap align-middle mb-0">
                            <thead>
                              <tr className="table-active">
                                <th scope="col" style={{ width: 50 }}>
                                  #
                                </th>
                                <th scope="col">Product Details</th>
                                <th scope="col">Price</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Tax</th>
                                <th scope="col">Discount</th>
                                <th scope="col" className="text-end">
                                  Amount
                                </th>
                              </tr>
                            </thead>
                            <tbody id="products-list">
                              {data?.ordereditems?.map((item, index) => {
                                return (
                                  <tr key={index}>
                                    <th scope="row">{index + 1}</th>
                                    <td className="text-start">
                                      <span className="fw-medium">
                                        {item?.name}
                                      </span>
                                      <p className="text-muted mb-0">
                                        {item?.description}
                                      </p>
                                    </td>
                                    <td>₹{item?.price}/-</td>
                                    <td>{item?.quantity}</td>
                                    <td>{item?.tax}%</td>
                                    <td>{item?.discount}%</td>
                                    <td className="text-end">
                                      ₹{item?.price * item?.quantity}/-
                                    </td>
                                  </tr>
                                );
                              })}
                            </tbody>
                          </table>
                        </div>
                        <div className="border-top border-top-dashed mt-2">
                          <table
                            className="table table-borderless table-nowrap align-middle mb-0 ms-auto"
                            style={{ width: 250 }}
                          >
                            <tbody>
                              <tr>
                                <td>Sub Total</td>
                                <td className="text-end">
                                  ₹
                                  {data?.ordereditems?.reduce(
                                    (acc, obj) => acc + obj.price,
                                    0
                                  )}
                                </td>
                              </tr>
                              <tr>
                                <td>Estimated Tax (+)</td>
                                <td className="text-end">
                                  ₹{data?.result?.TotalTax}
                                </td>
                              </tr>
                              <tr>
                                <td>
                                  Discount{" "}
                                  <small className="text-muted">(-)</small>
                                </td>
                                <td className="text-end">
                                  ₹{data?.result?.TotalDiscount}
                                </td>
                              </tr>
                              <tr className="border-top border-top-dashed fs-15">
                                <th scope="row">Total Amount</th>
                                <th className="text-end">
                                  ₹{data?.result?.TotalAmount}/-
                                </th>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                        <div className="mt-3">
                          <h6 className="text-muted text-uppercase fw-semibold mb-3">
                            Pending Balance:
                          </h6>
                          <p className="text-muted">
                            Total Amount: <span className="fw-medium">₹</span>
                            <span id="card-total-amount">
                              {customer?.balance}/-
                            </span>
                          </p>
                        </div>
                        <div className="mt-4">
                          <div className="alert alert-info">
                            <p className="mb-0">
                              <span className="fw-semibold">NOTES:</span>
                              <span id="note">
                                All accounts are to be paid within 7 days from
                                receipt of invoice. To be paid by cheque or
                                credit card or direct payment online. If account
                                is not paid within 7 days the credits details
                                supplied as confirmation of work undertaken will
                                be charged the agreed quoted fee noted above.
                              </span>
                            </p>
                          </div>
                        </div>
                        <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                          <a className="btn btn-info">
                            <i className="ri-printer-line align-bottom me-1" />{" "}
                            Print
                          </a>
                          <a
                            onClick={downloadInvoice}
                            className="btn btn-primary"
                          >
                            <i className="ri-download-2-line align-bottom me-1" />{" "}
                            Download
                          </a>
                        </div>
                      </div>
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

export default InvoiceDetails;
