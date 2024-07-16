-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 16, 2024 at 05:57 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `bam_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `barang`
--

CREATE TABLE `barang` (
  `id` int(11) NOT NULL,
  `n_barang` varchar(255) NOT NULL,
  `jml_stok` int(11) NOT NULL,
  `tipe_stok` enum('pcs','box','set','botol','-') NOT NULL,
  `h_beli` int(11) NOT NULL,
  `h_jual` int(11) NOT NULL,
  `merk_id` int(11) NOT NULL,
  `img` varchar(100) DEFAULT NULL,
  `kategori_id` int(11) NOT NULL,
  `ukuran_id` int(11) NOT NULL,
  `users_id` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `barang`
--

INSERT INTO `barang` (`id`, `n_barang`, `jml_stok`, `tipe_stok`, `h_beli`, `h_jual`, `merk_id`, `img`, `kategori_id`, `ukuran_id`, `users_id`, `updated_at`) VALUES
(88, 'Ban Motor IRC', 3, 'pcs', 200000, 250000, 27, 'http://localhost:1023/images/1720526803182_01e3775f313316c8857f65231d1ffe56.jpg', 11, 6, 13, '2024-07-14 12:38:06'),
(89, 'Oli Mesin Pertamina Enduro', 14, 'botol', 40000, 60000, 31, '', 12, 5, 13, '2024-07-09 11:46:34'),
(90, 'Aki GS Astra GTZ5S', 1, 'pcs', 120000, 170000, 36, 'http://localhost:1023/images/1720526640212_44255119b91d97004cf5cce7fcc2716f.jpg', 13, 5, 13, '2024-07-14 12:36:43'),
(91, 'Kampas Rem Bendix', 8, 'set', 50000, 75000, 46, '', 14, 10, 13, '2024-07-09 11:48:38'),
(92, 'Busi NGK', 7, 'pcs', 15000, 22000, 40, '', 15, 5, 13, '2024-07-14 12:37:46'),
(93, 'Rantai DID', 8, 'pcs', 98000, 145000, 46, '', 16, 5, 13, '2024-07-09 11:50:08'),
(94, 'Radiator Coolant Prestone', 20, 'pcs', 27000, 46000, 46, '', 18, 7, 13, '2024-07-09 11:51:31'),
(95, 'Lampu Depan Bosch', 10, 'pcs', 40000, 62000, 46, '', 20, 5, 13, '2024-07-09 11:52:52'),
(96, 'Handguard Acerbis', 8, 'set', 170000, 240000, 46, '', 17, 4, 13, '2024-07-09 11:53:47'),
(97, 'Oli Gardan Top 1', 3, 'botol', 20000, 30000, 35, 'http://localhost:1023/images/1720526547168_a41012200bd5d7865873a38fbe00b080.jpg', 19, 5, 13, '2024-07-14 12:36:37'),
(98, 'Oli Mesin Shell Advance', 4, 'botol', 41000, 50000, 32, 'http://localhost:1023/images/1720526725896_022ea51dc1860c46d5d6be1548926244.jpg', 12, 7, 13, '2024-07-14 12:36:59'),
(99, 'Lampu Sein', 16, 'pcs', 15000, 25000, 46, 'http://localhost:1023/images/1720526539687_6993fa1283ce952226ba839d0f18cb1b.png', 17, 5, 13, '2024-07-14 12:36:22');

-- --------------------------------------------------------

--
-- Table structure for table `kategori`
--

CREATE TABLE `kategori` (
  `id` int(11) NOT NULL,
  `n_kategori` varchar(45) NOT NULL,
  `catatan` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `kategori`
--

INSERT INTO `kategori` (`id`, `n_kategori`, `catatan`, `updated_at`) VALUES
(11, 'Ban Motor', '', '2024-07-09 06:01:20'),
(12, 'Oli Mesin', 'Oli Motor', '2024-07-09 06:03:13'),
(13, 'Aki', '', '2024-07-09 06:01:28'),
(14, 'Kampas Rem', '', '2024-07-09 06:01:36'),
(15, 'Busi', '', '2024-07-09 06:01:44'),
(16, 'Rantai/Gear/Vbelt', '', '2024-07-09 06:02:03'),
(17, 'Aksesoris', '', '2024-07-09 06:02:17'),
(18, 'Spare Part', '', '2024-07-09 06:02:26'),
(19, 'Oli Gardan', 'Oli Motor', '2024-07-09 06:03:21'),
(20, 'Lampu Motor', '', '2024-07-09 06:04:48'),
(21, 'Lainnya', '', '2024-07-09 11:51:39');

-- --------------------------------------------------------

--
-- Table structure for table `merk`
--

CREATE TABLE `merk` (
  `id` int(11) NOT NULL,
  `n_merk` varchar(45) NOT NULL,
  `logo` varchar(100) DEFAULT NULL,
  `catatan` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `merk`
--

INSERT INTO `merk` (`id`, `n_merk`, `logo`, `catatan`, `updated_at`) VALUES
(27, 'IRC', 'http://localhost:1023/Logo/1720507681108_aea3aadaa67add2aca3836d7b729e305.jpg', '', '2024-07-09 06:48:01'),
(28, 'Michelin', 'http://localhost:1023/Logo/1720508047514_6d4a9225355625c8025e733c6ae3c646.jpg', '', '2024-07-09 06:54:07'),
(29, 'Dunlop', 'http://localhost:1023/Logo/1720508085546_08a0e253031f2e8c9332e8c6b9cb7f8b.png', '', '2024-07-09 06:54:45'),
(30, 'FDR', 'http://localhost:1023/Logo/1720508119493_fb5b4fb15ad93418c6493b3103f8899b.png', '', '2024-07-09 06:55:19'),
(31, 'Pertamina Enduro', 'http://localhost:1023/Logo/1720508190461_58ddabf2da3fc502c8cd3849511b6f8f.jpg', '', '2024-07-09 06:56:30'),
(32, 'Shell', 'http://localhost:1023/Logo/1720508217520_3a127dee61ad6739bce769c93a181ae6.png', '', '2024-07-09 06:56:57'),
(33, 'Castrol', 'http://localhost:1023/Logo/1720508263498_d0ace3abd50295580df8fcb6d759f8ae.png', '', '2024-07-09 06:57:43'),
(34, 'Federal Oil', 'http://localhost:1023/Logo/1720508299030_ab3e57b802dcc86d64257a38e4242dca.jpg', '', '2024-07-09 06:58:19'),
(35, 'Top 1', 'http://localhost:1023/Logo/1720508324875_d57a5b643c609c15063f43df237b2ef1.png', '', '2024-07-09 06:58:44'),
(36, 'GS Astra', 'http://localhost:1023/Logo/1720508360191_ae7a3e6fbd21630b9745e544e96df5a0.jpg', '', '2024-07-09 06:59:20'),
(37, 'Bosch', 'http://localhost:1023/Logo/1720508409728_0a1181d42040b98070d07a91b47da047.png', '', '2024-07-09 07:00:09'),
(38, 'TDR', 'http://localhost:1023/Logo/1720508470203_87fc271ca53b733bed4ae2cf957df445.png', '', '2024-07-09 07:01:10'),
(39, 'Daytona', 'http://localhost:1023/Logo/1720508539769_e1f4ce851509faef8abd05f587de5f64.png', '', '2024-07-09 07:02:19'),
(40, 'NGK', 'http://localhost:1023/Logo/1720508570891_2337a0400f02ba04181715a05f1abe69.png', '', '2024-07-09 07:02:50'),
(41, 'Brisk', 'http://localhost:1023/Logo/1720508617826_c807275adae1e72de0bbfd93774f420d.jpg', '', '2024-07-09 07:03:37'),
(42, 'KTC (Kawahara)', 'http://localhost:1023/Logo/1720508651161_240d2945a13d892b96ea2424a381c923.png', '', '2024-07-09 07:04:11'),
(43, 'YSS', 'http://localhost:1023/Logo/1720508700439_73543cb08e96b8ef3c58fb7c6b5b9233.jpg', '', '2024-07-09 07:05:00'),
(44, 'Kitaco', 'http://localhost:1023/Logo/1720508745796_69c86003daa4dd9ffad96eeb8d7db2e7.png', '-', '2024-07-09 07:07:39'),
(46, 'Lainnya', '', '-', '2024-07-09 07:09:03');

-- --------------------------------------------------------

--
-- Table structure for table `pemasukan`
--

CREATE TABLE `pemasukan` (
  `id` int(11) NOT NULL,
  `tgl` datetime NOT NULL,
  `nama` varchar(255) NOT NULL,
  `qty` int(11) NOT NULL,
  `pemasukan` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `pemasukan`
--

INSERT INTO `pemasukan` (`id`, `tgl`, `nama`, `qty`, `pemasukan`, `updated_at`) VALUES
(13, '2024-07-14 00:00:00', 'Lampu Sein', 7, 105000, '2024-07-14 12:36:22'),
(14, '2024-07-14 00:00:00', 'Oli Gardan Top 1', 3, 60000, '2024-07-14 12:36:37'),
(15, '2024-07-14 00:00:00', 'Aki GS Astra GTZ5S', 2, 240000, '2024-07-14 12:36:43'),
(16, '2024-07-14 00:00:00', 'Oli Mesin Shell Advance', 2, 82000, '2024-07-14 12:36:59'),
(17, '2024-07-14 00:00:00', 'Busi NGK', 6, 90000, '2024-07-14 12:37:46'),
(18, '2024-07-14 00:00:00', 'Ban Motor IRC', 4, 800000, '2024-07-14 12:38:06');

-- --------------------------------------------------------

--
-- Table structure for table `pengeluaran`
--

CREATE TABLE `pengeluaran` (
  `id` int(11) NOT NULL,
  `tgl` datetime NOT NULL,
  `nama` varchar(255) NOT NULL,
  `qty` int(11) NOT NULL,
  `pengeluaran` int(11) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `pengeluaran`
--

INSERT INTO `pengeluaran` (`id`, `tgl`, `nama`, `qty`, `pengeluaran`, `updated_at`) VALUES
(3, '2024-07-09 00:00:00', 'Ban Motor IRC', 7, 1400000, '2024-07-09 11:45:49'),
(4, '2024-07-09 00:00:00', 'Oli Mesin Pertamina Enduro', 14, 560000, '2024-07-09 11:46:34'),
(5, '2024-07-09 00:00:00', 'Aki GS Astra', 3, 900000, '2024-07-09 11:47:18'),
(6, '2024-07-09 00:00:00', 'Kampas Rem Bendix', 8, 400000, '2024-07-09 11:48:38'),
(7, '2024-07-09 00:00:00', 'Busi NGK', 13, 195000, '2024-07-09 11:49:12'),
(8, '2024-07-09 00:00:00', 'Rantai DID', 8, 784000, '2024-07-09 11:50:08'),
(9, '2024-07-09 00:00:00', 'Radiator Coolant Prestone', 20, 540000, '2024-07-09 11:51:31'),
(10, '2024-07-09 00:00:00', 'Lampu Depan Bosch', 10, 400000, '2024-07-09 11:52:52'),
(11, '2024-07-09 00:00:00', 'Handguard Acerbis', 8, 1360000, '2024-07-09 11:53:47'),
(12, '2024-07-09 00:00:00', 'Oli Gardan Top 1', 6, 120000, '2024-07-09 11:55:24'),
(13, '2024-07-09 00:00:00', 'Oli Mesin Shell Advance', 6, 480000, '2024-07-09 11:55:54'),
(14, '2024-07-09 00:00:00', 'Lampu Sein', 23, 345000, '2024-07-09 11:57:35');

-- --------------------------------------------------------

--
-- Table structure for table `ukuran`
--

CREATE TABLE `ukuran` (
  `id` int(11) NOT NULL,
  `n_ukuran` varchar(45) NOT NULL,
  `catatan` text DEFAULT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `ukuran`
--

INSERT INTO `ukuran` (`id`, `n_ukuran`, `catatan`, `updated_at`) VALUES
(3, 'Lainnya', '', '2024-07-09 11:42:46'),
(4, 'Universal', '', '2024-07-09 11:42:50'),
(5, '-', '', '2024-07-09 11:42:53'),
(6, '90/90-14', 'untuk ban motor', '2024-07-09 11:43:11'),
(7, '1 Liter', '', '2024-07-09 11:43:37'),
(8, '2 Liter', '', '2024-07-09 11:43:44'),
(9, '+3 Liter', '', '2024-07-09 11:43:58'),
(10, 'Standard', '', '2024-07-09 11:44:56');

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `uuid` char(36) NOT NULL,
  `f_name` varchar(45) NOT NULL,
  `l_name` varchar(45) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(255) NOT NULL,
  `gender` enum('L','P') NOT NULL,
  `role` enum('admin','karyawan','pemilik') NOT NULL,
  `phone_number` bigint(20) NOT NULL,
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_general_ci;

--
-- Dumping data for table `users`
--

INSERT INTO `users` (`id`, `uuid`, `f_name`, `l_name`, `email`, `password`, `gender`, `role`, `phone_number`, `updated_at`) VALUES
(13, '5db0fc31-8a60-44e9-8baf-960662763c8d', 'Yunani', '.', 'yunani@gmail.com', '$2a$12$zj9DEZ4VL/NrLtUBZLpfo.LpYtW/XCJnNsKN9de6MPXuHxleiSIaC', 'P', 'pemilik', 6289634588844, '2024-07-14 18:32:23'),
(14, '47e013b8-b8e3-4673-b28f-675c229e3743', 'Dimas', 'Amanda Putra', 'dimas@gmail.com', '$2a$12$Hw2P4rBi/RMNOHLXYrqxQ.FsRngQ3HocLIOsrAy29TWzQLdanjhlO', 'L', 'karyawan', 6288847523411, '2024-07-09 12:28:02'),
(15, 'b82f2047-484f-4460-8dcc-2730dd4a126c', 'Yudi', '.', 'yudi@gmail.com', '$2a$12$VhcxdSIb.yfdJDSG1qz5QexJQ0YoFV9m31t1CiBXoTtjMs1cGyARG', 'L', 'karyawan', 6289680009203, '2024-07-09 12:28:55');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `barang`
--
ALTER TABLE `barang`
  ADD PRIMARY KEY (`id`),
  ADD KEY `fk_barang_merk_idx` (`merk_id`),
  ADD KEY `fk_barang_kategori1_idx` (`kategori_id`),
  ADD KEY `fk_barang_ukuran1_idx` (`ukuran_id`),
  ADD KEY `fk_barang_users1_idx` (`users_id`);

--
-- Indexes for table `kategori`
--
ALTER TABLE `kategori`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `n_merk_UNIQUE` (`n_kategori`);

--
-- Indexes for table `merk`
--
ALTER TABLE `merk`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `n_merk_UNIQUE` (`n_merk`);

--
-- Indexes for table `pemasukan`
--
ALTER TABLE `pemasukan`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `pengeluaran`
--
ALTER TABLE `pengeluaran`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `ukuran`
--
ALTER TABLE `ukuran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `n_ukuran_UNIQUE` (`n_ukuran`);

--
-- Indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email_UNIQUE` (`email`),
  ADD UNIQUE KEY `phone_number_UNIQUE` (`phone_number`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `barang`
--
ALTER TABLE `barang`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=118;

--
-- AUTO_INCREMENT for table `kategori`
--
ALTER TABLE `kategori`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT for table `merk`
--
ALTER TABLE `merk`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT for table `pemasukan`
--
ALTER TABLE `pemasukan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `pengeluaran`
--
ALTER TABLE `pengeluaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=47;

--
-- AUTO_INCREMENT for table `ukuran`
--
ALTER TABLE `ukuran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `barang`
--
ALTER TABLE `barang`
  ADD CONSTRAINT `fk_barang_kategori1` FOREIGN KEY (`kategori_id`) REFERENCES `kategori` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_barang_merk` FOREIGN KEY (`merk_id`) REFERENCES `merk` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_barang_ukuran1` FOREIGN KEY (`ukuran_id`) REFERENCES `ukuran` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_barang_users1` FOREIGN KEY (`users_id`) REFERENCES `users` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
