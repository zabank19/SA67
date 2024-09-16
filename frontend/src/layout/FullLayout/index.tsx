import React, { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "../../App.css";
import { UserOutlined, DashboardOutlined } from "@ant-design/icons";
import { Layout, Menu, Button, message } from "antd";
import logo from "../../assets/logo.png";
import Dashboard from "../../pages/dashboard";
import AdminDashboard from "../../pages/admindashboard";
import Customer from "../../pages/customer";
import CustomerCreate from "../../pages/customer/create";
import CustomerEdit from "../../pages/customer/edit";

const { Header, Content, Footer } = Layout;

const FullLayout: React.FC = () => {
  const page = localStorage.getItem("page");
  const [messageApi, contextHolder] = message.useMessage();
  const userID = localStorage.getItem("id") ?? "0";

  const setCurrentPage = (val: string) => {
    localStorage.setItem("page", val);
  };

  const Logout = () => {
    localStorage.clear();
    messageApi.success("Logout successful");
    setTimeout(() => {
      location.href = "/";
    }, 2000);
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      {contextHolder}
      
      {/* แถบด้านบน */}
      <Header style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {/* โลโก้ */}
        <div style={{ display: "flex", alignItems: "center" }}>
          <img src={logo} alt="Logo" style={{ width: 40, marginRight: 10 }} />
          <span style={{ color: "white", fontSize: 20 }}></span>
        </div>

        {/* เมนู */}
        <Menu
          theme="dark"
          mode="horizontal"
          defaultSelectedKeys={[page ? page : userID === "999" ? "admindashboard" : "dashboard"]}
        >
          {userID === "999" && (
            <Menu.Item key="admindashboard" onClick={() => setCurrentPage("admindashboard")}>
              <Link to="/">
                <DashboardOutlined />
                <span>Admin</span>
              </Link>
            </Menu.Item>
          )}

          {userID !== "999" && (
            <Menu.Item key="dashboard" onClick={() => setCurrentPage("dashboard")}>
              <Link to="/">
                <DashboardOutlined />
                <span>แจ้งปัญหา</span>
              </Link>
            </Menu.Item>
          )}

          {/* เพิ่มเมนูเพิ่มเติมได้ที่นี่ */}
        </Menu>

        {/* ปุ่มออกจากระบบ */}
        <Button onClick={Logout} type="primary" style={{ marginLeft: "auto" }}>
          ออกจากระบบ
        </Button>
      </Header>

      {/* เนื้อหาหลัก */}
      <Content style={{ margin: "16px" }}>
        <div style={{ padding: 24, minHeight: "100%", background: "#fff" }}>
          <Routes>
            <Route path="/" element={userID === "999" ? <AdminDashboard /> : <Dashboard />} />
            <Route path="/customer" element={<Customer />} />
            <Route path="/customer/create" element={<CustomerCreate />} />
            <Route path="/customer/edit/:id" element={<CustomerEdit />} />
          </Routes>
        </div>
      </Content>

      {/* Footer */}
      <Footer style={{ textAlign: "center" }}>
        RENTCAR
      </Footer>
    </Layout>
  );
};

export default FullLayout;
