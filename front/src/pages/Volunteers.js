import { useState, useMemo } from "react";
import {
  Table,
  Tag,
  Avatar,
  Button,
  Input,
  Select,
  Tooltip,
  Badge,
  Empty,
} from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DeleteOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  ReadOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import useFetchAllVolunteers from "../hooks/fetchVolunteers";
import LoadingComponent from "../components/LoadingComponent";
import {
  globalStyles,
  primary,
  accent,
  accentDim,
  VolunteerStatCard,
} from "../utils/uiHelpers";
import VolunteerDetail from "../components/VolunteerPreview";
import DetailsModal from "../components/DetailsModal";

function Volunteers() {
  const { volunteers, loading, refresh } = useFetchAllVolunteers();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const unread = useMemo(
    () => volunteers?.filter((v) => !v.isRead).length ?? 0,
    [volunteers],
  );
  const read = useMemo(
    () => volunteers?.filter((v) => v.isRead).length ?? 0,
    [volunteers],
  );

  const filtered = useMemo(() => {
    let base = volunteers ?? [];
    if (statusFilter === "unread") base = base.filter((v) => !v.isRead);
    if (statusFilter === "read") base = base.filter((v) => v.isRead);
    if (search.trim()) {
      const q = search.toLowerCase();
      base = base.filter(
        (v) =>
          v.fullName?.toLowerCase().includes(q) ||
          v.email?.toLowerCase().includes(q) ||
          v.message?.toLowerCase().includes(q),
      );
    }
    return base;
  }, [volunteers, search, statusFilter]);

  const openModal = (record) => {
    setSelected(record);
    setOpen(true);
  };

  const columns = [
    {
      title: "Full Name",
      key: "volunteer",
      width: 260,
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
              size={36}
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
            color: "#777",
            fontStyle: msg ? "normal" : "italic",
          }}
        >
          {msg || "No message"}
        </span>
      ),
    },
    {
      title: "Status",
      dataIndex: "isRead",
      width: 110,
      render: (isRead) => (
        <Tag
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 10,
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            padding: "2px 10px",
            borderRadius: 20,
            border: isRead
              ? "1px solid rgba(39,174,96,0.25)"
              : `1px solid rgba(254,165,73,0.3)`,
            background: isRead ? "rgba(39,174,96,0.08)" : accentDim,
            color: isRead ? "#27ae60" : accent,
          }}
        >
          {isRead ? "Read" : "Unread"}
        </Tag>
      ),
    },
    {
      title: "Received",
      dataIndex: "createdAt",
      width: 140,
      render: (date) => (
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            color: "#999",
          }}
        >
          {new Date(date).toLocaleDateString("en-KE", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      width: 100,
      render: (_, record) => (
        <div style={{ display: "flex", gap: 6 }}>
          <Tooltip title="Delete">
            <button
              className="delete-btn"
              style={{
                width: 30,
                height: 30,
                borderRadius: 7,
                border: "1px solid rgba(231,76,60,0.18)",
                background: "transparent",
                color: "#e74c3c",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                fontSize: 14,
                transition: "all 0.2s ease",
                padding: 0,
              }}
            >
              <DeleteOutlined />
            </button>
          </Tooltip>
        </div>
      ),
    },
  ];

  if (loading) return <LoadingComponent />;

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
            sub={unread > 0 ? `${unread} need attention` : "All caught up"}
          />
          <VolunteerStatCard
            icon={<ReadOutlined />}
            value={read}
            label="Read"
            color="#27ae60"
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
            justifyContent: "space-between",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <FilterOutlined style={{ color: primary, fontSize: 14 }} />
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                color: "#888",
                margin: 0,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              Filters
            </p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div className="search-wrap">
              <Input
                prefix={<SearchOutlined />}
                placeholder="Search by name, email, message…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                allowClear
                style={{ width: 260 }}
              />
            </div>
            <Select
              className="filter-select"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 140 }}
              options={[
                { label: "All submissions", value: "all" },
                { label: "Unread only", value: "unread" },
                { label: "Read only", value: "read" },
              ]}
            />
          </div>
        </div>

        {/* ── Table ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 14,
            border: "1px solid rgba(133,74,154,0.08)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            overflow: "hidden",
          }}
        >
          {/* Row count */}
          <div
            style={{
              padding: "12px 20px",
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
              Showing{" "}
              <strong style={{ color: "#666" }}>{filtered.length}</strong> of{" "}
              <strong style={{ color: "#666" }}>
                {volunteers?.length ?? 0}
              </strong>{" "}
              submissions
            </p>
            {unread > 0 && (
              <Badge
                count={`${unread} unread`}
                style={{
                  background: accentDim,
                  color: accent,
                  border: `1px solid rgba(254,165,73,0.3)`,
                  fontFamily: "'Outfit', sans-serif",
                  fontWeight: 600,
                  fontSize: 10,
                  boxShadow: "none",
                }}
              />
            )}
          </div>

          <Table
            className="vol-table"
            dataSource={filtered}
            columns={columns}
            rowKey="_id"
            pagination={{
              pageSize: 10,
              showSizeChanger: false,
              showTotal: (total) => (
                <span
                  style={{
                    fontFamily: "'Outfit', sans-serif",
                    fontSize: 12,
                    color: "#888585",
                  }}
                >
                  {total} total
                </span>
              ),
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
                      No volunteers found
                    </span>
                  }
                />
              ),
            }}
          />
        </div>
      </div>

      <DetailsModal
        component={<VolunteerDetail volunteer={selected} />}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}

export default Volunteers;
