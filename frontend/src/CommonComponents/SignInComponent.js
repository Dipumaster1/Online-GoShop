import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
const SignInComponent = () => {
  const [passwordicon, setpasswordicon] = useState(false);
  const [obj, setobj] = useState({});
  const [loading, setloading] = useState(false);
  const [rememberme, setrememberme] = useState(false);
  const navigate = useNavigate();
  const set = (event) =>
    setobj({ ...obj, [event.target.name]: event.target.value });
  const submit = async (e) => {
    try {
      e.preventDefault();
      setloading(true);
      const response = await axios.post("http://localhost:4010/api/login",obj, {
        // body: JSON.stringify(obj),
        headers: {
          "Content-Type": "application/json",
        }
      });
      alert(response?.data?.message); 

      if (response.status === 202) {
        localStorage.clear();
        localStorage.setItem(
          "Userinfo",
          JSON.stringify({
            Authorization: response?.data?.data?.token,
            Rememberme: rememberme,
          })
        );
        navigate("/" + response?.data?.data?.role);
      }
    } catch (error) {
      alert("Something went wrong. Try again later.");
    }finally{
      setloading(false)
    }
  };
  useEffect(() => {
    const getdata = async () => {
      const userinfo = JSON.parse(localStorage.getItem("Userinfo"));
      if (userinfo && userinfo.Rememberme)
        return await fetchuserdetails(
          userinfo.Authorization,
          userinfo.Rememberme
        );
    };
    getdata();
  }, []);
  const fetchuserdetails = async (token, remember) => {
    try {
      const response = await axios.get(
        "http://localhost:4010/api/fetchuserdetails",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: token,
          },
        }
      );
      alert(response?.data?.message);
      if (response.status === 202) {
        localStorage.clear();
        localStorage.setItem(
          "Userinfo",
          JSON.stringify({
            Authorization: response?.data?.data?.token,
            Rememberme: remember,
          })
        );
        navigate("/" + response?.data?.data?.role, { replace: true });
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong. Try again later.");
    }
  };
  return (
    <div className="account-pages">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10">
            <div className="auth-full-page-content d-flex min-vh-100 py-sm-2 py-4 justify-content-center">
              <div className="customcss">
                <div className="d-flex flex-column h-100 py-0 py-xl-4">
                  <div className="text-center mb-5">
                    <a>
                      <span className="logo-lg">
                        <img src="assets/images/GoShop-logo.png" height={150}/>
                      </span>
                    </a>
                  </div>
                  <div className="card my-auto ">
                    <div className="col-lg-12">
                      <div className="p-lg-3 p-10">
                        <div className="text-center">
                          <h5 className="mb-0">Welcome Back!</h5>
                          <p className="text-muted mt-2">
                            Sign in to continue to GoShop.
                          </p>
                        </div>
                        <div className="mt-4">
                          <form
                            onSubmit={submit}
                            action="#"
                            className="auth-input"
                          >
                            <div className="mb-3">
                              <label htmlFor="email" className="form-label">
                                Email
                              </label>
                              <input
                                type="email"
                                className="form-control"
                                name="email"
                                onChange={set}
                                id="email"
                                placeholder="Enter email"
                              />
                            </div>
                            <div className="mb-2">
                              <label
                                htmlFor="userpassword"
                                className="form-label"
                              >
                                Password
                              </label>
                              <div className="position-relative auth-pass-inputgroup mb-3">
                                <input
                                  name="password"
                                  onChange={set}
                                  type={passwordicon ? "text" : "password"}
                                  className="form-control pe-5 password-input"
                                  placeholder="Enter password"
                                />
                                <button
                                  className="btn btn-link position-absolute end-0 top-0 text-decoration-none text-muted"
                                  type="button"
                                >
                                  <i
                                    className={`las ${
                                      passwordicon ? "la-low-vision" : "la-eye"
                                    } align-middle fs-18`}
                                    onClick={() =>
                                      setpasswordicon(!passwordicon)
                                    }
                                  />
                                </button>
                              </div>
                            </div>
                            <div className="form-check form-check-primary fs-16 py-2">
                              <input
                                onChange={() => setrememberme(!rememberme)}
                                checked={rememberme}
                                className="form-check-input"
                                type="checkbox"
                                id="remember-check"
                              />
                              <label
                                className="form-check-label fs-14"
                                htmlFor="remember-check"
                              >
                                Remember me
                              </label>
                            </div>
                            <div className="mt-2">
                              <button
                                disabled={loading}
                                className="btn btn-primary w-100"
                                type="submit"
                              >
                                {loading ? "Logging..." : "Log In"}
                              </button>
                            </div>
                          </form>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-5 text-center">
                    <p className="mb-0 text-muted">
                      GoShop. Crafted with{" "}
                      <i className="mdi mdi-heart text-danger" /> by Dipanshu
                      Chouhan
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SignInComponent;
