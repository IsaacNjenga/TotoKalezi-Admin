import { useState, useMemo } from "react";
import { Table, Avatar, Button, Input, Tooltip, Empty } from "antd";
import {
  SearchOutlined,
  ReloadOutlined,
  DollarOutlined,
  TeamOutlined,
  RiseOutlined,
} from "@ant-design/icons";
import useFetchAllDonations from "../hooks/fetchAllDonations";
import LoadingComponent from "../components/LoadingComponent";
import { globalStyles, primary, green } from "../utils/uiHelpers";
import DetailsModal from "../components/DetailsModal";
import DonationsPreview from "../components/DonationsPreview";
import { format } from "date-fns";

function StatCard({ icon, value, label, color, sub }) {
  return (
    <div
      style={{
        background: "#fff",
        borderRadius: 12,
        border: "1px solid rgba(133,74,154,0.08)",
        boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
        padding: "16px 20px",
        display: "flex",
        alignItems: "center",
        gap: 14,
        flex: 1,
        cursor: "default",
        transition: "all 0.25s ease",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          borderRadius: 10,
          flexShrink: 0,
          background: `${color}18`,
          border: `1px solid ${color}33`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color,
          fontSize: 18,
        }}
      >
        {icon}
      </div>
      <div>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: "1.35rem",
            fontWeight: 700,
            color: "#1a1a1a",
            margin: 0,
            lineHeight: 1,
          }}
        >
          {value}
        </p>
        <p
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 11,
            fontWeight: 600,
            color: "#aaa",
            margin: "4px 0 0",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </p>
        {sub && (
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 11,
              color,
              margin: "2px 0 0",
              fontWeight: 500,
            }}
          >
            {sub}
          </p>
        )}
      </div>
    </div>
  );
}

function RenderTable({ openModal, loading, columns, filtered, emptyMessage }) {
  return (
    <Table
      className="don-table"
      loading={loading}
      dataSource={filtered}
      columns={columns}
      showHeader={false}
      size="small"
      rowKey="_id"
      pagination={{
        pageSize: 10,
        size: "small",
        showSizeChanger: true,
        showTotal: (total) => (
          <span
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 12,
              color: "#656464",
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
                style={{ fontFamily: "'Outfit', sans-serif", color: "#bbb" }}
              >
                {emptyMessage || "No donations found"}
              </span>
            }
          />
        ),
      }}
    />
  );
}

function Donations() {
  const { donations, loading, refresh } = useFetchAllDonations();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [open, setOpen] = useState(false);

  const totalKES = useMemo(
    () => donations?.reduce((sum, d) => sum + (d.amount || 0), 0) ?? 0,
    [donations],
  );
  const avgKES = useMemo(
    () => (donations?.length ? Math.round(totalKES / donations.length) : 0),
    [donations, totalKES],
  );
  const topDonor = useMemo(() => {
    if (!donations?.length) return null;
    return donations.reduce(
      (top, d) => (d.amount > (top?.amount ?? 0) ? d : top),
      null,
    );
  }, [donations]);

  const openModal = (record) => {
    setSelected(record);
    setOpen(true);
  };

  const applySearch = (data) => {
    if (!search.trim()) return data;
    const q = search.toLowerCase();
    return data.filter(
      (d) =>
        d.name?.toLowerCase().includes(q) ||
        d.email?.toLowerCase().includes(q) ||
        d.message?.toLowerCase().includes(q) ||
        d.transactionID?.toLowerCase().includes(q),
    );
  };

  const allFiltered = useMemo(
    () => applySearch(donations ?? []),
    // eslint-disable-next-line
    [donations, search],
  );

  const columns = [
    {
      key: "donor",
      width: 180,
      ellipsis: true,
      render: (_, record) => {
        const initials = record.name
          ?.split(" ")
          .map((n) => n[0])
          .join("")
          .toUpperCase()
          .slice(0, 2);
        return (
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Avatar
              size={28}
              style={{
                background: `linear-gradient(135deg, ${primary} 0%, #a066bc 100%)`,
                fontSize: 11,
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
                {record.name}
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
      key: "amount",
      width: 100,
      render: (_, record) => (
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 13,
            fontWeight: 700,
            color: green,
          }}
        >
          KES {record.amount?.toLocaleString()}
        </span>
      ),
    },
    {
      key: "txn",
      ellipsis: true,
      width: 200,
      render: (_, record) => (
        <span
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            color: "#aaa",
            letterSpacing: "0.03em",
          }}
        >
          {record.transactionID}
        </span>
      ),
    },
    {
      key: "message",
      ellipsis: true,
      render: (_, record) => (
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            color: "#777",
            fontStyle: record.message ? "normal" : "italic",
          }}
        >
          {record.message || "No message"}
        </span>
      ),
    },
    {
      key: "date",
      width: 180,
      render: (_, record) => (
        <span
          style={{
            fontFamily: "'Outfit', sans-serif",
            fontSize: 12,
            color: "#bbb",
          }}
        >
          {format(new Date(record.createdAt), "PPpp")}
          {/* {new Date(record.createdAt).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          })} */}
        </span>
      ),
    },
  ];

  if (loading) return <LoadingComponent />;

  const totalFiltered = allFiltered.length;

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
              Donations
            </h2>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "#999",
                margin: 0,
              }}
            >
              Track and manage all incoming donations.
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
        <div
          style={{
            display: "flex",
            gap: 14,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          <StatCard
            icon={<TeamOutlined />}
            value={donations?.length ?? 0}
            label="Total Donors"
            color={primary}
          />
          <StatCard
            icon={<DollarOutlined />}
            value={`KES ${totalKES.toLocaleString()}`}
            label="Total Raised"
            color={green}
            sub={`Avg. KES ${avgKES.toLocaleString()} per donation`}
          />
          <StatCard
            icon={<RiseOutlined />}
            value={topDonor ? `KES ${topDonor.amount?.toLocaleString()}` : "—"}
            label="Top Donation"
            color="#3498db"
            sub={topDonor?.name ?? ""}
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
          <Input
            prefix={<SearchOutlined />}
            placeholder="Search by name, email, txn ID…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            allowClear
            size="large"
            style={{ width: "100%", maxWidth: 1200 }}
          />
        </div>

        {/* ── Table card ── */}
        <div
          style={{
            background: "#fff",
            borderRadius: 12,
            border: "1px solid rgba(133,74,154,0.08)",
            boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
            overflow: "hidden",
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
              donations
            </p>
          </div>

          <RenderTable
            openModal={openModal}
            loading={loading}
            columns={columns}
            filtered={allFiltered}
            emptyMessage="No donations match your search"
          />
        </div>
      </div>

      <DetailsModal
        component={<DonationsPreview donation={selected} />}
        open={open}
        setOpen={setOpen}
        refresh={refresh}
      />
    </>
  );
}

export default Donations;
