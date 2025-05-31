import React from "react";

const VoteSection = () => {
  return (
    <div className="p-4 bg-white rounded shadow mt-4">
      <h2 className="text-lg font-bold mb-2">Voting</h2>
      <button className="bg-purple-500 text-white px-4 py-2 rounded mr-2">👍</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded">👎</button>
    </div>
  );
};

export default VoteSection;
