import React, { useState } from "react";
import { Button, Tooltip, Empty, Divider } from "antd";
import {
  GlobalOutlined,
  EditOutlined,
  ReloadOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  primary,
  globalStyles,
  green,
  WebsitePageCardSkeleton,
  WebsitePageCard,
} from "../utils/uiHelpers";
import useFetchWebsite from "../hooks/fetchWebsite";
import EditHeroModal from "../components/EditHero";
import DetailsModal from "../components/DetailsModal";

// ── Main ─────────────────────────────────────────────────────────
function Webpage() {
  const { website, loading, refresh } = useFetchWebsite();
  const [editing, setEditing] = useState(null);
  const [editOpen, setEditOpen] = useState(false);

  const openEdit = (page) => {
    setEditing(page);
    setEditOpen(true);
  };

  return (
    <>
      <style>{globalStyles}</style>
      <div style={{ padding: "0 0 48px", fontFamily: "'Outfit', sans-serif" }}>
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
              Website Pages
            </h2>
            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 13,
                color: "#999",
                margin: 0,
              }}
            >
              Manage hero images for each page of the Toto Kalezi website.
            </p>
          </div>
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              onClick={() => refresh()}
              style={{
                borderRadius: 8,
                borderColor: "rgba(133,74,154,0.2)",
                color: primary,
              }}
            />
          </Tooltip>
        </div>

        {/* ── Stats bar ── */}
        {!loading && website.length > 0 && (
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              border: "1px solid rgba(133,74,154,0.08)",
              boxShadow: "0 2px 10px rgba(0,0,0,0.04)",
              padding: "14px 20px",
              marginBottom: 24,
              display: "flex",
              alignItems: "center",
              gap: 24,
              animation: "fadeUp 0.4s ease both",
            }}
          >
            {[
              {
                label: "Total Pages",
                value: website.length,
                color: primary,
                icon: <GlobalOutlined />,
              },
              {
                label: "With Hero Images",
                value: website.filter((p) => p.heroImg).length,
                color: green,
                icon: <PictureOutlined />,
              },
            ].map(({ label, value, color, icon }) => (
              <div
                key={label}
                style={{ display: "flex", alignItems: "center", gap: 10 }}
              >
                <div
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 8,
                    background: `${color}18`,
                    border: `1px solid ${color}28`,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color,
                    fontSize: 15,
                  }}
                >
                  {icon}
                </div>
                <div>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: "1.1rem",
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
                      fontSize: 10,
                      fontWeight: 600,
                      color: "#aaa",
                      margin: "2px 0 0",
                      letterSpacing: "0.06em",
                      textTransform: "uppercase",
                    }}
                  >
                    {label}
                  </p>
                </div>
              </div>
            ))}

            <Divider
              orientation="vertical"
              style={{
                height: 32,
                borderColor: "rgba(133,74,154,0.12)",
                margin: "0 4px",
              }}
            />

            <p
              style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: 12,
                color: "#bbb",
                margin: 0,
              }}
            >
              Click the <EditOutlined style={{ color: primary }} /> icon on any
              page card to update its hero image.
            </p>
          </div>
        )}

        {/* ── Grid ── */}
        {loading ? (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {[1, 2, 3].map((i) => (
              <WebsitePageCardSkeleton key={i} />
            ))}
          </div>
        ) : website.length === 0 ? (
          <div
            style={{
              background: "#fff",
              borderRadius: 14,
              border: "1px solid rgba(133,74,154,0.08)",
              boxShadow: "0 2px 12px rgba(0,0,0,0.05)",
              padding: "60px 20px",
            }}
          >
            <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={
                <span
                  style={{ fontFamily: "'Outfit', sans-serif", color: "#bbb" }}
                >
                  No pages found
                </span>
              }
            />
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
              gap: 16,
            }}
          >
            {website.map((page, i) => (
              <div key={page._id} style={{ animationDelay: `${i * 60}ms` }}>
                <WebsitePageCard page={page} onEdit={openEdit} />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Edit modal ── */}
      {editing && (
        <DetailsModal
          open={editOpen}
          setOpen={setEditOpen}
          component={
            <EditHeroModal
              page={editing}
              open={editOpen}
              onClose={() => {
                setEditOpen(false);
                setEditing(null);
              }}
              onSaved={refresh}
            />
          }
        />
      )}
    </>
  );
}

export default Webpage;
