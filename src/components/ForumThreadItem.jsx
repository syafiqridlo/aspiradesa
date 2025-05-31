import React, { useState } from "react";
import ForumKomentarList from "./ForumKomentarList";
import ForumKomentarForm from "./ForumKomentarForm";

const ForumThreadItem = ({ thread }) => {
  const [showKomentar, setShowKomentar] = useState(false);
  const [comments, setComments] = useState(thread.comments || []);

  const refreshComments = async () => {
    // Optional: Fetch ulang komentar dari backend jika mau live update
  };

  const toggleKomentar = () => setShowKomentar(!showKomentar);

  return (
    <li className="bg-white dark:bg-gray-800 shadow-md rounded p-4">
      <h3 className="text-lg font-semibold">{thread.title}</h3>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Dibuat pada{" "}
        {new Date(thread.created_at).toLocaleDateString("id-ID", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>
      <p className="mt-2">{comments.length} komentar</p>

      <button
        onClick={toggleKomentar}
        className="text-blue-600 dark:text-blue-400 text-sm mt-2"
      >
        {showKomentar ? "Sembunyikan Komentar" : "Lihat & Balas"}
      </button>

      {showKomentar && (
        <div className="mt-3 border-t pt-3">
          <ForumKomentarList comments={comments} />
          <ForumKomentarForm
            threadId={thread.id}
            onSuccess={() => {
              // Tambahkan dummy refresh atau fetch ulang jika mau
              if (onSuccess) onSuccess(); // atau pakai refetch function
            }}
          />
        </div>
      )}
    </li>
  );
};

export default ForumThreadItem;
