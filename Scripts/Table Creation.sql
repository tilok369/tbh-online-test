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