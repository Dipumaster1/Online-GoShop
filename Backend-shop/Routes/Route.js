const express = require("express");
const { generateotp, verifyotp } = require("../Services/OtpService/OtpService");
const {
  otptoemailforverification,
} = require("../Services/EmailService/EmailService");
const { User, Shopkeeper } = require("../Model/UserModel/userModel");
const Product = require("../Model/ProductModel/ProductModel");
const HandleResponse = require("../HandleResponse/handleResponse");
const jwt = require("jsonwebtoken");
const checkUserDetails = require("../Middlewares/checkUserDetails");
const Routes = express.Router();

Routes.get("/HealthCheckApi", async (req, resp) =>
  HandleResponse(resp, 202, "Server health is okay")
);

//Shopkeeper Routes
Routes.post("/verifyshopkeeper", async (req, resp) => {
  try {
    const { name, phone, email, password, address, city, state } = req.body;
    //field check
    if (!name || !phone || !email || !password || !city || !address || !state)
      return HandleResponse(resp, 404, "Field is Empty");
    //checking account
    const existinguser = await User.findOne({ email });
    if (existinguser)
      return HandleResponse(resp, 400, "Account already exists");
    //generating otp,send them to email and verify them
    const otp = generateotp(email);
    return await otptoemailforverification(resp, email, otp);
  } catch (error) {
    return HandleResponse(resp, 500, "Internal Server Error", null, error);
  }
});
Routes.post("/createshopkeeper", async (req, resp) => {
  try {
    const { name, phone, email, address, password, city, state, otp } =
      req.body;

    if (!name || !phone || !email || !address || !city || !state || !password)
      return HandleResponse(resp, 404, "Field is Empty");

    if (!otp) return HandleResponse(resp, 404, "Enter the otp");

    const existinguser = await User.findOne({ email });
    if (existinguser) return HandleResponse(resp, 400, "User already exists");

    const response = verifyotp(email, otp);
    if (!response.status) return HandleResponse(resp, 400, response.message);

    const result = await Shopkeeper.create({
      name,
      phone,
      email,
      password,
      address,
      city,
      state,
    });

    return HandleResponse(resp, 201, "Account created successfully", result);
  } catch (error) {
    return HandleResponse(resp, 500, "Internal server error", null, error);
  }
});

//common login route for all posts
Routes.post("/login", async (req, resp) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) return HandleResponse(resp, 404, "Field is Empty");

    const result = await User.findOne({ email });
    if (!result) return HandleResponse(resp, 401, "Invalid Email");

    if (password === result.password) {
      if (!result.service)
        return HandleResponse(resp, 401, "Your service is disabled");
      const payload = { id: result._id };
      const token = jwt.sign(payload, process.env.JSON_SECRET_KEY);
      return HandleResponse(resp, 202, "login successfully", {
        token,
        role: result.role,
      });
    }
    return HandleResponse(resp, 401, "Invalid Password");
  } catch (error) {
    return HandleResponse(resp, 500, "Internal Server error", null, error);
  }
});

//SuperAdmin Routes
Routes.put("/enable", checkUserDetails, async (req, resp) => {
  try {
    const { id } = req.body;
    if (!id) return HandleResponse(resp, 404, "Plz Select the user");

    const existinguser = await User.findOne({ _id: id });
    if (!existinguser) return HandleResponse(resp, 404, "User is not found");

    const result = await User.updateOne(
      { _id: id },
      { $set: { service: true } }
    );
    return HandleResponse(resp, 202, "Service is enabled", result);
  } catch (error) {
    return HandleResponse(resp, 500, "Internal Server error", null, error);
  }
});
Routes.put("/disable", checkUserDetails, async (req, resp) => {
  try {
    const { id } = req.body;
    if (!id) return HandleResponse(resp, 404, "Plz Select the user");

    const existinguser = await User.findOne({ _id: id });
    if (!existinguser) return HandleResponse(resp, 404, "User is not found");

    const result = await User.updateOne(
      { _id: id },
      { $set: { service: false } }
    );
    return HandleResponse(resp, 202, "Service is disabled", result);
  } catch (error) {
    return HandleResponse(resp, 500, "Internal Server error", null, error);
  }
});

//route for getting all users without including superadmin
Routes.get("/getallusers", checkUserDetails, async (req, resp) => {
  try {
    const users = await User.find({ role: { $ne: "Superadmin" } }).select(
      "-password"
    );
    if (users.length === 0) return HandleResponse(resp, 400, "No user found");
    return HandleResponse(resp, 202, "Users fetched successfully", users);
  } catch (error) {
    return HandleResponse(resp, 500, "Internal Server error", null, error);
  }
});

//route for checking user details
Routes.post("/fetchuserdetails", checkUserDetails, async (req, resp) => {
  const payload = { id: req.user._id };
  const token = jwt.sign(payload, process.env.JSON_SECRET_KEY);
  return HandleResponse(resp, 202, "Login Successfully", {
    role: req.user.role,
    token,
  });
});

