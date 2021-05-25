BEGIN TRANSACTION;

DROP TABLE IF EXISTS "USERS";
CREATE TABLE IF NOT EXISTS "USERS" (
	"id"	                    INTEGER,
    "email"                     TEXT NOT NULL,
	"name"	                    TEXT NOT NULL,
    "password"                  TEXT NOT NULL,
    "curr_token"                TEXT NOT NULL,
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "MATERIALS";
CREATE TABLE IF NOT EXISTS "MATERIALS" (
	"id"	                    INTEGER,
    "name"                      TEXT NOT NULL,
    "file"                      TEXT NOT NULL,
	"time"	                    INT NOT NULL,
    "creator"                   INT NOT NULL,
    "category"                  INT NOT NULL,
    "version"                   INT NOT NULL,
    "topic"                     INT NOT NULL,
    FOREIGN KEY("creator")      REFERENCES "USERS"("id"),
	FOREIGN KEY("topic")        REFERENCES "TOPICS"("id"),
	PRIMARY KEY("id")
);

DROP TABLE IF EXISTS "PREREQUISITES";
CREATE TABLE IF NOT EXISTS "PREREQUISITES" (
    "topic"	                    INTEGER NOT NULL,
	"prerequisite"      	    INTEGER NOT NULL,
    FOREIGN KEY("topic")        REFERENCES "TOPICS"("id"),
    FOREIGN KEY("prerequisite") REFERENCES "TOPICS"("id"),
    PRIMARY KEY("topic", "prerequisite")
);

DROP TABLE IF EXISTS "TOPICS";
CREATE TABLE IF NOT EXISTS "TOPICS" (
	"id"	                    INTEGER,
	"title"	                    TEXT NOT NULL,
	"description"	            TEXT NOT NULL,
    "group_name"                     TEXT NOT NULL,
    "discipline"                TEXT NOT NULL,
    "creator"                   INTEGER NOT NULL,
	FOREIGN KEY("creator")      REFERENCES "USERS"("id"),
    PRIMARY KEY("id")
);
/*
DROP TABLE IF EXISTS "GROUPS";
CREATE TABLE IF NOT EXISTS "GROUPS" (
	"id"	                    INTEGER,
    "title"                     TEXT NOT NULL,
	"subject"	                INT NOT NULL,
    FOREIGN KEY("subject")      REFERENCES "SUBJECTS"("id"),
	PRIMARY KEY("id")
);
*/

-- DROP TABLE IF EXISTS "SUBJECTS";
-- CREATE TABLE IF NOT EXISTS "SUBJECTS" (
-- 	"id"	                    INTEGER,
--     "title"                     TEXT NOT NULL,
-- 	PRIMARY KEY("id")
-- );

/*
    Category
    1 Prepration
    2 Content
    3 Practice
    4 Assessment
*/
-- INSERT INTO TOPICS(title,description,group_name,discipline,creator) VALUES('Pointers', 'All about Pointers in C', 'C Programming', 'Computer Science and Engineering', 1);

/*
    TODO: USERS need to register and login separately to store in db
*/

-- write python code to fill up db

-- INSERT INTO "Topic" ("id","title","description") 
--     VALUES 
--     (1,'Variable','The concept of variables in programming'),
--     (2,'Struct','The concept of structs in programming'),
--     (3,'Pointer','The concept of pointers in programming'),
--     (4,'Memory Allocation','The concept of malloc/free in programming'),
--     (5,'If Conditions','The concept of structs in programming');

-- INSERT INTO "Prerequisite" ("source","destination") 
--     VALUES 
--     (1, 3), --
--     (1, 2),
--     (2, 3),
--     (3, 4),
--     (1, 5);

-- INSERT INTO "Attachment" ("id","topic_id", "path", "category") 
--     VALUES 
--     (1, 3, "Pointers - Motivation for Learning.mp4", 1), --
--     (2, 3, "Lecture Slides.pdf", 2),
--     (3, 3, "Pointers - Walkthrough (Coding).mp4", 2),
--     (4, 3, "Pointers - Walkthrough using a swap function.mp4", 2),
--     (5, 3, "Exercise Set 1.pdf", 3),
--     (6, 3, "Exercise Set 2.pdf", 3),
--     (7, 3, "Test Questions.pdf", 4);



-- DROP TABLE IF EXISTS "Question";
-- CREATE TABLE IF NOT EXISTS "Question" (
-- 	"question_id"	INTEGER NOT NULL,
-- 	"question_text"	TEXT NOT NULL,
-- 	"score"	INTEGER NOT NULL,
-- 	"time_limit"	INTEGER NOT NULL,
-- 	"song"	INTEGER,
-- 	"game"	INTEGER,
-- 	FOREIGN KEY("game") REFERENCES "Game"("game_id"),
-- 	FOREIGN KEY("song") REFERENCES "Song"("song_id"),
-- 	PRIMARY KEY("question_id" AUTOINCREMENT)
-- );

-- DROP TABLE IF EXISTS "Game";
-- CREATE TABLE IF NOT EXISTS "Game" (
-- 	"game_id"	INTEGER,
-- 	"game_title"	TEXT NOT NULL,
-- 	"tag"	TEXT,
-- 	"scoring_system"	INTEGER NOT NULL,
-- 	PRIMARY KEY("id")
-- );
-- DROP TABLE IF EXISTS "TextBased";
-- CREATE TABLE IF NOT EXISTS "TextBased" (
-- 	"tb_id"	INTEGER NOT NULL,
-- 	"answer_id"	INTEGER NOT NULL,
-- 	"answer_string"	BLOB,
-- 	FOREIGN KEY("answer_id") REFERENCES "Answer"("answer_id"),
-- 	PRIMARY KEY("tb_id")
-- );
-- DROP TABLE IF EXISTS "VoiceOver";
-- CREATE TABLE IF NOT EXISTS "VoiceOver" (
-- 	"answer_id"	INTEGER NOT NULL,
-- 	FOREIGN KEY("answer_id") REFERENCES "Answer"("answer_id"),
-- 	PRIMARY KEY("answer_id")
-- );
-- DROP TABLE IF EXISTS "MCQ";
-- CREATE TABLE IF NOT EXISTS "MCQ" (
-- 	"answer_id"	INTEGER NOT NULL,
-- 	FOREIGN KEY("answer_id") REFERENCES "Answer",
-- 	PRIMARY KEY("answer_id")
-- );
-- DROP TABLE IF EXISTS "Answer_Choices";
-- CREATE TABLE IF NOT EXISTS "Answer_Choices" (
-- 	"choice_id"	INTEGER,
-- 	"answer_id"	INTEGER,
-- 	"choice_answer"	TEXT NOT NULL,
-- 	"is_correct" INTEGER,
-- 	FOREIGN KEY("answer_id") REFERENCES "MCQ"("answer_id"),
-- 	PRIMARY KEY("choice_id")
-- );
-- DROP TABLE IF EXISTS "Answer";
-- CREATE TABLE IF NOT EXISTS "Answer" (
-- 	"answer_id"	INTEGER NOT NULL,
-- 	"question_id"	INTEGER NOT NULL,
-- 	"answer_type"	INTEGER NOT NULL,
-- 	FOREIGN KEY("question_id") REFERENCES "Question"("question_id"),
-- 	PRIMARY KEY("answer_id" AUTOINCREMENT)
-- );
-- DROP TABLE IF EXISTS "Song";
-- CREATE TABLE IF NOT EXISTS "Song" (
-- 	"song_id"	INTEGER,
-- 	"start_time"	INTEGER,
-- 	"end_time"	INTEGER,
-- 	"url"	TEXT,
-- 	PRIMARY KEY("song_id")
-- );
-- DROP TABLE IF EXISTS "Question";
-- CREATE TABLE IF NOT EXISTS "Question" (
-- 	"question_id"	INTEGER NOT NULL,
-- 	"question_text"	TEXT NOT NULL,
-- 	"score"	INTEGER NOT NULL,
-- 	"time_limit"	INTEGER NOT NULL,
-- 	"song"	INTEGER,
-- 	"game"	INTEGER,
-- 	FOREIGN KEY("game") REFERENCES "Game"("game_id"),
-- 	FOREIGN KEY("song") REFERENCES "Song"("song_id"),
-- 	PRIMARY KEY("question_id" AUTOINCREMENT)
-- );

COMMIT;