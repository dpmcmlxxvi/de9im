# Timing bench test results for `de9im`


The following presents the number of operations per second to process each pair of geometries with the given relation by each predicate. An :x: indicates the predicate is not supported for those geometries. The fastest and slowest times are highlighted. The geometries tested are in `test/data/bench`.

| first | relation | second | contains | coveredby | covers | crosses | disjoint | equals | intersects | overlaps | touches | within |
|:-----:|:--------:|:------:|:--------:|:---------:|:------:|:-------:|:--------:|:------:|:----------:|:--------:|:-------:|:------:|
| LineString | contains | LineString | 40,508 | 487,988 | 38,849 | 43,810 | 42,511 | 413,982 | 42,612 | <span style="color:red">**14,114**</span> | 28,210 | <span style="color:green">**540,358**</span> |
| LineString | coveredby | LineString | 646,867 | 766,860 | 597,976 | 61,210 | 62,022 | 310,126 | 61,927 | 721,254 | <span style="color:red">**43,469**</span> | <span style="color:green">**791,606**</span> |
| LineString | covers | LineString | 48,402 | 296,429 | 49,018 | 82,147 | 76,816 | 266,185 | 77,052 | <span style="color:red">**15,789**</span> | 45,229 | <span style="color:green">**304,383**</span> |
| LineString | crosses | LineString | 404,126 | 440,290 | 398,034 | 13,570 | 13,915 | 396,974 | 13,924 | <span style="color:red">**8,946**</span> | 74,964 | <span style="color:green">**452,693**</span> |
| LineString | disjoint | LineString | <span style="color:red">**1,278,189**</span> | 1,925,223 | 1,321,198 | 1,938,653 | 1,286,083 | 1,299,894 | 1,969,871 | 1,936,465 | <span style="color:green">**2,072,184**</span> | 2,069,843 |
| LineString | equals | LineString | 618,727 | 742,615 | 591,802 | 57,942 | <span style="color:red">**56,583**</span> | 315,849 | 57,075 | 721,960 | 74,860 | <span style="color:green">**750,655**</span> |
| LineString | intersects | LineString | 268,505 | 463,071 | 288,509 | 39,595 | 39,116 | 402,966 | 39,762 | <span style="color:red">**11,051**</span> | 31,347 | <span style="color:green">**465,359**</span> |
| LineString | overlaps | LineString | 264,396 | <span style="color:green">**473,338**</span> | 265,151 | 33,827 | 33,355 | 402,163 | 33,834 | <span style="color:red">**9,411**</span> | 24,546 | 462,000 |
| LineString | touches | LineString | <span style="color:green">**411,768**</span> | 368,144 | 406,243 | 47,796 | 51,137 | 328,068 | 51,897 | <span style="color:red">**37,437**</span> | 43,663 | 375,962 |
| LineString | within | LineString | 409,332 | 39,791 | <span style="color:green">**429,027**</span> | 44,984 | 44,389 | 35,153 | 45,146 | <span style="color:red">**22,638**</span> | 30,459 | 29,500 |
| LineString | coveredby | Polygon | :x: | 38,457 | :x: | 33,982 | <span style="color:red">**12,458**</span> | :x: | 12,598 | :x: | <span style="color:green">**47,829**</span> | 37,009 |
| LineString | crosses | Polygon | :x: | 24,619 | :x: | 23,299 | 13,510 | :x: | <span style="color:red">**13,481**</span> | :x: | 24,932 | <span style="color:green">**25,086**</span> |
| LineString | disjoint | Polygon | :x: | 49,946 | :x: | 38,506 | 12,725 | :x: | <span style="color:red">**12,719**</span> | :x: | 23,982 | <span style="color:green">**50,284**</span> |
| LineString | intersects | Polygon | :x: | <span style="color:green">**31,787**</span> | :x: | 26,147 | <span style="color:red">**12,300**</span> | :x: | 12,364 | :x: | 29,995 | 31,678 |
| LineString | touches | Polygon | :x: | <span style="color:green">**26,746**</span> | :x: | 26,385 | <span style="color:red">**11,110**</span> | :x: | 11,182 | :x: | 22,588 | 26,208 |
| LineString | within | Polygon | :x: | 61,838 | :x: | 50,898 | <span style="color:red">**14,343**</span> | :x: | 14,423 | :x: | <span style="color:green">**62,449**</span> | 54,704 |
| MultiPoint | coveredby | LineString | :x: | 296,655 | :x: | <span style="color:red">**189,810**</span> | 383,574 | :x: | <span style="color:green">**490,303**</span> | :x: | 365,395 | 195,949 |
| MultiPoint | crosses | LineString | :x: | 359,225 | :x: | <span style="color:red">**252,247**</span> | 377,416 | :x: | <span style="color:green">**490,517**</span> | :x: | 480,475 | 374,225 |
| MultiPoint | disjoint | LineString | :x: | 1,231,746 | :x: | 1,167,109 | <span style="color:red">**684,859**</span> | :x: | 1,192,336 | :x: | 1,204,576 | <span style="color:green">**1,262,230**</span> |
| MultiPoint | intersects | LineString | :x: | <span style="color:green">**493,958**</span> | :x: | 298,924 | 256,035 | :x: | 299,878 | :x: | <span style="color:red">**170,774**</span> | 481,341 |
| MultiPoint | touches | LineString | :x: | <span style="color:green">**495,634**</span> | :x: | 298,202 | 256,699 | :x: | 302,091 | :x: | <span style="color:red">**175,091**</span> | 495,249 |
| MultiPoint | within | LineString | :x: | 372,159 | :x: | <span style="color:red">**243,269**</span> | 364,380 | :x: | <span style="color:green">**475,414**</span> | :x: | 457,090 | 247,628 |
| MultiPoint | contains | MultiPoint | 289,326 | 381,560 | 295,322 | :x: | 360,127 | <span style="color:red">**148,937**</span> | <span style="color:green">**525,645**</span> | 294,032 | :x: | 394,702 |
| MultiPoint | coveredby | MultiPoint | 324,641 | 408,709 | 330,124 | :x: | 384,098 | <span style="color:red">**158,152**</span> | <span style="color:green">**493,331**</span> | 268,989 | :x: | 360,113 |
| MultiPoint | covers | MultiPoint | 287,038 | 372,880 | 300,395 | :x: | 371,132 | <span style="color:red">**147,235**</span> | <span style="color:green">**499,762**</span> | 289,755 | :x: | 386,958 |
| MultiPoint | disjoint | MultiPoint | <span style="color:red">**512,593**</span> | <span style="color:green">**930,489**</span> | 549,623 | :x: | 533,732 | 545,503 | 913,509 | 875,686 | :x: | 867,496 |
| MultiPoint | equals | MultiPoint | 362,751 | 511,916 | 378,589 | :x: | 419,377 | <span style="color:red">**186,804**</span> | <span style="color:green">**592,525**</span> | 365,571 | :x: | 495,540 |
| MultiPoint | intersects | MultiPoint | 292,019 | <span style="color:green">**528,416**</span> | 303,359 | :x: | 349,453 | 381,768 | 432,929 | <span style="color:red">**218,834**</span> | :x: | 519,657 |
| MultiPoint | overlaps | MultiPoint | 358,145 | 511,472 | 398,748 | :x: | 319,427 | 370,396 | 434,374 | <span style="color:red">**249,845**</span> | :x: | <span style="color:green">**513,808**</span> |
| MultiPoint | within | MultiPoint | 296,326 | 377,680 | 309,198 | :x: | 375,782 | <span style="color:red">**148,931**</span> | <span style="color:green">**514,972**</span> | 311,582 | :x: | 380,341 |
| MultiPoint | coveredby | Polygon | :x: | 105,829 | :x: | <span style="color:red">**78,927**</span> | 207,231 | :x: | <span style="color:green">**243,190**</span> | :x: | 239,713 | 82,454 |
| MultiPoint | disjoint | Polygon | :x: | 227,010 | :x: | 107,224 | 101,411 | :x: | 106,761 | :x: | <span style="color:red">**56,319**</span> | <span style="color:green">**240,364**</span> |
| MultiPoint | intersects | Polygon | :x: | 227,354 | :x: | <span style="color:red">**78,098**</span> | 133,757 | :x: | 143,600 | :x: | 115,932 | <span style="color:green">**241,511**</span> |
| MultiPoint | touches | Polygon | :x: | 151,465 | :x: | 158,376 | 214,498 | :x: | <span style="color:green">**257,103**</span> | :x: | 102,157 | <span style="color:red">**82,036**</span> |
| MultiPoint | within | Polygon | :x: | 151,022 | :x: | 104,896 | 214,692 | :x: | <span style="color:green">**241,380**</span> | :x: | 230,995 | <span style="color:red">**102,264**</span> |
| Polygon | contains | Polygon | <span style="color:green">**310,536**</span> | <span style="color:red">**163**</span> | 283,102 | :x: | 36,472 | 169 | 37,217 | 173 | 169 | 170 |
| Polygon | coveredby | Polygon | 225,076 | 47 | <span style="color:green">**237,751**</span> | :x: | 46 | 47 | 47 | <span style="color:red">**46**</span> | 226,709 | 47 |
| Polygon | covers | Polygon | 172 | 306,807 | 171 | :x: | 30,689 | 286,405 | 31,324 | <span style="color:red">**109**</span> | 294 | <span style="color:green">**307,343**</span> |
| Polygon | disjoint | Polygon | <span style="color:green">**388,092**</span> | 240,045 | 363,875 | :x: | <span style="color:red">**10,612**</span> | 216,657 | 10,808 | 36,605 | 11,394 | 237,207 |
| Polygon | equals | Polygon | 128 | 129 | 129 | :x: | 29,850 | <span style="color:red">**67**</span> | <span style="color:green">**32,278**</span> | 132 | 123 | 127 |
| Polygon | intersects | Polygon | <span style="color:green">**368,234**</span> | 90 | 367,599 | :x: | 10,069 | 91 | 10,083 | <span style="color:red">**59**</span> | 239,505 | 90 |
| Polygon | overlaps | Polygon | <span style="color:green">**360,060**</span> | 91 | 359,126 | :x: | 10,006 | 90 | 10,112 | <span style="color:red">**60**</span> | 241,748 | 94 |
| Polygon | touches | Polygon | <span style="color:green">**375,011**</span> | 378 | 366,380 | :x: | 32,376 | 375 | 32,417 | 374 | <span style="color:red">**362**</span> | 374 |
| Polygon | within | Polygon | 224,471 | 48 | 230,489 | :x: | 47 | 48 | 48 | 47 | <span style="color:green">**238,366**</span> | <span style="color:red">**47**</span> |
