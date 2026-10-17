import React from "react";

export default function StatusBadge({ status }) {
  if (!status) return null;

  const normalized = status.toLowerCase();

  // Color mapping from PRD Bab 5.2:
  // Menunggu, Dikumpulkan: #F59E0B
  // Aktif, Dinilai: #15A66A
  // Ditolak, Terlambat: #E53935
  // Belum dikumpulkan: #6B7280

  let style = {
    backgroundColor: "#F3F4F6",
    color: "#6B7280",
    border: "1px solid #E5E7EB",
  };

  if (normalized === "menunggu" || normalized === "dikumpulkan") {
    style = {
      backgroundColor: "#FEF3C7",
      color: "#B45309",
      border: "1px solid #FDE68A",
    };
  } else if (normalized === "aktif" || normalized === "dinilai") {
    style = {
      backgroundColor: "#D1FAE5",
      color: "#065F46",
      border: "1px solid #A7F3D0",
    };
  } else if (normalized === "ditolak" || normalized === "terlambat") {
    style = {
      backgroundColor: "#FEE2E2",
      color: "#991B1B",
      border: "1px solid #FECACA",
    };
  } else if (normalized === "belum dikumpulkan") {
    style = {
      backgroundColor: "#F3F4F6",
      color: "#4B5563",
      border: "1px solid #E5E7EB",
    };
  }

  // Format label capital first
  const displayLabel = status.charAt(0).toUpperCase() + status.slice(1);

  return (
    <span
      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold tracking-wide"
      style={style}
    >
      <span
        className="w-1.5 h-1.5 rounded-full mr-1.5"
        style={{
          backgroundColor:
            normalized === "menunggu" || normalized === "dikumpulkan"
              ? "#F59E0B"
              : normalized === "aktif" || normalized === "dinilai"
              ? "#15A66A"
              : normalized === "ditolak" || normalized === "terlambat"
              ? "#E53935"
              : "#6B7280",
        }}
      />
      {displayLabel}
    </span>
  );
}
