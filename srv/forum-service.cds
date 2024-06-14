using ForumApplication as my from '../db/schema';

// @(requires: 'authenticated-user')
service ForumService {
    entity Thread as projection on my.Thread;
    entity Answer as projection on my.Answer;
    entity Author as projection on my.Author;

    action deleteThread (ID:String) returns String;
    action upvote (ID:String) returns String;
    action downVote (ID:String) returns String;
    action isDeleted (ID:String) returns String;
    action isUpdated (ID:String, Content:String) returns String;
} 