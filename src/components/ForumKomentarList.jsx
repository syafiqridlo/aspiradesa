//src/components/forumkomentarlist.jsx
import React from "react";

const ForumKomentarList = ({ comments }) => {
  if (!comments?.length) return <p className="text-sm text-gray-500">Belum ada komentar.</p>;

  return (
    <div className="mt-2 space-y-1">
      {comments.map((komentar) => (
        <div key={komentar.id} className="text-sm text-gray-700 border-t pt-1">
          <strong>{komentar.author}:</strong> {komentar.isi}
        </div>
      ))}
    </div>
  );
};

export default ForumKomentarList;
