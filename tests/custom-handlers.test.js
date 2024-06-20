const cds = require('@sap/cds');
const { upvoteHandler,downVoteHandler,deleteThreadHandler,isDeletedHandler,isUpdatedHandler } = require('../srv/forum-service');
const cdsTestInstance = cds.test("serve", "--port", 5000).in(__dirname + "/..");

describe('Forum app handlers', () => {
  const MockReq = {
    data:{
      ID : "ebf9ae9c-0439-4eaa-85b6-4b9d8c4b0d80"
    }
 
}
    it('upvote handler', async ()=>{
    const result = await upvoteHandler(MockReq)
    expect(result.code).toEqual(200)
    expect(result.message).toEqual("Thread upvoted successfully")
    expect(result.status).toEqual("SUCCESS")
    })

    it('downVote handler',async ()=>{
      const result  = await downVoteHandler(MockReq)
      expect(result.code).toEqual(200)
      expect(result.message).toEqual("Thread downVote successfully")
      expect(result.status).toEqual("SUCCESS")
    })

    it('delete thread handler', async ()=>{
      const result = await deleteThreadHandler(MockReq)
      expect(result.code).toEqual(200)
      expect(result.message).toEqual("Thread deleted successfully")
      expect(result.status).toEqual("SUCCESS")
    })

    // it("Should not delete Thread with answers",async()=>{
    //   const mockSelect = jest.fn();
    //   const mock = {
    //     data:{
    //       ID:"ebf9ae9c-0439-4eaa-85b6-4b9d8c4b0d80"
    //     },
    //     reject:jest.fn()
    //   }
    //   mockSelect.mockResolvedValue([{ answer: "Answer 1" }, { answer: "Answer 2" }]);
    //   await deleteThreadHandler(mock);
    //   expect(mock.reject).toHaveBeenCalledWith(400, "Cannot delete a thread that has answers");
    // })

    it('Is deleted handler',async ()=>{
      const result = await isDeletedHandler(MockReq)
      expect(result.code).toEqual(200)
      expect(result.message).toEqual("Thread Answer deleted successfully")
      expect(result.status).toEqual("SUCCESS")
    })

    it("isUpdatedHandler",async ()=>{
      const result = await isUpdatedHandler(MockReq)
      expect(result.code).toEqual(200)
      expect(result.message).toEqual("Answer updated successfully.")
      expect(result.status).toEqual("SUCCESS")
    })



});
