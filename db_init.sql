CREATE TABLE phases (
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) UNIQUE NOT NULL
);

CREATE TABLE posts (
  id INTEGER AUTO_INCREMENT PRIMARY KEY,
  phase_id INTEGER NOT NULL,
  user_id INTEGER NOT NULL,
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