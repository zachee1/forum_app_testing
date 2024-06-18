
const cds = require('@sap/cds');

jest.mock('@sap/cds', () => {
  const mockUpdate = jest.fn().mockReturnValue({
    set: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis()
  });

  return {
    transaction: jest.fn(),
    entities: jest.fn(),
    ql: {
      UPDATE: mockUpdate
    }
  };
});

const forumService = require('../srv/forum-service');

describe('Forum Application Service', () => {
  let srv, mockReq, mockTx, mockEntities, mockUpdate;

  beforeEach(() => {
    jest.clearAllMocks();

    mockUpdate = cds.ql.UPDATE;

    mockEntities = {
      Answer: { name: 'Answer' },
      Thread: { name: 'Thread' },
    };

    cds.entities.mockReturnValue(mockEntities);

    srv = {
      on: jest.fn(),
    };

    mockReq = {
      data: { ID: 'test-id' },
    };

    mockTx = {
      run: jest.fn().mockResolvedValue([{ affectedRows: 1 }]),
    };

    cds.transaction.mockReturnValue(mockTx);

    forumService(srv);
  });

  describe('upvote', () => {
    it('should increase upvotes by 1', async () => {
      const upvoteHandler = srv.on.mock.calls.find(call => call[0] === 'upvote')[1];

      const result = await upvoteHandler(mockReq);

      expect(cds.transaction).toHaveBeenCalledWith(mockReq);

      expect(mockUpdate).toHaveBeenCalledWith(mockEntities.Thread);
      expect(mockUpdate().set).toHaveBeenCalledWith({ Upvotes: { "+=": 1 } });
      expect(mockUpdate().where).toHaveBeenCalledWith({ ID: 'test-id' });

      expect(mockTx.run).toHaveBeenCalled();

      expect(result).toEqual({
        code: 200,
        message: "Thread upvoted successfully",
        status: "SUCCESS",
      });
    });
  });
});