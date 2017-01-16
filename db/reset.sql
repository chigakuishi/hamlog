use ham;

drop table if exists stations;
drop table if exists qsos;
drop table if exists details;
drop table if exists memo;
drop table if exists sessions;

create table stations(
  callsign varchar(10) primary key,
  password varchar(64) not null,
  email varchar(512),
  name varchar(64)
);

create table sessions(
  id varchar(64) primary key,
  station varchar(10) not null,
  `limit` integer not null
);

create table qsos(
  id integer primary key auto_increment,
  station varchar(10) not null,
  callsign varchar(10) not null,
  day integer not null, -- yyyymmdd
  time integer not null, -- hhmm
  qth varchar(64) not null,
  my_qth varchar(64) not null,
  band double not null,
  `mode` varchar(32) not null,
  rst integer not null,
  my_rst integer not null
);

create table details(
  id integer primary key auto_increment,
  qso integer,
  question varchar(1024) not null,
  answer varchar(1024) not null
);

create table memo(
  id integer primary key auto_increment,
  qso integer,
  memo varchar(1024)
);
