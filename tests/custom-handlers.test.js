const cds = require('@sap/cds');

// Mocking `cds.transaction` and `cds.ql.UPDATE`
jest.mock('@sap/cds', () => {
  const mockUpdate = jest.fn().mockReturnValue({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis()
  });

  return {
    transaction: jest.fn().mockReturnValue({
      run: jest.fn().mockResolvedValue([{ affectedRows: 1 }])
    }),
    entities: jest.fn().mockReturnValue({
      "ForumApplication.Thread": { name: 'Thread' }
    }),
    ql: {
      UPDATE: mockUpdate
    }
  };
});


const forumService = require('../srv/forum-service');

// Mock `cds.ql.UPDATE`
const { ql } = cds;
const mockUpdate = ql.UPDATE;

describe('Forum Application Service', () => {
  let srv, mockReq;

  beforeEach(() => {
    jest.clearAllMocks();

    srv = {
      on: jest.fn(),
    };

    mockReq = {
      data: { ID: 'test-id' },
    };

    forumService(srv);
  });

  describe('upvote', () => {
    it('should increase upvotes by 1', async () => {
      const upvoteHandler = srv.on.mock.calls.find(call => call[0] === 'upvote')[1];

      const result = await upvoteHandler(mockReq);

      expect(cds.transaction).toHaveBeenCalledWith(mockReq);
      expect(mockUpdate).toHaveBeenCalledWith("ForumApplication.Thread");
      expect(mockUpdate().set).toHaveBeenCalledWith({ Upvotes: { "+=": 1 } });
      expect(mockUpdate().where).toHaveBeenCalledWith({ ID: 'test-id' });
      expect(cds.transaction().run).toHaveBeenCalled();
      expect(result).toEqual({
        code: 200,
        message: "Thread upvoted successfully",
        status: "SUCCESS",
      });
    });
  });
});

