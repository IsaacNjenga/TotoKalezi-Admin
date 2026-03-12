import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { primary, primaryDim, primaryMid } from "../utils/uiHelpers";

function DetailsModal({ setOpen, component, open, width = 680, refresh }) {
  return (
    <Modal
      open={open}
      onCancel={() => {
        setOpen(false);
        refresh();
      }}
      centered
      footer={null}
      width={width}
      closeIcon={
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 8,
            border: `1px solid ${primaryMid}`,
            background: primaryDim,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: primary,
            fontSize: 13,
            transition: "all 0.2s ease",
          }}
        >
          <CloseOutlined />
        </div>
      }
      styles={{
        content: {
          padding: 0,
          borderRadius: 16,
          overflow: "hidden",
          border: `1px solid ${primaryMid}`,
          boxShadow:
            "0 24px 60px rgba(0,0,0,0.18), 0 0 0 1px rgba(133,74,154,0.06)",
        },
        header: { display: "none" },
        body: { padding: 0 },
        mask: { backdropFilter: "blur(4px)", background: "rgba(10,5,20,0.55)" },
      }}
    >
      {component}
    </Modal>
  );
}

export default DetailsModal;
