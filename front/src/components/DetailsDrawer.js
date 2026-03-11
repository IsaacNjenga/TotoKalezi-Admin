import { Drawer } from "antd";

const DRAWER_WIDTH = 600;

function DetailsDrawer({ open, toggleDrawer, component, title }) {
  return (
    <Drawer
      open={open}
      onClose={() => toggleDrawer()}
      title={title}
      placement="right"
      closable={{ placement: "end" }}
      size={DRAWER_WIDTH}
      styles={{
        header: {
          padding: "12px 20px",
          borderBottom: "1px solid rgba(133,74,154,0.12)",
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 700,
          fontSize: 15,
        },
        body: {
          padding: 0,
          margin: 0,
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
        wrapper: {
          boxShadow: "-8px 0 32px rgba(0,0,0,0.12)",
        },
      }}
    >
      {component}
    </Drawer>
  );
}

export default DetailsDrawer;
