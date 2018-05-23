-- phpMyAdmin SQL Dump
-- version 4.7.9
-- https://www.phpmyadmin.net/
--
-- Máy chủ: 127.0.0.1
-- Thời gian đã tạo: Th5 23, 2018 lúc 06:41 AM
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
(8, 'Test Exam', 'sihc', '2018-05-23 10:36:08'),
(9, 'Final Exam', 'sihc', '2018-05-23 10:59:48');

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `question`
--

CREATE TABLE `question` (
  `questionID` int(11) NOT NULL,
  `contestID` int(11) NOT NULL,
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

INSERT INTO `question` (`questionID`, `contestID`, `question`, `A`, `B`, `C`, `D`, `correct`, `point`) VALUES
(1, 8, 'I haven\'t got ...', 'no brothers or sisters', 'brothers or sisters', 'any brothers or sisters', 'some brothers and sisters', 'C', 2),
(2, 8, 'We haven’t got ... Champagne.', 'a lot', 'little', 'too', 'much', 'D', 2),
(3, 8, 'I wanted an orange car, but they only had ...', 'a one red', 'one red', 'a red one', 'a red', 'C', 2),
(4, 8, 'She ... Supper with us last Friday.', 'hadn\'t', 'no had', 'didn\'t have got', 'didn\'t have', 'D', 2),
(5, 8, 'We have to go to the supermarket ... some bread and milk.', 'for getting', 'to get', 'to getting', 'for to get', 'B', 2),
(6, 9, 'Iâ€™ve lost my passport. I canâ€™t find it ...', 'anywhere', 'nowhere', 'everywhere', 'somewhere', 'A', 2),
(7, 9, 'Have you ...?', 'got any friends in Barcelona', 'not got no friends in Barcelona', 'in Barcelona any friends', 'friends in Barcelona got', 'A', 2),
(8, 9, 'Every year,he goes to the coast for his holidays ...', 'in train', 'on train', 'by train', 'with train', 'C', 2),
(9, 9, 'Michael ... Paris in the morning', 'to leaving', 'leaves for', 'is leaving for', 'leave to', 'C', 2),
(10, 9, 'She has her German classes ...', 'in Tuesday mornings', 'at Tuesday mornings', 'by Tuesday mornings', 'on Tuesday mornings', 'D', 2);

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
('admin', 'Quản trị viên 1', 'e10adc3949ba59abbe56e057f20f883e', 3),
('aerolima', 'Quản trị viên 2', 'e10adc3949ba59abbe56e057f20f883e', 3),
('equal', 'Sinh viên 1', 'e10adc3949ba59abbe56e057f20f883e', 1),
('lauqerm', 'Nguyễn Thanh Bằng', 'e10adc3949ba59abbe56e057f20f883e', 1),
('sihc', 'Giáo viên 1', 'e10adc3949ba59abbe56e057f20f883e', 2);

-- --------------------------------------------------------

--
-- Cấu trúc bảng cho bảng `userhistory`
--

CREATE TABLE `userhistory` (
  `historyID` int(11) NOT NULL,
  `username` varchar(40) COLLATE utf8_unicode_ci NOT NULL,
  `contestID` int(11) NOT NULL,
  `mark` float NOT NULL DEFAULT '0',
  `time` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

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
  ADD PRIMARY KEY (`questionID`),
  ADD KEY `belongToContest` (`contestID`);

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
  ADD KEY `contest` (`contestID`);

--
-- AUTO_INCREMENT cho các bảng đã đổ
--

--
-- AUTO_INCREMENT cho bảng `contest`
--
ALTER TABLE `contest`
  MODIFY `ID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT cho bảng `question`
--
ALTER TABLE `question`
  MODIFY `questionID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT cho bảng `userhistory`
--
ALTER TABLE `userhistory`
  MODIFY `historyID` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Các ràng buộc cho các bảng đã đổ
--

--
-- Các ràng buộc cho bảng `question`
--
ALTER TABLE `question`
  ADD CONSTRAINT `belongToContest` FOREIGN KEY (`contestID`) REFERENCES `contest` (`ID`);

--
-- Các ràng buộc cho bảng `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `userrole` FOREIGN KEY (`role`) REFERENCES `role` (`ID`);

--
-- Các ràng buộc cho bảng `userhistory`
--
ALTER TABLE `userhistory`
  ADD CONSTRAINT `contest` FOREIGN KEY (`contestID`) REFERENCES `contest` (`ID`) ON DELETE NO ACTION ON UPDATE CASCADE,
  ADD CONSTRAINT `user` FOREIGN KEY (`username`) REFERENCES `user` (`username`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
