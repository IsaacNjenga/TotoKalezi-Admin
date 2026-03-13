import { useState, useMemo } from "react";
import { Table, Avatar, Button, Input, Tooltip, Empty, Collapse } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  StarOutlined,
  MailOutlined,
  StarFilled,
  CarryOutOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import useFetchAllVolunteers from "../hooks/fetchVolunteers";
import {
  globalStyles,
  primary,
  accent,
  VolunteerStatCard,
} from "../utils/uiHelpers";
import VolunteerDetail from "../components/VolunteerPreview";
import DetailsModal from "../components/DetailsModal";
import { useNotification } from "../contexts/NotificationContext";
import axios from "axios";
import { useAuth } from "../contexts/AuthContext";

const btnStyle = {
  width: 22,
  height: 22,
  border: "0px solid rgba(231,76,60,0.18)",
  background: 0,
  color: "#9d9d9d",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  cursor: "pointer",
  fontSize: 12,
  transition: "all 0.2s ease",
  padding: 0,
};

const RenderTable = ({
  openModal,
  loading,
  emptyMessage,
  columns,
  filtered,
}) => {
  return (
    <Table
      className="vol-table"
      loading={loading}
      dataSource={filtered}
      columns={columns}
      showHeader={false}
      size="small"
      rowKey="_id"
      pagination={{
        pageSize: 10,
        size: "small",
        showSizeChanger: false,
      }}
      rowClassName={(r) => (r.isRead ? "" : "unread-row")}
      onRow={(record) => ({
        onClick: () => openModal(record),
        style: { cursor: "pointer" },
      })}
      locale={{
        emptyText: (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={
              <span
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  color: "#bbb",
                }}
              >
                {emptyMessage || "No submissions found"}
              </span>
            }
          />
        ),
      }}
    />
  );
};

const panelStyles = {
  header: { padding: "10px 16px", margin: 0 },
  body: { padding: 0, margin: 0 },
};

