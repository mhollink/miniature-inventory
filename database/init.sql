SET
SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET
AUTOCOMMIT = 0;
START TRANSACTION;
SET
time_zone = "+00:00";

-- --------------------------------------------------------

--
-- Table structure for table `collections`
--

CREATE TABLE `collections`
(
    `user_id`       varchar(255) NOT NULL,
    `collection_id` varchar(255) NOT NULL,
    `name`          varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `donators`
--

CREATE TABLE `donators`
(
    `user_id` varchar(255) NOT NULL,
    `level`   varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `groups`
--

CREATE TABLE `groups`
(
    `user_id`       varchar(255) NOT NULL,
    `group_id`      varchar(255) NOT NULL,
    `collection_id` varchar(255) NOT NULL,
    `name`          varchar(255) NOT NULL,
    `sort_index`    bigint(99) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `last_interaction`
--

CREATE TABLE `last_interaction`
(
    `user_id`     varchar(255) NOT NULL,
    `action`      varchar(255) NOT NULL,
    `action_time` datetime     NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `miniatures`
--

CREATE TABLE `miniatures`
(
    `user_id`     varchar(255) NOT NULL,
    `model_id`    varchar(255) NOT NULL,
    `stage_index` int(9) NOT NULL,
    `amount`      int(9) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `models`
--

CREATE TABLE `models`
(
    `user_id`    varchar(255) NOT NULL,
    `model_id`   varchar(255) NOT NULL,
    `group_id`   varchar(255) NOT NULL,
    `name`       varchar(255) NOT NULL,
    `sort_index` bigint(99) NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `paints`
--

CREATE TABLE `paints`
(
    `user_id`          varchar(255) NOT NULL,
    `paint_id`         varchar(255) NOT NULL,
    `paint_brand`      varchar(255) NOT NULL,
    `paint_range`      varchar(255) NOT NULL,
    `paint_name`       varchar(255) NOT NULL,
    `paint_color_code` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

-- --------------------------------------------------------

--
-- Table structure for table `workflow_stages`
--

CREATE TABLE `workflow_stages`
(
    `user_id`     varchar(255) NOT NULL,
    `stage_index` varchar(255) NOT NULL,
    `name`        varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `collections`
--
ALTER TABLE `collections`
    ADD PRIMARY KEY (`collection_id`),
  ADD KEY `collection_by_user` (`user_id`);

--
-- Indexes for table `donators`
--
ALTER TABLE `donators`
    ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `groups`
--
ALTER TABLE `groups`
    ADD PRIMARY KEY (`group_id`),
  ADD KEY `group_by_collection` (`collection_id`),
  ADD KEY `group_by_user` (`user_id`);

--
-- Indexes for table `last_interaction`
--
ALTER TABLE `last_interaction`
    ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `miniatures`
--
ALTER TABLE `miniatures`
    ADD UNIQUE KEY `model_stage` (`model_id`,`stage_index`),
    ADD KEY `miniature_by_user` (`user_id`),
    ADD KEY `model_id` (`model_id`) USING BTREE;

--
-- Indexes for table `models`
--
ALTER TABLE `models`
    ADD PRIMARY KEY (`model_id`),
  ADD KEY `model_by_user` (`user_id`),
  ADD KEY `models_by_group` (`group_id`);

--
-- Indexes for table `paints`
--
ALTER TABLE `paints`
    ADD PRIMARY KEY (`paint_id`),
  ADD UNIQUE KEY `specific_paint_by_user` (`paint_brand`,`paint_range`,`paint_name`,`user_id`);

--
-- Indexes for table `workflow_stages`
--
ALTER TABLE `workflow_stages`
    ADD UNIQUE KEY `no_double_stages` (`user_id`,`stage_index`),
    ADD KEY `stages_by_user` (`user_id`) USING BTREE;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `groups`
--
ALTER TABLE `groups`
    ADD CONSTRAINT `groups_of_collection` FOREIGN KEY (`collection_id`) REFERENCES `collections` (`collection_id`) ON DELETE CASCADE;

--
-- Constraints for table `miniatures`
--
ALTER TABLE `miniatures`
    ADD CONSTRAINT `miniatures_of_model` FOREIGN KEY (`model_id`) REFERENCES `models` (`model_id`) ON DELETE CASCADE;

--
-- Constraints for table `models`
--
ALTER TABLE `models`
    ADD CONSTRAINT `models_in_group` FOREIGN KEY (`group_id`) REFERENCES `groups` (`group_id`) ON DELETE CASCADE;

COMMIT;
