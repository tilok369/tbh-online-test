Create table [dbo].[Role]
(
	Id int not null primary key identity(1,1),
	[Name] nvarchar(50) not null,
	[Status] bit not null,
	[SortOrder] int not null,
	CreatedOn datetime not null,
	CreatedBy nvarchar(50) not null,
	UpdatedOn datetime null,
	UpdatedBy nvarchar(50) null
)



GO

Create table [dbo].[User]
(
	Id int not null primary key identity(1,1),
	Email nvarchar(50) not null,
	[Password] nvarchar(15) not null,
	RoleId int not null,
	[Status] bit not null,
	CreatedOn datetime not null,
	CreatedBy nvarchar(50) not null,
	UpdatedOn datetime null,
	UpdatedBy nvarchar(50) null,
	foreign key (RoleId) references [dbo].[Role](Id)
)

Create table [dbo].[Examinee]
(
	Id int not null primary key identity(1,1),
	Email nvarchar(50) not null,
	[Name] nvarchar(50) not null,
	CreatedOn datetime not null,
	CreatedBy nvarchar(50) not null,
	UpdatedOn datetime null,
	UpdatedBy nvarchar(50) null
)

Create table [dbo].[Exam]
(
	Id int not null primary key identity(1,1),
	Title nvarchar(100) not null,
	TotalQuestions int not null,
	Duration int not null,
	CreatedOn datetime not null,
	CreatedBy nvarchar(50) not null,
	UpdatedOn datetime null,
	UpdatedBy nvarchar(50) null,
)

Create table [dbo].[QuestionType]
(
	Id int not null primary key identity(1,1),
	[Name] nvarchar(50) not null
)

Create table [dbo].[Question]
(
	Id int not null primary key identity(1,1),
	[ExamId] int not null, 
	[TypeId] int not null,
	[Text] nvarchar(500) not null,
	[Options] nvarchar(1000) null,
	CreatedOn datetime not null,
	CreatedBy nvarchar(50) not null,
	UpdatedOn datetime null,
	UpdatedBy nvarchar(50) null,
	foreign key (TypeId) references [dbo].[QuestionType](Id),
	foreign key (ExamId) references [dbo].[Exam](Id)
)

Create table [dbo].[Answer]
(
	Id int not null primary key identity(1,1),
	[ExamId] int not null, 
	[ExamineeId] int not null,
	[Text] nvarchar(max),
	[Point] int null,
	CreatedOn datetime not null,
	CreatedBy nvarchar(50) not null,
	UpdatedOn datetime null,
	UpdatedBy nvarchar(50) null,
	foreign key (ExamineeId) references [dbo].[Examinee](Id),
	foreign key (ExamId) references [dbo].[Exam](Id)
)

Create table [dbo].[ExamStatus]
(
	Id int not null primary key identity(1,1),
	[ExamId] int not null, 
	[ExamineeId] int not null,
	[Status] int not null,
	CreatedOn datetime not null,
	CreatedBy nvarchar(50) not null,
	UpdatedOn datetime null,
	UpdatedBy nvarchar(50) null,
	foreign key (ExamineeId) references [dbo].[Examinee](Id),
	foreign key (ExamId) references [dbo].[Exam](Id)
)

alter table [dbo].[Question] add SubText nvarchar(max) null
alter table [dbo].[Answer] add QuestionId int not null
alter table [dbo].[Answer] add foreign key (QuestionId) references [dbo].[Question](Id)
alter table [dbo].[Exam] add [Status] bit not null
alter table [dbo].[Examinee] add Phone nvarchar(20) not null
alter table [dbo].[Question] add Point float null
alter table [dbo].[Answer] alter column [Point] float null

--insert into [dbo].[QuestionType] ([Name]) values ('Explanation'), ('Coding Output'), ('Code Writing'), ('MCQ')
select * from [dbo].[QuestionType]
select * from [dbo].[Exam]
select * from [dbo].[Question]
select * from [dbo].[Examinee]
select * from [dbo].[Answer]