function Volunteers() {
  const { token } = useAuth();
  const { volunteers, loading, refresh } = useFetchAllVolunteers();
  const openNotification = useNotification();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);
  const [activePanel, setActivePanel] = useState("unread");

  const updateMsg = async (id, updateData) => {
    if (!id || !token) return;
    try {
      await axios.post(
        `/volunteers/mark-record/${id}`,
        { ...updateData },
        { headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      console.error("Error marking email:", error);
      openNotification("error", "Error", "Failed to mark email as read");
    }
  };

  const handleMenuClick = async (key, record) => {
    if (!key || !record) return;

    if (key === "toggle-read") {
      await updateMsg(record._id, { isRead: !record.isRead });
    }

    if (key === "toggle-star") {
      await updateMsg(record._id, { isStarred: !record.isStarred });
    }

    refresh(); // ensure table updates
  };

  const unread = useMemo(
    () => volunteers?.filter((v) => !v.isRead).length ?? 0,
    [volunteers],
  );
  const read = useMemo(
    () => volunteers?.filter((v) => v.isRead).length ?? 0,
    [volunteers],
  );
  const starred = useMemo(
    () => volunteers?.filter((v) => v.isStarred).length ?? 0,
    [volunteers],
  );

  const openModal = async (record) => {
    setSelected(record);
    setOpen(true);
    await updateMsg(record._id, { isRead: true });
  };

  // search helper
  const applySearch = (data) => {
    if (!search.trim()) return data;

    const q = search.toLowerCase();

    return data.filter(
      (v) =>
        v.fullName?.toLowerCase().includes(q) ||
        v.email?.toLowerCase().includes(q) ||
        v.message?.toLowerCase().includes(q),
    );
  };

  const unreadFiltered = useMemo(() => {
    let base = volunteers?.filter((v) => !v.isRead) ?? [];

    if (statusFilter === "read") return []; // user forced opposite filter

    return applySearch(base);
    // eslint-disable-next-line
  }, [volunteers, search, statusFilter]);

  const readFiltered = useMemo(() => {
    let base = volunteers?.filter((v) => v.isRead) ?? [];

    if (statusFilter === "unread") return [];

    return applySearch(base);
    // eslint-disable-next-line
  }, [volunteers, search, statusFilter]);

  const allFiltered = useMemo(
    () => applySearch(volunteers ?? []),
    // eslint-disable-next-line
    [volunteers, search],
  );

  const columns = [
    {
      title: "",
      key: "actions",
      width: 50,
      render: (_, record) => (
        <div
          style={{ display: "flex", gap: 6, cursor: "default" }}
          onClick={(e) => e.stopPropagation()} // prevents row click
        >
          <Tooltip title={record.isStarred ? "Unstar" : "Star"}>
            <Button
              type="text"
              className="star-btn"
              style={btnStyle}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClick("toggle-star", record);
              }}
            >
              {record.isStarred ? (
                <StarFilled style={{ color: "#f39c12" }} />
              ) : (
                <StarOutlined />
              )}
            </Button>
          </Tooltip>

          <Tooltip title={record.isRead ? "Mark as Unread" : "Mark as Read"}>
            <Button
              type="text"
              className="read-btn"
              style={btnStyle}
              onClick={(e) => {
                e.stopPropagation();
                handleMenuClick("toggle-read", record);
              }}
            >
              {!record.isRead ? (
                <CarryOutOutlined style={{ color: "#27ae60" }} />
              ) : (
                <MailOutlined />
              )}
            </Button>
          </Tooltip>
        </div>
      ),
    },
    {
      title: "Full Name",
      key: "volunteer",
      width: 170,
      ellipsis: true,
      render: (_, record) => {
        const initials = record.fullName
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <Avatar
              size={28}
              style={{
                background: `linear-gradient(135deg, ${primary} 0%, #a066bc 100%)`,
                fontSize: 13,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {initials}
            </Avatar>
            <div>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 13,
                  fontWeight: record.isRead ? 500 : 700,
                  color: "#1a1a1a",
                  margin: 0,
                }}
              >
                {record.fullName}
              </p>
              <p
                style={{
                  fontFamily: "'Outfit', sans-serif",
                  fontSize: 11,
                  color: "#999",
                  margin: 0,
                }}
              >
                {record.email}
              </p>
            </div>
          </div>
        );
      },
    },
    {
      title: "Message",
      dataIndex: "message",
      ellipsis: true,
      render: (msg) => (
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            color: "#3f3c3c",
            fontStyle: msg ? "normal" : "italic",
          }}
        >
          {msg || "No message"}
        </span>
      ),
    },
    {
      title: "Received",
      dataIndex: "createdAt",
      width: 90,
      render: (date) => (
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            color: "#999",
          }}
        >
          {new Date(date).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })}
        </span>
      ),
    },
  ];

  const items = [
    {
      key: "unread",
      styles: panelStyles,
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#555",
            }}
          >
            Unread
          </span>
        </div>
      ),
      children: (
        <RenderTable
          openModal={openModal}
          loading={loading}
          columns={columns}
          filtered={unreadFiltered}
          emptyMessage={
            search
              ? "No unread submissions match your search"
              : "No unread submissions"
          }
        />
      ),
    },
    {
      key: "read",
      styles: panelStyles,
      label: (
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#555",
            }}
          >
            Read
          </span>
        </div>
      ),
      children: (
        <RenderTable
          openModal={openModal}
          loading={loading}
          columns={columns}
          filtered={readFiltered}
          emptyMessage={
            search
              ? "No read submissions match your search"
              : "No read submissions"
          }
        />
      ),
    },
  ];

  const totalFiltered = volunteers.length;
  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ padding: "0 0 40px", fontFamily: "'Outfit', sans-serif" }}>
        {/* ── Header ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            gap: 12,
          }}
        >
          <div>
            <h2
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "1.4rem",
                fontWeight: 700,
                color: "#1a1a1a",
                margin: "0 0 2px",
              }}
            >
              Volunteers
            </h2>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "#999",
                margin: 0,
              }}
            >
              Manage volunteer submissions from the website.
            </p>
          </div>
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              onClick={refresh}
              style={{
                borderRadius: 8,
                borderColor: "rgba(133,74,154,0.2)",
                color: primary,
              }}
            />
          </Tooltip>
        </div>

        {/* ── Stats ── */}
        <div style={{ display: "flex", gap: 14, marginBottom: 24 }}>
          <VolunteerStatCard
            icon={<TeamOutlined />}
            value={volunteers?.length ?? 0}
            label="Total"
            color={primary}
          />
          <VolunteerStatCard
            icon={<ClockCircleOutlined />}
            value={unread}
            label="Unread"
            color={accent}
            sub={
              unread > 0
                ? `needs attention`
                : ""
            }
          />
          <VolunteerStatCard
            icon={<CheckCircleOutlined />}
            value={read}
            label="Read"
            color="#27ae60"
          />{" "}
          <VolunteerStatCard
            icon={<StarFilled />}
            value={starred}
            label="Starred"
            color="#f39c12"
          />
        </div>

        {/* ── Filters ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid rgba(133,74,154,0.08)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            padding: "14px 20px",
            marginBottom: 16,
            display: "flex",
            alignItems: "center",
          }}
        >
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name, email, message…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            size="large"
            style={{ width: "100%", maxWidth: 1200 }}
          />
        </div>

        {/* ── Table ── */}
        <div
          style={{
            background: "#fff",
            border: "1px solid rgba(133,74,154,0.08)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            overflow: "hidden",
            borderRadius: 12,
          }}
        >
          {/* Row count */}
          <div
            style={{
              padding: "8px 20px",
              borderBottom: "1px solid rgba(133,74,154,0.07)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                color: "#bbb",
                margin: 0,
              }}
            >
              Showing <strong style={{ color: "#666" }}>{totalFiltered}</strong>{" "}
              submissions
            </p>
          </div>

          {search ? (
            <RenderTable
              openModal={openModal}
              loading={loading}
              columns={columns}
              filtered={allFiltered}
              emptyMessage={"No submissions match your search"}
            />
          ) : (
            <Collapse
              accordion
              items={items}
              activeKey={activePanel}
              onChange={(key) => setActivePanel(key)}
              className="vol-collapse"
              style={{ padding: 0, border: "none" }}
            />
          )}
        </div>
      </div>

      <DetailsModal
        component={<VolunteerDetail volunteer={selected} />}
        open={open}
        setOpen={setOpen}
        refresh={refresh}
      />
    </>
  );
}

export default Volunteers;