//Product Routes
Routes.post("/addproduct", checkUserDetails, async (req, resp) => {
  try {
    const {
      name,
      company,
      model,
      description,
      price,
      discount,
      rate,
      tax,
      stock,
      userid,
    } = req.body;
    if (
      !name ||
      !company ||
      !model ||
      !description ||
      !price ||
      !discount ||
      !rate ||
      !tax ||
      !userid
    )
      return HandleResponse(resp, 404, "Field is empty");

    const existingproduct = await Product.findOne({ model });
    if (existingproduct)
      return HandleResponse(resp, 400, "Product of this model already exists");

    const newproduct = await Product.create({
      userid,
      name,
      company,
      model,
      description,
      price,
      discount,
      rate,
      tax,
      stock,
    });
    return HandleResponse(resp, 201, "Product added successfully", newproduct);
  } catch (error) {
    return HandleResponse(resp, 500, "Internal server error", null, error);
  }
});
Routes.get("/getproducts", checkUserDetails, async (req, resp) => {
  try {
    const allproducts = await Product.find({
      userid: "67913e0af355f679f16b04b4",
    });
    if (allproducts.length === 0)
      return HandleResponse(resp, 404, "Your product list is empty");

    return HandleResponse(
      resp,
      202,
      "All products successfully fetched",
      allproducts
    );
  } catch (error) {
    return HandleResponse(resp, 500, "Internal server error", null, error);
  }
});
Routes.delete("/deleteproduct/:id", checkUserDetails, async (req, resp) => {
  try {
    const { id } = req.params;
    if (!id) return HandleResponse(resp, 404, "Plz select the product");

    const existingproduct = await Product.findOne({
      _id: id,
      userid: "67913e0af355f679f16b04b4",
    });
    if (!existingproduct)
      return HandleResponse(
        resp,
        404,
        "This product is not found in your product list."
      );

    const result = await Product.deleteOne({
      _id: id,
      userid: "67913e0af355f679f16b04b4",
    });
    return HandleResponse(resp, 202, "Product deleted successfully", result);
  } catch (error) {
    return HandleResponse(resp, 500, "Internal server error", null, error);
  }
});
Routes.put("/updateproduct/:id", checkUserDetails, async (req, resp) => {
  try {
    const {
      name,
      company,
      model,
      stock,
      description,
      price,
      discount,
      rate,
      tax,
    } = req.body;
    if (
      !name ||
      !company ||
      !model ||
      !description ||
      !price ||
      !discount ||
      !rate ||
      !tax
    )
      return HandleResponse(resp, 404, "Field is Empty");

    const { id } = req.params;
    if (!id) return HandleResponse(resp, 404, "Plz select the product");

    const existingproduct = await Product.findOne({ _id: id });
    if (!existingproduct)
      return HandleResponse(
        resp,
        404,
        "This product is not found in your product list"
      );

    const response = await Product.findOne({ model });
    if (response)
      return HandleResponse(
        resp,
        400,
        "Product of this model is already exists in your product list"
      );

    const updatedproduct = await Product.updateOne(
      { _id: id },
      {
        $set: {
          name,
          company,
          model,
          description,
          price,
          discount,
          rate,
          tax,
          stock,
        },
      }
    );
    return HandleResponse(
      resp,
      202,
      "Product updated successfully",
      updatedproduct
    );
  } catch (error) {
    return HandleResponse(resp, 500, "Internal Server error", error);
  }
});

//route and constant for creating multi-product using excel file
const validateObjectKeys = (object, schema) => {
  const schemaKeys = Object.keys(schema.paths).filter(
    (key) => key !== "__v" && key !== "_id" && key !== "createdat"
  );
  const objectKeys = Object.keys(object);

  for (const key of schemaKeys) {
    if (
      !object.hasOwnProperty(key) ||
      object[key] === null ||
      object[key] === ""
    )
      return "The key " + key + " is missing or empty.";
  }

  for (const key of objectKeys) {
    if (!schemaKeys.includes(key))
      return "The key " + key + " is not declared in the schema.";
  }

  return null;
};
Routes.post("/addmultipleproducts", checkUserDetails, async (req, resp) => {
  try {
    const { items } = req.body;
    if (!Array.isArray(items) || items.length === 0)
      return HandleResponse(
        resp,
        400,
        "Invalid input. Provide an array of items."
      );
    const updateditems = items.map((item) => {
      return { ...item, userid: req.user._id };
    });
    const errors = [];
    updateditems.map(async (item, index) => {
      const validationError = validateObjectKeys(item, Product.schema);
      if (validationError) errors.push({ index, error: validationError });

      const existingproduct = await Product.findOne({ model: item.model });
      if (existingproduct)
        errors.push({
          index,
          error: "The modelNumber " + item.model + " already exists.",
        });
    });

    if (errors.length > 0)
      return HandleResponse(
        resp,
        400,
        "Validation errors occurred.",
        null,
        errors
      );

    const result = await Product.insertMany(updateditems);
    return HandleResponse(
      resp,
      201,
      "All products are added successfully",
      result
    );
  } catch (error) {
    return HandleResponse(resp, 500, "Internal Server Error", null, error);
  }
});
module.exports = Routes;
