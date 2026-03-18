import React, { useState } from "react";
import { Avatar, Layout, Menu, Tooltip } from "antd";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import {
  CreditCardOutlined,
  HomeOutlined,
  PictureOutlined,
  PoweroffOutlined,
  UsergroupAddOutlined,
  SettingOutlined,
  LeftSquareOutlined,
  RightSquareOutlined,
  CodeOutlined,
  FileImageOutlined,
} from "@ant-design/icons";
import { useAuth } from "../contexts/AuthContext";
import Swal from "sweetalert2";
import "../assets/css/navbar.css";
import {
  sidebarBg,
  primary,
  globalStyles,
  accentMid,
} from "../utils/uiHelpers";

const { Header, Sider, Content } = Layout;

const menuConfig = [
  {
    key: "/",
    label: "Dashboard",
    icon: HomeOutlined,
    path: "/",
  },
  {
    key: "/donations",
    label: "Donations",
    icon: CreditCardOutlined,
    path: "/donations",
  },
  {
    key: "/gallery",
    label: "Gallery",
    icon: PictureOutlined,
    path: "/media",
  },
  {
    key: "/media/albums",
    label: "Albums",
    icon: FileImageOutlined,
    path: "/media/albums",
  },
  // {
  //   key: "media-group",
  //   label: "Gallery",
  //   icon: PictureOutlined,
  //   children: [
  //     {
  //       key: "/media",
  //       label: "View Gallery",
  //       icon: PictureOutlined,
  //       path: "/media",
  //     },
  //     {
  //       key: "/media/albums",
  //       label: "View Albums",
  //       icon: FileImageOutlined,
  //       path: "/media/albums",
  //     },
  //   ],
  // },
  {
    key: "/volunteers",
    label: "Volunteers",
    icon: UsergroupAddOutlined,
    path: "/volunteers",
  },
  {
    key: "/webpage-editor",
    label: "Site Editor",
    icon: CodeOutlined,
    path: "/webpage-editor",
  },
];

// const allLeafItems = menuConfig.flatMap((item) =>
//   item.children ? item.children : [item],
// );

// const getTitleFromPath = (path) => {
//   const found = allLeafItems.find((item) => item.path === path);
//   return found?.label ?? "Dashboard";
// };

export const NavLabel = ({ label, collapsed }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        gap: 8,
      }}
    >
      <span
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14,
          fontWeight: 500,
          color: "rgba(255,255,255,0.85)",
          letterSpacing: "0.02em",
          flex: 1,
          display: collapsed ? "none" : "block",
        }}
      >
        {label}
      </span>
    </div>
  );
};

