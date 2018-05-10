DROP DATABASE IF EXISTS tripful;
CREATE DATABASE tripful;

\c tripful;

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR (100) UNIQUE NOT NULL,
  password VARCHAR (100) NOT NULL,
  location VARCHAR (150),
  email VARCHAR(100) UNIQUE NOT NULL
);

INSERT INTO users (username, password, location, email) VALUES 
  ('Prathyusha Mattam', '$2b$10$O2R7SiqOEonm81TdYiPFhOC3mNNQz5CjiR8Go4KmpebeM8YhXMZ9.', 'Atlanta, GA', 'prathyusha@m.com');

