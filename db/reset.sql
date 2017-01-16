use ham;

drop table if exists stations;
drop table if exists qsos;
drop table if exists details;
drop table if exists memos;
drop table if exists sessions;

create table stations(
  callsign varchar(10) primary key,
  password varchar(64) not null,
  email varchar(512),
  name varchar(64)
);
insert into stations(callsign,password,email,name) values("JI1XRF","a670fbf3abc5cdcfc00892c2518564761d56440f7f0e34d6b1b3d82739e0badf","chigakuishi.soft@gmail.com","小林怜央");

create table sessions(
  id varchar(64) primary key,
  station varchar(10) not null,
  `limit` integer not null
);

insert into sessions(id,station,`limit`) value('848e2cc1c4ab81cdf8754e9315a64ce95187346f9814513e48d02a5fc0dd878b','JI1XRF',99999999999);

create table qsos(
  id integer primary key auto_increment,
  station varchar(10) not null,
  callsign varchar(10) not null,
  `date` integer not null, -- yyyymmdd
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
  qso integer not null,
  question varchar(1024) not null,
  answer varchar(1024) not null,
  `type` varchar(16)
);

create table memos(
  id integer primary key auto_increment,
  qso integer,
  memo varchar(1024)
);
