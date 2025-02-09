import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const AddCustomerModal = (props) => {
  const [obj, setobj] = useState({});
  const [loading, setloading] = useState(false);
  const navigate = useNavigate();
  const set = (event) =>
    setobj({ ...obj, [event.target.name]: event.target.value });
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
      const response = await fetch("http://localhost:4010/api/createCustomer", {
        method: "post",
        body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
          Authorization: userinfo.Authorization,
        },
      });
      const result = await response.json();
      alert(result?.message);
      if (response.status === 201) {
        props.setToggle(false);
        await props.getallcustomers(userinfo.Authorization);
      }
      setloading(false);
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Try again later");
    }
  };
  return (
    <div>
      <div className="modal-backdrop fade show"></div>
      <div
        className="modal fade show"
        style={{ display: "block" }}
        id="addpaymentModal"
        tabIndex={-1}
        aria-hidden="true"
      >
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0">
            <div className="modal-header p-4 pb-0">
              <h5 className="modal-title" id="createMemberLabel">
                Add Customer
              </h5>
              <button
                type="button"
                onClick={() => props.setToggle(false)}
                className="btn-close"
                id="createMemberBtn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body p-4">
              <form onSubmit={submit}>
                <div className="row">
                  <div className="col-lg-12">
                    <div className="mb-3">
                      <label htmlFor="Name" className="form-label">
                        Customer Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        onChange={set}
                        className="form-control"
                        id="Name"
                        placeholder="Enter Name"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="Address" className="form-label">
                        Customer Address
                      </label>
                      <input
                        type="text"
                        name="address"
                        onChange={set}
                        className="form-control"
                        id="Address"
                        placeholder="Enter Address"
                      />
                    </div>
                    <div className="mb-3">
                      <label htmlFor="Phone" className="form-label">
                        Customer Phone
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        onChange={set}
                        className="form-control"
                        id="Phone"
                        placeholder="Enter Phone"
                      />
                    </div>
                    <div className="hstack gap-2 justify-content-end">
                      <button
                        type="button"
                        className="btn btn-light"
                        onClick={() => props.setToggle(false)}
                      >
                        Close
                      </button>
                      <button
                        type="submit"
                        disabled={loading}
                        className="btn btn-success"
                        id="addNewMember"
                      >
                        {loading ? "Adding..." : "Add Customer"}
                      </button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddCustomerModal;
