import React, { useState } from "react";
import ShopkeeperHeader from "../Components/ShopkeeperHeader";
import NewInvoice from "../Components/NewInvoice";
import InvoiceDetails from "../Components/InvoiceDetails";

const Invoice = () => {
  const [invoices, setinvoices] = useState(null);
  return (
    <div>
      <ShopkeeperHeader />
      {invoices ? (
        <InvoiceDetails data={invoices} />
      ) : (
        <NewInvoice setinvoices={setinvoices} />
      )}
    </div>
  );
};

export default Invoice;
