const project = __dirname + "/..";
const cds = require("@sap/cds/lib");
cds.test(project);

describe('ForumApplication Service', () => {
    let db;
    let Author, Thread, Answer;

    beforeAll(async () => {
        db = await cds.connect.to("db");
        ({ Author, Thread, Answer } = db.entities);
    });

    describe('Author Entity', () => {
        it('should get Author successfully', async () => {
            expect(Author).toBeDefined();
            expect(typeof Author).toBe('object');
        });

        it('should have required properties with correct types', async () => {
            expect(Author.elements.username).toBeDefined();
            expect(Author.elements.username.type).toBe('cds.String');

            expect(Author.elements.email).toBeDefined();
            expect(Author.elements.email.type).toBe('cds.String');

            expect(Author.elements.password).toBeDefined();
            expect(Author.elements.password.type).toBe('cds.String');
        });

        it('should have associations to Thread and Answer', async () => {
            expect(Author.elements.thread.type).toBe('cds.Association');
            expect(Author.elements.thread.target).toBe('ForumApplication.Thread');

            expect(Author.elements.answer.type).toBe('cds.Association');
            expect(Author.elements.answer.target).toBe('ForumApplication.Answer');
        });

        it('should have at least one author', async () => {
            const authorCount = await db.run(SELECT.from(Author).limit(1));
            expect(authorCount.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('Thread Entity', () => {
        it('should get Thread successfully', async () => {
            expect(Thread).toBeDefined();
            expect(typeof Thread).toBe('object');
        });

        it('should have required properties with correct types', async () => {
            expect(Thread.elements.Title).toBeDefined();
            expect(Thread.elements.Title.type).toBe('cds.String');

            expect(Thread.elements.Content).toBeDefined();
            expect(Thread.elements.Content.type).toBe('cds.String');

            expect(Thread.elements.Upvotes).toBeDefined();
            expect(Thread.elements.Upvotes.type).toBe('cds.Integer');

            expect(Thread.elements.DownVotes).toBeDefined();
            expect(Thread.elements.DownVotes.type).toBe('cds.Integer');

            expect(Thread.elements.CreatedAt).toBeDefined();
            expect(Thread.elements.CreatedAt.type).toBe('cds.Timestamp');

            expect(Thread.elements.UpdatedAt).toBeDefined();
            expect(Thread.elements.UpdatedAt.type).toBe('cds.Timestamp');
        });

        it('should have associations to Author and Answer', async () => {
            expect(Thread.elements.author.type).toBe('cds.Association');
            expect(Thread.elements.author.target).toBe('ForumApplication.Author');

            expect(Thread.elements.answers.type).toBe('cds.Association');
            expect(Thread.elements.answers.target).toBe('ForumApplication.Answer');
        });

        it('should have at least one thread', async () => {
            const threadCount = await db.run(SELECT.from(Thread).limit(1));
            expect(threadCount.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('Answer Entity', () => {
        it('should get Answer successfully', async () => {
            expect(Answer).toBeDefined();
            expect(typeof Answer).toBe('object');
        });

        it('should have required properties with correct types', async () => {
            expect(Answer.elements.Content).toBeDefined();
            expect(Answer.elements.Content.type).toBe('cds.String');

            expect(Answer.elements.IsDeleted).toBeDefined();
            expect(Answer.elements.IsDeleted.type).toBe('cds.Boolean');

            expect(Answer.elements.CreatedAt).toBeDefined();
            expect(Answer.elements.CreatedAt.type).toBe('cds.Timestamp');

            expect(Answer.elements.UpdatedAt).toBeDefined();
            expect(Answer.elements.UpdatedAt.type).toBe('cds.Timestamp');
        });

        it('should have associations to Author and Thread', async () => {
            expect(Answer.elements.author.type).toBe('cds.Association');
            expect(Answer.elements.author.target).toBe('ForumApplication.Author');

            expect(Answer.elements.thread.type).toBe('cds.Association');
            expect(Answer.elements.thread.target).toBe('ForumApplication.Thread');
        });

        it('should have at least one answer', async () => {
            const answerCount = await db.run(SELECT.from(Answer).limit(1));
            expect(answerCount.length).toBeGreaterThanOrEqual(1);
        });
    });

    describe('Association and Relations', () => {
        it('Thread should have a valid association to Author', async () => {
            const thread = await db.run(SELECT.from(Thread).limit(1));
            if (thread.length > 0) {
                const author = await db.run(SELECT.from(Author).where({ ID: thread[0].author_ID }));
                expect(author.length).toBeGreaterThan(0);
            }
        });

        it('Thread should have valid associations to Answers', async () => {
            const thread = await db.run(SELECT.from(Thread).limit(1));
            if (thread.length > 0) {
                const answers = await db.run(SELECT.from(Answer).where({ thread_ID: thread[0].ID }));
                expect(Array.isArray(answers)).toBe(true);
            }
        });

        it('Author should have valid associations to Threads and Answers', async () => {
            const author = await db.run(SELECT.from(Author).limit(1));
            if (author.length > 0) {
                const threads = await db.run(SELECT.from(Thread).where({ author_ID: author[0].ID }));
                expect(Array.isArray(threads)).toBe(true);

                const answers = await db.run(SELECT.from(Answer).where({ author_ID: author[0].ID }));
                expect(Array.isArray(answers)).toBe(true);
            }
        });

        it('Answer should have valid associations to Author and Thread', async () => {
            const answer = await db.run(SELECT.from(Answer).limit(1));
            if (answer.length > 0) {
                const author = await db.run(SELECT.from(Author).where({ ID: answer[0].author_ID }));
                expect(author.length).toBeGreaterThan(0);

                const thread = await db.run(SELECT.from(Thread).where({ ID: answer[0].thread_ID }));
                expect(thread.length).toBeGreaterThan(0);
            }
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle empty result set gracefully for Author', async () => {
            const result = await SELECT.from(Author).where({ ID: '00000000-0000-0000-0000-000000000000' });
            expect(result.length).toEqual(0);
        });

        it('should handle invalid data type input for Author', async () => {
            try {
                await INSERT.into(Author).entries({ ID: 'invalid_id', username: 12345, email: 67890, password: 11223 });
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        it('should handle missing required fields for Author', async () => {
            try {
                await INSERT.into(Author).entries({ username: '' });
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        it('should handle empty result set gracefully for Thread', async () => {
            const result = await SELECT.from(Thread).where({ ID: '00000000-0000-0000-0000-000000000000' });
            expect(result.length).toEqual(0);
        });

        it('should handle invalid data type input for Thread', async () => {
            try {
                await INSERT.into(Thread).entries({ ID: 'invalid_id', Title: 12345, Content: 67890, Upvotes: 'abc', DownVotes: 'xyz' });
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        it('should handle missing required fields for Thread', async () => {
            try {
                await INSERT.into(Thread).entries({ Title: '' });
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        it('should handle empty result set gracefully for Answer', async () => {
            const result = await SELECT.from(Answer).where({ ID: '00000000-0000-0000-0000-000000000000' });
            expect(result.length).toEqual(0);
        });

        it('should handle invalid data type input for Answer', async () => {
            try {
                await INSERT.into(Answer).entries({ ID: 'invalid_id', Content: 12345, IsDeleted: 'abc' });
            } catch (error) {
                expect(error).toBeDefined();
            }
        });

        it('should handle missing required fields for Answer', async () => {
            try {
                await INSERT.into(Answer).entries({ Content: '' });
            } catch (error) {
                expect(error).toBeDefined();
            }
        });
    });
});
