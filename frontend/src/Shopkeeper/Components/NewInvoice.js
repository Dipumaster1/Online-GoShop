import React, { useEffect, useState } from "react";
import Title from "../../CommonComponents/Title";
import Footer from "../../CommonComponents/Footer";
import AddItemModal from "./AddItemModal";
import ChooseCustomerModal from "./ChooseCustomerModal";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const NewInvoice = ({ setinvoices }) => {
  const [AddItemToggle, setAddItemToggle] = useState(false);
  const [customer, setcustomer] = useState({});
  const [items, setitems] = useState([]);
  const [result, setresult] = useState({});
  const [ChooseCustomerToggle, setChooseCustomerToggle] = useState(false);
  const navigate = useNavigate();
  const [loading, setloading] = useState(false);
  const addquantity = (obj) => {
    obj.quantity += 1;
    setitems(items.map((item) => (item._id === obj._id ? obj : item)));
  };
  const removequantity = (obj) => {
    if (obj.quantity <= 1) {
      setitems(items.filter((item) => item._id !== obj._id));
    } else {
      obj.quantity -= 1;
      setitems(items.map((item) => (item._id === obj._id ? obj : item)));
    }
  };
  const changediscount = (updateddiscount, obj) => {
    obj.discount = updateddiscount;
    setitems(items.map((item) => (item._id === obj._id ? obj : item)));
  };
  const remove = (obj) => {
    setitems(items.filter((item) => item._id !== obj._id));
  };
  useEffect(() => {
    let subtotal = 0;
    let totaltax = 0;
    let totaldiscount = 0;
    items?.map((item) => {
      subtotal += item.quantity * item.price;
      totaltax += (item.quantity * (item.price * item.tax)) / 100;
      totaldiscount += (item.quantity * (item.price * item.discount)) / 100;
    });
    const grandtotal = subtotal + totaltax - totaldiscount;
    setresult({ grandtotal, subtotal, totaltax, totaldiscount });
  }, [items]);
  const submit = async (e) => {
    try {
      e.preventDefault();
      setloading(true);
      const userinfo = JSON.parse(localStorage.getItem("Userinfo"));
      if (!userinfo || !userinfo.Authorization) {
        localStorage.clear();
        alert("Unauthorised user");
        window.history.replaceState(null, null, "/");
        return navigate("/", { replace: true });
      }
      if (!customer._id) return alert("Choose your Customer");
      if (items.length === 0) return alert("Add products to your invoice");
      const ordereditems = items.map((item) => ({
        id: item._id,
        quantity: item.quantity,
      }));
      const response = await axios.post(
        "http://localhost:4010/api/createInvoice/" + customer._id,{ordereditems},
        {
          // body: JSON.stringify({ ordereditems }),
          headers: {
            "Content-Type": "application/json",
            Authorization: userinfo.Authorization,
          },
        }
      );
      alert(response?.data?.message);
      if (response.status === 201) {
        setinvoices(response?.data?.data);
      }
    } catch (error) {
      alert("Something went wrong. Please try again");
    } finally {
      return setloading(false);
    }
  };
  return (
    <div className="main-content">
      <div className="page-content">
        <div className="container-fluid">
          <Title Name={"New Invoice"} />
          <div className="row justify-content-center">
            <div className="col-xxl-9">
              <div className="card">
                <form
                  onSubmit={submit}
                  className="needs-validation"
                  noValidate
                  id="invoice_form"
                >
                  <div className="card-body border-bottom border-bottom-dashed p-4">
                    <div className="row">
                      <div className="col-lg-6">
                        <div className="row g-3">
                          <div className="col-lg-8 col-sm-6">
                            <label htmlFor="choices-payment-status">
                              Select your Customer
                            </label>
                            <div className="input-light">
                              <a
                                onClick={() =>
                                  setChooseCustomerToggle(!ChooseCustomerToggle)
                                }
                                id="add-item"
                                className="btn btn-soft-secondary fw-medium"
                              >
                                <i className="ri-add-fill me-1 align-bottom" />{" "}
                                {customer?.name
                                  ? "Change Customer"
                                  : "Add Customer"}
                              </a>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-lg-6 col-sm-6">
                        <div>
                          <label
                            htmlFor="billingName"
                            className="text-muted text-uppercase fw-semibold"
                          >
                            Billing Address
                          </label>
                        </div>
                        <div className="mb-2">
                          <input
                            type="text"
                            value={customer?.name ? customer?.name : ""}
                            className="form-control bg-light border-0"
                            id="billingName"
                            placeholder="Full Name"
                            required
                            readOnly={true}
                          />
                        </div>
                        <div className="mb-2">
                          <input
                            type="text"
                            value={customer?.address ? customer?.address : ""}
                            className="form-control bg-light border-0"
                            data-plugin="cleave-phone"
                            id="billingPhoneno"
                            placeholder="Address"
                            readOnly={true}
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <input
                            type="text"
                            value={customer?.phone ? customer?.phone : ""}
                            className="form-control bg-light border-0"
                            data-plugin="cleave-phone"
                            id="billingPhoneno"
                            placeholder="Phone"
                            readOnly={true}
                            required
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="card-body p-4">
                    <div className="table-responsive">
                      <table className="invoice-table table table-borderless table-nowrap mb-0">
                        <thead className="align-middle">
                          <tr className="table-active">
                            <th scope="col" style={{ width: 50 }}>
                              #
                            </th>
                            <th scope="col" style={{ width: 300 }}>
                              Product Details
                            </th>
                            <th scope="col">
                              <div className="d-flex text-center currency-select input-light align-items-center">
                                Price(₹)
                              </div>
                            </th>
                            <th
                              scope="col"
                              style={{ width: 150, textAlign: "center" }}
                            >
                              Quantity
                            </th>
                            <th scope="col" style={{ width: 12 }}>
                              Tax(%)
                            </th>
                            <th scope="col" style={{ width: 12 }}>
                              Disc.(%)
                            </th>
                            <th
                              scope="col"
                              className="text-center"
                              style={{ width: 120 }}
                            >
                              Amount(₹)
                            </th>
                            <th scope="col" className="text-end"></th>
                          </tr>
                        </thead>
                        <tbody id="newlink">
                          {items &&
                            items.length !== 0 &&
                            items?.map((item, index) => {
                              return (
                                <tr
                                  key={index}
                                  id={index + 1}
                                  className="product"
                                >
                                  <th scope="row" className="product-id">
                                    {index + 1}
                                  </th>
                                  <td className="text-start">
                                    <div className="mb-2">
                                      <input
                                        type="text"
                                        readOnly={true}
                                        value={item?.name}
                                        className="form-control bg-light border-0"
                                        id="productName-1"
                                        placeholder="Product Name"
                                        required
                                      />
                                    </div>
                                    <input
                                      type="text"
                                      readOnly={true}
                                      value={item?.description}
                                      className="form-control bg-light border-0"
                                      id="productDetails-1"
                                      placeholder="Product Details"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      readOnly={true}
                                      value={item?.price}
                                      className="form-control product-price bg-light border-0"
                                      id="productRate-1"
                                      required
                                    />
                                  </td>
                                  <td>
                                    <div className="input-step">
                                      <button
                                        type="button"
                                        onClick={() => removequantity(item)}
                                        className="minus"
                                      >
                                        –
                                      </button>
                                      <input
                                        readOnly={true}
                                        type="number"
                                        className="product-quantity"
                                        id="product-qty-1"
                                        value={item?.quantity}
                                      />
                                      <button
                                        type="button"
                                        className="plus"
                                        onClick={() => addquantity(item)}
                                      >
                                        +
                                      </button>
                                    </div>
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      value={item?.tax}
                                      className="form-control bg-light border-0 product-line-price"
                                      id="productPrice-1"
                                      readOnly={true}
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      onChange={(event) =>
                                        changediscount(event.target.value, item)
                                      }
                                      value={item?.discount}
                                      className="form-control bg-light border-0 product-line-price"
                                    />
                                  </td>
                                  <td>
                                    <input
                                      type="number"
                                      value={item?.price * item?.quantity}
                                      className="form-control bg-light border-0 product-line-price"
                                      id="productPrice-1"
                                      readOnly={true}
                                    />
                                  </td>
                                  <td className="text-end product-removal">
                                    <a
                                      onClick={() => remove(item)}
                                      style={{ fontSize: "25px" }}
                                      className="btn btn-success"
                                    >
                                      &times;
                                    </a>
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                        <tbody>
                          <tr>
                            <td colSpan={5}>
                              <a
                                onClick={() => setAddItemToggle(!AddItemToggle)}
                                id="add-item"
                                className="btn btn-soft-secondary fw-medium"
                              >
                                <i className="ri-add-fill me-1 align-bottom" />{" "}
                                Add Item
                              </a>
                            </td>
                          </tr>
                          <tr className="border-top border-top-dashed mt-2">
                            <td colSpan={4} />
                            <td colSpan={4} className="p-0">
                              <table className="table table-borderless table-sm table-nowrap align-middle mb-0">
                                <tbody>
                                  <tr>
                                    <th scope="row">Sub Total</th>
                                    <td style={{ width: 150 }}>
                                      <input
                                        type="number"
                                        value={
                                          result?.subtotal
                                            ? result?.subtotal
                                            : ""
                                        }
                                        className="form-control bg-light border-0"
                                        id="cart-subtotal"
                                        readOnly
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Total Tax</th>
                                    <td>
                                      <input
                                        type="number"
                                        value={
                                          result?.totaltax
                                            ? result?.totaltax
                                            : ""
                                        }
                                        className="form-control bg-light border-0"
                                        id="cart-tax"
                                        readOnly
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <th scope="row">Total Discount</th>
                                    <td>
                                      <input
                                        type="number"
                                        value={
                                          result?.totaldiscount
                                            ? result?.totaldiscount
                                            : ""
                                        }
                                        className="form-control bg-light border-0"
                                        id="cart-discount"
                                        readOnly
                                      />
                                    </td>
                                  </tr>
                                  <tr className="border-top border-top-dashed">
                                    <th scope="row">Total Amount</th>
                                    <td>
                                      <input
                                        type="number"
                                        value={
                                          result?.grandtotal
                                            ? result?.grandtotal
                                            : ""
                                        }
                                        className="form-control bg-light border-0"
                                        id="cart-total"
                                        readOnly
                                      />
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="exampleFormControlTextarea1"
                        className="form-label text-muted text-uppercase fw-semibold"
                      >
                        NOTES
                      </label>
                      <textarea
                        className="form-control alert alert-info"
                        id="exampleFormControlTextarea1"
                        readOnly={true}
                        placeholder="Notes"
                        rows={2}
                        required
                        defaultValue={
                          "All accounts are to be paid within 7 days from receipt of invoice. To be paid by cheque or credit card or direct payment online. If account is not paid within 7 days the credits details supplied as confirmation of work undertaken will be charged the agreed quoted fee noted above."
                        }
                      />
                    </div>
                    <div className="hstack gap-2 justify-content-end d-print-none mt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-info"
                      >
                        <i className="ri-printer-line align-bottom me-1" />
                        {loading ? "Saving..." : "Save Invoice"}
                      </button>
                      <a
                        className="btn btn-danger"
                        onClick={() => navigate("/Shopkeeper")}
                      >
                        <i className="ri-send-plane-fill align-bottom me-1" />
                        Discard
                      </a>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      {AddItemToggle && (
        <AddItemModal
          items={items}
          setitems={setitems}
          setToggle={setAddItemToggle}
        />
      )}
      {ChooseCustomerToggle && (
        <ChooseCustomerModal
          setcustomer={setcustomer}
          setToggle={setChooseCustomerToggle}
        />
      )}
      <Footer />
    </div>
  );
};

export default NewInvoice;
