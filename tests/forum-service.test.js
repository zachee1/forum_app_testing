const path = require('path');
const cds = require('@sap/cds/lib');
const project = __dirname + "/..";

cds.test(project);

describe('Services', () => {
  const { GET, POST } = cds.test(project);

  it('should display the data', async () => {
    const { data } = await GET('/odata/v4/forum/Thread');
    console.log(data);
    expect(data.value.length).toEqual(4);
  });

  it('should have correct data structure', async () => {
    const { data } = await GET('/odata/v4/forum/Thread');
    data.value.forEach(thread => {
      expect(thread).toHaveProperty('ID');
      expect(thread).toHaveProperty('author_ID');
      expect(thread).toHaveProperty('Title');
      expect(thread).toHaveProperty('Content');
      expect(thread).toHaveProperty('Upvotes');
      expect(thread).toHaveProperty('DownVotes');
      expect(thread).toHaveProperty('CreatedAt');
      expect(thread).toHaveProperty('UpdatedAt');
    });
  });

  it('should have correct specific values', async () => {
    const { data } = await GET('/odata/v4/forum/Thread');
    const firstThread = data.value.find(thread => thread.Title === 'First Thread');
    expect(firstThread).toBeDefined();
    expect(firstThread.Upvotes).toEqual(10);
    expect(firstThread.DownVotes).toEqual(2);
  });


  it('should handle invalid route', async () => {
    try {
      await GET('/odata/v4/forum/InvalidRoute');
    } catch (error) {
      expect(error.response.status).toBe(404);
    }
  });

  it('should handle malformed request', async () => {
    try {
      await POST('/odata/v4/forum/Thread', { data: { Title: 'Incomplete Data' } });
    } catch (error) {
      expect(error.response.status).toBe(400);
    }
  });
});

