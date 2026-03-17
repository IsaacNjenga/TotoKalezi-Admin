import { LoadingOutlined } from "@ant-design/icons";
import { Modal } from "antd";
import React from "react";

function DeleteModal({
  deleteTarget,
  setDeleteTarget,
  handleDelete,
  refresh,
  deleteLoading,
}) {
  return (
    <Modal
      open={!!deleteTarget}
      onCancel={() => setDeleteTarget(null)}
      onOk={async () => {
        handleDelete(deleteTarget._id);
        setDeleteTarget(null);
        setTimeout(() => {
          if (refresh) {
            refresh();
          } else {
            // window.location.reload();
            console.log("refresh");
          }
        }, 1000);
      }}
      okText={deleteLoading ? <LoadingOutlined /> : "Delete"}
      okButtonProps={{
        danger: true,
        style: {
          fontFamily: "'Outfit', sans-serif",
          fontWeight: 600,
          borderRadius: 8,
        },
      }}
      cancelButtonProps={{
        style: { fontFamily: "'Outfit', sans-serif", borderRadius: 8 },
      }}
      title={
        <span style={{ fontFamily: "'Outfit', sans-serif", fontWeight: 700 }}>
          Delete Media
        </span>
      }
      centered
    >
      <p
        style={{
          fontFamily: "'Outfit', sans-serif",
          fontSize: 14,
          color: "#555",
        }}
      >
        Are you sure you want to perform this action? It cannot be undone.
      </p>
      {deleteTarget?.url ||
        (deleteTarget?.cover && (
          <img
            src={deleteTarget.url || deleteTarget.cover}
            alt=""
            style={{
              width: "100%",
              maxHeight: 180,
              objectFit: "cover",
              borderRadius: 8,
              marginTop: 8,
            }}
          />
        ))}
    </Modal>
  );
}

export default DeleteModal;
