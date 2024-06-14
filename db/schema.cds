namespace ForumApplication;

Entity Author {
    key ID: UUID;
    username: String;
    email : String;
    password: String;
    thread: Association to many Thread on thread.author = $self;
    answer: Association to many Answer on answer.author = $self;
}


@cds.search: { Title }
Entity Thread {
    key ID:UUID;
    author: Association to Author;
    Title: String(255);
    Content: String(1000);
    Upvotes:Integer default 0;
    DownVotes: Integer default 0;
    answers: Association to many Answer on answers.thread = $self;
    CreatedAt: Timestamp @cds.on.insert : $now;
    UpdatedAt : Timestamp @cds.on.insert : $now ;
}

Entity Answer { 
    key ID:UUID;
    author: Association to Author;
    thread:Association to Thread;
    Content: String;
    IsDeleted:Boolean default false;
    CreatedAt: Timestamp @cds.on.insert : $now;
    UpdatedAt : Timestamp @cds.on.insert : $now ;
}


