const cds = require("@sap/cds");

module.exports = (srv) => {
  const { Answer, Thread } = cds.entities("ForumApplication");
  srv.on("upvote", async (req) => {
    const { ID } = req.data;
    const tx = cds.transaction(req);
    await tx.run(
      UPDATE(Thread)
        .set({ Upvotes: { "+=": 1 } })
        .where({ ID })
    );
    return {
      code: 200,
      message: "Thread upvoted successfully",
      status: "SUCCESS",
    };
  });

  srv.on("downVote", async (req) => {
    const { ID } = req.data;
    const tx = cds.transaction(req);
    await tx.run(
      UPDATE(Thread)
       .set({ DownVotes: { "+=": 1 } })
        .where({ ID })
    );
    return { 
      code: 200,
      message: "Thread downVote successfully",
      status: "SUCCESS",
    };
  });

  srv.on("deleteThread", async (req) => {
    const { ID } = req.data;
    console.log("ThreadId:", ID);
    const tx = cds.transaction(req);

    const hasAnswers = await tx.read(Answer).where({ thread_ID: ID });
    if (hasAnswers.length > 0) {
      req.reject(400, "Cannot delete a thread that has answers");
    } else {
      await tx.run(DELETE.from(Thread).where({ ID }));
      return {
        code: 200,
        message: "Thread deleted successfully",
        status: "SUCCESS",
      };
    }
  });

  srv.on('isDeleted', async(req) => {
    const {ID} = req.data;
    const tx = cds.transaction(req);
    const data = await tx.read(Answer).where({ID})
   const isDeleted = data.map((t) => {
      return t.IsDeleted
    })

    if(isDeleted[0] === true) req.reject(400, 'Not found')
    await tx.run(
      UPDATE (Answer) 
      .set({IsDeleted: true})
      .where({ID})
    );
    return {
      code: 200,
      message: "Thread Answer deleted successfully",
      status: "SUCCESS",
    };
  })

  // update the data 
  srv.on("isUpdated", async (req) => {
    const { ID,Content } = req.data;
    const tx = cds.transaction(req);
   const result = await tx.run(
      UPDATE(Answer)
        .set({Content})
        .where({ ID })
    );
    console.log("data", result, Content)
    return {
      code: 200,
      message: "Answer updated successfully..",
      status: "SUCCESS",
    };
  });
};
