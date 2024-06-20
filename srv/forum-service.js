
const cds = require("@sap/cds");

const upvoteHandler = async (req) => {
  const  ID  = req.data.ID
  await UPDATE("ForumApplication.Thread")
      .set({ Upvotes: { "+=": 1 } })
      .where({ ID })
  
  return {
    code: 200,
    message: "Thread upvoted successfully",
    status: "SUCCESS",
  };
};

const downVoteHandler = async (req) => {
  const { ID } = req.data;
   await UPDATE("ForumApplication.Thread")
      .set({ DownVotes: { "+=": 1 } })
      .where({ ID })
  return { 
    code: 200,
    message: "Thread downVote successfully",
    status: "SUCCESS",
  };
};

const deleteThreadHandler = async (req) => {
  const { ID } = req.data;
  const hasAnswers = await SELECT.from("ForumApplication.Answer").where({ID})
  if (hasAnswers.length > 0) {
    req.reject(400, "Cannot delete a thread that has answers");
  } else {
     await DELETE.from("ForumApplication.Thread").where({ ID });
    return {
      code: 200,
      message: "Thread deleted successfully",
      status: "SUCCESS",
    };
  }
};

const isDeletedHandler = async (req) => {
  const { ID } = req.data;
  const data = await SELECT.from("ForumApplication.Answer").where({ID})
  const isDeleted = data.map((t) => t.IsDeleted);

  if (isDeleted[0] === true) req.reject(400, 'Not found');
   await UPDATE("ForumApplication.Answer")
      .set({ IsDeleted: true })
      .where({ ID })
  return {
    code: 200,
    message: "Thread Answer deleted successfully",
    status: "SUCCESS",
  };
};

const isUpdatedHandler = async (req) => {
  const { ID, Content } = req.data;
   await UPDATE("ForumApplication.Answer")
      .set({ Content })
      .where({ ID })
  return {
    code: 200,
    message: "Answer updated successfully.",
    status: "SUCCESS",
  };
};

module.exports = (srv) => {
  srv.on("upvote", upvoteHandler);
  srv.on("downVote", downVoteHandler);
  srv.on("deleteThread", deleteThreadHandler);
  srv.on("isDeleted", isDeletedHandler);
  srv.on("isUpdated", isUpdatedHandler);
};

// Export handlers for testing
module.exports.upvoteHandler = upvoteHandler;
module.exports.downVoteHandler = downVoteHandler;
module.exports.deleteThreadHandler = deleteThreadHandler;
module.exports.isDeletedHandler = isDeletedHandler;
module.exports.isUpdatedHandler = isUpdatedHandler;
