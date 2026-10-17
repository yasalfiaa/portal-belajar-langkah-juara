import React from "react";
import { AlertCircle, FolderOpen, RefreshCw } from "lucide-react";

export function EmptyState({ title = "Belum Ada Data", message, actionText, onAction, icon: Icon = FolderOpen }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-8 sm:p-12 text-center max-w-md mx-auto my-6 shadow-xs">
      <div className="w-14 h-14 bg-orange-50 text-[#EA580C] rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-100">
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-base font-bold text-[#1F2937] mb-1">{title}</h3>
      {message && <p className="text-sm text-[#5A6B78] mb-6 leading-relaxed">{message}</p>}
      {actionText && onAction && (
        <button
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#EA580C] hover:bg-[#c2410c] text-white text-sm font-semibold transition-colors shadow-sm shadow-[#EA580C]/20"
        >
          {actionText}
        </button>
      )}
    </div>
  );
}

export function ErrorState({ message = "Gagal memuat data", onRetry }) {
  return (
    <div className="bg-white rounded-2xl border border-red-200 p-8 text-center max-w-md mx-auto my-6">
      <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center mx-auto mb-3">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="text-base font-bold text-red-900 mb-1">Terjadi Kesalahan</h3>
      <p className="text-sm text-red-700 mb-5">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-300 bg-white hover:bg-red-50 text-red-700 text-sm font-semibold transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Coba lagi
        </button>
      )}
    </div>
  );
}

export function LoadingState({ text = "Memuat data..." }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-200/80 p-12 text-center max-w-md mx-auto my-6">
      <div className="w-10 h-10 border-3 border-orange-200 border-t-[#EA580C] rounded-full animate-spin mx-auto mb-4" />
      <p className="text-sm font-medium text-[#5A6B78]">{text}</p>
    </div>
  );
}
