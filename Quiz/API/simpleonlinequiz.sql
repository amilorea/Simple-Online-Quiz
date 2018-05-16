-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 16, 2018 lúc 07:18 AM
-- Phiên bản máy phục vụ: 10.1.31-MariaDB
-- Phiên bản PHP: 7.2.3

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Cơ sở dữ liệu: `simpleonlinequiz`
--

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `contest`
--

CREATE TABLE `contest` (
  `ID` int(11) NOT NULL,
  `contestname` text COLLATE utf8_unicode_ci NOT NULL,
  `teacher` text COLLATE utf8_unicode_ci NOT NULL,
  `created` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `contest`
--

INSERT INTO `contest` (`ID`, `contestname`, `teacher`, `created`) VALUES
(1, 'Midterm', 'sihcpro', '2018-05-12 18:01:29'),
(2, 'Final', 'equal1', '2018-05-12 18:01:29');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `question`
--

CREATE TABLE `question` (
  `ID` int(11) NOT NULL,
  `contest` int(11) NOT NULL,
  `question` text COLLATE utf8_unicode_ci NOT NULL,
  `A` text COLLATE utf8_unicode_ci NOT NULL,
  `B` text COLLATE utf8_unicode_ci NOT NULL,
  `C` text COLLATE utf8_unicode_ci NOT NULL,
  `D` text COLLATE utf8_unicode_ci NOT NULL,
  `correct` text COLLATE utf8_unicode_ci NOT NULL,
  `point` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `question`
--

INSERT INTO `question` (`ID`, `contest`, `question`, `A`, `B`, `C`, `D`, `correct`, `point`) VALUES
(1, 1, 'What is that?', 'That is what?', 'What that is?', 'Is that what?', 'Is that, What?', 'A', 2.75),
(2, 2, 'Does Bang free?', 'Yes, He is.', 'Yes, he does.', 'No, he doesn\'t', 'No, he didn\'t.', 'B', 2.25),
(3, 2, 'Do you like English?', 'Yes, I\'m.', 'Yes, I\'ll.', 'No, I didn\'t.', 'No never!', 'D', 3.25);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `role`
--

CREATE TABLE `role` (
  `ID` int(11) NOT NULL,
  `rolename` text COLLATE utf8_unicode_ci NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `role`
--

INSERT INTO `role` (`ID`, `rolename`) VALUES
(0, 'Guest'),
(1, 'User'),
(2, 'Teacher'),
(3, 'Admin');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `user`
--

CREATE TABLE `user` (
  `username` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `accountname` text COLLATE utf8_unicode_ci NOT NULL,
  `password` text COLLATE utf8_unicode_ci NOT NULL,
  `role` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `user`
--

INSERT INTO `user` (`username`, `accountname`, `password`, `role`) VALUES
('equal', 'Bang', '465289687a70db7aa7217cc240c29f0f', 3),
('equal1', 'Bang sida', '465289687a70db7aa7217cc240c29f0f', 2),
('equal2', 'Bang tester', '465289687a70db7aa7217cc240c29f0f', 1),
('sihc', 'Chi', '3d186804534370c3c817db0563f0e461', 3),
('sihcpro', 'Chi dep trai', '3d186804534370c3c817db0563f0e461', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `userhistory`
--

CREATE TABLE `userhistory` (
  `historyID` int(11) NOT NULL,
  `username` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `ContestID` int(11) NOT NULL,
  `Mark` float NOT NULL DEFAULT '0',
  `Time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Đang đổ dữ liệu cho bảng `userhistory`
--

INSERT INTO `userhistory` (`historyID`, `username`, `ContestID`, `Mark`, `Time`) VALUES
(1, 'equal', 1, 7, '2018-05-16 10:56:38'),
(2, 'equal', 2, 8, '2018-05-16 10:56:38'),
(3, 'sihc', 1, 7, '2018-05-16 10:57:07'),
(4, 'sihc', 1, 9, '2018-05-16 10:57:18'),
(5, 'sihc', 2, 8, '2018-05-16 10:57:29');

--
-- Chỉ mục cho các bảng đã đổ
--

--
-- Chỉ mục cho bảng `contest`
--
ALTER TABLE `contest`
  ADD PRIMARY KEY (`ID`);

--
-- Chỉ mục cho bảng `question`
--
ALTER TABLE `question`
  ADD PRIMARY KEY (`ID`),
  ADD KEY `belongToContest` (`contest`);

--
-- Chỉ mục cho bảng `role`
--
ALTER TABLE `role`
  ADD PRIMARY KEY (`ID`);

--
-- Chỉ mục cho bảng `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`),
  ADD KEY `userrole` (`role`);

--
-- Chỉ mục cho bảng `userhistory`
--
ALTER TABLE `userhistory`
  ADD PRIMARY KEY (`historyID`),
  ADD KEY `user` (`username`),
  ADD KEY `contest` (`ContestID`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `contest`
--
ALTER TABLE `contest`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT cho bảng `question`
--
ALTER TABLE `question`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT cho bảng `userhistory`
--
ALTER TABLE `userhistory`
  MODIFY `historyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `belongToContest` FOREIGN KEY (`contest`) REFERENCES `contest` (`ID`);

--
-- Các ràng buộc cho bảng `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `userrole` FOREIGN KEY (`role`) REFERENCES `role` (`ID`);

--
-- Các ràng buộc cho bảng `userhistory`
--
ALTER TABLE `userhistory`
  ADD CONSTRAINT `contest` FOREIGN KEY (`ContestID`) REFERENCES `contest` (`ID`),
  ADD CONSTRAINT `user` FOREIGN KEY (`username`) REFERENCES `user` (`username`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
