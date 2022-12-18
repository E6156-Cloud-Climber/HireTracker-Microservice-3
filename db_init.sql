drop table if exists posts;
drop table if exists phases;

CREATE TABLE phases (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE posts (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  phase_id INTEGER NOT NULL,
  user_id VARCHAR(256) NOT NULL,
  position_id INTEGER NOT NULL,
  date DATE NOT NULL,
  description VARCHAR(1000),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (phase_id) REFERENCES phases(id)
);

INSERT INTO phases (name) VALUES
  ('Applied'),
  ('Online Assessment'),
  ('Phone Screen'),
  ('Virtual Onsite'),
  ('Onsite'),
  ('Verbal Offer'),
  ('Written Offer'),
  ('Rejected');

INSERT INTO posts (phase_id, user_id, position_id, date, updated_at, description)
VALUES
    (1, 1, 1, '2022-08-30', '2022-08-30 18:23:47', ''),
    (2, 1, 1, '2022-09-05', '2022-09-05 18:23:47', ''),
    (3, 1, 1, '2022-09-10', '2022-09-10 18:23:47', 'The HR is nice is asks a few administrative questions only.'),
    (4, 1, 1, '2022-09-21', '2022-09-21 18:23:47', "My experience interviewing with Apple was truly unforgettable. The company is known for its rigorous and challenging interview process, and I was eager to prove myself. The interviews were incredibly well-structured and focused on testing my technical skills as well as my ability to think on my feet and solve complex problems. I was impressed by the caliber of the interviewers and their ability to ask thoughtful and insightful questions. Overall, I felt like I was able to demonstrate my abilities and knowledge, and I am grateful for the opportunity to have interviewed with such a prestigious company."),
    (6, 1, 1, '2022-09-23', '2022-09-23 18:23:47', 'My Dream company!!!'),

    (1, 1, 2, '2022-08-15', '2022-08-15 18:23:47', ''),
    (2, 1, 2, '2022-08-25', '2022-08-25 18:23:47', ''),
    (4, 1, 2, '2022-09-12', '2022-09-12 18:23:47', "My interview experience in the tech industry has been both challenging and rewarding. I have had the opportunity to meet with a variety of talented and knowledgeable individuals who have pushed me to think outside the box and demonstrate my skills and expertise. The interviews have been thorough and have given me the chance to showcase my technical abilities as well as my communication and problem-solving skills. Overall, I have found the interview process in the tech industry to be both demanding and exciting, and I am grateful for the opportunities it has provided."),
    (8, 1, 2, '2022-09-17', '2022-09-17 18:23:47', 'Sad :('),

    (1, 2, 1, '2022-08-10', '2022-08-10 18:23:47', 'I m the first?'),
    (2, 2, 1, '2022-08-21', '2022-08-21 18:23:47', ''),
    (3, 2, 1, '2022-08-30', '2022-08-30 18:23:47', ''),
    (4, 2, 1, '2022-09-05', '2022-09-05 18:23:47', ''),
    (8, 2, 2, '2022-11-20', '2022-11-20 18:23:47', 'Dont come to this company!'),

    (1, 3, 1, '2022-08-25', '2022-08-25 18:23:47', ''),
    (2, 3, 1, '2022-09-10', '2022-09-10 18:23:47', ''),

    (1, 4, 1, '2022-08-16', '2022-08-16 18:23:47', 'Try my luck :)'),
    (1, 5, 1, '2022-08-27', '2022-08-27 18:23:47', 'My dream company!'),

    (7, 2, 3, '2022-12-12', '2022-12-12 18:23:47', 'Finally got an offer!!!!!'),
    (1, 2, 5, '2022-12-5', '2022-12-05 18:23:47', 'A late apply lol...');