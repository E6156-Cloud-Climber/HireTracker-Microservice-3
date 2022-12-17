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

INSERT INTO posts (phase_id, user_id, position_id, date)
VALUES
    (1, 1, 1, '2022-08-30'),
    (2, 1, 1, '2022-09-05'),
    (3, 1, 1, '2022-09-10'),
    (4, 1, 1, '2022-09-21'),
    (6, 1, 1, '2022-09-23'),

    (1, 1, 2, '2022-08-15'),
    (2, 1, 2, '2022-08-25'),
    (4, 1, 2, '2022-09-12'),
    (8, 1, 2, '2022-09-17'),

    (1, 2, 1, '2022-08-10'),
    (2, 2, 1, '2022-08-21'),
    (3, 2, 1, '2022-08-30'),
    (4, 2, 1, '2022-09-05'),
    (6, 2, 1, '2022-09-12');