import { Button, Divider } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import { primary, primaryDim, Masonry, MediaCard } from "../utils/uiHelpers";
import { useNavigate } from "react-router-dom";

export function AlbumDetail({ album, setDeleteTarget }) {
  const navigate = useNavigate();

  if (!album) return null;

  const date = new Date(album.createdAt).toLocaleDateString("en-KE", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  const time = new Date(album.createdAt).toLocaleTimeString("en-KE", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div style={{ fontFamily: "'Outfit', sans-serif" }}>
      {/* Cover */}
      <div
        style={{
          position: "relative",
          height: 200,
          background: "#0d0814",
          overflow: "hidden",
        }}
      >
        {album.cover ? (
          <img
            src={album.cover}
            alt={album.title}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: primaryDim,
            }}
          >
            <FileImageOutlined style={{ color: primary, fontSize: 40 }} />
          </div>
        )}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to top, rgba(5,2,14,0.8) 0%, transparent 60%)",
          }}
        />
        <div style={{ position: "absolute", bottom: 16, left: 20 }}>
          <h3
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: "1.2rem",
              fontWeight: 800,
              color: "#fff",
              margin: 0,
            }}
          >
            {album.title}
          </h3>
        </div>
      </div>

      <div style={{ padding: "20px 24px 2px" }}>
        {album.description && (
          <p
            style={{
              fontFamily: "'Outfit', sans-serif",
              fontSize: 13,
              color: "#666",
              lineHeight: 1.7,
              margin: "0 0 18px",
            }}
          >
            {album.description}
          </p>
        )}

        <Divider
          style={{ borderColor: "rgba(133,74,154,0.1)", margin: "0 0 16px" }}
        />

        <div style={{ marginTop: 10, width: "100%" }}>
          <h3>Media</h3>
          <Masonry
            items={album.media.slice(0, 4)}
            columns={4}
            gap={14}
            renderItem={(item) => (
              <div key={item._id}>
                <MediaCard
                  item={item}
                  onDelete={() => setDeleteTarget(item._id)}
                />
              </div>
            )}
          />
        </div>

        <Divider
          style={{ borderColor: "rgba(133,74,154,0.1)", margin: "0 0 16px" }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            {[
              {
                label: "Created",
                value: `${date} at ${time}`,
              },
            ].map(({ icon, label, value }) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "8px 10px",
                  borderRadius: 7,
                  marginBottom: 2,
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = primaryDim)
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "transparent")
                }
              >
                <span
                  style={{
                    color: primary,
                    fontSize: 13,
                    marginTop: 2,
                    flexShrink: 0,
                  }}
                >
                  {icon}
                </span>
                <div>
                  <p
                    style={{
                      fontFamily: "'Outfit', sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.08em",
                      textTransform: "uppercase",
                      color: "#bbb",
                      margin: "0 0 1px",
                    }}
                  >
                    {label}
                  </p>
                  <p
                    style={{
                      fontSize: label === "ID" ? 11 : 13,
                      fontWeight: 500,
                      color: "#333",
                      margin: 0,
                      fontFamily:
                        label === "ID"
                          ? "'Courier New', monospace"
                          : "'Outfit', sans-serif",
                    }}
                  >
                    {value}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div>
            <Button
              type="primary"
              onClick={() => {
                navigate(`/media/album/${album._id}`);
              }}
            >
              Open Album
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