// ── Main ─────────────────────────────────────────────────────────
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, user, collapsed, setCollapsed } = useAuth();
  const [current, setCurrent] = useState(location.pathname);

  // Ant Design menu items
  const antMenuItems = menuConfig.map((item) => {
    const iconEl = React.createElement(item.icon, {
      style: { fontSize: 18, color: "rgba(255,255,255,0.75)", flexShrink: 0 },
    });

    if (item.children) {
      // Find the "create" child path for the plus button
      const createChild = item.children.find(
        (c) =>
          c.path?.includes("create") ||
          c.label?.toLowerCase().includes("upload") ||
          c.label?.toLowerCase().includes("add"),
      );

      return {
        key: item.key,
        icon: iconEl,
        label: (
          <NavLabel
            label={item.label}
            childPath={createChild?.path}
            collapsed={collapsed}
            navigate={navigate}
          />
        ),
        children: item.children.map((child) => ({
          key: child.path,
          icon: React.createElement(child.icon, {
            style: { fontSize: 16, color: "rgba(255,255,255,0.65)" },
          }),
          label: (
            <Link
              to={child.path}
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "rgba(255,255,255,0.75)",
                textDecoration: "none",
              }}
              onClick={() => setCurrent(child.path)}
            >
              {child.label}
            </Link>
          ),
        })),
      };
    }

    return {
      key: item.path,
      icon: iconEl,
      label: (
        <Link
          to={item.path}
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 14,
            fontWeight: 500,
            color: "rgba(255,255,255,0.85)",
            textDecoration: "none",
            letterSpacing: "0.02em",
          }}
          onClick={() => setCurrent(item.path)}
        >
          {item.label}
        </Link>
      ),
    };
  });

  const handleLogout = () => {
    Swal.fire({
      title: "Log out?",
      text: "Are you sure you want to log out?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: primary,
      cancelButtonColor: "#555",
      confirmButtonText: "Yes, log out",
    }).then(async (result) => {
      if (result.isConfirmed) await logout();
    });
  };

  return (
    <>
      <style>{globalStyles}</style>
      <Layout style={{ minHeight: "100vh" }}>
        {/* ── SIDEBAR ─────────────────────────────────────────── */}
        <Sider
          trigger={null}
          collapsible
          collapsed={collapsed}
          breakpoint="md"
          onBreakpoint={(broken) => setCollapsed(broken)}
          width={260}
          collapsedWidth={72}
          style={{
            background: sidebarBg,
            overflow: "auto",
            height: "100vh",
            position: "sticky",
            top: 0,
            insetInlineStart: 0,
            borderRight: "1px solid rgba(255,255,255,0.06)",
            display: "flex",
            flexDirection: "column",
          }}
        >
          {/* ── Logo block ── */}
          <div
            style={{
              padding: collapsed ? "16px 12px" : "14px 12px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              borderBottom: "1px solid rgba(255,255,255,0.07)",
              marginBottom: 4,
              transition: "padding 0.3s ease",
            }}
          >
            <img
              src={logo}
              alt="logo"
              style={{
                width: collapsed ? 44 : 80,
                height: collapsed ? 44 : 80,
                borderRadius: collapsed ? 6 : 8,
                objectFit: "cover",
                // border: `2px solid rgba(254,165,73,0.25)`,
                boxShadow: "0 4px 16px rgba(0,0,0,0.3)",
                transition: "all 0.35s ease",
              }}
            />
            {!collapsed && (
              <div style={{ textAlign: "center", marginTop: 12 }}>
                <p
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 15,
                    fontWeight: 700,
                    color: "#fff",
                    margin: "0 0 4px",
                    letterSpacing: "0.03em",
                  }}
                >
                  TotoKalezi
                </p>

                {user && (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <p
                      style={{
                        fontFamily: "'Outfit', sans-serif",
                        fontSize: 12,
                        color: "rgba(255,255,255,0.4)",
                        margin: "0px 0 0",
                        letterSpacing: "0.02em",
                      }}
                    >
                      {user?.username}
                    </p>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        backgroundColor: "green",
                        marginLeft: 4,
                        borderRadius: "50%",
                      }}
                    />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ── Menu ── */}
          <Menu
            theme="dark"
            mode="inline"
            className="admin-menu"
            selectedKeys={[current]}
            defaultOpenKeys={["media-group"]}
            inlineCollapsed={collapsed}
            style={{
              background: "transparent",
              border: "none",
              flex: 1,
              padding: "0 4px",
            }}
            items={antMenuItems}
            onClick={({ key }) => setCurrent(key)}
          />

          {/* ── Collapse toggle ── */}
          <div
            style={{
              padding: collapsed ? "16px 12px" : "16px 20px",
              borderTop: "1px solid rgba(255,255,255,0.07)",
              display: "flex",
              justifyContent: collapsed ? "center" : "flex-start",
            }}
          >
            <button
              className="collapse-toggle"
              onClick={() => setCollapsed((p) => !p)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: 8,
                padding: collapsed ? "8px" : "8px 16px",
                cursor: "pointer",
                color: "rgba(255,255,255,0.5)",
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                transition: "all 0.2s ease",
                width: collapsed ? "auto" : "100%",
              }}
            >
              {collapsed ? (
                <RightSquareOutlined style={{ fontSize: 16 }} />
              ) : (
                <LeftSquareOutlined style={{ fontSize: 16 }} />
              )}
            </button>
          </div>
        </Sider>

        <Layout>
          {/* ── HEADER ──────────────────────────────────────────── */}
          <Header
            style={{
              background: sidebarBg,
              height: "auto",
              padding: "0",
              borderBottom: "1px solid rgba(255,255,255,0.06)",
              position: "sticky",
              top: 0,
              zIndex: 100,
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "12px 24px",
                minHeight: 64,
              }}
            >
              <div></div>
              {/* Right actions */}
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                {/* Notifications */}
                {/* <Tooltip title="Notifications">
                  <Badge count={3} size="small" color={accent}>
                    <button
                      className="header-icon-btn"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 8,
                        border: "1px solid rgba(255,255,255,0.1)",
                        background: "rgba(255,255,255,0.04)",
                        color: "rgba(255,255,255,0.6)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        fontSize: 16,
                        transition: "all 0.2s ease",
                        padding: 0,
                      }}
                    >
                      <BellOutlined />
                    </button>
                  </Badge>
                </Tooltip> */}

                {/* Settings */}
                <Tooltip title="Settings">
                  <button
                    className="header-icon-btn"
                    onClick={() => navigate("/settings")}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: "1px solid rgba(255,255,255,0.1)",
                      background: "rgba(255,255,255,0.04)",
                      color: "rgba(255,255,255,0.6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: 16,
                      transition: "all 0.2s ease",
                      padding: 0,
                    }}
                  >
                    <SettingOutlined />
                  </button>
                </Tooltip>

                {/* Divider */}
                <div
                  style={{
                    width: 1,
                    height: 28,
                    background: "rgba(255,255,255,0.1)",
                    margin: "0 4px",
                  }}
                />

                {/* User avatar + name */}
                <Tooltip title={user?.username}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      padding: "6px 12px 6px 6px",
                      borderRadius: 10,
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "rgba(255,255,255,0.04)",
                      cursor: "default",
                    }}
                  >
                    <Avatar
                      src={user?.avatar}
                      size={28}
                      style={{
                        background: primary,
                        border: `1px solid ${accentMid}`,
                        fontSize: 12,
                        fontWeight: 700,
                      }}
                    >
                      {user?.username?.[0]?.toUpperCase()}
                    </Avatar>
                    <div style={{ lineHeight: 1.3 }}>
                      <p
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 13,
                          fontWeight: 600,
                          color: "#fff",
                          margin: 0,
                        }}
                      >
                        {user?.username ?? "Admin"}
                      </p>
                      {/* <p
                        style={{
                          fontFamily: "'Outfit', sans-serif",
                          fontSize: 10,
                          color: accent,
                          margin: 0,
                          letterSpacing: "0.04em",
                        }}
                      >
                        Administrator
                      </p> */}
                    </div>
                  </div>
                </Tooltip>

                {/* Logout */}
                <Tooltip title="Log Out">
                  <button
                    className="logout-btn"
                    onClick={handleLogout}
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 8,
                      border: "1px solid rgba(231,76,60,0.3)",
                      background: "rgba(231,76,60,0.08)",
                      color: "#e74c3c",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      fontSize: 16,
                      transition: "all 0.2s ease",
                      padding: 0,
                    }}
                  >
                    <PoweroffOutlined />
                  </button>
                </Tooltip>
              </div>
            </div>
          </Header>

          {/* ── CONTENT ─────────────────────────────────────────── */}
          <Content
            style={{
              margin: 20,
              padding: 0,
              minHeight: "calc(100vh - 104px)",
              background: "transparent",
            }}
          >
            <Outlet />
          </Content>
        </Layout>
      </Layout>
    </>
  );
}

export default Navbar;
