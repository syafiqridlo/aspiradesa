// src/components/ForumList.jsx
import React from "react";

const ForumList = ({ threads, onSelect }) => {
  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Forum Diskusi</h2>

      {threads.length === 0 ? (
        <p className="text-gray-500">Belum ada topik diskusi.</p>
      ) : (
       threads.map((thread) => {
  const author = thread.comments?.[0]?.author || "Anonim";
  const createdAt = new Date(thread.created_at).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div
      key={thread.id}
      onClick={() => onSelect(thread)}
      className="p-3 border-b hover:bg-gray-100 cursor-pointer"
    >
      <h3 className="font-bold text-blue-700">{thread.title}</h3>
      <p className="text-sm text-gray-600">{author} • {createdAt}</p>
      <p className="text-gray-700 mt-1 line-clamp-2">
        {thread.preview || thread.comments?.[0]?.isi || "Belum ada komentar"}
      </p>
    </div>
  );
})

      )}
    </div>
  );
};

export default ForumList;
