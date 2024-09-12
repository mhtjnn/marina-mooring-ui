import React from "react";
import LoginForm from "../Login/LoginForm";

const Admin = () => {
  const Label = "Login";
  const typeEmail = "email";
  const typePass = "password";
  return (
    <div>
      <LoginForm
        Label={Label}
        typeEmail={typeEmail}
        typePass={typePass}
        admin={true}
      />
    </div>
  );
};

export default Admin;
