insert into role (Id, RoleName) values (1, 'Admin');
insert into role (Id, RoleName) values (2, 'User');

insert into user(Id, Firstname, Lastname, Username, Email, PasswordHash, CreatedDate, IsConfirmed, IsBlocked, VerifyToken, ResetPasswordToken, ResetPasswordExpire) values (999, 'admin', 'admin', 'superadmin', 'admin@email.com', '$2a$10$cbPsZQ3HKjHF0UQsVqyHoOaEQTMZd5Cdbs.ST12ANea1IxDnJvAMm', '2016-06-07', '1', '0', '', NULL, NULL)

insert into user_role(999,1)